import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://user-auth-management-backend.onrender.com/api/login",
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/users");
    } catch (err) {
      console.error("Login failed:", err);

      if (err.response && err.response.status === 403) {
        alert(err.response.data.message);
      } else {
        alert("Login failed: Invalid credentials");
      }
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <div className='lock-icon'>
          <i className='fas fa-lock'></i>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Email'
            className='input-field'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password'
            className='input-field'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type='submit'
            className='submit-button'>
            Log In
          </button>
        </form>
        <p>
          Not registered?
          <Link to='/register'> Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
