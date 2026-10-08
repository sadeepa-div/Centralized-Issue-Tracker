import { Routes, Route, Navigate } from "react-router-dom";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Issues from "./pages/Issues";
import CreateIssue from "./pages/CreateIssue";
import IssueDetails from "./pages/IssueDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import MyIssues from "./pages/MyIssues";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

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
    </Routes>
  );
}

export default App;
