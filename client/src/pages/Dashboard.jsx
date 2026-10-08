import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalIssues: 0,
    openIssues: 0,
    inProgressIssues: 0,
    testingIssues: 0,
    resolvedIssues: 0,
    closedIssues: 0,
  });

  const [recentIssues, setRecentIssues] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/stats/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setStats({
        totalIssues: data.totalIssues,
        openIssues: data.openIssues,
        inProgressIssues: data.inProgressIssues,
        testingIssues: data.testingIssues,
        resolvedIssues: data.resolvedIssues,
        closedIssues: data.closedIssues,
      });

      setRecentIssues(data.recentIssues);
    } catch (error) {
      setMessage("Cannot connect to server");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2>Bug Tracker</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/issues">Issues</Link>
          <Link to="/my-issues">My Issues</Link>
          <Link to="/create-issue">Create Issue</Link>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>

            {user && (
              <p>
                Welcome, {user.name} ({user.role})
              </p>
            )}
          </div>

          <button onClick={handleLogout}>Logout</button>
        </div>

        {message && <p className="error-message">{message}</p>}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Issues</h3>
            <p>{stats.totalIssues}</p>
          </div>

          <div className="stat-card">
            <h3>Open</h3>
            <p>{stats.openIssues}</p>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <p>{stats.inProgressIssues}</p>
          </div>

          <div className="stat-card">
            <h3>Testing</h3>
            <p>{stats.testingIssues}</p>
          </div>

          <div className="stat-card">
            <h3>Resolved</h3>
            <p>{stats.resolvedIssues}</p>
          </div>

          <div className="stat-card">
            <h3>Closed</h3>
            <p>{stats.closedIssues}</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Issues</h2>

          {recentIssues.length === 0 ? (
            <p>No issues available yet.</p>
          ) : (
            <div className="recent-issues">
              {recentIssues.map((issue) => (
                <div className="recent-issue-item" key={issue._id}>
                  <div>
                    <Link to={`/issues/${issue._id}`}>
                      <strong>{issue.title}</strong>
                    </Link>

                    <p>Project: {issue.project?.name}</p>
                  </div>

                  <div>
                    <strong>{issue.status}</strong>

                    <p>{issue.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
