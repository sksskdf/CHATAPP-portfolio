# CHAT APP

<img width="1280" alt="스크린샷 2023-05-31 오후 4 59 04" src="https://github.com/sksskdf/CHATAPP-portfolio/assets/78300703/bb192b92-2c4b-44db-856c-761dc29d2cfb">
<img width="1280" alt="스크린샷 2023-05-31 오후 5 02 21" src="https://github.com/sksskdf/CHATAPP-portfolio/assets/78300703/f91b7a57-97a5-4d96-9126-966721492779">
<img width="896" alt="스크린샷 2023-05-31 오후 5 03 17" src="https://github.com/sksskdf/CHATAPP-portfolio/assets/78300703/50661cea-8e82-46e3-b6bf-58cb2d79b5ad">


# 사용한 기술 스택
    Desktop App:
        Electron, React, MUI, TypeScript, JavaScript, rSocket

    Server:
        Kotlin, SpringBoot, WebFlux, Coroutines, H2
        
------

# 기능, 구현 개요

### 클라이언트 사이드 기능
    메인페이지:
        입력폼을 통해 입력받은 닉네임이 비어있는지 검증한 뒤 브라우저 쿠키에 저장한 후 문제가 없다면 채팅페이지로 전환합니다.
        
    채팅페이지:
        메시지 출력:
            채팅페이지에 도달하면 React Hook API와 rSocket을 이용해 서버와 소켓연결을 시도합니다.
            요청 스트림을 생성한뒤 서버에게 데이터를 요청하고 서버는 연속적인 응답 스트림을 반환합니다.
            이후 구독 콜백을 등록한 뒤, 서버로부터 받은 데이터를 형식에 맞게 변환한 후 화면에 그립니다.
            
        메시지 전송:
            입력폼을 통해 입력받은 대화내용을 전송버튼 혹은 엔터키 입력에 전송이벤트를 등록합니다.
            이벤트가 트리거되면 메시지 데이터와 쿠키에 저장된 닉네임정보, 날짜를 JSON 형식으로 직렬화하여 RSocket 프로토콜의 메타데이터를 함께 서버로 전달합니다.
            
-------
