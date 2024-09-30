import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register", {
        name,
        email,
        password,
      });
      alert("User registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <div className='lock-icon'>
          <i className='fas fa-user-plus'></i>{" "}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Name'
            className='input-field'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete='off'
          />
          <input
            type='email'
            placeholder='Email'
            className='input-field'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete='off'
          />
          <input
            type='password'
            placeholder='Password'
            className='input-field'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete='off'
          />
          <button
            type='submit'
            className='submit-button'>
            Register
          </button>
        </form>
        <p>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
