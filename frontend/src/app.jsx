import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const username = window.prompt("Enter your name:");

const socket = io("https://sprint-09-10.onrender.com");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [room, setRoom] = useState("general");
  const typingTimer = useRef(null);

  useEffect(() => {
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("typing", (data) => {
      setTypingUser(data.username);
    });

    socket.on("stopTyping", () => {
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
      room: room,
    });

    setMessage("");
  };

  return (
    <div>
      <h1>Socket.IO Chat</h1>
      <div>
        <label>Select Room: </label>

        <select
          value={room}
          onChange={(e) => {
            const selectedRoom = e.target.value;

            setRoom(selectedRoom);
            setMessages([]);

            socket.emit("joinRoom", selectedRoom);
          }}
        >
          <option value="general">General</option>
          <option value="tech">Tech</option>
        </select>
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);

          socket.emit("typing", {
            username: username,
            room: room,
          });

          clearTimeout(typingTimer.current);

          typingTimer.current = setTimeout(() => {
            socket.emit("stopTyping", {
              username: username,
              room: room,
            });
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
