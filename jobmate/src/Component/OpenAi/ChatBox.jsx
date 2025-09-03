import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import useChat from "../../hooks/useChat";
import ResumeHelper from "./ResumeHelper";
import JobDescription from "./JobAnalyzer";

export default function ChatBox() {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  async function handleSend() {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
        {["chat", "resume", "job"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderBottom: activeTab === tab ? "3px solid #1976d2" : "none",
              background: "transparent",
              fontWeight: activeTab === tab ? "bold" : "normal",
              cursor: "pointer",
            }}
          >
            {tab === "chat"
              ? "Chat"
              : tab === "resume"
              ? "Resume Helper"
              : "Job Analyzer"}
          </button>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              style={{ height: "100%" }}
            >
              <div
                style={{
                  height: "390px",
                  overflowY: "auto",
                  border: "2px solid #eee",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                {messages
                  .filter((msg) => msg.role !== "system")
                  .map((msg, i) => (
                    <ChatMessage
                      key={i}
                      role={msg.role}
                      content={msg.content}
                    />
                  ))}
              </div>

              <div style={{ display: "flex", marginTop: "10px" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask career questions..."
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    marginLeft: "8px",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    background: "#1976d2",
                    color: "white",
                    border: "none",
                  }}
                >
                  Send
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "resume" && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <ResumeHelper />
            </motion.div>
          )}

          {activeTab === "job" && (
            <motion.div
              key="job"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <JobDescription />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
