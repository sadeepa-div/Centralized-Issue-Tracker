import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Archive,
  CircleCheck,
  CircleDot,
  Clock3,
  FlaskConical,
  ListTodo,
  LogOut,
  Plus,
} from "lucide-react";
import API_BASE_URL from "../config/api";
import Sidebar from "../components/Sidebar";
import DashboardCalendar from "../components/DashboardCalendar";

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
        totalIssues: data.totalIssues || 0,
        openIssues: data.openIssues || 0,
        inProgressIssues: data.inProgressIssues || 0,
        testingIssues: data.testingIssues || 0,
        resolvedIssues: data.resolvedIssues || 0,
        closedIssues: data.closedIssues || 0,
      });

      setRecentIssues(data.recentIssues || []);
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

  const completedIssues = stats.resolvedIssues + stats.closedIssues;

  const completionPercentage =
    stats.totalIssues === 0
      ? 0
      : Math.round((completedIssues / stats.totalIssues) * 100);

  const openIssues = () => {
    navigate("/issues");
  };

  const issueStats = [
    { label: "Total issues", value: stats.totalIssues, icon: ListTodo, tone: "total" },
    { label: "Open", value: stats.openIssues, icon: CircleDot, tone: "open" },
    { label: "In progress", value: stats.inProgressIssues, icon: Clock3, tone: "progress" },
    { label: "Testing", value: stats.testingIssues, icon: FlaskConical, tone: "testing" },
    { label: "Resolved", value: stats.resolvedIssues, icon: CircleCheck, tone: "resolved" },
    { label: "Closed", value: stats.closedIssues, icon: Archive, tone: "closed" },
  ];

  const statusItems = [
    { label: "Open", value: stats.openIssues, tone: "open" },
    { label: "In progress", value: stats.inProgressIssues, tone: "progress" },
    { label: "Testing", value: stats.testingIssues, tone: "testing" },
    { label: "Resolved", value: stats.resolvedIssues, tone: "resolved" },
    { label: "Closed", value: stats.closedIssues, tone: "closed" },
  ];

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header dashboard-page-header">
          <div className="dashboard-heading">
            <span className="dashboard-eyebrow">WORKSPACE OVERVIEW</span>
            <h1>Dashboard</h1>
            <p>
              Welcome back, {user?.name || "there"}. Here’s your issue
              overview.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <Link className="dashboard-create-button" to="/create-issue">
              <Plus size={18} aria-hidden="true" />
              Create issue
            </Link>
            <button
              className="dashboard-logout-button"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={17} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </header>

        {message && <p className="error-message">{message}</p>}

        <section className="dashboard-stats-grid" aria-label="Issue statistics">
          {issueStats.map(({ label, value, icon: Icon, tone }) => (
            <button
              className={`stat-card dashboard-stat-card dashboard-stat-${tone}`}
              key={label}
              onClick={openIssues}
              type="button"
            >
              <span className="dashboard-stat-icon">
                <Icon size={19} aria-hidden="true" />
              </span>
              <span className="dashboard-stat-label">{label}</span>
              <strong>{value}</strong>
              <span className="dashboard-stat-link">View issues</span>
            </button>
          ))}
        </section>

        <div className="dashboard-overview-grid">
          <section className="dashboard-section dashboard-status-section">
            <div className="section-heading dashboard-section-heading">
              <div>
                <h2>Status overview</h2>
                <p>Progress across all {stats.totalIssues} issues</p>
              </div>
            </div>

            <div className="dashboard-completion">
              <div className="dashboard-completion-label">
                <span>Completed</span>
                <strong>{completionPercentage}%</strong>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-label="Issue completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPercentage}
              >
                <div
                  className="progress-value"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="status-overview">
              {statusItems.map(({ label, value, tone }) => {
                const percentage =
                  stats.totalIssues === 0
                    ? 0
                    : Math.min((value / stats.totalIssues) * 100, 100);

                return (
                  <div className={`status-row status-row-${tone}`} key={label}>
                    <span>{label}</span>
                    <div
                      className="status-bar"
                      role="progressbar"
                      aria-label={`${label} issues`}
                      aria-valuemin={0}
                      aria-valuemax={stats.totalIssues}
                      aria-valuenow={value}
                    >
                      <div style={{ width: `${percentage}%` }} />
                    </div>
                    <strong>{value}</strong>
                  </div>
                );
              })}
            </div>
          </section>

          <DashboardCalendar />
        </div>

        <section className="dashboard-section dashboard-recent-section">
          <div className="section-heading dashboard-section-heading">
            <div>
              <h2>Recent issues</h2>
              <p>The latest activity across your workspace</p>
            </div>
            <Link className="dashboard-view-all" to="/issues">
              View all issues
            </Link>
          </div>

          {recentIssues.length === 0 ? (
            <div className="dashboard-empty-state">
              <CircleDot size={22} aria-hidden="true" />
              <p>No issues to show yet.</p>
              <span>Create an issue to start tracking work.</span>
            </div>
          ) : (
            <div className="recent-issues">
              {recentIssues.map((issue) => (
                <Link
                  className="recent-issue-item"
                  key={issue._id}
                  to={`/issues/${issue._id}`}
                >
                  <div>
                    <strong>{issue.title}</strong>

                    <p>{issue.project?.name || "No Project"}</p>
                  </div>

                  <div className="recent-issue-info">
                    <span
                      className={`priority-badge priority-${issue.priority
                        ?.toLowerCase()
                        .replace(" ", "-")}`}
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
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
