import { useState } from "react";
import { Input, Button } from "@mui/material";

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState("");
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleClick = () => {
    sendMessage(message);
    setMessage("");
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        gap: "0.5rem",
        position: "absolute",
        bottom: "1rem",
        alignItems: "center",
      }}
    >
      <Input
        id="messageInput"
        placeholder="메시지를 입력하세요"
        onKeyUp={(e) => handleKeyPress(e)}
        onChange={handleMessage}
        value={message}
        color="tertiary"
        style={{
          width: "83%",
        }}
      />
      <Button id="messageButton" variant="contained" onClick={handleClick}>
        전송
      </Button>
    </div>
  );
};

export default MessageInput;
