export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  const styles = {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: "12px",
    margin: "6px",
    alignSelf: isUser ? "flex-end" : "flex-start",
    background: isUser ? "#1976d2" : "#e0e0e0",
    color: isUser ? "#fff" : "#000",
  };

  return <div style={styles}>{content}</div>;
}