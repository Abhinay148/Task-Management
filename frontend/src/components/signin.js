import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../App.css';

const Signin = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');

  const login = async () => {
    const email = document.getElementById("useremail").value;
    const password = document.getElementById("userpassword").value;

    const response = await fetch(`http://localhost:5000/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    try {
      if (response.ok) {
        const result = await response.json();
        const authToken = result.token;
        localStorage.setItem("authToken", authToken);

        if (result.user.access === "admin") {
          navigate('/admin');
        } else if (result.user.access === "user") {
          navigate('/user/userId');
        }
      } else {
        setAlertMessage("Wrong credentials. Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="signup-container">
      <h3>Sign In</h3>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="email" id="useremail" name="email" placeholder='Email-Id' />
        </div>
        <div className="form-group">
          <input type="password" id="userpassword" name="password" placeholder='Password' />
        </div>
        <div className="align-right">
          <button type="submit" className="signup-button">Sign In</button>
        </div>
      </form>
      {alertMessage && <div className="alert">{alertMessage}</div>}
    </div>
  );
};

export default Signin;
