import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from "../config/api";
import Sidebar from "../components/Sidebar";
import { useToast } from "../context/ToastContext";

function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ============================
  // FETCH PROFILE
  // ============================
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to load profile", "error");

        return null;
      }

      setProfile(data.user);

      return data.user;
    } catch {
      showToast("Cannot connect to server", "error");

      return null;
    }
  };

  // ============================
  // FETCH ISSUES
  // ============================
  const fetchIssues = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIssues(data);
      }
    } catch {
      showToast("Cannot connect to server", "error");
    }
  };

  // ============================
  // LOAD PAGE
  // ============================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([fetchProfile(), fetchIssues()]);

      setLoading(false);
    };

    loadData();
  }, []);

  // ============================
  // LOGOUT
  // ============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ============================
  // STATISTICS
  // ============================
  const assignedIssues = profile
    ? issues.filter((issue) => issue.assignee?._id === profile.id)
    : [];

  const reportedIssues = profile
    ? issues.filter((issue) => issue.reporter?._id === profile.id)
    : [];

  const completedAssignedIssues = assignedIssues.filter(
    (issue) => issue.status === "Resolved" || issue.status === "Closed",
  );

  const activeAssignedIssues = assignedIssues.filter(
    (issue) => issue.status !== "Resolved" && issue.status !== "Closed",
  );

  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar />

        <main className="dashboard-content">
          <div className="issues-loading">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="dashboard-page">
        <Sidebar />

        <main className="dashboard-content">
          <p>Unable to load profile.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        {/* HEADER */}
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>

            <p>View your account and work statistics.</p>
          </div>

          <button className="profile-logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="profile-main-card">
          <div className="profile-avatar">
            {profile.name?.charAt(0).toUpperCase()}
          </div>

          <div className="profile-main-info">
            <h2>{profile.name}</h2>

            <p>{profile.email}</p>

            <span className="profile-role">{profile.role}</span>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <span>Assigned Issues</span>

            <strong>{assignedIssues.length}</strong>
          </div>

          <div className="profile-stat-card">
            <span>Active Issues</span>

            <strong>{activeAssignedIssues.length}</strong>
          </div>

          <div className="profile-stat-card">
            <span>Completed Issues</span>

            <strong>{completedAssignedIssues.length}</strong>
          </div>

          <div className="profile-stat-card">
            <span>Reported Issues</span>

            <strong>{reportedIssues.length}</strong>
          </div>
        </div>

        {/* ACCOUNT INFORMATION */}
        <div className="profile-section">
          <h2>Account Information</h2>

          <div className="profile-info-grid">
            <div>
              <span>Name</span>
              <strong>{profile.name}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{profile.email}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>{profile.role}</strong>
            </div>

            <div>
              <span>User ID</span>
              <strong className="profile-user-id">{profile.id}</strong>
            </div>
          </div>
        </div>

        {/* RECENT ASSIGNED ISSUES */}
        <div className="profile-section">
          <div className="section-heading">
            <div>
              <h2>Recent Assigned Issues</h2>

              <p>Issues currently assigned to your account.</p>
            </div>

            <button
              className="profile-view-button"
              onClick={() => navigate("/my-issues")}
            >
              View My Issues
            </button>
          </div>

          {assignedIssues.length === 0 ? (
            <div className="profile-empty">
              <p>No issues are currently assigned to you.</p>
            </div>
          ) : (
            <div className="profile-issue-list">
              {assignedIssues.slice(0, 5).map((issue) => (
                <button
                  type="button"
                  className="profile-issue-row"
                  key={issue._id}
                  onClick={() => navigate(`/issues/${issue._id}`)}
                >
                  <div>
                    <strong>{issue.title}</strong>

                    <span>{issue.project?.name || "No Project"}</span>
                  </div>

                  <div className="profile-issue-badges">
                    <span
                      className={`priority-badge priority-${issue.priority
                        ?.toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {issue.priority}
                    </span>

                    <span
                      className={`status-badge status-${issue.status
                        ?.toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {issue.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;
