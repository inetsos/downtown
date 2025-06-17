import { ref } from 'vue'
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import {
  startOfDay, endOfDay, subDays,
  startOfWeek, endOfWeek, subWeeks,
  startOfMonth, endOfMonth, subMonths,
  startOfYear, endOfYear, subYears,
  format
} from 'date-fns'

export function useSalesSummary(companyId) {
  const salesSummary = ref({
    day: { total: 0, count: 0, avg: 0, growth: null },
    week: { total: 0, count: 0, avg: 0, growth: null },
    month: { total: 0, count: 0, avg: 0, growth: null },
    year: { total: 0, count: 0, avg: 0, growth: null },
  })

  const dayLabels = ref([])
  const daySales = ref([])
  const weekLabels = ref([])
  const weekSales = ref([])
  const monthLabels = ref([])
  const monthSales = ref([])
  const yearLabels = ref([])
  const yearSales = ref([])

  const getOrdersInPeriod = async (startDate, endDate) => {
    const ordersRef = collection(db, 'companies', companyId, 'orders')
    const q = query(
      ordersRef,
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<=', Timestamp.fromDate(endDate))
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data())
  }

  const calcSummary = (orders) => {
    const count = orders.length
    const total = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0)
    const avg = count > 0 ? total / count : 0
    return { total, count, avg }
  }

  const calcGrowth = (current, previous) => {
    if (previous === 0) return null
    return ((current - previous) / previous) * 100
  }

  const loadSummary = async () => {
    const now = new Date()

    const [todayStart, todayEnd] = [startOfDay(now), endOfDay(now)]
    const [yesterdayStart, yesterdayEnd] = [startOfDay(subDays(now, 1)), endOfDay(subDays(now, 1))]

    const [thisWeekStart, thisWeekEnd] = [startOfWeek(now), endOfWeek(now)]
    const [lastWeekStart, lastWeekEnd] = [startOfWeek(subWeeks(now, 1)), endOfWeek(subWeeks(now, 1))]

    const [thisMonthStart, thisMonthEnd] = [startOfMonth(now), endOfMonth(now)]
    const [lastMonthStart, lastMonthEnd] = [startOfMonth(subMonths(now, 1)), endOfMonth(subMonths(now, 1))]

    const [thisYearStart, thisYearEnd] = [startOfYear(now), endOfYear(now)]
    const [lastYearStart, lastYearEnd] = [startOfYear(subYears(now, 1)), endOfYear(subYears(now, 1))]

    const [
      todayOrders, yesterdayOrders,
      thisWeekOrders, lastWeekOrders,
      thisMonthOrders, lastMonthOrders,
      thisYearOrders, lastYearOrders
    ] = await Promise.all([
      getOrdersInPeriod(todayStart, todayEnd),
      getOrdersInPeriod(yesterdayStart, yesterdayEnd),
      getOrdersInPeriod(thisWeekStart, thisWeekEnd),
      getOrdersInPeriod(lastWeekStart, lastWeekEnd),
      getOrdersInPeriod(thisMonthStart, thisMonthEnd),
      getOrdersInPeriod(lastMonthStart, lastMonthEnd),
      getOrdersInPeriod(thisYearStart, thisYearEnd),
      getOrdersInPeriod(lastYearStart, lastYearEnd),
    ])

    salesSummary.value.day = {
      ...calcSummary(todayOrders),
      growth: calcGrowth(
        calcSummary(todayOrders).total,
        calcSummary(yesterdayOrders).total
      )
    }

    salesSummary.value.week = {
      ...calcSummary(thisWeekOrders),
      growth: calcGrowth(
        calcSummary(thisWeekOrders).total,
        calcSummary(lastWeekOrders).total
      )
    }

    salesSummary.value.month = {
      ...calcSummary(thisMonthOrders),
      growth: calcGrowth(
        calcSummary(thisMonthOrders).total,
        calcSummary(lastMonthOrders).total
      )
    }

    salesSummary.value.year = {
      ...calcSummary(thisYearOrders),
      growth: calcGrowth(
        calcSummary(thisYearOrders).total,
        calcSummary(lastYearOrders).total
      )
    }

    await Promise.all([
      loadDailyTrend(),
      loadWeeklyTrend(),
      loadMonthlyTrend(),
      loadYearlyTrend()
    ])
  }

  const loadDailyTrend = async () => {
    const today = new Date()
    const startDate = subDays(today, 6)

    const dates = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(today, 6 - i)
      return format(date, 'yyyy-MM-dd')
    })

    const ordersRef = collection(db, 'companies', companyId, 'orders')
    const q = query(
      ordersRef,
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('createdAt')
    )

    const snapshot = await getDocs(q)

    const salesMap = {}
    snapshot.forEach(doc => {
      const data = doc.data()
      const dateKey = format(data.createdAt.toDate(), 'yyyy-MM-dd')
      salesMap[dateKey] = (salesMap[dateKey] || 0) + (data.totalAmount || 0)
    })

    const trend = dates.map(dateStr => ({
      date: format(new Date(dateStr), 'MM-dd'),
      total: salesMap[dateStr] || 0,
    }))

    dayLabels.value = trend.map(item => item.date)
    daySales.value = trend.map(item => item.total)
  }

  const loadWeeklyTrend = async () => {
    const today = new Date()
    const weeks = Array.from({ length: 6 }).map((_, i) => {
      const start = startOfWeek(subWeeks(today, 5 - i))
      const end = endOfWeek(start)
      return { label: format(start, 'MM/dd'), start, end }
    })

    const ordersRef = collection(db, 'companies', companyId, 'orders')
    const startDate = weeks[0].start

    const q = query(
      ordersRef,
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('createdAt')
    )
    const snapshot = await getDocs(q)

    const salesMap = new Map()

    snapshot.forEach(doc => {
      const data = doc.data()
      const created = data.createdAt.toDate()
      for (const week of weeks) {
        if (created >= week.start && created <= week.end) {
          salesMap.set(week.label, (salesMap.get(week.label) || 0) + (data.totalAmount || 0))
          break
        }
      }
    })

    weekLabels.value = weeks.map(w => w.label)
    weekSales.value = weeks.map(w => salesMap.get(w.label) || 0)
  }

  const loadMonthlyTrend = async () => {
    const today = new Date()
    const months = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(today, 5 - i)
      return {
        label: format(date, 'yyyy-MM'),
        start: startOfMonth(date),
        end: endOfMonth(date),
      }
    })

    const ordersRef = collection(db, 'companies', companyId, 'orders')
    const startDate = months[0].start

    const q = query(
      ordersRef,
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('createdAt')
    )
    const snapshot = await getDocs(q)

    const salesMap = new Map()

    snapshot.forEach(doc => {
      const data = doc.data()
      const created = data.createdAt.toDate()
      for (const month of months) {
        if (created >= month.start && created <= month.end) {
          salesMap.set(month.label, (salesMap.get(month.label) || 0) + (data.totalAmount || 0))
          break
        }
      }
    })

    monthLabels.value = months.map(m => m.label)
    monthSales.value = months.map(m => salesMap.get(m.label) || 0)
  }

  const loadYearlyTrend = async () => {
    const today = new Date()
    const years = Array.from({ length: 4 }).map((_, i) => {
      const date = subYears(today, 3 - i)
      return {
        label: format(date, 'yyyy'),
        start: startOfYear(date),
        end: endOfYear(date),
      }
    })

    const ordersRef = collection(db, 'companies', companyId, 'orders')
    const startDate = years[0].start

    const q = query(
      ordersRef,
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('createdAt')
    )
    const snapshot = await getDocs(q)

    const salesMap = new Map()

    snapshot.forEach(doc => {
      const data = doc.data()
      const created = data.createdAt.toDate()
      for (const year of years) {
        if (created >= year.start && created <= year.end) {
          salesMap.set(year.label, (salesMap.get(year.label) || 0) + (data.totalAmount || 0))
          break
        }
      }
    })

    yearLabels.value = years.map(y => y.label)
    yearSales.value = years.map(y => salesMap.get(y.label) || 0)
  }

  // 시간대별 매출
  const hourlyLabels = ref([])
  const hourlyTotalAmounts = ref([])
  const hourlyOrderCounts = ref([])

  const loadHourlySales = async (companyId, startDate, endDate) => {
    const ordersRef = collection(db, "companies", companyId, "orders")
    const q = query(
      ordersRef,
      where("createdAt", ">=", Timestamp.fromDate(startDate)),
      where("createdAt", "<=", Timestamp.fromDate(endDate))
    )
    const snapshot = await getDocs(q)

    const hourlyData = new Array(24).fill(0)
    const hourlyCounts = new Array(24).fill(0)

    snapshot.forEach(doc => {
      const order = doc.data()
      const hour = order.createdAt.toDate().getHours()
      hourlyData[hour] += order.totalAmount || 0
      hourlyCounts[hour] += 1
    })

    hourlyLabels.value = Array.from({ length: 24 }, (_, i) => `${i}시`)
    hourlyTotalAmounts.value = hourlyData
    hourlyOrderCounts.value = hourlyCounts
  }

  /**
   * 메뉴별 판매 통계에 카테고리 포함
   * items 배열 내 객체: { name, category, quantity, price }
   */
  const loadProductSalesByMenu = async (companyId, startDate, endDate) => {
    const ordersRef = collection(db, 'companies', companyId, 'orders')
    const q = query(
      ordersRef,
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<=', Timestamp.fromDate(endDate))
    )

    const snapshot = await getDocs(q)
    const salesMap = new Map()

    snapshot.forEach((doc) => {
      const order = doc.data()
      const items = order.items || []

      items.forEach(({ name, categoryName, quantity, price }) => {
        const key = `${name}|${categoryName || '기타'}`
        const prev = salesMap.get(key) || { quantity: 0, total: 0 }

        salesMap.set(key, {
          quantity: prev.quantity + quantity,
          total: prev.total + quantity * price,
        })
      })
    })

    return Array.from(salesMap.entries()).map(([key, data]) => {
      const [productName, category] = key.split('|')
      return {
        productName,
        category,
        quantitySold: data.quantity,
        totalAmount: data.total,
      }
    })
  }

  return {
    salesSummary,
    dayLabels,
    daySales,
    weekLabels,
    weekSales,
    monthLabels,
    monthSales,
    yearLabels,
    yearSales,
    hourlyLabels,
    hourlyTotalAmounts,
    hourlyOrderCounts,
    loadSummary,
    loadHourlySales,
    loadProductSalesByMenu,
  }
}
