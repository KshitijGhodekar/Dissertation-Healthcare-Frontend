import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import "./Login.scss";
import bgImage from './Healthcare.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const loginFormRef = useRef(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(credentials.email)) {
      alert("Please enter a valid email");
      return;
    }

    if (credentials.password === "doctor123") navigate("/doctor");
    else if (credentials.password === "admin123") navigate("/admin");
    else alert("Invalid credentials");
  };

  return (
    <div className="loginPage">
      <div className="background-image">
        <img src={bgImage} alt="Healthcare Background" />
      </div>

      <div className="login-container">
        <form 
          className="loginForm" 
          ref={loginFormRef}
          onSubmit={handleSubmit}
        >
          <div className="formHeader">
            <h1>Cross-Border Healthcare Portal</h1>
            <p>Secure and Interoperable Data Access</p>
          </div>

          <div className="inputGroup">
            <input
              type="email"
              value={credentials.email}
              placeholder=" "
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
            <label>Email</label>
            <span className="input-border" />
          </div>

          <div className="inputGroup">
            <input
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              placeholder=" "
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
            <label>Password</label>
            <span className="input-border" />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button 
            type="submit" 
            className="loginButton"
            disabled={!validateEmail(credentials.email) || !credentials.password}
          >
            <FiLogIn className="icon" />
            Login
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn google">
              <FaGoogle /> Google
            </button>
            <button type="button" className="social-btn microsoft">
              <FaMicrosoft /> Microsoft
            </button>
          </div>

          <a href="#forgot-password" className="forgot-password">
            Forgot password?
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;