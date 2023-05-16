import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CopyRight from "./components/mainpage/CopyRight";
import StartChatButton from "./components/mainpage/StartChatButton";
import NickNameField from "./components/mainpage/NickNameField";
import { Alert } from "@mui/material";

export default function App() {
  const [alert, setAlert] = useState("none");
  const [nickname, setNickname] = useState("");

  const showAlert = (val) => {
    setAlert(val);
  };

  return (
    <Container maxWidth="sm" align="center">
      <Box sx={{ my: 4 }} style={{ marginTop: "12rem" }}>
        <Alert severity="error" style={{ display: alert }}>
          닉네임을 입력해주세요!
        </Alert>
        <Typography variant="h4" component="h1" gutterBottom>
          챗앱에 오신 것을 환영합니다 !
        </Typography>
        <NickNameField
          nickname={nickname}
          setNickname={setNickname}
          showAlert={showAlert}
        />
        <StartChatButton showAlert={showAlert} nickname={nickname} />
        <CopyRight />
      </Box>
    </Container>
  );
}
