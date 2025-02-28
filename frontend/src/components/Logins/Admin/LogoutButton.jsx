import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <button className="logout" onClick={handleLogout} style={{ backgroundColor: "red", color: "white", padding: "10px", borderRadius: "5px" }}>
      Logout
    </button>
  );
};

export default LogoutButton;
