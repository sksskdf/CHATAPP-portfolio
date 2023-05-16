import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    tertiary: {
      main: "#212722",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
