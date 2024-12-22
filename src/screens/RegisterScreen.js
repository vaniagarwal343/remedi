import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebaseConfig";

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
      navigate('/');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Register</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleRegister} style={styles.button}>
        Register
      </button>
    </div>
  );
};

const styles = {
  container: { padding: 20, maxWidth: 400, margin: 'auto', textAlign: 'center' },
  title: { marginBottom: 20 },
  input: { width: '100%', padding: 10, margin: '10px 0', borderRadius: 5, border: '1px solid #ccc' },
  button: { padding: 10, backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: 5 },
};

export default RegisterScreen;