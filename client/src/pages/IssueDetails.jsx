import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function IssueDetails() {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchIssue = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/issues/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setIssue(data);
      setStatus(data.status);
    } catch (error) {
      setMessage("Cannot connect to server");
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/issues/${id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Issue status updated successfully");

      fetchIssue();
    } catch (error) {
      setMessage("Cannot connect to server");
    }
  };

  if (!issue) {
    return (
      <div className="dashboard-content">
        {message ? <p>{message}</p> : <p>Loading issue...</p>}
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2>Bug Tracker</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/issues">Issues</Link>
          <Link to="/create-issue">Create Issue</Link>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="page-header">
          <h1>Issue Details</h1>

          <Link to="/issues">Back to Issues</Link>
        </div>

        {message && <p className="project-message">{message}</p>}

        <div className="issue-details-card">
          <h2>{issue.title}</h2>

          <div className="issue-detail-row">
            <strong>Description:</strong>
            <p>{issue.description}</p>
          </div>

          <div className="issue-detail-row">
            <strong>Project:</strong>
            <p>{issue.project?.name}</p>
          </div>

          <div className="issue-detail-row">
            <strong>Type:</strong>
            <p>{issue.type}</p>
          </div>

          <div className="issue-detail-row">
            <strong>Priority:</strong>
            <p>{issue.priority}</p>
          </div>

          <div className="issue-detail-row">
            <strong>Reporter:</strong>
            <p>{issue.reporter?.name}</p>
          </div>

          <div className="issue-detail-row">
            <strong>Assignee:</strong>

            <p>{issue.assignee?.name || "Not Assigned"}</p>
          </div>

          <div className="status-update-section">
            <label>
              <strong>Status</strong>
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="Open">Open</option>

              <option value="In Progress">In Progress</option>

              <option value="Testing">Testing</option>

              <option value="Resolved">Resolved</option>

              <option value="Closed">Closed</option>
            </select>

            <button className="primary-button" onClick={handleStatusUpdate}>
              Update Status
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default IssueDetails;
