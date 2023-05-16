import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const CopyRight = () => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      style={{ position: "absolute", bottom: "2rem", left: "40%" }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Chat App
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default CopyRight;
