import { useState, useEffect } from "react";
import { Box, Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles/";
import MessageBox from "./MessageBox";
import MessageInput from "./MessageInput";
import theme from "../../theme";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState(() => {});

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

    const subscription = connection.then((rsocket) => {
      const endpoint = "api.v1.messages.stream";

      const user = {
        name: localStorage.getItem("nickname"),
        avatarImageLink: "https://randomuser.me/api/portraits/women/77.jpg",
      };

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

      return messageSubscription;
    });

    return () => {
      subscription.then((sub) => {
        sub.cancel();
      });
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box>
          <MessageBox messages={messages} />
          <MessageInput sendMessage={sendMessage} />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ChatPage;