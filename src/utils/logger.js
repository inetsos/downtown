// src/utils/logger.js
export async function logEvent(level, message, data = {}) {
  try {
    await fetch(
      'https://logevent-m65i6rbula-du.a.run.app', 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          level,
          message,
          data,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      }
    )
  } catch (e) {
    console.warn('로그 전송 실패:', e)
  }
}
