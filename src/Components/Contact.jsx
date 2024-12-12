import React, { useState, useRef } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./contact.css"; // Import the custom CSS file
import { ToastContainer, toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const btn = useRef(null); // Initialize reference to button

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if the button reference exists before modifying it
    if (btn.current) {
      btn.current.setAttribute("disabled", "true");
    }

    try {
      const response = await axios.post(
        "https://chatting-app1.onrender.com/contact",
        formData
      );
      setResponseMessage(response.data.message);
      if (response.data.status) {
        toast.success(response.data.message, { position: "top-center" });
      }
      setFormData({ name: "", email: "", message: "" }); // Clear form after submission
    } catch (error) {
      console.log("Error submitting form:", error);
      setResponseMessage("Something went wrong! Please try again later.");
    } finally {
      // Re-enable the button after submission
      if (btn.current) {
        btn.current.removeAttribute("disabled");
      }
    }
  };

  return (
    <div className="contact-page container py-5">
      {/* About Me Section */}
      <div className="about-me py-5 px-4 mb-5 rounded-lg shadow-lg">
        <h2 className="text-center mb-4">About Me</h2>
        <p className="lead text-center text-muted">
          Hi, I’m <strong>Shiv Raj Singh</strong>, a{" "}
          <strong>Full Stack Developer</strong> based in{" "}
          <strong>Bangalore</strong>. I love building apps that are both
          efficient and user-friendly. My skill set includes technologies like
          JavaScript, React, Node.js, and AWS.
        </p>
        <p className="text-center text-muted">
          Feel free to reach out if you'd like to collaborate or need help with
          a project. Let's create something amazing together!
        </p>
      </div>

      {/* Contact Form Section */}
      <div className="contact-form-section py-5 px-4 rounded-lg shadow-lg">
        <h2 className="text-center mb-4">Contact Me</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control shadow-sm"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control shadow-sm"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              className="form-control shadow-sm"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>
          <button
            ref={btn}
            type="submit"
            className="btn btn-primary btn-block shadow-sm"
          >
            Send Message
          </button>
        </form>
        {responseMessage && (
          <p className="response-message text-center mt-3 text-success">
            {responseMessage}
          </p>
        )}
      </div>

      {/* Footer Section */}
      <footer className="contact-footer py-4 mt-5">
        <div className="container text-center">
          <h2>Contact Details</h2>
          <div className="contact-info mb-3">
            <p>
              <FaPhone /> Phone:{" "}
              <a href="tel:+919627347143" className="text-white">
                9627347143
              </a>
            </p>
            <p>
              <FaEnvelope /> Email:{" "}
              <a href="mailto:mt932747@gmail.com" className="text-white">
                mt932747@gmail.com
              </a>
            </p>
            <p className="text-light">Bangalore, India</p>
          </div>
          <div className="social-links mb-3">
            <a
              href="https://www.facebook.com/people/Shiv-Raj-Singh/pfbid0piXUrwAAbe5Eu9i6RQKQSjNnqRTN69wg6gJ5Uep3z9igJ2SsJ7uhApDgwveCdSdfl/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.linkedin.com/in/shiv-raj-singh-6a7883224/?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 text-white"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://github.com/Shiv-Raj-Singh/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 text-white"
            >
              <FaGithub />
            </a>
          </div>
          <p className="portfolio-link">
            Check out my portfolio:{" "}
            <a
              href="https://my-portfolio-app1.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              MyPortfolio
            </a>
          </p>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default Contact;
