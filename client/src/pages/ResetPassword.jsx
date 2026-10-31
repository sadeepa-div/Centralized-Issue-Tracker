import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { LockKeyhole, Eye, EyeOff } from "lucide-react";

import API_BASE_URL from "../config/api";
import { useToast } from "../context/ToastContext";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const { showToast } = useToast();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      showToast("Password must contain at least 6 characters", "error");

      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password/${token}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Password reset failed", "error");

        return;
      }

      showToast("Password reset successful", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-login-page">
      <section className="login-panel-wrapper">
        <div className="glass-login-card">
          <div className="login-heading">
            <h1>Reset Password</h1>

            <p>Enter your new password below.</p>
          </div>

          <form className="premium-login-form" onSubmit={handleSubmit}>
            <div className="premium-input-group">
              <LockKeyhole size={19} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="button"
                className="password-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <div className="premium-input-group">
              <LockKeyhole size={19} />

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <button
              type="submit"
              className="premium-login-button"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="login-register">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResetPassword;
