import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Search,
  RotateCcw,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import API_BASE_URL from "../config/api";

function MyIssues() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const [issues, setIssues] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [priority, setPriority] =
    useState("");

  // ==========================
  // LOAD MY ISSUES
  // ==========================
  const fetchMyIssues = async () => {
    try {
      setLoading(true);

      const params =
        new URLSearchParams();

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
      }

      if (
        status &&
        user?.role !== "Tester"
      ) {
        params.set(
          "status",
          status
        );
      }

      if (priority) {
        params.set(
          "priority",
          priority
        );
      }

      const query =
        params.toString();

      const response =
        await fetch(
          `${API_BASE_URL}/issues/my${
            query
              ? `?${query}`
              : ""
          }`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setIssues([]);
        return;
      }

      setIssues(data);

    } catch (error) {
      console.error(error);
      setIssues([]);

    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // SEARCH DELAY
  // ==========================
  useEffect(() => {
    const timer =
      setTimeout(() => {
        fetchMyIssues();
      }, 300);

    return () =>
      clearTimeout(timer);

  }, [
    search,
    status,
    priority,
  ]);

  // ==========================
  // CLEAR FILTERS
  // ==========================
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
  };

  // ==========================
  // SUMMARY
  // ==========================
  const total =
    issues.length;

  const open =
    issues.filter(
      (issue) =>
        issue.status === "Open"
    ).length;

  const active =
    issues.filter(
      (issue) =>
        issue.status ===
          "In Progress" ||
        issue.status ===
          "Testing"
    ).length;

  const completed =
    issues.filter(
      (issue) =>
        issue.status ===
          "Resolved" ||
        issue.status ===
          "Closed"
    ).length;

  // ==========================
  // ROLE MESSAGE
  // ==========================
  const getRoleMessage = () => {
    if (
      user?.role === "Developer"
    ) {
      return "Issues currently assigned to you.";
    }

    if (
      user?.role === "Tester"
    ) {
      return "Issues currently waiting for testing.";
    }

    return "Monitor and manage issues across the workspace.";
  };

  return (
    <div className="dashboard-page">

      <Sidebar />

      <main className="dashboard-content">

        {/* HEADER */}
        <div className="my-issues-header">
          <div>
            <h1>My Issues</h1>

            <p>
              {getRoleMessage()}
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="my-issues-stats">

          <div className="my-issue-stat">
            <span>Total</span>
            <strong>{total}</strong>
          </div>

          <div className="my-issue-stat">
            <span>Open</span>
            <strong>{open}</strong>
          </div>

          <div className="my-issue-stat">
            <span>Active</span>
            <strong>{active}</strong>
          </div>

          <div className="my-issue-stat">
            <span>Completed</span>
            <strong>
              {completed}
            </strong>
          </div>

        </div>

        {/* FILTERS */}
        <div className="issue-filter-panel">

          <div className="issue-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          {user?.role !==
            "Tester" && (
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
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
          )}

          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value
              )
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

          <button
            type="button"
            onClick={clearFilters}
            className="clear-filter-button"
          >
            <RotateCcw size={16} />
            Clear
          </button>

        </div>

        {/* ISSUES */}
        {loading ? (
          <div className="loading-state">
            Loading issues...
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state">
            <h3>
              No issues found
            </h3>

            <p>
              There are currently no
              issues for this workspace.
            </p>
          </div>
        ) : (
          <div className="my-issues-list">

            {issues.map((issue) => (
              <div
                key={issue._id}
                className="my-issue-card"
                onClick={() =>
                  navigate(
                    `/issues/${issue._id}`
                  )
                }
              >

                <div className="my-issue-card-top">

                  <div>
                    <span className="type-badge">
                      {issue.type}
                    </span>

                    <h3>
                      {issue.title}
                    </h3>
                  </div>

                  <span
                    className={`priority-badge priority-${issue.priority
                      ?.toLowerCase()}`}
                  >
                    {issue.priority}
                  </span>

                </div>

                <p>
                  {issue.description}
                </p>

                <div className="my-issue-card-bottom">

                  <div>
                    <span>
                      Project
                    </span>

                    <strong>
                      {issue.project
                        ?.name ||
                        "No Project"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Assignee
                    </span>

                    <strong>
                      {issue.assignee
                        ?.name ||
                        "Unassigned"}
                    </strong>
                  </div>

                  <span
                    className={`status-badge status-${issue.status
                      ?.toLowerCase()
                      .replaceAll(
                        " ",
                        "-"
                      )}`}
                  >
                    {issue.status}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default MyIssues;