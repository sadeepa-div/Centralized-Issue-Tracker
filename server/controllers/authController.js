const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/User");

// ======================================
// REGISTER
// ======================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ["Developer", "Tester"];

    const safeRole = allowedRoles.includes(role) ? role : "Developer";

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: safeRole,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================
// LOGIN
// ======================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================
// CURRENT USER
// ======================================
const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// ======================================
// FORGOT PASSWORD
// ======================================
const forgotPassword = async (req, res) => {
  let user;
  let hashedToken;

  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, "");

    if (!emailUser || !emailPass || emailPass.length !== 16) {
      return res.status(503).json({
        message:
          "Password reset email is not configured. Set EMAIL_USER and a valid 16-character Gmail App Password in the server environment.",
      });
    }

    user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    // Don't reveal whether an account exists
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });

    try {
      await transporter.sendMail({
        from: `"BugFlow" <${emailUser}>`,
        to: user.email,
        subject: "BugFlow Password Reset",
        html: `
          <h2>BugFlow Password Reset</h2>
          <p>You requested to reset your BugFlow password.</p>
          <p>This link will expire in 15 minutes.</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you did not request this, you can ignore this email.</p>
        `,
      });
    } finally {
      transporter.close();
    }

    res.status(200).json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Password reset email delivery failed:", {
      code: error.code,
      responseCode: error.responseCode,
      command: error.command,
    });

    if (user && hashedToken) {
      try {
        await User.updateOne(
          { _id: user._id, resetPasswordToken: hashedToken },
          {
            $set: {
              resetPasswordToken: null,
              resetPasswordExpires: null,
            },
          },
        );
      } catch (cleanupError) {
        console.error("Failed to clear unused password reset token:", {
          message: cleanupError.message,
        });
      }
    }

    const authenticationFailed =
      error.code === "EAUTH" || error.responseCode === 535;

    res.status(500).json({
      message: authenticationFailed
        ? "Gmail rejected the email credentials. Set EMAIL_PASS to a valid Gmail App Password."
        : "Unable to deliver the password reset email. Check the server email settings and try again.",
    });
  }
};

// ======================================
// RESET PASSWORD
// ======================================
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset link is invalid or has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = null;

    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful. You can now login.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
