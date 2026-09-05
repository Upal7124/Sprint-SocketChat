import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const username = window.prompt("Enter your name:");

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const typingTimer = useRef(null);

  useEffect(() => {
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    socket.on("typing", (username) => {
      setTypingUser(username);
    });
    socket.on("stopTyping", (username) => {
      setTypingUser("");
    });
    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stopTyping");
      clearTimeout(typingTimer.current);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") {
      return;
    }

    socket.emit("message", {
      username: username,
      message: message,
    });

    setMessage("");
  };

  return (
    <div>
      <h1>Socket.IO Chat</h1>

      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);

          socket.emit("typing", username);

          clearTimeout(typingTimer.current);

          typingTimer.current = setTimeout(() => {
            socket.emit("stopTyping", username);
          }, 1000);
        }}
        placeholder="Type a message"
      />

      <button onClick={sendMessage}>Send</button>
      {typingUser && <p>{typingUser} is typing...</p>}

      <h2>Messages</h2>

      {messages.map((msg, index) => (
        <p key={index}>
          <strong>{msg.username}:</strong> {msg.message}
        </p>
      ))}
    </div>
  );
}

export default App;
