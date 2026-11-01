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

  const [summaryFilter, setSummaryFilter] =
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
    setSummaryFilter("");
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

  const visibleIssues = issues.filter((issue) => {
    if (summaryFilter === "open") {
      return issue.status === "Open";
    }

    if (summaryFilter === "active") {
      return issue.status === "In Progress" || issue.status === "Testing";
    }

    if (summaryFilter === "completed") {
      return issue.status === "Resolved" || issue.status === "Closed";
    }

    return true;
  });

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
        <div className="my-issues-stats my-issue-summary">

          <button
            type="button"
            className={`my-issue-stat ${
              summaryFilter === "" ? "active" : ""
            }`}
            onClick={() => {
              setSummaryFilter("");
              setStatus("");
            }}
            aria-pressed={summaryFilter === ""}
          >
            <span>Total</span>
            <strong>{total}</strong>
            <small>Show all issues</small>
          </button>

          <button
            type="button"
            className={`my-issue-stat ${
              summaryFilter === "open" ? "active" : ""
            }`}
            onClick={() => {
              setSummaryFilter("open");
              setStatus("");
            }}
            aria-pressed={summaryFilter === "open"}
          >
            <span>Open</span>
            <strong>{open}</strong>
            <small>Show open issues</small>
          </button>

          <button
            type="button"
            className={`my-issue-stat ${
              summaryFilter === "active" ? "active" : ""
            }`}
            onClick={() => {
              setSummaryFilter("active");
              setStatus("");
            }}
            aria-pressed={summaryFilter === "active"}
          >
            <span>Active</span>
            <strong>{active}</strong>
            <small>Show active issues</small>
          </button>

          <button
            type="button"
            className={`my-issue-stat ${
              summaryFilter === "completed" ? "active" : ""
            }`}
            onClick={() => {
              setSummaryFilter("completed");
              setStatus("");
            }}
            aria-pressed={summaryFilter === "completed"}
          >
            <span>Completed</span>
            <strong>
              {completed}
            </strong>
            <small>Show completed issues</small>
          </button>

        </div>

        {/* FILTERS */}
        <div className="issue-filter-panel my-issues-filter-panel">

          <div className="issue-search-box my-issues-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search issues..."
              aria-label="Search issues"
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
              onChange={(event) => {
                setSummaryFilter("");
                setStatus(
                  event.target.value
                );
              }}
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
        ) : visibleIssues.length === 0 ? (
          <div className="empty-state">
            <h3>
              {summaryFilter
                ? `No ${summaryFilter} issues found`
                : "No issues found"}
            </h3>

            <p>
              {summaryFilter
                ? `There are currently no ${summaryFilter} issues matching these filters.`
                : "There are currently no issues for this workspace."}
            </p>
          </div>
        ) : (
          <div className="my-issues-list">

            {visibleIssues.map((issue) => (
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