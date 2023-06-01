# CHAT APP

<img width="1280" alt="스크린샷 2023-05-31 오후 4 59 04" src="https://github.com/sksskdf/CHATAPP-portfolio/assets/78300703/bb192b92-2c4b-44db-856c-761dc29d2cfb">
<img width="1280" alt="스크린샷 2023-05-31 오후 5 02 21" src="https://github.com/sksskdf/CHATAPP-portfolio/assets/78300703/f91b7a57-97a5-4d96-9126-966721492779">
<img width="896" alt="스크린샷 2023-05-31 오후 5 03 17" src="https://github.com/sksskdf/CHATAPP-portfolio/assets/78300703/50661cea-8e82-46e3-b6bf-58cb2d79b5ad">


## 사용한 기술 스택
Desktop App:
    Electron, React, MUI, TypeScript, JavaScript, rSocket

Server:
    Kotlin, SpringBoot, WebFlux, Coroutines, H2
        
------

## 기능, 구현 개요

### 클라이언트 사이드 기능
#### 메인페이지
입력폼을 통해 입력받은 닉네임이 비어있는지 검증한 뒤 브라우저 로컬저장소에 저장한 후 문제가 없다면 채팅페이지로 전환합니다.

    //검증 코드, 브라우저 로컬저장소에 저장한 후 채팅페이지로 전환
    const StartChatButton: React.FC = ({ nickname, showAlert }: any) => {
      const HrefChat = () => {
        if (nickname.length > 0) {
          localStorage.setItem("nickname", nickname);
          ReactDOM.render(<ChatPage />, document.getElementById("root"));
        } else {
          showAlert("flex");
        }
      };
      
    //

#### 채팅페이지
##### 메시지 출력
채팅페이지에 도달하면 React Hook API와 rSocket을 이용해 서버와 소켓연결을 시도합니다.
요청 스트림을 생성한뒤 서버에게 데이터를 요청하고 서버는 연속적인 응답 스트림을 반환합니다.
이후 구독 콜백을 등록한 뒤, 서버로부터 받은 데이터를 형식에 맞게 변환한 후 화면에 그립니다.

    //소켓 연결
    useEffect(() => {
    const client = new rsocketCore.RSocketClient({
      transport: new rsocketWebSocketClient(
        {
          url: "ws://localhost:8080/rsocket",
        },
        rsocketCore.BufferEncoders
      ),
      setup: {
        dataMimeType: "application/json",
        metadataMimeType: rsocketCore.MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
        keepAlive: 5000,
        lifetime: 60000,
      },
    });

    const connection = client.connect();
    
    //스트림 생성 후 스트림에 대한 구독콜백 등록
    const messageStream = rsocket.requestStream({
        metadata: rsocketCore.encodeAndAddWellKnownMetadata(
          Buffer.alloc(0),
          rsocketCore.MESSAGE_RSOCKET_ROUTING,
          Buffer.from(String.fromCharCode(endpoint.length) + endpoint)
        ),
      });

      const messageSubscription = messageStream.subscribe({
        onSubscribe: (s) => {
          s.request(1000);
        },
        onNext: (e) => {
          const message = JSON.parse(e.data);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              userName: message.user.name,
              content: message.content,
              sent: message.sent,
            },
          ]);
        },
      });

##### 메시지 전송
전송버튼과 엔터키 입력에 전송이벤트를 등록합니다.
이벤트가 트리거되면 입력폼을 통해 입력된  쿠키에 저장된 닉네임정보, 날짜를 JSON 형식으로 직렬화하여 RSocket 프로토콜의 메타데이터를 함께 서버로 전달합니다.

    const sendMessageHandler = (content) => {
        rsocket
          .requestChannel(
            new rsocketFlowable.Flowable((source) => {
              source.onSubscribe({
                cancel: () => {},
                request: (n) => {},
              });
              source.onNext({
                data: Buffer.from(
                  JSON.stringify({
                    content: content,
                    user: user,
                    sent: new Date().toISOString(),
                  })
                ),
                metadata: rsocketCore.encodeAndAddWellKnownMetadata(
                  Buffer.alloc(0),
                  rsocketCore.MESSAGE_RSOCKET_ROUTING,
                  Buffer.from(String.fromCharCode(endpoint.length) + endpoint)
                ),
              });
            })
          )
          .subscribe({
            onSubscribe: (s) => {
              s.request(1000);
            },
          });
      };

      setSendMessage(() => sendMessageHandler);
      
### 서버 사이드 기능
#### 컨트롤러
    @Controller
    @MessageMapping("api.v1.messages")
    class MessageResource(val messageService: MessageService) {

    @MessageMapping("stream")
    suspend fun receive(@Payload inboundMessages: Flow<MessageVM>) =
        messageService.post(inboundMessages)

    @MessageMapping("stream")
    fun send(): Flow<MessageVM> = messageService
        .stream()
        .onStart {
            emitAll(messageService.latest())
        }
    }
    
컨트롤러 클래스에는 메시지를 처리하기 위한 두 개의 메서드가 있습니다.
첫 번째 메서드인 receive는 MessageVM 객체의 Flow를 받아 메시지 서비스를 통해 DB에 저장합니다. 
onStart 함수는 클라이언트가 Flow를 수신하기 시작할 때 최근 메시지를 불러오게 합니다.
두 번째 메서드인 send는 메시지 서비스를 통해 가져온 MessageVM 객체의 Flow를 리턴합니다.

#### 서비스

    @Service
    class PersistentMessageService(val messageRepository: MessageRepository) : MessageService {

        val sender: MutableSharedFlow<MessageVM> = MutableSharedFlow()

        override fun latest(): Flow<MessageVM> =
            messageRepository.findLatest()
                .mapToViewModel()

        override fun after(messageId: String): Flow<MessageVM> =
            messageRepository.findLatest(messageId)
                .mapToViewModel()

        override fun stream(): Flow<MessageVM> = sender

        override suspend fun post(messages: Flow<MessageVM>) =
            messages
                .onEach { sender.emit(it.asRendered()) }
                .map { it.asDomainObject() }
                .let { messageRepository.saveAll(it) }
                .collect()
    }

서비스 클래스에는 네가지 메서드가 있습니다.
- latest(): 데이터 스트림에 구독한 경우, Flow는 데이터베이스에서 최근 메시지를 리턴합니다.
- after(messageId): 데이터 스트림에 구독한 경우, 지정된 메시지ID 이후에 보낸 메시지를 리턴합니다.
- stream(): 데이터 스트림에 구독한 경우, Flow는 데이터베이스에서 모든 메시지를 리턴합니다.
- post(messages): DB에 메시지를 저장합니다.

네가지 메서드는 모두 messageRepository를 통해 데이터베이스에 접근합니다.

#### 리파지토리
    interface MessageRepository : CoroutineCrudRepository<Message, String> {

        // language=SQL
        @Query("""
            SELECT * FROM (
                SELECT * FROM MESSAGES
                ORDER BY "SENT" DESC
                LIMIT 10
            ) ORDER BY "SENT"
        """)
        fun findLatest(): Flow<Message>

        // language=SQL
        @Query("""
            SELECT * FROM (
                SELECT * FROM MESSAGES
                WHERE SENT > (SELECT SENT FROM MESSAGES WHERE ID = :id)
                ORDER BY "SENT" DESC 
            ) ORDER BY "SENT"
        """)
        fun findLatest(@Param("id") id: String): Flow<Message>
    }

리파지토리 클래스에는 두 가지 메서드가 있습니다.

- findLatest(): 이 메서드는 최신 10개의 메시지를 반환합니다.
- findLatest(id): 이 메서드는 지정된 메시지 이후에 보낸 최신 10개의 메시지를 반환합니다.

두 메서드 모두 Query 애노테이션을 사용하여 SQL 쿼리를 지정합니다. Query 애노테이션은 Spring Data JPA가 SQL 쿼리를 실행하는 데 사용합니다.
Coroutine을 사용하여 비동기 방식으로 데이터를 저장하고 가져옵니다.

-------

## 프로젝트를 끝낸 뒤 소감
평상시 관심이 많던 코틀린을 활용해서 스프링부트 프로젝트를 해보고 싶었습니다.
스프링 홈페이지에서 코틀린을 활용한 튜토리얼을 찾다가 채팅서버를 만드는 튜토리얼이 있길래
튜토리얼을 다 따라하고 난 후, 일렉트론과 리액트를 추가적으로 도입하여 데스크톱 앱으로 만들어 보았습니다.

리액트를 사용해본 경험은 있지만 일렉트론은 거의 처음 사용해보았는데, 일렉트론 프로젝트안에 리액트를 추가할 때 특정 라이브러리도 사용해야하고 추가적으로 작업해야 할 환경셋팅들이 있었어서 조금 헤맸던 것 같습니다.
그리고 간단하게 타입스크립트를 간단히 적용해보았는데 익숙하지 않은 탓에 소켓 연결하는 부분에선 비교적 익숙한 JS로 작성하였습니다.
javaFX 이후론 데스크톱앱을 만들어 본 적이 없었는데 재미있는 경험이었다고 생각합니다.
소켓통신도 처음 활용해보았는데 신기하고 재미있었습니다.

코틀린은 JS에 비해 문법이 다양해서 러닝커브가 높다는 생각이 들었습니다.
하지만 자바에 비해 더욱 유연하고 효율적으로 코딩할 수 있다는 점에선 충분히 매력적이라고 생각했습니다.
앞으로 지속적으로 코틀린에 대해 학습해야겠다는 생각이 들었습니다.
webFlux도 다소 생소한 개념이었어서 그런지 조금 어렵게 느껴졌습니다.
기회가 된다면 webFlux 관련 문서들을 읽어보아야겠다는 생각을 했습니다.

다양한 스택들 활용해볼 수 있는 좋은 경험이었고 다음번엔 코틀린, 스프링부트, 일렉트론, 리액트를 활용하여 다른 데스크톱 애플리케이션도 만들어 볼 계획입니다.
