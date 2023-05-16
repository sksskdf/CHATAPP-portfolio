import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import ChatPage from "./components/chatpage/ChatPage";
import theme from "./theme";

const nickname = localStorage.getItem("nickname");

if (!nickname)
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>,
    document.getElementById("root")
  );
else
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatPage />
    </ThemeProvider>,
    document.getElementById("root")
  );
