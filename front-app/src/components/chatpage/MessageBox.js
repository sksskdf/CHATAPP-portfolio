import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const MessageBox = ({ messages }) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <ul>
        {messages.map((msg, idx) => (
          <li
            key={idx}
            style={{ display: "flex", gap: "1rem", alignContent: "center" }}
          >
            <AccountCircleIcon
              style={{ width: "2.5rem", height: "2.5rem", alignSelf: "center" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.9rem" }}>{msg.userName}</span>
              <span
                style={{
                  marginLeft: "0.2rem",
                  backgroundColor: "black",
                  color: "white",
                  padding: "0.3rem",
                  borderRadius: "0.3rem",
                  fontSize: "0.93rem",
                  textAlign: "center",
                }}
              >
                {msg.content}
              </span>
            </div>
            <span
              style={{
                alignSelf: "flex-end",
                fontSize: "0.75rem",
                color: "gray",
              }}
            >
              {new Date(msg.sent).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageBox;
