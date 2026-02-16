import React, { useState } from 'react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import './SignIn.css';
import logo from './images/logo.png';
import { auth, googleProvider, signInWithEmailAndPassword, signInWithPopup } from './firebase';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to Home upon successful login
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Redirect to Home upon successful login
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header>
        <h1 className="logo-header">LEGAL RESEARCH ASSISTANT</h1>
        <div className="header-buttons">
          <button onClick={() => setShowContactForm(true)}>Contact Us</button>
          <button>Sign Up</button>
        </div>
      </header>

      <main>
        <div className="logo">
          <div className="logo-circle">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
        </div>

        <p className="subtitle">JUSTICE SIMPLIFIED</p>

        <div className="sign-in-form">
          <h2>Sign In</h2>
          {error && <p className="error">{error}</p>} {/* Show error messages */}

          <form onSubmit={handleEmailSignIn}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button type="submit" className="sign-in-button">Sign In</button>
          </form>

          <div className="social-sign-in">
            <p>Sign in with</p>
            <div className="social-buttons">
              <button className="social-button google" onClick={handleGoogleSignIn}>
                <FaGoogle className="icon" />
                <span>Google</span>
              </button>
              <button className="social-button microsoft">
                <FaMicrosoft className="icon" />
                <span>Microsoft</span>
              </button>
            </div>
          </div>

          <button onClick={() => {/* Handle the forgot password action here */}} className="forgot-password">
            Forgot password?
          </button>
        </div>
      </main>

      <footer>
        <p>🔒 Secure & Confidential</p>
        <p>© 2024 Legal Research Assistant. All rights reserved.</p>
      </footer>

      {showContactForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Contact Us</h2>
              <button onClick={() => setShowContactForm(false)}>×</button>
            </div>
            <div className="modal-body">
              <iframe
                src="https://forms.gle/iHUy593GKuAa98K78"
                width="100%"
                height="500"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                title="Contact Form"
              >
                Loading form...
              </iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
