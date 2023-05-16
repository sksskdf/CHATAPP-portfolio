import TextField from "@mui/material/TextField";
import ChatPage from "../chatpage/ChatPage";
import ReactDOM from "react-dom";

const NickNameField: React.FC = ({ nickname, setNickname, showAlert }: any) => {
  const enter = (event: any) => {
    if (event.code === "Enter") {
      if (nickname.length > 0) {
        localStorage.setItem("nickname", nickname);
        ReactDOM.render(<ChatPage />, document.getElementById("root"));
      } else {
        showAlert("flex");
      }
    }
  };

  return (
    <TextField
      id="outlined-basic"
      label="닉네임"
      variant="outlined"
      style={{ marginTop: "3rem", width: "20rem" }}
      onChange={(e) => setNickname(e.target.value)}
      onKeyUp={(e) => enter(e)}
    />
  );
};

export default NickNameField;
