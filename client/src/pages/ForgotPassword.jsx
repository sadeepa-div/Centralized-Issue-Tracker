import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

import API_BASE_URL from "../config/api";
import { useToast } from "../context/ToastContext";

function ForgotPassword() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      showToast("Please enter your email", "error");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Unable to send reset email", "error");

        return;
      }

      showToast(data.message, "success");
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
            <h1>Forgot Password?</h1>

            <p>Enter your email and we will send you a password reset link.</p>
          </div>

          <form className="premium-login-form" onSubmit={handleSubmit}>
            <div className="premium-input-group">
              <Mail size={19} />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="premium-login-button"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="login-register">
            <Link to="/login">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
