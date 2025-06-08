## 🔗 예약 포털 시스템 (Vue + Vuetify + Firebase)

Vue 3, Vuetify 3, Firebase를 기반으로 제작된 **다중 업체 예약 관리 포털**입니다.  
고객, 업체, 관리자가 각각의 역할에 따라 예약을 생성하고 관리할 수 있는 실시간 웹 서비스입니다.

---

### 🧰 기술 스택

- **Frontend**: Vue 3, Vuetify 3, Vite, Pinia, Vue Router  
- **Backend/DB**: Firebase (Authentication, Firestore, Storage, Cloud Functions)

---

### 프로젝트가 진행되면서 계속 수정됩니다.

- 설명이 별로 없이 코드 위주로 진행됩니다.
- 댓글로 질문을 남겨 주시면 대답해 드립니다.
- 개발에 아이디어를 주시면 적용하겠습니다.

---

https://inetsos.tistory.com/

#### 1. 동네 (예약) 포털 - Vue3 + Vuetify + Firebase
여러 업체가 함께 사용하는 예약 포털을 Vue, Vuetify, Firebase를 활용해 개발합니다.  
이 조합은 빠른 개발, 실시간 기능, 확장성에 매우 적합합니다.  
아래는 시스템 아키텍처와 주요 기능을 고려한 설계 및 개발 로드맵입니다.  

#### 2. 동네 (예약) 포털 - Vue 3 + Vite + Vuetify 3 + JS 프로젝트
 - 프로젝트  
&nbsp; npm create vite@latest booking-portal -- --template vue   
&nbsp; cd booking-portal   
&nbsp; npm install vuetify@^3 @mdi/font sass vite-plugin-vuetify    
  
#### 3. 동네 (예약) 포털 (Vue 3 + Firebase) - 회원 등록, 로그인
Vue 3 + Vuetify + Firebase + 상태관리(Pinia)를 사용하여 이메일/비밀번호 회원등록 및 로그인 기능을 구현합니다.
- createUserWithEmailAndPassword  
  Firebase Authentication에서 이메일과 비밀번호를 사용해 새 사용자를 생성할 때 사용하는 메서드입니다. 주로 웹 앱이나 모바일 앱에서 사용자 회원가입 기능을 구현할 때 사용됩니다.
  
- signInWithEmailAndPassword  
  Firebase Authentication에서 이메일과 비밀번호를 사용해 기존 사용자를 로그인시키는 메서드입니다. 로그인 기능이 필요한 앱에서 자주 사용됩니다.

#### 4. 동네 (예약) 포털 (Vue 3 + Firebase) - 비밀번호 변경, 비밀번호 리셋
- 비밀번호 변경
보안상의 이유로 비밀번호는 주기적으로 변경하는 것이 좋습니다.  
비밀번호 변경은 로그인 후에 가능하므로 프로필 페이지 기능을 둡니다.  
  
- updatePassword()  
 Firebase Authentication에서 현재 로그인된 사용자의 비밀번호를 새 비밀번호로 변경할 때 사용하는 메서드입니다.  
  
- reauthenticateWithCredential
 Firebase Authentication에서 이미 로그인한 사용자가 자신의 인증 상태를 다시 확인(재인증) 해야 할 때 사용하는 메서드입니다.  
 비밀번호를 변경하는 것은 민감한 작업이므로 사용자의 신원을 다시 확인한 후 비밀번호를 변경합니다.  


#### 5. 동네 (예약) 포털 (Vue 3 + Firebase) - 구글 계정으로 로그인

&nbsp; Firebase Authentication의 이메일과 비밀번호로 회원 가입을 하지 않고 구글 계정으로 로그인하는 기능을 구현합니다.  
  
&nbsp; 구글 계정으로 로그인하여 프로필 정보를 생성하면  
&nbsp; 앱에 접속을 할 때는 구글 계정으로 로그인을 해야 합니다.  
&nbsp; 만약 Firebase Authentication의 이메일과 비밀번호로 회원 가입을 한 사용자가  
&nbsp; 구글 계정으로 로그인을 하여 다른 프로필을 생성하면  
&nbsp; 이 두 계정을 각 다른 사용자로 인식합니다.  
  
#### 6. 동네 (예약) 포털 (Vue 3 + Firebase) - 회원의 업체 관리

&nbsp; 회원은 여러 업체를 등록할 수 있습니다.  
&nbsp; 회원이 등록한 업체는 등록한 회원이 관리자가 됩니다.  
  
&nbsp; 회원은 여러 업체를 등록할 수 있습니다.  
&nbsp; 회원이 등록한 업체는 등록한 회원이 관리자가 됩니다.  
&nbsp; 등록한 업체의 정보는 수정, 삭제할 수 있습니다.  
  
#### 7. 동네 (예약) 포털 (Vue 3 + Firebase) - 등록 업체 보기(홈)

&nbsp; 홈페이지에 등록한 모든 업체들을 보여 줍니다.  
&nbsp; 업종을 선택하면 해당 업종의 업체들만 볼 수 있습니다.  
  
&nbsp; 업체 리스트에서 업체를 클릭하면 업체 정보 상세 보기로 이동합니다.  
&nbsp; 로그인 한 상태라면 ‘예약 하기’ 버튼을 볼 수 있고,  
&nbsp; 예약 하기를 누르면 예약 화면으로 이동합니다.  

#### 8. 동네 (예약) 포털 (Vue 3 + Firebase) - 예약하기

&nbsp; 업체 등록 정보에 영업 시간을 추가하였습니다.  
&nbsp; 영업 시간에 따라 영업 상태 (영업중, 영업 종료)를 표시할 수 있습니다.  
&nbsp; 회원은 홈페이지에서 업체를 선택하여 예약을 할 수 있습니다.  
&nbsp; 예약 페이지가 열릴 때 라우터 쿼리로 받은 comapnyId로 업체 정보를 가져와 화면에 필요한 정보들을 나타냅니다.  
&nbsp; 예약 시간은 30분 단위의 타임슬롯을 선택하고,  
&nbsp; 하나의 예약에 타임 슬롯을 여러개 선택할 수 있습니다.  
  
#### 9. 동네 (예약) 포털 (Vue 3 + Firebase) - 회원 예약 보기, 예약 기능 개선

&nbsp; 예약 기능의 개선이 있습니다.  
&nbsp; 예약 정보에 업체 이름을 추가하였고,  
&nbsp; 예약 번호를 추가하였습니다.  
    
&nbsp; 내가 예약한 내역을 볼 수 있습니다.  
&nbsp; 그리고 ‘대기중’인 예약은 취소할 수 있습니다.  
    
&nbsp; 예약 업체와 예약 번호를 추가하였습니다.  
&nbsp; 그리고 UI도 개선되었습니다.  
   
&nbsp; 예약 번호의 경우 자동 증가하는 숫자인데,  
&nbsp; Firestore의 경우 자동증가하는 숫자 필드를 지원하지 않습니다.  
&nbsp; 그래서 별도의 counters 컬렉션의 reservationCounter 문서에 current 필드를 사용합니다.  
&nbsp; 예약번호를 지정하기 위해 이 current 필드의 값을 가져와 설정하고  
&nbsp; current 필드의 값을 증가시킵니다.  
&nbsp; 이렇게 하면 중복되는 예약 번호가 없습니다.  
    
&nbsp; 예약 정보에 업체 이름, 예약 번호 등의 추가로 UI도 개선하였습니다.  

#### 10. 동네 (예약) 포털 (Vue 3 + Firebase) - 업체 예약 관리

&nbsp; 예약 정보에 회원 이름을 추가하였습니다.  
&nbsp; 업체에서 예약 조회를 할 때 고객의 이름이 보이는 것이 좋다고 생각했기 때문입니다.  
  
&nbsp; 회원은 자신이 등록한 업체의 리스트를 조회할 수 있습니다.  
&nbsp; 업체 리스트에는 각 업체의 ‘예약 관리’ 버튼이 있고,  
&nbsp; 이것을 누르면 해당 업체의 예약 리스트를 볼 수 있습니다.  
&nbsp; 업체의 관리자는 각 예약에 대해 승인과 거부를 할 수 있습니다.  
  
#### 11. 동네 (예약) 포털 (Vue 3 + Firebase) - 주소 api 연동 선택
  
&nbsp; 주소 API 연동을 위해 사용할 수 있는 대표적인 서비스는 다음과 같습니다:  

&nbsp; ✅ 1. Kakao 주소 검색 API (우편번호 서비스)  
&nbsp; ✅ 2. 네이버 주소 검색 API  
&nbsp; ✅ 3. 한국지역정보개발원 주소 API  
&nbsp; ✅ 4. Google Places API / Geocoding API  


#### 12. 동네 (예약) 포털 (Vue 3 + Firebase) - 업체 주소 등록

&nbsp; 업체 등록 정보에 주소를 추가합니다.  
&nbsp; 주소 API는 Kakao 주소 검색 API (우편번호 서비스)를 사용합니다.  
&nbsp; ChatGPT가 Kakao 주소 검색 API가 좋다고 합니다.  
  
&nbsp; 업체 정보에 주소 필드를 추가하는 이유는  
&nbsp; 지도에 업체의 위치를 보여주기 위해서입니다.  
&nbsp; 지도는 네이버 지도를 사용할 예정입니다.  

#### 13. 동네 (예약) 포털 (Vue 3 + Firebase) - 네이버 지도 sdk 연동 가이드

&nbsp; 네이버 지도 SDK 연동은 다음 3단계로 구성됩니다:  
  
&nbsp; ✅ 1. 클라이언트 ID 발급  
&nbsp; ✅ 2. SDK 스크립트 삽입  
&nbsp; ✅ 3. 지도 초기화 코드 작성  

#### 14. 동네 (예약) 포털 (Vue 3 + Firebase) - 네이버 지도에 업체 위치 보기

&nbsp; Home의 업체 리스트에서 업체 정보에 주소가 있습니다.  
&nbsp; 주소 옆에 '지도 보기' 버튼이 있고 이것을 누르면 네이버 지도로 위치를 보여 줍니다.  
  
#### 15. 동네 (예약) 포털 (Vue 3 + Firebase) - 네이버 지도 상점 위치 보기 개선

&nbsp; 상점의 주소로 네이버 지도 위에 표시를 하였을 때 실제 위치와 차이가 납니다.  
&nbsp; 상호로 위치를 검색하는 기능을 추가하였습니다.  
&nbsp; 상호로 위치 검색은 사용자가 입력한 키워드에 대한 검색으로 여러 개의 검색결과를 돌려 줍니다.   
&nbsp; 네이버 상호 검색은 내부적으로 POI 정보를 반환합니다.
  
📌 POI (Point of Interest): 위치 기반 데이터에서 관심 지점(상점, 식당, 병원, 공원 등)을 의미합니다.  
  
#### 16. 동네 (예약) 포털 (Vue 3 + Firebase) - 미용실 예약 커스터마이징

&nbsp; 예약 관리 시스템을 고도화합니다.  
&nbsp; 미용실에 대해 커스터마이징을 진행해 봅시다.  
  
&nbsp; 미용실 예약을 할 때 서비스를 선택할 수 있도록 합니다.  
&nbsp; 이를 위하여 서비스를 등록, 수정, 삭제할 수 있는  관리 기능을 구현합니다.  
   
&nbsp; ‘상점 보기’에서 서비스업 상점의 경우 ‘서비스(메뉴) 관리’ 링크가 추가되었습니다.  
&nbsp; 서비스 관리 페이지에서 등록된 서비스 리스트를 볼 수 있고  
&nbsp; 서비스를 등록할 수도 있고,  
&nbsp; 등록된 서비스를 선택하면 서비스를 수정할 수도 있습니다.  
  
&nbsp; 서비스 리스트 기능은 서비스 등록에도 사용되므로  
&nbsp; 상점의 관리자가 아닌 경우 ‘서비스 등록’ 버튼이 보이지 않습니다.  
&nbsp; 이를 위하여 현재 로그인한 회원이 상점의 관리자인지 확인할 수 있어야 합니다.  
&nbsp; 상점의 관리자는 company.ownerId가 현재 로그인한 user.uid와 같으면 상점의 관리자입니다.  
  
&nbsp; 서비서업인 경우 상점 상세 보기에서도 ‘서비스 보기’로 등록된 서비스를 볼 수 있습니다.  
&nbsp; 관리자는 예약 관리에서 예약 시간과 함께 고객의 서비스도 확인할 수 있습니다.  
  
#### 17. 동네 포털 - v-expansion-panels, v-data-table, vuedraggable

- v-expansion-panels는 Vuetify에서 제공하는 UI 컴포넌트로, 여러 개의 내용을 아코디언(accordion) 방식으로 펼치고 접을 수 있게 해주는 구성 요소입니다.  
- v-data-table은 Vuetify에서 제공하는 강력한 표 형식의 데이터 표시 컴포넌트입니다.   
- vuedraggable는 Vue.js에서 드래그 앤 드롭(Drag & Drop) 기능을 쉽게 구현할 수 있게 해주는 인기 라이브러리입니다.   
  
#### 18. 동네 포털 (Vue 3 + Vuetify + Firebase) - 메뉴 카테고리 관리    

&nbsp; 테이크아웃 커피점의 메뉴 관리를 생각해 봅니다.
  
&nbsp; 음료의 종류가 생각보다 많습니다.
&nbsp; 음료 외에 토핑, 사이드 메뉴까지 있습니다.

&nbsp; 우선 메뉴 관리를 위하여 
&nbsp; 카테고리를 등록하여 
&nbsp; 카테고리 별로 메뉴를 볼 수 있도록 하겠습니다.

&nbsp; 카테고리를 등록하면 
&nbsp; 등록한 카테고리는 리스트에 나타납니다.

&nbsp; 카테고리 리스트의 카테고리 옆 삭제 아이콘을 누르면 카테고리가 삭제 됩니다.

&nbsp; 카테고리의 순서는 메뉴를 나타낼 때 카테고리 순서로 나타내기 위해 필요합니다.
&nbsp; 카테고리 리스트에서 카테고리를 드래그하면 순서를 변경할 수 있습니다.

![카테고리 관리](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbquPwg%2FbtsOtiEaEp8%2FAPbV3yV2AU7mDW3PAe6IcK%2Fimg.png)
  
 
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

### 🗂️ Firestore 구조

profiles  
└─ uid "fofKvBAMxpeuwQT3RtnZckoSHxG2"   
└─ email "portal@email.com" (문자열)   
└─ name "예약포털 개발자" (문자열)   
└─ aboutMe "예약 시스템이 필요한 업체는 누구나 업체를 등록하면 무료로 예약 시스템을 사용할 수 있습니다. " (문자열)    
└─ createdAt 2025년 5월 29일 오후 7시 35분 57초 UTC+9 (타임스탬프)    
    
companies  
└─ category "서비스업" (문자열)  
└─ name "영헤어" (문자열)  
└─ description "우리 동네 미용실입니다. 편한 시간에 미리 예약하시고 오시면 됩니다. " (문자열)  
└─ openTime "10:30" (문자열)  
└─ closeTime "20:00" (문자열)  
└─ address "대구 수성구 달구벌대로669길 40" (문자열)  
└─ detailAddress "영헤어" (문자열)  
└─ zipcode "42273" (문자열)  
└─ ownerId "fofKvBAMxpeuwQT3RtnZckoSHxG2" (문자열)  
└─ createdAt 2025년 6월 1일 오후 3시 42분 13초 UTC+9 (타임스탬프)  
└─ updatedAt 2025년 6월 3일 오후 6시 12분 6초 UTC+9 (타임스탬프)  
└─ services (서브컬렉션)  
&nbsp;&nbsp;&nbsp;&nbsp;└─ category "염색" (문자열)  
&nbsp;&nbsp;&nbsp;&nbsp;└─ name "전체염색" (문자열)  
&nbsp;&nbsp;&nbsp;&nbsp;└─ description "" (문자열)  
&nbsp;&nbsp;&nbsp;&nbsp;└─ price "60000" (문자열)  
&nbsp;&nbsp;&nbsp;&nbsp;└─ createdAt 2025년 6월 5일 오후 5시 18분 48초 UTC+9 (타임스탬프)  
   
reservations  
└─ companyId "nIBne1CmWHRjUWWYAKSV" (문자열)  
└─ companyName "영헤어" (문자열)  
└─ createdAt 2025년 6월 5일 오후 5시 56분 30초 UTC+9 (타임스탬프)  
└─ date "2025-06-05" (문자열)  
└─ memo "" (문자열)  
└─ reservationNumber 27 (번호)  
└─ serviceId "x8Ai3SGs62jM4QRVrSRd" (문자열)  
└─ serviceName "남성컷" (문자열)  
└─ status "대기중" (문자열)  
└─ timeSlots (배열)  
&nbsp;&nbsp;&nbsp;&nbsp;0 "09:30~10:00" (문자열)  
└─ userId "fofKvBAMxpeuwQT3RtnZckoSHxG2" (문자열)  
└─ userName "예약포털 개발자" (문자열)  

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

'/', name: 'home',  홈  
'/register', name: 'register', 회원가입  
'/profile', name: 'profile', 회원 프로필  
'/login', 로그인  
'/register-company',  name: 'RegisterCompany' 상점 등록  
'/my-companies', name: 'MyCompanies'  등록한 내 상점  
'/edit-company/:id', name: 'EditCompany' 상점 정보 수정  
'/company/:id', name: 'CompanyDetai'  상점 상세 보기  
'/reservation', name: 'Reservation'  예약 하기  
'/my-reservations', name: 'MyReservations'  회원의 내 예약  
'/company-reservations/:companyId', name: 'CompanyReservations'  상점의 예약   
'/map', name: 'MapView'  네이버 지도에서 상점 위치 보기  
'/companies/:companyId/services', name: 'ServiceList'  서비스 업종의 등록한 서비스 목록  
'/companies/:companyId/services/:serviceId?', name: 'ServiceManagement'  서버스업종의 서비스 등록, 수정, 삭제  
  
---

### 🔧 Firebase Hosting 배포

```bash
npm run build
firebase deploy
