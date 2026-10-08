import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

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

  const token = localStorage.getItem("token");

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/developers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDevelopers(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIssues = async () => {
    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (priority) params.append("priority", priority);
      if (project) params.append("project", project);
      if (assignee) params.append("assignee", assignee);

      const response = await fetch(
        `${API_BASE_URL}/issues?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setIssues(data);
      setMessage("");
    } catch (error) {
      setMessage("Cannot connect to server");
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [search, status, priority, project, assignee]);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setProject("");
    setAssignee("");
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
        <div className="page-header">
          <h1>Issues</h1>
          <p>Search, filter and manage reported issues.</p>
        </div>

        <div className="issue-filters">
          <input
            type="text"
            placeholder="Search issue title..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Testing">Testing</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={project}
            onChange={(event) => setProject(event.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
          >
            <option value="">All Developers</option>
            {developers.map((developer) => (
              <option key={developer._id} value={developer._id}>
                {developer.name}
              </option>
            ))}
          </select>

          <button type="button" onClick={clearFilters}>
            Clear
          </button>
        </div>

        {message && <p className="error-message">{message}</p>}

        <div className="issue-list">
          {issues.length === 0 ? (
            <p>No issues found.</p>
          ) : (
            issues.map((issue) => (
              <div className="issue-card" key={issue._id}>
                <Link to={`/issues/${issue._id}`}>
                  <h3>{issue.title}</h3>
                </Link>
                <p>{issue.description}</p>
                <div className="issue-meta">
                  <span>{issue.status}</span>
                  <span>{issue.priority}</span>
                  <span>{issue.project?.name}</span>
                  <span>{issue.assignee?.name || "Unassigned"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Issues;
