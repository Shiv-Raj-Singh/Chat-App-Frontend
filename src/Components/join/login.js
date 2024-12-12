import React, { useState, useRef } from "react";
import "./loginSignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const dummyUser = { phone: "", password: "", room: "" };
const errors = { phone: "", password: "", room: "" };

const Login = () => {
  const Navigate = useNavigate();
  const [error, setError] = useState(errors);
  const btn = useRef();
  const [user, setUser] = useState(dummyUser);

  const handleOnChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    btn.current.setAttribute("disabled", "true");
    e.preventDefault();
    try {
      const response = await axios.post(
        // 'https://chatting-app1.onrender.com/login',
        "https://chatting-app1.onrender.com/login",
        user
      );
      const data = await response.data;
      data.status && toast.success(data.message, { position: "top-center" });
      const userData = data.data;
      localStorage.data = JSON.stringify(userData);
      localStorage.token = userData.token;
      // Reload the page after setting the data
      Navigate("/");
      window.location.reload();
      //   data.status && clickHandler(data.data);
      btn.current.removeAttribute("disabled");
    } catch (err) {
      const errMsg = err.response.data.message.toLowerCase();
      const obj = { ...errors };
      let errFind = false;
      for (let key in error) {
        if (errMsg.match(key)) {
          errFind = true;
          obj[key] = errMsg;
        }
      }
      !errFind && toast.error(errMsg, { theme: "dark", position: "top-right" });
      setError(obj);
      btn.current.removeAttribute("disabled");
    }
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <h1 className="loginTitle">Login to Your Account</h1>
        <form onSubmit={handleSubmit} className="loginForm">
          <div className="inputGroup">
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleOnChange}
              className="inputField"
              placeholder="Enter Your Phone"
              required
            />
            {error.phone && <span className="errorMessage">{error.phone}</span>}
          </div>

          <div className="inputGroup">
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleOnChange}
              className="inputField"
              placeholder="Enter Your Password"
              required
            />
            {error.password && (
              <span className="errorMessage">{error.password}</span>
            )}
          </div>

          <div className="checkWrapper">
            <input type="checkbox" required className="checkBox" />
            <label className="checkLabel">Remember me</label>
          </div>

          <div className="actionLinks">
            <p onClick={() => Navigate("/")} className="linkText">
              Don't have an account? Register Here
            </p>
            <p
              onClick={() => Navigate("/forget-password")}
              className="linkText forgetPassword"
            >
              Forgot Password?
            </p>
          </div>

          <button type="submit" className="submitButton" ref={btn}>
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
