import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import Sidebar from "../components/Sidebar";

function Issues() {
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [project, setProject] = useState("");
  const [assignee, setAssignee] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ======================================
  // FETCH PROJECTS
  // ======================================
  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ======================================
  // FETCH DEVELOPERS
  // ======================================
  const fetchDevelopers = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/developers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDevelopers(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ======================================
  // FETCH ISSUES
  // ======================================
  const fetchIssues = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (status) {
        params.append("status", status);
      }

      if (priority) {
        params.append("priority", priority);
      }

      if (project) {
        params.append("project", project);
      }

      if (assignee) {
        params.append("assignee", assignee);
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

  // ======================================
  // INITIAL DATA
  // ======================================
  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, []);

  // ======================================
  // LIVE SEARCH + FILTER
  // ======================================
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIssues();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    search,
    status,
    priority,
    project,
    assignee,
  ]);

  // ======================================
  // CLEAR FILTERS
  // ======================================
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setProject("");
    setAssignee("");
  };

  const hasFilters =
    search ||
    status ||
    priority ||
    project ||
    assignee;

  // ======================================
  // CSS CLASS HELPERS
  // ======================================
  const getStatusClass = (issueStatus) => {
    return `status-badge status-${issueStatus
      ?.toLowerCase()
      .replaceAll(" ", "-")}`;
  };

  const getPriorityClass = (issuePriority) => {
    return `priority-badge priority-${issuePriority
      ?.toLowerCase()
      .replaceAll(" ", "-")}`;
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">

        {/* PAGE HEADER */}
        <div className="page-header issues-page-header">
          <div>
            <h1>Issues</h1>

            <p>
              Search, filter and manage reported issues.
            </p>
          </div>

          <Link
            to="/create-issue"
            className="create-issue-link"
          >
            + Create Issue
          </Link>
        </div>

        {/* FILTER AREA */}
        <div className="issue-filter-panel">

          <div className="issue-search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search issue title..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="issue-filter-grid">

            {/* STATUS */}
            <div className="filter-field">
              <label>Status</label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
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

            {/* PRIORITY */}
            <div className="filter-field">
              <label>Priority</label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
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

            {/* PROJECT */}
            <div className="filter-field">
              <label>Project</label>

              <select
                value={project}
                onChange={(event) =>
                  setProject(event.target.value)
                }
              >
                <option value="">
                  All Projects
                </option>

                {projects.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ASSIGNEE */}
            <div className="filter-field">
              <label>Developer</label>

              <select
                value={assignee}
                onChange={(event) =>
                  setAssignee(event.target.value)
                }
              >
                <option value="">
                  All Developers
                </option>

                {developers.map(
                  (developer) => (
                    <option
                      key={developer._id}
                      value={developer._id}
                    >
                      {developer.name}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          {/* FILTER FOOTER */}
          <div className="filter-footer">

            <p>
              {loading
                ? "Loading issues..."
                : `${issues.length} issue${
                    issues.length === 1 ? "" : "s"
                  } found`}
            </p>

            {hasFilters && (
              <button
                type="button"
                className="clear-filter-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

          </div>

        </div>

        {/* ERROR */}
        {message && (
          <p className="error-message">
            {message}
          </p>
        )}

        {/* ISSUE LIST */}
        {loading ? (
          <div className="issues-loading">
            <div className="loading-spinner"></div>

            <p>Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-issues">
            <h3>No Issues Found</h3>

            <p>
              Try changing your search or filters.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="modern-issue-list">

            {issues.map((issue) => (
              <Link
                key={issue._id}
                to={`/issues/${issue._id}`}
                className="modern-issue-card"
              >

                {/* TOP */}
                <div className="issue-card-top">

                  <div className="issue-card-title">
                    <h3>{issue.title}</h3>

                    <p>
                      {issue.description}
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

                {/* INFORMATION */}
                <div className="issue-card-details">

                  <div>
                    <span className="issue-label">
                      Status
                    </span>

                    <span
                      className={getStatusClass(
                        issue.status
                      )}
                    >
                      {issue.status}
                    </span>
                  </div>

                  <div>
                    <span className="issue-label">
                      Project
                    </span>

                    <strong>
                      {issue.project?.name ||
                        "No Project"}
                    </strong>
                  </div>

                  <div>
                    <span className="issue-label">
                      Assigned To
                    </span>

                    <strong>
                      {issue.assignee?.name ||
                        "Unassigned"}
                    </strong>
                  </div>

                  <div>
                    <span className="issue-label">
                      Type
                    </span>

                    <strong>
                      {issue.type}
                    </strong>
                  </div>

                </div>

                {/* FOOTER */}
                <div className="issue-card-footer">

                  <span>
                    Reported by{" "}
                    <strong>
                      {issue.reporter?.name ||
                        "Unknown"}
                    </strong>
                  </span>

                  <span className="view-issue-text">
                    View Issue →
                  </span>

                </div>

              </Link>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default Issues;