import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  UserRoundCog,
  ArrowRight,
  Bug,
} from "lucide-react";

import API_BASE_URL from "../config/api";
import { useToast } from "../context/ToastContext";

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("Developer");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (
    event
  ) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      showToast(
        "Please complete all fields",
        "error"
      );

      return;
    }

    if (password.length < 6) {
      showToast(
        "Password must contain at least 6 characters",
        "error"
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        showToast(
          data.message ||
            "Registration failed",
          "error"
        );

        return;
      }

      showToast(
        "Account created successfully",
        "success"
      );

      setTimeout(() => {
        navigate("/login");
      }, 600);
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
    <div className="premium-register-page">

      <div className="register-background-overlay" />

      {/* LEFT SIDE */}
      <section className="register-visual-side">

        <div className="register-visual-content">

          <div className="visual-badge">
            START YOUR WORKSPACE
          </div>

          <h1>
            Join your team.
            <br />
            Track work better.
          </h1>

          <p>
            Create your BugFlow account and
            start managing issues, projects,
            assignments and progress from one
            centralized workspace.
          </p>

        </div>

        <div className="login-bottom-text">
          Centralized Issue & Bug Tracking System
        </div>

      </section>

      {/* REGISTER PANEL */}
      <section className="register-panel-wrapper">

        <div className="glass-register-card">

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

          {/* HEADING */}
          <div className="register-heading">

            <h1>
              Create Account
            </h1>

            <p>
              Join BugFlow and start managing
              your work
            </p>

          </div>

          {/* FORM */}
          <form
            className="premium-register-form"
            onSubmit={handleRegister}
          >

            {/* NAME */}
            <div className="premium-input-group">

              <User size={19} />

              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
              />

            </div>

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

            {/* ROLE */}
            <div className="premium-input-group">

              <UserRoundCog size={19} />

              <select
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value
                  )
                }
              >
                <option value="Developer">
                  Developer
                </option>

                <option value="Tester">
                  Tester
                </option>
              </select>

            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="premium-register-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Creating Account..."
                  : "CREATE ACCOUNT"}
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

          {/* LOGIN */}
          <div className="login-register">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;