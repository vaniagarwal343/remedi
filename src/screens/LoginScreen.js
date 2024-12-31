import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebaseConfig";
import '../styles/loginscreen.css'; // Import the updated CSS file

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
      navigate('/home');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <img src="../assets/logo.png" alt="REMEDII Logo" className="login-logo" />
      <h1 className="login-title">Welcome to REMEDII</h1>
      <p className="login-subtitle">Your personalized medication tracker</p>
      <div className="login-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
        <p className="login-footer">
          Don’t have an account?{' '}
          <span className="login-link" onClick={() => navigate('/register')}>
            Register Now
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
