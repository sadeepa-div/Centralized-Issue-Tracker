import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import API_BASE_URL from "../config/api";
import Sidebar from "../components/Sidebar";
import { useToast } from "../context/ToastContext";

function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState("");

  const [developers, setDevelopers] = useState([]);
  const [assignee, setAssignee] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("Bug");
  const [editPriority, setEditPriority] = useState("Medium");

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const getAllowedStatuses = () => {
    if (user?.role === "Admin" || user?.role === "Project Manager") {
      return ["Open", "In Progress", "Testing", "Resolved", "Closed"];
    }

    if (user?.role === "Developer") {
      return ["Open", "In Progress", "Testing"];
    }

    if (user?.role === "Tester") {
      return ["In Progress", "Resolved"];
    }

    return [];
  };

  const canManageIssue =
    user?.role === "Admin" || user?.role === "Project Manager";

  const canAssign = canManageIssue;

  // ======================================
  // FETCH ISSUE
  // ======================================
  const fetchIssue = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
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

      if (canAssign && data.project?._id) {
        await fetchDevelopers(data.project._id);
      }

      setStatus(data.status || "Open");

      setAssignee(data.assignee?._id || "");

      setEditTitle(data.title || "");

      setEditDescription(data.description || "");

      setEditType(data.type || "Bug");

      setEditPriority(data.priority || "Medium");
    } catch {
      setMessage("Cannot connect to server");
    }
  };

  // ======================================
  // FETCH DEVELOPERS
  // ======================================
  const fetchDevelopers = async (projectId) => {
    if (!projectId) {
      setDevelopers([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/project/${projectId}/developers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setDevelopers([]);
        return;
      }

      setDevelopers(data);
    } catch (error) {
      console.error(error);

      setDevelopers([]);
    }
  };

  // ======================================
  // FETCH COMMENTS
  // ======================================
  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setComments([]);
        return;
      }

      if (Array.isArray(data)) {
        setComments(data);
      } else {
        setComments(data.comments || []);
      }
    } catch {
      setComments([]);
    }
  };

  // ======================================
  // LOAD PAGE
  // ======================================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([fetchIssue(), fetchComments()]);

      setLoading(false);
    };

    loadData();
  }, [id]);

  // ======================================
  // STATUS UPDATE
  // ======================================
  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${id}/status`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to update status", "error");

        return;
      }

      showToast("Issue status updated successfully", "success");

      fetchIssue();
    } catch {
      showToast("Cannot connect to server", "error");
    }
  };

  // ======================================
  // ASSIGN DEVELOPER
  // ======================================
  const handleAssignIssue = async () => {
    if (!assignee) {
      showToast("Please select a developer", "error");

      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/issues/${id}/assignee`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          assignee,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to assign developer", "error");

        return;
      }

      showToast("Issue assigned successfully", "success");

      fetchIssue();
    } catch  {
      showToast("Cannot connect to server", "error");
    }
  };

  // ======================================
  // ADD COMMENT
  // ======================================
  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!commentText.trim()) {
      showToast("Please enter a comment", "error");

      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          text: commentText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to add comment", "error");

        return;
      }

      setCommentText("");

      showToast("Comment added successfully", "success");

      fetchComments();
    } catch  {
      showToast("Cannot connect to server", "error");
    }
  };
  // ======================================
  // UPDATE ISSUE
  // ======================================
  const handleUpdateIssue = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      showToast("Title and description are required", "error");

      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          type: editType,
          priority: editPriority,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to update issue", "error");

        return;
      }

      showToast("Issue updated successfully", "success");

      setEditMode(false);

      fetchIssue();
    } catch  {
      showToast("Cannot connect to server", "error");
    }
  };

  // ======================================
  // DELETE ISSUE
  // ======================================
  const handleDeleteIssue = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this issue?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to delete issue", "error");

        return;
      }

      showToast("Issue deleted successfully", "success");

      setTimeout(() => {
        navigate("/issues");
      }, 500);
    } catch  {
      showToast("Cannot connect to server", "error");
    }
  };

  // ======================================
  // DATE FORMAT
  // ======================================
  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString();
  };

  const statusClass = `status-badge status-${issue?.status
    ?.toLowerCase()
    .replaceAll(" ", "-")}`;

  const priorityClass = `priority-badge priority-${issue?.priority
    ?.toLowerCase()
    .replaceAll(" ", "-")}`;

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar />

        <main className="dashboard-content">
          <div className="issues-loading">
            <div className="loading-spinner"></div>

            <p>Loading issue...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="dashboard-page">
        <Sidebar />

        <main className="dashboard-content">
          <p>{message || "Issue not found"}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        {/* HEADER */}
        <div className="issue-details-header">
          <div>
            <Link to="/issues" className="back-link">
              ← Back to Issues
            </Link>

            <h1>{issue.title}</h1>

            <div className="issue-header-badges">
              <span className={statusClass}>{issue.status}</span>

              <span className={priorityClass}>{issue.priority}</span>

              <span className="type-badge">{issue.type}</span>
            </div>
          </div>

          {canManageIssue && (
            <div className="issue-header-actions">
              <button
                className="primary-button"
                onClick={() => setEditMode(true)}
              >
                Edit Issue
              </button>

              <button className="delete-button" onClick={handleDeleteIssue}>
                Delete
              </button>
            </div>
          )}
        </div>

        {message && <div className="issue-message">{message}</div>}

        {/* MAIN GRID */}
        <div className="issue-details-layout">
          {/* LEFT SIDE */}
          <div className="issue-details-main">
            {/* DESCRIPTION */}
            <div className="issue-details-section">
              <h2>Description</h2>

              <p className="issue-description-full">{issue.description}</p>
            </div>

            {/* EDIT FORM */}
            {editMode && (
              <div className="issue-details-section edit-panel">
                <div className="section-heading">
                  <h2>Edit Issue</h2>

                  <button
                    className="close-edit-button"
                    onClick={() => setEditMode(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="form-group">
                  <label>Title</label>

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>

                  <textarea
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                  />
                </div>

                <div className="edit-form-grid">
                  <div className="form-group">
                    <label>Type</label>

                    <select
                      value={editType}
                      onChange={(event) => setEditType(event.target.value)}
                    >
                      <option value="Bug">Bug</option>

                      <option value="Task">Task</option>

                      <option value="Feature">Feature</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority</label>

                    <select
                      value={editPriority}
                      onChange={(event) => setEditPriority(event.target.value)}
                    >
                      <option value="Low">Low</option>

                      <option value="Medium">Medium</option>

                      <option value="High">High</option>

                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="edit-buttons">
                  <button
                    className="primary-button"
                    onClick={handleUpdateIssue}
                  >
                    Save Changes
                  </button>

                  <button
                    className="cancel-button"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* COMMENTS */}
            <div className="issue-details-section">
              <div className="section-heading">
                <h2>Comments</h2>

                <span>{comments.length}</span>
              </div>

              <form className="modern-comment-form" onSubmit={handleAddComment}>
                <textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  required
                />

                <button type="submit" className="primary-button">
                  Add Comment
                </button>
              </form>

              {comments.length === 0 ? (
                <div className="empty-comments">
                  <p>No comments yet.</p>
                </div>
              ) : (
                <div className="modern-comment-list">
                  {comments.map((comment) => (
                    <div className="modern-comment" key={comment._id}>
                      <div className="comment-avatar">
                        {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>

                      <div className="comment-content">
                        <div className="comment-heading">
                          <strong>{comment.user?.name || "User"}</strong>

                          <span>{formatDate(comment.createdAt)}</span>
                        </div>

                        {comment.user?.role && (
                          <small>{comment.user.role}</small>
                        )}

                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <aside className="issue-details-sidebar">
            {/* ISSUE INFO */}
            <div className="issue-side-card">
              <h3>Issue Information</h3>

              <div className="issue-side-info">
                <div>
                  <span>Project</span>

                  <strong>{issue.project?.name || "No Project"}</strong>
                </div>

                <div>
                  <span>Reporter</span>

                  <strong>{issue.reporter?.name || "Unknown"}</strong>
                </div>

                <div>
                  <span>Assignee</span>

                  <strong>{issue.assignee?.name || "Unassigned"}</strong>
                </div>

                <div>
                  <span>Created</span>

                  <strong>{formatDate(issue.createdAt)}</strong>
                </div>

                <div>
                  <span>Last Updated</span>

                  <strong>{formatDate(issue.updatedAt)}</strong>
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div className="issue-side-card">
              <h3>Update Status</h3>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {getAllowedStatuses().map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>

              <button
                className="side-action-button"
                onClick={handleStatusUpdate}
              >
                Update Status
              </button>
            </div>

            {/* ASSIGN */}
            {canAssign && (
              <div className="issue-side-card">
                <h3>Assign Developer</h3>

                <select
                  className="side-select"
                  value={assignee}
                  onChange={(event) => setAssignee(event.target.value)}
                >
                  <option value="">Select Developer</option>

                  {developers.map((developer) => (
                    <option key={developer._id} value={developer._id}>
                      {developer.name}
                    </option>
                  ))}
                </select>

                <button
                  className="side-action-button"
                  onClick={handleAssignIssue}
                >
                  Assign
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

export default IssueDetails;
