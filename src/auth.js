import axios from "axios";
export const verifyAuth = async ({ setIsAuthenticated }) => {
  const token = localStorage.getItem("token");
  console.log("Token: ", token);
  if (token) {
    try {
      const response = await axios.get(
        "https://chatting-app1.onrender.com/auth", // Example API endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );
      console.log("Response: ", response.status);
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error verifying auth:", error);
      setIsAuthenticated(false);
    }
  } else {
    setIsAuthenticated(false);
  }
};
