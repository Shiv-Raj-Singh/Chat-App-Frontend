import React, { useRef, useState } from "react";
import "./loginSignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const dummyUser = {
  name: "",
  phone: "",
  email: "",
  gender: "",
  password: "",
  cPassword: "",
};
const errors = {
  name: "",
  phone: null,
  email: null,
  gender: null,
  password: null,
  cPassword: null,
};

const Register = () => {
  const [user, setUser] = useState(dummyUser);
  const [error, setError] = useState(errors);

  const btn = useRef();
  const Navigate = useNavigate();

  const clickHandler = () => {
    Navigate("/");
  };

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
        // "https://chatting-app1.onrender.com/register"
        "https://chatting-app1.onrender.com/register",
        user
      );
      const data = await response.data;
      const userData = data.data;
      localStorage.data = JSON.stringify(userData);
      localStorage.token = userData.token;

      if (data.status) clickHandler();
      // Reload the page after setting the data
      window.location.reload();
      toast.success("Submitted Successfully!", {
        theme: "light",
        position: "top-center",
      });
      btn.current.removeAttribute("disabled");
      setUser(dummyUser);
    } catch (err) {
      const errMsg = err.response?.data.message.toLowerCase();
      const obj = { ...errors };
      for (let key in error) {
        if (errMsg?.match(key)) {
          obj[key] = errMsg;
        }
      }
      setError(obj);
      btn.current.removeAttribute("disabled");
    }
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f7f8fc" }}
      >
        <div
          className="card shadow p-4"
          style={{
            width: "400px",
            borderRadius: "15px",
            backgroundColor: "white",
          }}
        >
          <h3 className="text-center mb-4">Register Your Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                value={user.name}
                className="form-control"
                required
                placeholder="Enter Your Name"
                name="name"
                onChange={handleOnChange}
              />
              {error.name && (
                <span className="text-danger small">{error.name}</span>
              )}
            </div>
            <div className="mb-3">
              <input
                type="tel"
                value={user.phone}
                className="form-control"
                required
                placeholder="Enter Your Phone"
                name="phone"
                onChange={handleOnChange}
              />
              {error.phone && (
                <span className="text-danger small">{error.phone}</span>
              )}
            </div>
            <div className="mb-3">
              <input
                type="email"
                value={user.email}
                className="form-control"
                required
                placeholder="Enter Your Email"
                name="email"
                onChange={handleOnChange}
              />
              {error.email && (
                <span className="text-danger small">{error.email}</span>
              )}
            </div>
            <div className="mb-3">
              <select
                value={user.gender}
                className="form-select"
                required
                name="gender"
                onChange={handleOnChange}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {error.gender && (
                <span className="text-danger small">{error.gender}</span>
              )}
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={user.password}
                className="form-control"
                required
                placeholder="Enter Your Password"
                name="password"
                onChange={handleOnChange}
              />
              {error.password && (
                <span className="text-danger small">{error.password}</span>
              )}
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={user.cPassword}
                className="form-control"
                required
                placeholder="Confirm Your Password"
                name="cPassword"
                onChange={handleOnChange}
              />
              {error.cPassword && (
                <span className="text-danger small">{error.cPassword}</span>
              )}
            </div>
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                required
                id="terms"
              />
              <label className="form-check-label" htmlFor="terms">
                Agree to terms and conditions
              </label>
            </div>
            <button type="submit" ref={btn} className="btn btn-primary w-100">
              Submit
            </button>
            <p className="text-center mt-3">
              Already have an account?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={clickHandler}
              >
                Login Here
              </span>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
