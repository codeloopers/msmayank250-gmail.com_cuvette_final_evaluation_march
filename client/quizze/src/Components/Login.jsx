import React, { useState,useEffect } from "react";
import "../Components/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
   
  }, []);

  const validateForm = () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email format is invalid');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('https://msmayank250-gmail-com-cuvette-final.onrender.com/users/login', { email, password });

      if (response.data.status === 'Success') {
        const { token, userId } = response.data;

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId',userId);
        toast.success('Login successful!');
        history('/dashboard');
      } else if (response.data.status === 'Failed') {
        toast.error('Login failed. Please check your credentials.');
        history('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };


  

  return (
    <>
      <div className="container">
        <h1 className="title">QUIZZIE</h1>
        <div className="toggle-buttons">
          <Link to="/signup">
            <button className="toggle-button">Sign Up</button>
          </Link>
          <button className="toggle-button active">Log In</button>
        </div>
        <form className="form" onSubmit={submit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              className={emailError ? "error" : ""}
              required
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              className={passwordError ? "error" : ""}
              required
            />
            {passwordError && (
              <span className="error-message">{passwordError}</span>
            )}
          </div>
          <button type="submit" className="submit-button">
            Log In
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
