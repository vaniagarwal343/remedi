import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebaseConfig";
import '../styles/loginscreen.css';
import Logo from '../assets/logo.png'; // Adjust path if needed


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
      <img src={Logo} alt="REMEDII Logo" className="login-logo" />
      <h1 className="login-title">welcome to remedii!</h1>
      <p className="login-subtitle">your personal medication manager</p>
      <div className="login-form">
        <input
          type="email"
          placeholder="enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">
          login
        </button>
        <p className="login-footer">
          don’t have an account?{' '}
          <span className="login-link" onClick={() => navigate('/register')}>
            register now
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
