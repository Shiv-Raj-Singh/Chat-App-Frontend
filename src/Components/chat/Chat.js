import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ChatRoom.css";

const ChatRoom = () => {
  const navigate = useNavigate();
  const msgBoxRef = useRef();
  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [usersListVisible, setUsersListVisible] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const socketInstance = io("https://chatting-app1.onrender.com");
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      socketInstance.emit("joinDirectChat", { username: data.name });
    });

    // Listening for the updated list of users
    socketInstance.on("usersList", (users) => {
      console.log("List of users: ", users); // This should log the updated users list
      setUsers(users); // Update users state
    });

    socketInstance.on("getLatestMessage", (newMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      msgBoxRef.current?.scrollIntoView({ behavior: "smooth" });
      setMsg("");
      setLoading(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [data.name]);

  // Set user data on initial load
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("data") || "{}");
    if (userData) {
      setData(userData);
      setUsers([userData?.name]);
    } else {
      toast.error("No user data found!");
    }
  }, []);

  // Send message
  const sendMessage = () => {
    if (msg.trim()) {
      setLoading(true);
      const newMessage = { time: new Date(), msg, name: data.name };
      socket.emit("newDirectMessage", newMessage);
    }
  };

  const handleInputChange = (e) => setMsg(e.target.value);
  const handleKeyPress = (e) => e.key === "Enter" && sendMessage();

  const toggleUsersList = () => setUsersListVisible(!usersListVisible);

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h1>Chat Room</h1>
        <button className="users-btn" onClick={toggleUsersList}>
          Users ({users.length})
        </button>
        <button className="close-btn" onClick={() => navigate("/")}>
          End Chat
        </button>
      </div>

      {/* Users List */}
      {usersListVisible && (
        <div className="users-list">
          <h3>Users Online:</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Messages Area */}
      <div className="messages-container">
        <div className="messages-box">
          {allMessages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                data.name === message.name ? "sent" : "received"
              }`}
            >
              <div className="message-header">
                <strong>{message.name}</strong>
                <small>{new Date(message.time).toLocaleTimeString()}</small>
              </div>
              <p className="message-text">{message.msg}</p>
            </div>
          ))}
          <div ref={msgBoxRef}></div>
        </div>
      </div>

      {/* Input Area */}
      <div className="message-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={msg}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? <div className="spinner" /> : "Send"}
        </button>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default ChatRoom;
