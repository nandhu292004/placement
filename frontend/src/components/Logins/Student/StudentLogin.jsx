import React, { useState } from 'react';
import './StudentLogin.css';

const StudentLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleToggle = () => {
    setIsSignUp((prev) => !prev);
    setFormData({ name: '', email: '', password: '' }); // Clear form on toggle
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp
      ? 'http://localhost:4000/api/auth/signup'
      : 'http://localhost:4000/api/auth/login';

    const payload = isSignUp
      ? { ...formData, role: 'student' } // Include role for sign-up
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert(isSignUp ? 'Sign up successful!' : 'Login successful!');
        console.log('Response Data:', data);
        // Store token in local storage for authenticated routes
        localStorage.setItem('token', data.token);
      } else {
        alert(data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server!');
    }
  };

  return (
    <div className="auth-container">
      <h1>{isSignUp ? 'Student Sign-Up' : 'Student Login'}</h1>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
      </form>
      <p onClick={handleToggle} style={{ cursor: 'pointer', color: 'blue' }}>
        {isSignUp ? 'Already have an account? Login' : 'New User? Sign Up'}
      </p>
    </div>
  );
};

export default StudentLogin;
