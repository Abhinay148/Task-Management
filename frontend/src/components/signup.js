import React, { useState } from 'react';
import './../App.css';

const Signup = () => {
  const [alertMessage, setAlertMessage] = useState('');

  const signup = async () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`http://localhost:5000/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: username, email, password })
    });

    if (response.ok) {
      const authToken = await response.json();
      localStorage.setItem("authToken", authToken);
      console.log(authToken);
      setAlertMessage("Signup Success: Please SignIn to continue");
      // Redirect to the login page or perform any other necessary action here.
      window.location.reload();
    } else if (response.status === 409) { // Check for a 409 Conflict status code for email already existing
      setAlertMessage("Email already exists. Please use a different email.");
    } else if (response.status === 400) { // Check for a 400 Bad Request status code for invalid email
      setAlertMessage("Invalid email format. Please enter a valid email.");
    } else {
      setAlertMessage("Signup failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup();
  };

  return (
    <div className="signup-container">
      <h3>Sign Up</h3>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" id="username" name="username" placeholder='Username' />
        </div>
        <div className="form-group">
          <input type="email" id="email" name="email" placeholder='Email-Id' />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" placeholder='Password' />
        </div>
        <div className="align-right">
          <button type="submit" className="signup-button">Sign Up</button>
        </div>
      </form>
      {alertMessage && <div className="alert">{alertMessage}</div>}
    </div>
  );
};

export default Signup;
