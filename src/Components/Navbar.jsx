import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // For navigation between pages

import { verifyAuth } from "../auth";

const NavbarComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const Navigate = useNavigate();
  console.log("Navbar ......");

  // Verify the token on component mount
  useEffect(() => {
    verifyAuth({ setIsAuthenticated });
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token"); // Optionally clear the token from localStorage
      Navigate("/");
      // reload the window
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <Navbar expand="lg" className="navbar-dark bg-dark">
      <Container>
        <Navbar.Brand href="#home">My App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/chat">
                  Chat
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
