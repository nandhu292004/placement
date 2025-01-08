import React, { useState } from 'react';
import './adminLogin.css'; // Ensure this file contains your CSS
import { assets } from '../../../assets/assets';
import Header from '../../HomePage/HomePage';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false); // Toggle state for Login/Register form

  const toggleForm = () => {
    setIsRegister((prevState) => !prevState);
  };

  return (
    <>
      <div className="header">
        <img src={assets.header} alt="Header" />
      </div>
      <div
        className="home-page"
        style={{ backgroundImage: `url(${assets.nec_clg})` }}
      >
        <div className="container">
          <h2>{isRegister ? 'Register' : 'Login'}</h2>
          <img
            src={assets.nec_logo}
            alt="Logo"
            style={{ width: '80px', marginBottom: '10px' }}
          />
          {isRegister ? (
            // Register Form
            <form>
              <label>
                Category:
                <select>
                  <option>Staff</option>
                  <option>Student</option>
                </select>
              </label>
              <br />
              <label>
                Full Name:
                <input type="text" />
              </label>
              <br />
              <label>
                Email:
                <input type="email" />
              </label>
              <br />
              <label>
                Password:
                <input type="password" />
              </label>
              <br />
              <label>
                Confirm Password:
                <input type="password" />
              </label>
              <br />
              <button
                type="submit"
                style={{ backgroundColor: 'green', color: 'white' }}
              >
                Register
              </button>
            </form>
          ) : (
            // Login Form
            <form>
              <label>
                Category:
                <select>
                  <option>Staff</option>
                  <option>Student</option>
                </select>
              </label>
              <br />
              <label>
                Username/Email:
                <input type="email" />
              </label>
              <br />
              <label>
                Password:
                <input type="password" />
              </label>
              <br />
              <button
                type="submit"
                style={{ backgroundColor: 'green', color: 'white' }}
              >
                Login
              </button>
            </form>
          )}
          <p>
            {isRegister ? (
              <>
                Already a user?{' '}
                <button
                  type="button"
                  onClick={toggleForm}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                New user?{' '}
                <button
                  type="button"
                  onClick={toggleForm}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Register
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
