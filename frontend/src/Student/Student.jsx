import React from 'react'
import './Student.css';
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import LogoutButton from '../components/Logins/Admin/LogoutButton';

const Student = () => {
  return (
    <nav className="navbar">
      <img src={assets.nec_logo_header} alt="College Logo" className="college-logo" />
      <div className="college-text">
        <h1 className="college-name">National Engineering College</h1>
          <p className="college-address">K.R. Nagar, Kovilpatti - 628 503</p>
      </div>
    <ul className="nav-links">
      <li><Link to="/student">Home</Link></li>
      <li><Link to="/recruiters">Recruiters</Link></li>
      <li><Link to="/student-upcoming-drives">Upcoming Drive</Link></li>
      <li><Link to="/status">Status</Link></li>
    </ul>
    <li className="icons">
      <span>🔔</span> {/* Notification Icon */}
      <Link to="/student-profile">
      <span title="Profile">👤</span> {/* Profile Icon */}
      </Link>
    </li>
    <li>
    <LogoutButton/>
    </li>
  </nav>
  )
}

export default Student;
