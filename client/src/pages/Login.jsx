import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Bug,
  FolderKanban,
  BarChart3,
  Users,
} from "lucide-react";

import API_BASE_URL from "../config/api";
import { useToast } from "../context/ToastContext";

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast(
        "Email and password are required",
        "error"
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message || "Login failed",
          "error"
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      showToast(
        "Login successful",
        "success"
      );

      navigate("/dashboard");
    } catch (error) {
      showToast(
        "Cannot connect to server",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-login-page">

      {/* BACKGROUND OVERLAY */}
      <div className="login-background-overlay" />

      {/* LEFT VISUAL CONTENT */}
      <section className="login-visual-side">

        <div className="login-visual-content">

          <div className="visual-badge">
            CENTRALIZED ISSUE MANAGEMENT
          </div>

          <h1>
            Track issues.
            <br />
            Build better software.
          </h1>

          <p>
            Manage projects, bugs, tasks,
            developers and progress from one
            centralized workspace.
          </p>

          <div className="floating-icons">

            <div className="floating-icon icon-one">
              <Bug size={26} />
            </div>

            <div className="floating-icon icon-two">
              <FolderKanban size={26} />
            </div>

            <div className="floating-icon icon-three">
              <BarChart3 size={26} />
            </div>

            <div className="floating-icon icon-four">
              <Users size={26} />
            </div>

          </div>

        </div>

        <div className="login-bottom-text">
          Centralized Issue & Bug Tracking System
        </div>

      </section>

      {/* LOGIN PANEL */}
      <section className="login-panel-wrapper">

        <div className="glass-login-card">

          {/* BRAND */}
          <div className="login-brand">

            <div className="login-brand-icon">
              <Bug size={30} />
            </div>

            <div>
              <h2>
                Bug<span>Flow</span>
              </h2>

              <p>
                Issue Tracking System
              </p>
            </div>

          </div>

          {/* TITLE */}
          <div className="login-heading">

            <h1>
              Welcome Back
            </h1>

            <p>
              Sign in to your account to
              continue
            </p>

          </div>

          {/* FORM */}
          <form
            className="premium-login-form"
            onSubmit={handleLogin}
          >

            {/* EMAIL */}
            <div className="premium-input-group">

              <Mail size={19} />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
              />

            </div>

            {/* PASSWORD */}
            <div className="premium-input-group">

              <LockKeyhole size={19} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
              />

              <button
                type="button"
                className="password-eye"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

            {/* FORGOT */}
            <div className="login-options">

              <button
                type="button"
                className="forgot-password-button"
                onClick={() =>
                  showToast(
                    "Password recovery can be added later",
                    "info"
                  )
                }
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN */}
            <button
              type="submit"
              className="premium-login-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Signing In..."
                  : "LOGIN"}
              </span>

              {!loading && (
                <ArrowRight size={20} />
              )}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="login-divider">

            <span />

            <p>or</p>

            <span />

          </div>

          {/* REGISTER */}
          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create account
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;