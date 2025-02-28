import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";
import { assets } from "../../../assets/assets";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to their respective dashboard
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      if (storedRole === "student") {
        navigate("/student");
      } else if (storedRole === "admin") {
        navigate("/admin");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        username,
        password,
      });

      const { message, role } = response.data;

      if (response.status === 200) {
        alert(message); // Show success message
        localStorage.setItem("username", username); // Store username
        localStorage.setItem("role", role); // Store role

        // Redirect based on role
        if (role === "student") {
          navigate("/student");
        } else if (role === "admin") {
          navigate("/admin");
        } else {
          alert("Unknown role");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid username or password.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="college-info">
            <img src={assets.nec_logo_header} alt="College Logo" className="college-logo" />
            <div className="college-text">
              <h1 className="college-name">National Engineering College</h1>
              <p className="college-address">K.R. Nagar, Kovilpatti - 628 503</p>
            </div>
          </div>
          <div className="other-info">
            <div className="tnea-code">
              <p>TNEA Counselling Code</p>
              <h2>4962</h2>
            </div>
            <img src={assets.nec_person} alt="Principal or Representative" className="person-image" />
          </div>
        </div>
      </header>
      <div className="center">
        <img src={assets.nec_banner} className="banner"/>
        <div className="container">
          <h2>Login</h2>
          <img src={assets.nec_logo_header} alt="Logo" style={{ width: "80px", marginBottom: "10px" }} />
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" required />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            </label>
            <br />
            <button type="submit" style={{ backgroundColor: "green", color: "white" }}>
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
