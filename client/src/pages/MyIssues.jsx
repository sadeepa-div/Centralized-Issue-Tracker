import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import Sidebar from "../components/Sidebar";

function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const fetchMyIssues = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (user?.role === "Developer") {
        params.append("assignee", user.id);
      }

      if (user?.role === "Tester") {
        params.append("status", "Testing");
      }

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      if (priorityFilter) {
        params.append("priority", priorityFilter);
      }

      const response = await fetch(
        `${API_BASE_URL}/issues?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        setIssues([]);
        return;
      }

      setIssues(data);
      setMessage("");
    } catch (error) {
      setMessage("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
  }, [statusFilter, priorityFilter]);

  const pageTitle = () => {
    if (user?.role === "Developer") {
      return "My Assigned Issues";
    }

    if (user?.role === "Tester") {
      return "Testing Workspace";
    }

    if (user?.role === "Project Manager") {
      return "Project Issues";
    }

    if (user?.role === "Admin") {
      return "All Issues";
    }

    return "My Issues";
  };

  const pageDescription = () => {
    if (user?.role === "Developer") {
      return "Issues currently assigned to you.";
    }

    if (user?.role === "Tester") {
      return "Issues currently ready for testing.";
    }

    return "View and manage issue activity.";
  };

  const openCount = issues.filter(
    (issue) => issue.status === "Open"
  ).length;

  const inProgressCount = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const testingCount = issues.filter(
    (issue) => issue.status === "Testing"
  ).length;

  const completedCount = issues.filter(
    (issue) =>
      issue.status === "Resolved" ||
      issue.status === "Closed"
  ).length;

  const clearFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status
      ?.toLowerCase()
      .replaceAll(" ", "-")}`;
  };

  const getPriorityClass = (priority) => {
    return `priority-badge priority-${priority
      ?.toLowerCase()
      .replaceAll(" ", "-")}`;
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">

        {/* HEADER */}
        <div className="my-issues-header">

          <div>
            <h1>{pageTitle()}</h1>

            <p>{pageDescription()}</p>

            {user && (
              <span className="current-role">
                {user.name} • {user.role}
              </span>
            )}
          </div>

          <Link
            to="/create-issue"
            className="create-issue-link"
          >
            + Create Issue
          </Link>

        </div>

        {message && (
          <p className="error-message">
            {message}
          </p>
        )}

        {/* SUMMARY */}
        <div className="my-issue-summary">

          <div className="my-issue-stat">
            <span>Total</span>
            <strong>{issues.length}</strong>
          </div>

          <div className="my-issue-stat">
            <span>Open</span>
            <strong>{openCount}</strong>
          </div>

          <div className="my-issue-stat">
            <span>In Progress</span>
            <strong>{inProgressCount}</strong>
          </div>

          <div className="my-issue-stat">
            <span>Testing</span>
            <strong>{testingCount}</strong>
          </div>

          <div className="my-issue-stat">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>

        </div>

        {/* FILTERS */}
        <div className="my-issue-filters">

          <div>
            <label>Status</label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="">
                All Statuses
              </option>

              <option value="Open">
                Open
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Testing">
                Testing
              </option>

              <option value="Resolved">
                Resolved
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>
          </div>

          <div>
            <label>Priority</label>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >
              <option value="">
                All Priorities
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Critical">
                Critical
              </option>
            </select>
          </div>

          {(statusFilter || priorityFilter) && (
            <button
              type="button"
              onClick={clearFilters}
              className="clear-filter-button"
            >
              Clear Filters
            </button>
          )}

        </div>

        {/* ISSUE LIST */}
        {loading ? (
          <div className="issues-loading">
            <div className="loading-spinner"></div>
            <p>Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-my-issues">

            <h3>No Issues Found</h3>

            <p>
              There are no issues matching your current view.
            </p>

          </div>
        ) : (
          <div className="my-issues-grid">

            {issues.map((issue) => (
              <Link
                to={`/issues/${issue._id}`}
                key={issue._id}
                className="my-issue-card"
              >

                <div className="my-issue-card-top">

                  <div>
                    <h3>{issue.title}</h3>

                    <p>
                      {issue.project?.name ||
                        "No Project"}
                    </p>
                  </div>

                  <span
                    className={getPriorityClass(
                      issue.priority
                    )}
                  >
                    {issue.priority}
                  </span>

                </div>

                <div className="my-issue-description">
                  {issue.description}
                </div>

                <div className="my-issue-meta">

                  <div>
                    <span>Status</span>

                    <strong>
                      <span
                        className={getStatusClass(
                          issue.status
                        )}
                      >
                        {issue.status}
                      </span>
                    </strong>
                  </div>

                  <div>
                    <span>Type</span>
                    <strong>{issue.type}</strong>
                  </div>

                  <div>
                    <span>Assignee</span>
                    <strong>
                      {issue.assignee?.name ||
                        "Unassigned"}
                    </strong>
                  </div>

                </div>

                <div className="my-issue-footer">

                  <span>
                    Reported by{" "}
                    {issue.reporter?.name ||
                      "Unknown"}
                  </span>

                  <strong>
                    Open Issue →
                  </strong>

                </div>

              </Link>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default MyIssues;