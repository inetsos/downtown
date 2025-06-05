### 프로젝트가 진행되면서 계속 수정됩니다.

설명이 별로 없이 코드 위주로 진행됩니다.
댓글로 질문을 남겨 주시면 대답해 드립니다.
개발에 아이디어를 주시면 적용하겠습니다.

https://inetsos.tistory.com/

1. 동네 (예약) 포털 - Vue3 + Vuetify + Firebase
2. 동네 (예약) 포털 - Vue 3 + Vite + Vuetify 3 + JS 프로젝트
3. 동네 (예약) 포털 (Vue 3 + Firebase) - 회원 등록, 로그인
4. 동네 (예약) 포털 (Vue 3 + Firebase) - 비밀번호 변경, 비밀번호 리셋
5. 동네 (예약) 포털 (Vue 3 + Firebase) - 구글 계정으로 로그인
6. 동네 (예약) 포털 (Vue 3 + Firebase) - 회원의 업체 관리
7. 동네 (예약) 포털 (Vue 3 + Firebase) - 등록 업체 보기(홈)
8. 동네 (예약) 포털 (Vue 3 + Firebase) - 예약하기
9. 동네 (예약) 포털 (Vue 3 + Firebase) - 회원 예약 보기, 예약 기능 개선
10. 동네 (예약) 포털 (Vue 3 + Firebase) - 업체 예약 관리
11. 동네 (예약) 포털 (Vue 3 + Firebase) - 주소 api 연동 선택
12. 동네 (예약) 포털 (Vue 3 + Firebase) - 업체 주소 등록
13. 동네 (예약) 포털 (Vue 3 + Firebase) - 네이버 지도 sdk 연동 가이드
14. 동네 (예약) 포털 (Vue 3 + Firebase) - 네이버 지도에 업체 위치 보기
15. 동네 (예약) 포털 (Vue 3 + Firebase) - 네이버 지도 상점 위치 보기 개선
16. 동네 (예약) 포털 (Vue 3 + Firebase) - 미용실 예약 커스터마이징


## 🔗 예약 포털 시스템 (Vue + Vuetify + Firebase)

Vue 3, Vuetify 3, Firebase를 기반으로 제작된 **다중 업체 예약 관리 포털**입니다.  
고객, 업체, 관리자가 각각의 역할에 따라 예약을 생성하고 관리할 수 있는 실시간 웹 서비스입니다.

---

### 🧰 기술 스택

- **Frontend**: Vue 3, Vuetify 3, Vite, Pinia, Vue Router  
- **Backend/DB**: Firebase (Authentication, Firestore, Storage, Cloud Functions)

---

### 🧑‍🤝‍🧑 사용자 역할

| 역할     | 설명 |
|----------|------|
| 고객     | 업체 선택 후 예약 신청, 예약 확인/취소 |
| 업체     | 예약 시간 등록, 고객 예약 관리 |
| 관리자   | 업체 승인, 예약 통계 확인 (선택 사항) |

---

### 📌 핵심 기능

#### 고객 기능
- 업체 검색 및 예약 신청
- 내 예약 목록 조회/취소

#### 업체 기능
- 업체 정보 등록
- 예약 시간 슬롯 설정
- 예약 승인/거절
- 예약 캘린더 확인
- 고객 리스트 열람

#### 관리자 기능 (선택)
- 업체 승인
- 예약 통계 확인

---

### 🗂️ Firestore 구조 예시

users (고객)
└─ uid
└─ name, email, role: 'customer'

vendors (업체)
└─ vendorId
└─ name, category, email, timeSlots[], ownerUid, createdAt

bookings
└─ bookingId
└─ vendorId, customerUid, date, time, status: 'pending'|'confirmed'|'canceled'


---

### 🛠️ 개발 로드맵

1. 프로젝트 세팅 (Vite + Vuetify + Firebase 연동)
2. Firebase Auth 구현 및 역할 분리
3. 업체 기능 개발
4. 고객 기능 개발
5. 관리자 기능 개발 (선택)
6. Cloud Functions 통한 알림 기능 (선택)

---

### 🖥️ 주요 페이지

| 경로 | 설명 |
|------|------|
| `/login` | 로그인 / 회원가입 |
| `/dashboard` | 사용자 유형에 따라 자동 리디렉션 |
| `/vendor/home` | 업체 대시보드 |
| `/vendor/schedule` | 예약 슬롯 등록 및 관리 |
| `/vendor/bookings` | 예약 승인/거절 |
| `/customer/vendors` | 업체 검색 및 예약 신청 |
| `/customer/bookings` | 내 예약 확인 및 취소 |

---

### 🔧 Firebase Hosting 배포

```bash
npm run build
firebase deploy
