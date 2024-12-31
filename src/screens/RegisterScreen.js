import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebaseConfig";
import '../styles/RegisterScreen.css'; // Import the updated CSS file
import Logo from '../assets/logo.png'; // Adjust the path if needed

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Account created successfully!');
      navigate('/home');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="register-container">
      <img src={Logo} alt="REMEDII Logo" className="register-logo" />
      <h1 className="register-title">register</h1>
      <p className="register-subtitle">create your account to get started</p>
      <div className="register-form">
        <input
          type="email"
          placeholder="enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="register-input"
        />
        <button onClick={handleRegister} className="register-button">
          register
        </button>
        <p className="register-footer">
          already have an account?{' '}
          <span className="register-link" onClick={() => navigate('/login')}>
            login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
