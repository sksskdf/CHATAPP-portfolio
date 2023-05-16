import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import ChatPage from "../chatpage/ChatPage";

const StartChatButton: React.FC = ({ nickname, showAlert }: any) => {
  const HrefChat = () => {
    if (nickname.length > 0) {
      localStorage.setItem("nickname", nickname);
      ReactDOM.render(<ChatPage />, document.getElementById("root"));
    } else {
      showAlert("flex");
    }
  };

  return (
    <Button
      variant="contained"
      style={{
        display: "block",
        marginTop: "2rem",
        width: "14rem",
        height: "4rem",
        fontWeight: "bold",
      }}
      onClick={HrefChat}
    >
      채팅 시작하기
    </Button>
  );
};

export default StartChatButton;
