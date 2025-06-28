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

### 1. 동네 (예약) 포털 - Vue3 + Vuetify + Firebase
여러 업체가 함께 사용하는 예약 포털을 Vue, Vuetify, Firebase를 활용해 개발합니다.  
이 조합은 빠른 개발, 실시간 기능, 확장성에 매우 적합합니다.  
아래는 시스템 아키텍처와 주요 기능을 고려한 설계 및 개발 로드맵입니다.  

### 2. 동네 (예약) 포털 - Vue 3 + Vite + Vuetify 3 + JS 프로젝트
 - 프로젝트  
&nbsp; npm create vite@latest booking-portal -- --template vue   
&nbsp; cd booking-portal   
&nbsp; npm install vuetify@^3 @mdi/font sass vite-plugin-vuetify    
  
### 3. 동네 (예약) 포털 (Vue 3 + Firebase) - 회원 등록, 로그인
Vue 3 + Vuetify + Firebase + 상태관리(Pinia)를 사용하여 이메일/비밀번호 회원등록 및 로그인 기능을 구현합니다.
- createUserWithEmailAndPassword  
  Firebase Authentication에서 이메일과 비밀번호를 사용해 새 사용자를 생성할 때 사용하는 메서드입니다. 주로 웹 앱이나 모바일 앱에서 사용자 회원가입 기능을 구현할 때 사용됩니다.
  
- signInWithEmailAndPassword  
  Firebase Authentication에서 이메일과 비밀번호를 사용해 기존 사용자를 로그인시키는 메서드입니다. 로그인 기능이 필요한 앱에서 자주 사용됩니다.

### 4. 동네 (예약) 포털 (Vue 3 + Firebase) - 비밀번호 변경, 비밀번호 리셋
- 비밀번호 변경
보안상의 이유로 비밀번호는 주기적으로 변경하는 것이 좋습니다.  
비밀번호 변경은 로그인 후에 가능하므로 프로필 페이지 기능을 둡니다.  
  
- updatePassword()  
 Firebase Authentication에서 현재 로그인된 사용자의 비밀번호를 새 비밀번호로 변경할 때 사용하는 메서드입니다.  
  
- reauthenticateWithCredential
 Firebase Authentication에서 이미 로그인한 사용자가 자신의 인증 상태를 다시 확인(재인증) 해야 할 때 사용하는 메서드입니다.  
 비밀번호를 변경하는 것은 민감한 작업이므로 사용자의 신원을 다시 확인한 후 비밀번호를 변경합니다.  


### 5. 동네 (예약) 포털 (Vue 3 + Firebase) - 구글 계정으로 로그인

&nbsp; Firebase Authentication의 이메일과 비밀번호로 회원 가입을 하지 않고 구글 계정으로 로그인하는 기능을 구현합니다.  
  
&nbsp; 구글 계정으로 로그인하여 프로필 정보를 생성하면  
&nbsp; 앱에 접속을 할 때는 구글 계정으로 로그인을 해야 합니다.  
&nbsp; 만약 Firebase Authentication의 이메일과 비밀번호로 회원 가입을 한 사용자가  
&nbsp; 구글 계정으로 로그인을 하여 다른 프로필을 생성하면  
&nbsp; 이 두 계정을 각 다른 사용자로 인식합니다.  
  
### 6. 동네 (예약) 포털 (Vue 3 + Firebase) - 회원의 업체 관리

&nbsp; 회원은 여러 업체를 등록할 수 있습니다.  
&nbsp; 회원이 등록한 업체는 등록한 회원이 관리자가 됩니다.  
  
&nbsp; 회원은 여러 업체를 등록할 수 있습니다.  
&nbsp; 회원이 등록한 업체는 등록한 회원이 관리자가 됩니다.  
&nbsp; 등록한 업체의 정보는 수정, 삭제할 수 있습니다.  
  
### 7. 동네 (예약) 포털 (Vue 3 + Firebase) - 등록 업체 보기(홈)

&nbsp; 홈페이지에 등록한 모든 업체들을 보여 줍니다.  
&nbsp; 업종을 선택하면 해당 업종의 업체들만 볼 수 있습니다.  
  
&nbsp; 업체 리스트에서 업체를 클릭하면 업체 정보 상세 보기로 이동합니다.  
&nbsp; 로그인 한 상태라면 ‘예약 하기’ 버튼을 볼 수 있고,  
&nbsp; 예약 하기를 누르면 예약 화면으로 이동합니다.  

### 8. 동네 (예약) 포털 (Vue 3 + Firebase) - 예약하기

&nbsp; 업체 등록 정보에 영업 시간을 추가하였습니다.  
&nbsp; 영업 시간에 따라 영업 상태 (영업중, 영업 종료)를 표시할 수 있습니다.  
&nbsp; 회원은 홈페이지에서 업체를 선택하여 예약을 할 수 있습니다.  
&nbsp; 예약 페이지가 열릴 때 라우터 쿼리로 받은 comapnyId로 업체 정보를 가져와 화면에 필요한 정보들을 나타냅니다.  
&nbsp; 예약 시간은 30분 단위의 타임슬롯을 선택하고,  
&nbsp; 하나의 예약에 타임 슬롯을 여러개 선택할 수 있습니다.  
  
### 9. 동네 (예약) 포털 (Vue 3 + Firebase) - 회원 예약 보기, 예약 기능 개선

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

### 10. 동네 (예약) 포털 (Vue 3 + Firebase) - 업체 예약 관리

&nbsp; 예약 정보에 회원 이름을 추가하였습니다.  
&nbsp; 업체에서 예약 조회를 할 때 고객의 이름이 보이는 것이 좋다고 생각했기 때문입니다.  
  
&nbsp; 회원은 자신이 등록한 업체의 리스트를 조회할 수 있습니다.  
&nbsp; 업체 리스트에는 각 업체의 ‘예약 관리’ 버튼이 있고,  
&nbsp; 이것을 누르면 해당 업체의 예약 리스트를 볼 수 있습니다.  
&nbsp; 업체의 관리자는 각 예약에 대해 승인과 거부를 할 수 있습니다.  
  
### 11. 동네 (예약) 포털 (Vue 3 + Firebase) - 주소 api 연동 선택
  
&nbsp; 주소 API 연동을 위해 사용할 수 있는 대표적인 서비스는 다음과 같습니다:  

&nbsp; ✅ 1. Kakao 주소 검색 API (우편번호 서비스)  
&nbsp; ✅ 2. 네이버 주소 검색 API  
&nbsp; ✅ 3. 한국지역정보개발원 주소 API  
&nbsp; ✅ 4. Google Places API / Geocoding API  


### 12. 동네 (예약) 포털 (Vue 3 + Firebase) - 업체 주소 등록

&nbsp; 업체 등록 정보에 주소를 추가합니다.  
&nbsp; 주소 API는 Kakao 주소 검색 API (우편번호 서비스)를 사용합니다.  
&nbsp; ChatGPT가 Kakao 주소 검색 API가 좋다고 합니다.  
  
&nbsp; 업체 정보에 주소 필드를 추가하는 이유는  
&nbsp; 지도에 업체의 위치를 보여주기 위해서입니다.  
&nbsp; 지도는 네이버 지도를 사용할 예정입니다.  

### 13. 동네 (예약) 포털 (Vue 3 + Firebase) - 네이버 지도 sdk 연동 가이드

&nbsp; 네이버 지도 SDK 연동은 다음 3단계로 구성됩니다:  
  
&nbsp; ✅ 1. 클라이언트 ID 발급  
&nbsp; ✅ 2. SDK 스크립트 삽입  
&nbsp; ✅ 3. 지도 초기화 코드 작성  

### 14. 동네 (예약) 포털 (Vue 3 + Firebase) - 네이버 지도에 업체 위치 보기

&nbsp; Home의 업체 리스트에서 업체 정보에 주소가 있습니다.  
&nbsp; 주소 옆에 '지도 보기' 버튼이 있고 이것을 누르면 네이버 지도로 위치를 보여 줍니다.  
  
### 15. 동네 (예약) 포털 (Vue 3 + Firebase) - 네이버 지도 상점 위치 보기 개선

&nbsp; 상점의 주소로 네이버 지도 위에 표시를 하였을 때 실제 위치와 차이가 납니다.  
&nbsp; 상호로 위치를 검색하는 기능을 추가하였습니다.  
&nbsp; 상호로 위치 검색은 사용자가 입력한 키워드에 대한 검색으로 여러 개의 검색결과를 돌려 줍니다.   
&nbsp; 네이버 상호 검색은 내부적으로 POI 정보를 반환합니다.
  
📌 POI (Point of Interest): 위치 기반 데이터에서 관심 지점(상점, 식당, 병원, 공원 등)을 의미합니다.  
  
### 16. 동네 (예약) 포털 (Vue 3 + Firebase) - 미용실 예약 커스터마이징

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
  
### 17. 동네 포털 - v-expansion-panels, v-data-table, vuedraggable

- v-expansion-panels는 Vuetify에서 제공하는 UI 컴포넌트로, 여러 개의 내용을 아코디언(accordion) 방식으로 펼치고 접을 수 있게 해주는 구성 요소입니다.  
- v-data-table은 Vuetify에서 제공하는 강력한 표 형식의 데이터 표시 컴포넌트입니다.   
- vuedraggable는 Vue.js에서 드래그 앤 드롭(Drag & Drop) 기능을 쉽게 구현할 수 있게 해주는 인기 라이브러리입니다.   
  
### 18. 동네 포털 (Vue 3 + Vuetify + Firebase) - 메뉴 카테고리 관리    

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
  
### 19. 동네 포털 (Vue 3 + Vuetify + Firebase) - 토핑 관리 
  
&nbsp; 커피에 크림(휘핑 크림, 비낙농 크림 등)이나 시럽, 초콜릿 등을 추가하여   
&nbsp; 커피 위에 장식하는 것을 '토핑'이라고 합니다.   
&nbsp; 토핑은 커피의 맛과 외관을 더욱 다양하고 즐겁게 만들어주는 역할을 합니다.  
   
&nbsp; 음료와 토핑이 하나의 완성된 메뉴를 만들기 때문에   
&nbsp; 메뉴를 구성할 때 음료와 토핑을 묶을 수 있어야 합니다.  
&nbsp; 각 음료에는 일부 토핑만 가능할 수 있으므로   
&nbsp; 각 음료에 대해 가능한 토핑을 음료와 연동하여야 합니다.    
  
&nbsp; 토핑을 음료에 추가하는 것으로   
&nbsp; 음료에 추가하여 제공됩니다.   
&nbsp; 그러므로 토핑만으로는 별도의 메뉴를 구성하지 않도록 합니다.   
  
&nbsp; 토핑은 가격이 있으므로   
&nbsp; 토핑의 이름과 가격을 등록하면  
&nbsp; 토핑 리스트로 나타나고  
&nbsp; 리스트에서 토핑을 선택하여 드래그로 순서를 변경할 수 있습니다.  
  
&nbsp; 토핑 리스트의 토핑 옆 삭제 아이콘을 누르면   
&nbsp; 등록된 토핑을 삭제할 수 있습니다.  
  
![토핑 관리](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb85JaE%2FbtsOrByy2tn%2F6rqNqxcITpaVY6aPiFWddk%2Fimg.png)

### 20. 동네 포털 (Vue 3 + Vuetify + Firebase) - 음료 Ice/Hot 옵션 관리

&nbsp; 대부분의 음료는 아이스(Ice), 핫(Hot)을 선택할 수 있습니다.  
&nbsp; 그러나 일부 음료의 경우 아이스만, 또는 핫만 가능할 수 있습니다.  
&nbsp; 그러므로 음료를 주문할 때 아이스 또는 핫을 선택할 수 있도록 메뉴를 구성해야 합니다.  
  
&nbsp; 아이스, 핫 선택 또는 아이스만, 또는 핫만 등록할 수 있습니다.  
&nbsp; 등록된 옵션은 리스에 나타나고   
&nbsp; 등록된 아이스/핫 옵션의 순서는 드래그로 변경할 수 있습니다.  
&nbsp; 옵션 옆에 있는 삭제 아이콘을 눌러 삭제할 수 있습니다.  
    
![옵션 관리](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FePj6l5%2FbtsOsVW17FN%2F2FEif2mkWqzNgd2UVBKIE1%2Fimg.png)

### 21. 동네 포털 (Vue 3 + Vuetify) - Firebase Storage (메뉴 이미지 저장)

&nbsp; 메뉴에는 이미지가 있습니다.  
&nbsp; 메뉴를 등록할 때 로컬 PC에서 이미지를 선택하면  
&nbsp; 선택된 이미지를 firebase storage에 업로드합니다.  
&nbsp; 웹에서 메뉴의 이미지는 보면 firebase storage에 업로드된 이미지를 보여줍니다.  
  
&nbsp; Firebase Cloud Storage는 Google Cloud Storage 기반으로 동작하며,   
&nbsp; Firebase에서 제공하는 파일 저장 서비스입니다.  
&nbsp; 주로 앱에서 이미지, 오디오, 비디오, PDF 같은 대용량 파일을 안전하게 저장하고, 필요할 때 불러오는 데 사용됩니다.  

### 22. 예약 포털 (Vue3 + Vuetify + Firebase) - 카페 메뉴 관리

&nbsp; 메뉴는 카테고리, 이름, 설명, 가격, 가능한 토핑, 옵션의 항목을 가지고 있습니다.  
&nbsp; 또한 각 메뉴는 이미지도 가지고 있습니다.  
  
&nbsp; 메뉴를 등록하기 위하여  
&nbsp; 카테고리, 토핑, 옵션은 별도로 등록하였습니다.  
&nbsp; 그리고 메뉴 이미지도 준비 하였습니다.  
   
&nbsp; 메뉴 등록 화면의 상단에는 메뉴를 등록하기 위한 폼이 있고  
&nbsp; 하단에는 등록된 메뉴의 리스트를 보여줍니다.  
  
&nbsp; 메뉴 리스트는 카테고리별로 관리되며  
&nbsp; 메뉴 리스트에서 드래그하여 메뉴의 순서를 변경할 수 있습니다.  
   
![메뉴 관리 1](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F8rVAJ%2FbtsOw3NRWM5%2FhJwM5eWANgoOJRvyccMH1K%2Fimg.png)

![메뉴 관리 2](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FPqqJe%2FbtsOuEIB6ro%2FzZAZOT6IVnc9PWBIkOrBK1%2Fimg.png)

![메뉴 관리 3](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcP5xp9%2FbtsOxq9VEW0%2FU7ELuxfCC8cAlH0rrBmpbk%2Fimg.png)
   
### 23. 예약 포털 (Vue3 + Vuetify + Firebase) - 카페 메뉴 관리 완성

메뉴를 등록려면  
메뉴 이미지를 업로드하고,  
이름, 설명, 가격을 입력하고  
음료에 가능한 토핑과 옵션을 선택하여   
저장합니다.  

![메뉴 관리 완성 1](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fn8ZAO%2FbtsOv6dwVgu%2FcXay1oRJwhGhXhPuvqlpU1%2Fimg.png)
![메뉴 관리 완성 1](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FUkAx1%2FbtsOxruuylL%2FLdjbQkriuUkofpJuU56iBK%2Fimg.png)
![메뉴 관리 완성 1](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FenfVui%2FbtsOwIXvPRE%2FYRPJKMUROk9YHhqjg5BiW1%2Fimg.png)
![메뉴 관리 완성 1](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbaT88H%2FbtsOvvkmQ61%2FQ4ImINSv9vesqnllZBGOgK%2Fimg.png)

### 24. 예약 포털 (Vue3 + Vuetify + Firebase) - 카페 온라인 주문

- 카페 온라인 주문  

온라인 주문을 하기 위한 메뉴를 보여줍니다.  
메뉴는 이미지, 이름, 설명, 가격과  
가능한 토핑 리스트, 옵션 리스트를 한 화면 보여줍니다.  
  
토핑 리스트는 메뉴 등록에서 등록한 음료에 추가가 가능한 토핑을 나열하고  
체크 박스로 여러 개를 선택할 수 있도록 합니다.  
  
옵션도 마찬가지로 메뉴에 등록한 선택 가능한 옵션만 나타내고  
옵션이 하나인 경우는 자동으로 기본 옵션이 선택되고  
옵션이 둘 이상의 경우는 사용자가 옵션을 선택해야 주문이 되도록 하였습니다.  
  
메뉴 주문에서 카테고리 태그 리스트가 화면을 넘치는 경우 좌우 스크롤합니다.  
  
![카페 온라인 주문 1](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FnxJtt%2FbtsOwDoUfJv%2FAIv81UawAWvMPFikldqPB1%2Fimg.png)
![카페 온라인 주문 2](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FLZtxr%2FbtsOyWmXFKh%2FrDhqyfi0ajdj1zbghlrgbK%2Fimg.png)
  
- 장비구니  
  
담기 버튼을 클릭하면 장바구니에 담습니다.  
장바구니 버튼을 클릭하면 주문한 메뉴들을 확인할 수 있고,  
장바구니 창에서 주문을 할 수 있습니다.  
   
장바구니에서 주문 메뉴의 수량을 조정할 수 있습니다.  
수량을 조절하면 주문 품목의 가격과 합계 금액도 재계산 되어야  합니다.  
  
수량 조절과 별개로  삭제 버튼이 있어 이것을 누르면 주문 메뉴를 삭제할 수 있습니다.  
품목이 삭제되면 합계 금액도 재계산되어야 합니다.  
  
![카페 온라인 주문 장바구니 1](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb8BBwc%2FbtsOwb7tA8U%2FBM9YyyHzEXwkHLOIYeQqZK%2Fimg.png)
![카페 온라인 주문 장바구니 2](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FrNt6o%2FbtsOx8nSOJU%2FcekNI1rnkLMbsvarB08hB0%2Fimg.png)
  

### 25. 예약 포털 (Vue3 + Firebase) - 카페 운영 대시보드

운영에 필요한 각종 관리 기능들을 모아둔 페이지를 ‘운영 대시보드’라 합시다.  
운영에 필요한 각 기능들을 우선 다음과 같이 정리합니다.  
  
1. 메뉴 관리  
2. 메뉴 품절 관리  
3. 고객 주문 확인  
4. 고객 주문 완료 및 픽업 알림  
5. 고객 주문 취소  
  
이들 관리 기능 외에도 매출 집계, 현황 등 매출 분석과  
많이 팔리는 품목 조회 등 고객 데이터 분석 등  
운영에 필요한 각종 리포팅 기능도 필요할 것입니다.
  
계속 운영 대시보드에 필요한 기능들이 추가되어갈 것입니다.  
  
![카페 운영자 대시보드](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FHsRhx%2FbtsOzgtZNfd%2F8JtE7MzaV1xGJROHDdxmyK%2Fimg.png)
  
### 26. 예약 포털 (Vue3 + Vuetify + Firebase) - 카페 메뉴 품절 상태 관리

메뉴가 품절인 경우에 대한 처리를 생각해 봅시다.  
   
품절이 확인 되면 관리자가 우선 메뉴의 품절 상태를 설정합니다.  
그러면 온라인 주문 메뉴 리스트에 품절을 표시해야 합니다.  
품절된 품목에 대해서는 주문이 되지 않습니다.  
  
![카페 온라인 주문 품절 메뉴](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fch2n6w%2FbtsOzAsFl2e%2FLJzqrnoNDhKSBedRyaU8tk%2Fimg.png)
  

### 27. 예약 포털 (Vue3 + Vuetify + Firebase) - 카페의 온라인 주문 관리

고객 주문 확인 페이지에서 고객의 주문에 따라 음료가 준비되면 완료 버튼을 눌러 주문을 완료합니다.  
주문확인 페이지의 경우 실제 카페에서 적용을 한다면   
바쁘게 음료를 준비하면서 화면을 확인하므로 시인성이 좋아야 합니다.  
그래서 주문 내용이 잘 보일 수 있도록 각 항목에 대해 폰트를 키우고 글자색도 다르게 부여했습니다.   
  
'완료' 버튼을 누르면 주문이 완료로 변경됩니다.  
주문 상태 즉 대기, 완료의 태그 색을 다르게 하여 쉽게 구분할 수 있도록 했습니다.  
  
![카페 온라인 주문 주문 확인 및 완료 처리](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Flup40%2FbtsOz48o9bk%2FZnwZW1FnjHGEQnA8Y97Ej0%2Fimg.png)
  

### 28. 예약 포털 (Vue3 + Firebase) 마이페이지 - 주문 내역, 예약 내역

- 마이페이지
동네 포털에 이전에 개발한 미용실 예약이 있습니다.   
그리고 현재 개발 중인 카레 온라인 주문 기능으로  
조회하는 것이 두개로 늘었습니다.  
미용실 예약 조회와 카페 주문조회 입니다.  
그래서 마이페이지를 새로 추가 하였습니다.  
마이페이지에는 예약 내역과 주문 내역이 있습니다.  
  
![동네 포털 마이페이지](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbdLE7r%2FbtsOAh7QYO1%2F1HNQVhyuAUkNeUjtM9YC5k%2Fimg.png)

- 주문 내역  
카페의 온라인 주문 내역을 확인할 수 있습니다.  
카페별로 구분하여 주문 내역을 볼 수 있습니다.  
  
![동네 포털 내 주문 보기](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbbLD0G%2FbtsOBSTdxtC%2F1enKGEKq4fqvK1KnRKoxB1%2Fimg.png)
  

### 29. 예약 포털 (Vue3 + Firebase) - 익명 로그인, 비회원 주문

비회원 주문을 클릭하면 ‘익명 로그인’을 합니다.  
그러면  Firebase에서 임시 사용자 계정을 생성 하고 이 계정은 익명 로그인 계정임을 알 수 있습니다.  
  
익명 로그인을 한 후 온라인 주문에서 메뉴 선택을 하고  
장바구니에 접속을 하면   
장바구니에서는 익명 로그인일 경우 이름과 전화번호를 입력 받습니다.  

이름과 전화번호를 입력한 후 ‘주문하기’ 버튼을 누르면 비회원 주문이 됩니다.  
  
- 비회원 주문 - 홈  

![동네 포털 비회원 주문 링크](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbHxO64%2FbtsOCjXrNCm%2FjwE2IGPWP3UvfokxssO251%2Fimg.png)
  
- 비회원 주문 하기  

![동네 포털 비회원 주문 하기](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FkPQXA%2FbtsOCPO1vts%2F4NCRckMG6IuylKk5wA8Sa0%2Fimg.png)
  
- 비회원 주문 조회  

![동네 포털 비회원 주문 조회](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcuapOs%2FbtsOA8buoRT%2FoRa4071lHIwQ9iQtuAeWz1%2Fimg.png)
  

### 30. 예약 포털 (Vue3 + Firebase) - 회원의 카페 온라인 주문

회원의 주문은 상점의 ‘온라인 주문’ 버튼을 누르면 온라인 주문을 할 수 있습니다.  

회원이 로그인 하지 않은 상태에서 ‘온라인 주문’을 누르면  
로그인 페이지로 이동하여 로그인을 합니다.  
로그인에 성공을 하면 주문 페이지로 이동합니다.  
  
온라인 주문에서 메뉴를 선택한 후   
장바구니로 이동하여 주문을 할 수 있습니다.  
회원 주문의 경우 이름과 전화번호 입력은 없습니다.  
   
온라인 주문 페이지에는 ‘주문 내역’ 링크가 있습니다.  
이것을 누르면 회원의 이 카페에 대한 주문 내역을 확인할 수 있습니다.  
  
- 회원 온라인 주문 - 홈  

![동네 포털 비회원 온라인 주문](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fm0P8i%2FbtsOAIqOa3G%2FHoDkXudbrKoKp2E1dRv4BK%2Fimg.png)

- 회원 온라인 주문 장바구니  

![동네 포털 회원 온라인 주문 장바구니](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FckNAMD%2FbtsOBhsB2tN%2FNatQjk9j9KBcCEt2HRUOM0%2Fimg.png)

- 회원 주문 내역

![동네 포털 회원 온라인 주문 장바구니](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbEdVOj%2FbtsOAWih3CT%2FK5qoOSM3Ey89kboVX3jTnk%2Fimg.png)
  

### 31. 예약 포털 (Vue3 + Firebase) - chart.js, vue-chartjs

매출 분석은 차트로 시각화 하여 나타내도록 합시다.  
차트를 사용하여 매출을 시각화합니다.  
  
Vue.js 애플리케이션에서 차트를 시각화하기 위해 필요한 두 가지 라이브러리를 설치합니다.
  
#### 🔧 Vue Chart 설치   

npm install chart.js@4 vue-chartjs@5  

이 명령은 다음을 설치합니다:  
- chart.js 라이브러리의 4.x 버전  
- vue-chartjs 라이브러리의 5.x 버전 (Vue 3용)  
  
이 조합은 Vue 3 프로젝트에서 차트를 표시하려는 경우 가장 호환성 있는 버전 조합입니다.

#### 매출 대시보드  
  
매출 대시보드를 통해 매출 데이터를 시각적으로 통합하여 실시간으로 모니터링합니다.  

- useSalesSummary.js  
useSalesSummary는 Vue 3의 Composition API와 Firebase Firestore를 활용해  
매출 요약 및 트렌드 데이터(일/주/월/연/시간대별)를 계산하고 시각화하기 위한 Composable 함수입니다.

![동네 포털 회원 온라인 주문 매츨 차트](
https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbiZqff%2FbtsOEPVNbM5%2Fbovg2z2B5jegSgEtCIpSuk%2Fimg.png)
  

### 32. 예약 포털 (Vue3 + Firebase) - 매출을 vue-chartjs 차트로 시각화

useSalesSummary() composable은 매출 분석을 위한 강력한 도구입니다.   
Firestore 데이터를 기반으로 오늘, 이번주, 이번달, 올해와 그 이전 기간의 데이터를 가져와 매출 트렌드와 성장율을 계산 계산하여 관리자 대시보드에 출력합니다. 
  
- 일 매출: 최근 7일간의 일별 매출 트렌드 및 성장율  
- 주 매출: 최근 6주 간의 주간 매출 트렌드 및 성장율  
- 월 매출: 최근 6개월 간의 월별 매출 트렌드 및 성장율  
- 년 매출: 최근 4년 간의 연도별 매출 트렌드 및 성장율  
  
![매츨 분석 - 데스크탑](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbbyRag%2FbtsOE7J4U8J%2FS8N4xxcH8IBaa7QFCSXVd0%2Fimg.png)

![매츨 분석 - 모바일](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F39twF%2FbtsOFlBjvKB%2F3aEq4YURcMK1sbkXtlRU21%2Fimg.png)
  

### 33. 예약 포털 (Vue3 + Firebase) - 카페 시간대별 매출 분석

시간대별로 매출과 주문량을 함께 시각화하면 유용한 인사이트를 얻을 수 있습니다.  
  
두 데이터(매출 & 주문량)를 이중 Y축 차트로 동시에 보여주어  
흐름을 한눈에 비교할 수 있어서 직관적입니다.   
  
기간을 입력하면 Firebase Firestore에 저장된 주문 데이터를 기준으로,   
입력 기간 내 시간대별 매출(totalAmount)과 주문 수(order count)를 트렌드 차트로 화면에 출력합니다.  
  
![시간대별 매츨 분석 - 데스크탑](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FeH5LGX%2FbtsODWJgVat%2F2vECfbx44uWMUNrRP4P1y1%2Fimg.png)

![시간대별 매츨 분석 - 모바일](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FALC6L%2FbtsOFmNLU01%2FCWyG7GOyeUFWqJkv4IKqVk%2Fimg.png)
  

### 34. 예약 포털 (Vue3 + Firebase) - 상품별 매출 리포트
  
상품별 판매 수량과 매출 집계 리포트는 단순한 자료가 아니라, 경영의 나침반과도 같은 역할을 해요.   
기간을 입력하고 ‘조회’를 누르면 입력한 기간 동안의 매출 수량과 금액의 집계를 매출액이 큰 순으로 정렬하여 출력합니다.  
  
![상품별 매출 리포트 - 데스크탑](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FFjXZP%2FbtsOHENUR77%2F2VfQruK4ZLvqw00dDdI9sK%2Fimg.png)

![상품별 매출 리포트 - 모바일](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fng1C7%2FbtsOIZDKGaz%2FtrXoIFI6kOULk4Q4jGqIb1%2Fimg.png)
  

### 35. 예약 포털 (Vue3 + Firebase) - 카카오 로그인 기능 구현에 필요한 것들

- 카카오 로그인 구현 단계  
   
소셜 로그인은 사용자가 별도의 회원가입 절차 없이 기존에 사용하던 소셜 계정 (예: 카카오, 네이버, 구글 등)을 이용하여 다른 서비스에 로그인할 수 있도록 하는 기능입니다.   
  
✅ 1. 카카오 개발자 등록 및 앱 설정  
✅ 2. 프론트엔드 구현 (Vue 등)  
🔸 1) 카카오 로그인 URL 생성 및 리디렉션  
🔸 2) 콜백 페이지 처리  
🔸 3) 액세스 토큰 요청  
🔸 4) 사용자 정보 요청  
✅ 3. Firebase 연동 (Custom Token 방식)  
🔸 1) Cloud Function 예시 (kakaoLogin)  
✅ 4. Firebase Auth에 로그인  
✅ 5. Firestore 사용자 프로필 저장 (선택)  
    
### 36. 예약 포털 (Vue3 + Firebase) - 카카오 로그인 구현
  
카카오 인증 전체 흐름은 크게 클라이언트(프론트엔드)와 서버(백엔드/Firebase Functions)가 함께 협력하여 사용자를 카카오 → Firebase 인증 사용자로 연동하는 방식입니다.  
  
✅ 카카오 인증 전체 흐름 (Firebase 연동 기준)
1. 사용자 → 로그인 버튼 클릭  
&nbsp; 카카오 로그인 창으로 리디렉션됨  
2. 카카오 로그인 성공 → Redirect URI로 돌아옴  
&nbsp; code 파라미터가 포함되어 돌아옴  
3. 클라이언트 → code로 카카오 액세스 토큰 요청  
4. 클라이언트 → 액세스 토큰으로 카카오 사용자 정보 요청  
5. 클라이언트 → 서버로 accessToken 전송  
6. 서버 (Firebase Cloud Function)  
&nbsp; 카카오 사용자 ID로 Firebase UID 생성 (kakao:123456)  
&nbsp; 커스텀 토큰 발급  
7. 클라이언트 → Firebase 로그인  
&nbsp; Firebase 인증에 로그인 완료  
&nbsp; 이후 Firebase 서비스 사용 가능 (DB, Storage, 인증 상태 등)  
    
![카카오로 로그인](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FyJTpz%2FbtsOHeJzhOo%2FCPa0mqlOKROnvY3ddGoklk%2Fimg.png)
  

### 37. 예약 포털 (Vue3 + Firebase) - 네이버 로그인 구현
  
1. [사용자 요청] 네이버 로그인 버튼 클릭  
&nbsp; 네이버 로그인 URL을 만들어 브라우저 이동:  
2. [네이버] 로그인 후 리디렉션  
&nbsp; 성공 시 REDIRECT_URI로 리디렉션됩니다:  
3. [클라이언트 or 서버] Access Token 요청  
4. [access token] 사용자 정보 요청  
5. [Firebase Functions] → Custom Token 생성 (선택 사항)  
6. [클라이언트] Firebase 로그인  
  
### 38. Vue3 + Firebase 프로젝트 '우리 동네' - PWA 설정 추가

PWA(Progressive Web App)를 설정하는 과정은 웹 앱에 앱처럼 설치 가능한 기능과 오프라인 동작 기능을 추가하는 일입니다.  

![홈 화면에 설치](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbXOl9e%2FbtsOMeiii06%2FoMsLLN5V2jcwtjvNgRJdv1%2Fimg.png)
  
![홈 화면에 설치 후 바탕화면](https://blog.kakaocdn.net/dna/cveK4d/btsOLtmKWRM/AAAAAAAAAAAAAAAAAAAAANIon29J9pRMz6l6j_GLTmTf3pmkKwMLFTsq5YLtWrzY/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1750658399&allow_ip=&allow_referer=&signature=vXeZmUV89p7LiFk7LXjve%2F45Ty8%3D)
  
  
### 39. Vue3 + Firebase 프로젝트 '우리 동네' - 쿠폰 관리 시스템

주문 결제를 할 때 장바구니에서 사용할 수 있는 쿠폰의 목록을 보입니다.  
주문 총금액 10,000원당 1,000원 할인 쿠폰을 발행하는 것이니  
쿠폰의 목록에는 1,000원 할인 쿠폰 여러장이 보입니다.  
이들 쿠폰 중 한장 또는 여러장을 선택하여 할인된 금액으로 결제할 수 있습니다.  
  
결제를 하면 할인을 뺀 최종 결제 금액과 발급한 쿠폰의 수를 비교하여   
새로 쿠폰을 발급해야 한다면 1,000원 할인 쿠폰을 발급합니다.  
  
마이페이지에서 내 쿠폰을 조회할 수 있습니다.  
내 쿠폰에는 쿠폰이 발급된 날짜와 사용날짜 그리고 사용 가능 여부를 확인할 수 있습니다.  
  
![할인 쿠폰 사용](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FblQgge%2FbtsOWl8xuoC%2FAAAAAAAAAAAAAAAAAAAAAMIWrae9vnebG6IWSeseQkdu1NowKyUTI0Mppui3kbnu%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1751295599%26allow_ip%3D%26allow_referer%3D%26signature%3D5nWEC31ugberCLAJD6hMlye7TsU%253D)

![내 쿠폰 보기](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FpGzCr%2FbtsOWd34sya%2FAAAAAAAAAAAAAAAAAAAAACNshlCGFZh6gy5hR4yteLyzV6oYzgVhD_LLWqtba6oT%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1751295599%26allow_ip%3D%26allow_referer%3D%26signature%3DWLrH9cpdAsyLs9jsAEJTR1%252BrHUI%253D)
  
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
