import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase auth method
import { auth } from "../firebaseConfig";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Login function
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
      navigate('/home'); // Redirect to the home screen
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
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
      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>
      <p>
        Don’t have an account?{' '}
        <span
          style={styles.link}
          onClick={() => navigate('/register')} // Navigate to registration
        >
          Register Now
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: { padding: 20, maxWidth: 400, margin: 'auto', textAlign: 'center' },
  title: { marginBottom: 20 },
  input: { width: '100%', padding: 10, margin: '10px 0', borderRadius: 5, border: '1px solid #ccc' },
  button: { padding: 10, backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: 5 },
  link: { color: '#003366', cursor: 'pointer' },
};

export default LoginScreen;