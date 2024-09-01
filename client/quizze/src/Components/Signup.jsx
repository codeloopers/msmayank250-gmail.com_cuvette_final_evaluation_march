import React, { useState } from 'react';
import '../Components/Signup.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!name) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
        const res = await axios.post('http://localhost:5001/users/signup', { email, name, password });
  
    
        if (res.data.status === 'Success') {
            toast.success('Success');
            setTimeout(() => {
                navigate('/');
            }, 100); 
        } else {
                toast.error('Sign up failed. Please try again.');
                navigate('/signup');  
                toast.error('failed');
        }
    } catch (e) {
       
        if (e.response) {
          
            if (e.response.data && e.response.data.message) {
                toast.error(e.response.data.message); 
            } else {
                toast.error('An unexpected error occurred.');
            }
        } else if (e.request) {
           
            toast.error('No response from the server. Please try again later.');
        } else {
           
            toast.error('An unexpected error occurred.');
        }
        console.log(e);  
    }
    
    }
    
      

  return (
    <>
    
      <div className="container">
        <h1 className="title">QUIZZIE</h1>
        <div className="toggle-buttons">
          <button className="toggle-button active">Sign Up</button>
          <Link to="/">
            <button className="toggle-button">Log In</button>
          </Link>
        </div>
        <form className="form" onSubmit={submit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="cnfpassword">Confirm Password</label>
            <input
              type="password"
              id="cnfpassword"
              name="cnfpassword"
              required
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>
          <button type="submit" className="submit-button">
            Sign-Up
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
