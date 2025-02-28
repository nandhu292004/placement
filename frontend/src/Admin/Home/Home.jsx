import React from 'react';
import './Home.css';
import { NavLink } from "react-router-dom";
import AdminRegisteredStudents from '../AdminRegisterStudents/AdminRegisterStudents';
import LogoutButton from '../../components/Logins/Admin/LogoutButton';

const Home = () => {
    return (
      <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <h1 className="navbar-logo">Placement Portal</h1>
        <ul className="nav-links">
          <li>
            <NavLink exact to="/admin" activeClassName="active-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-recruiters" activeClassName="active-link">
              Recruiters
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-upcoming-drives" activeClassName="active-link">
              Upcoming Drives
            </NavLink>
          </li>
          <li>
          <NavLink to="/admin-registered-students" activeClassName="active-link">
              Registered Students
            </NavLink>
          </li>
        </ul>
        <LogoutButton/>
      </div>
    </nav>
      );
}

export default Home;