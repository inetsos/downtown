/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");
const axios = require("axios");
const cors = require('cors')({ origin: true }); // 모든 출처 허용 (개발용)

const {defineSecret} = require("firebase-functions/params");

const NAVER_CLIENT_ID = defineSecret("NAVER_CLIENT_ID");
const NAVER_CLIENT_SECRET = defineSecret("NAVER_CLIENT_SECRET");

admin.initializeApp();
const db = admin.firestore()

exports.naverLogin = onRequest({ 
  region: "asia-northeast3",
  timeoutSeconds: 60, 
  secrets: [NAVER_CLIENT_ID, NAVER_CLIENT_SECRET], // 여기에 반드시 추가!
}, (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { code, state } = req.body;

    const clientId = process.env[NAVER_CLIENT_ID.name];
    const clientSecret = process.env[NAVER_CLIENT_SECRET.name];

    logger.info(`clientId ${clientId}`);
    logger.info(`clientSecret ${clientSecret}`);

    if (!code || !state) {
      return res.status(400).json({ error: "code and state are required." });
    }

    try {
      // 1. 네이버 토큰 요청 (POST로 수정)
      const tokenRes = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code,
          state,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = tokenRes.data.access_token;

      logger.info(`Custom token created for ${accessToken}`);

      // 2. 사용자 정보 요청
      const userRes = await axios.get("https://openapi.naver.com/v1/nid/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const naverUser = userRes.data.response;
      const naverUid = `naver:${naverUser.id}`;

      logger.info(`naverUid ${naverUid}`);
      // 3. Firebase 커스텀 토큰 생성
      const customToken = await admin.auth().createCustomToken(naverUid);

      // 4. 응답에 사용자 프로필 포함
      res.json({
        token: customToken,
        profile: {
          uid: naverUid,
          name: naverUser.name || '네이버 사용자',
          email: naverUser.email || '',
          aboutMe: '',
          provider: 'naver',
          createdAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error("Naver login failed", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to login with Naver" });
    }
  });
});

// 상호로 검색
exports.naverLocalSearch = onRequest(
  {
    region: "asia-northeast3",
    secrets: [NAVER_CLIENT_ID, NAVER_CLIENT_SECRET],
  },
  async (req, res) => {
    cors(req, res, async () => {
      try {
        const { query } = req.query;
        const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=15`;

        const result = await axios.get(apiUrl, {
          headers: {
            "X-Naver-Client-Id": NAVER_CLIENT_ID.value(),
            "X-Naver-Client-Secret": NAVER_CLIENT_SECRET.value(),
          },
        });

        res.status(200).json(result.data);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
);

exports.kakaoLogin = onRequest({
  region: "asia-northeast3"  // 서울 리전 예시
}, (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      logger.warn(`Unsupported method: ${req.method}`);
      return res.status(405).send('Method Not Allowed');
    }

    const kakaoAccessToken = req.body.accessToken;

    if (!kakaoAccessToken) {
      logger.warn("Access token not provided");
      return res.status(400).json({ error: "Access token is required." });
    }

    try {
      // Kakao 사용자 정보 요청
      const kakaoRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
        },
      });

      const kakaoUser = kakaoRes.data;
      const kakaoUid = `kakao:${kakaoUser.id}`;

      // Firebase Custom Token 생성
      const customToken = await admin.auth().createCustomToken(kakaoUid);
      logger.info(`Custom token created for ${kakaoUid}`);
      res.json({ token: customToken });

    } catch (err) {
      logger.error("Kakao login failed", err.response?.data || err.message);
      res.status(500).json({ error: "Failed to login with Kakao" });
    }
  });
});

// -- 시스템 운영 로그 저장
//exports.logEvent = onRequest(async (req, res) => {
exports.logEvent = onRequest({
  region: "asia-northeast3"  // 서울 리전 
}, async (req, res) => {
  cors(req, res, async () => {
    try {
      const log = req.body
      log.createdAt = admin.firestore.FieldValue.serverTimestamp()

      await db.collection('logs').add(log)

      res.status(200).send('Logged')
    } catch (e) {
      console.error('로그 저장 실패:', e)
      res.status(500).send('Internal Server Error')
    }
  })
})

