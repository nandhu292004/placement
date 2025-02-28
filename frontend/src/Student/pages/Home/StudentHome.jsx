import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentHome.css"; // Ensure this file exists
import Student from "../../Student";
import { FaUserCircle } from "react-icons/fa"; // Profile icon

const StudentHome = () => {
  return (
    <>
      <Student />

      <div className="home">
        {/* Banner Section with Overlay */}
        <div className="banner-container">
          <img
            src="https://img.jagranjosh.com/images/2023/January/312023/National-Engineering-College-NEC-Kovilpatti-Campus-View-1.jpg"
            alt="College"
            className="banner"
          />
          <div className="overlay">
            <h1>Welcome to Our Institution</h1>
            <p>Empowering minds, shaping futures.</p>
          </div>
        </div>

        {/* Vision & Mission Section */}
        <div className="sections">
          <div className="grid-container">
            <div className="vision">
              <h2>🌟 Vision</h2>
              <p>Transforming lives through quality education and research with human values.</p>
            </div>
            <div className="mission">
              <h2>🎯 Mission</h2>
              <ul>
                <li>Maintain excellent infrastructure and faculty.</li>
                <li>Provide a conducive environment for creativity and team spirit.</li>
                <li>Promote ethical behavior and commitment to society.</li>
                <li>Collaborate with academia, industry, and government.</li>
              </ul>
            </div>
          </div>

          {/* Placement Statistics Section */}
          <div className="placement-statistics">
            <h2>📊 Placement Statistics</h2>
            <img
              src="https://nec.edu.in/wp-content/uploads/2024/11/infographic_new.png"
              alt="Placement Statistics"
              className="placement-img"
            />
          </div>
        </div>

        {/* Footer with Principal's Contact Details */}
        <footer className="footer">
          <h2>📌Contact Us</h2>
          <p>
            <strong>The Principal,</strong> <br />
            National Engineering College (Autonomous) <br />
            K.R. Nagar, Kovilpatti, Thoothukudi (Dt) - 628503 <br />
            Ph: 04632 – 222 502 | Fax: 232749 <br />
            Mobile: 93859 76674, 93859 76684 <br />
            Email: <a href="mailto:principal@nec.edu.in">principal@nec.edu.in</a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default StudentHome;
