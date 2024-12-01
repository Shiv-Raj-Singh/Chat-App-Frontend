import { useEffect, useState } from "react";
import ChatRoom from "../Components/chat/Chat";
import { useNavigate } from "react-router-dom";
import { verifyAuth } from "../auth";

export default function ChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  console.log("Navbar ......");

  // Verify the token on component mount
  useEffect(() => {
    verifyAuth({ setIsAuthenticated });
  }, []);
  return isAuthenticated ? (
    <>
      <ChatRoom />
    </>
  ) : (
    navigate("/login")
  );
}
