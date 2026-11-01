import { useLayoutEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Issues from "./pages/Issues";
import CreateIssue from "./pages/CreateIssue";
import IssueDetails from "./pages/IssueDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import MyIssues from "./pages/MyIssues";
import Profile from "./pages/Profile";

import "./App.css";
import "./theme.css";

function App() {
  const [theme, setTheme] = useState(() =>
    window.localStorage.getItem("bugflow-theme") === "dark" ? "dark" : "light",
  );

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("bugflow-theme", theme);
  }, [theme]);

  return (
    <>
      <button
        className="theme-toggle"
        type="button"
        onClick={() =>
          setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light")
        }
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        aria-pressed={theme === "dark"}
      >
        {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
      </button>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <Issues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-issues"
          element={
            <ProtectedRoute>
              <MyIssues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/issues/:id"
          element={
            <ProtectedRoute>
              <IssueDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-issue"
          element={
            <ProtectedRoute>
              <CreateIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
