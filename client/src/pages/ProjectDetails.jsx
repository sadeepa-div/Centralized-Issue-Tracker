import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config/api";
import Sidebar from "../components/Sidebar";
import { useToast } from "../context/ToastContext";

function ProjectDetails() {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const canManage =
    currentUser?.role === "Admin" || currentUser?.role === "Project Manager";

  // ============================
  // FETCH PROJECT
  // ============================
  const fetchProject = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setProject(data);
    } catch (error) {
      setMessage("Cannot connect to server");
    }
  };

  // ============================
  // FETCH USERS
  // ============================
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/team`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ============================
  // FETCH PROJECT ISSUES
  // ============================
  const fetchIssues = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues?project=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIssues(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ============================
  // LOAD PAGE
  // ============================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([fetchProject(), fetchUsers(), fetchIssues()]);

      setLoading(false);
    };

    loadData();
  }, [id]);

  // ============================
  // ADD MEMBER
  // ============================
  const handleAddMember = async () => {
    if (!selectedUser) {
      showToast("Please select a team member", "error");

      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/members`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          userId: selectedUser,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to add member", "error");

        return;
      }

      showToast("Member added successfully", "success");

      setSelectedUser("");

      fetchProject();
    } catch (error) {
      showToast("Cannot connect to server", "error");
    }
  };

  // ============================
  // REMOVE MEMBER
  // ============================
  const handleRemoveMember = async (userId) => {
    const confirmed = window.confirm("Remove this member from the project?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/${id}/members/${userId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to remove member", "error");

        return;
      }

      showToast("Member removed successfully", "success");

      fetchProject();
    } catch (error) {
      showToast("Cannot connect to server", "error");
    }
  };
  // ============================
  // PROJECT STATISTICS
  // ============================
  const totalIssues = issues.length;

  const openIssues = issues.filter((issue) => issue.status === "Open").length;

  const inProgressIssues = issues.filter(
    (issue) => issue.status === "In Progress",
  ).length;

  const testingIssues = issues.filter(
    (issue) => issue.status === "Testing",
  ).length;

  const completedIssues = issues.filter(
    (issue) => issue.status === "Resolved" || issue.status === "Closed",
  ).length;

  const progress =
    totalIssues === 0 ? 0 : Math.round((completedIssues / totalIssues) * 100);

  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar />

        <main className="dashboard-content">
          <div className="projects-loading">
            <div className="loading-spinner"></div>
            <p>Loading project...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="dashboard-page">
        <Sidebar />

        <main className="dashboard-content">
          <p>{message || "Project not found"}</p>
        </main>
      </div>
    );
  }

  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to delete project", "error");

        return;
      }

      showToast("Project deleted successfully", "success");

      setTimeout(() => {
        navigate("/projects");
      }, 500);
    } catch (error) {
      showToast("Cannot connect to server", "error");
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        {/* HEADER */}
        <div className="project-details-header">
          {canManage && (
            <button
              type="button"
              className="delete-project-button"
              onClick={handleDeleteProject}
            >
              Delete Project
            </button>
          )}
          <div>
            <Link to="/projects" className="back-link">
              ← Back to Projects
            </Link>

            <h1>{project.name}</h1>

            <p>{project.description}</p>
          </div>

          <div className="project-progress-circle">
            <strong>{progress}%</strong>
            <span>Complete</span>
          </div>
        </div>

        {message && <p className="project-message">{message}</p>}

        {/* STATISTICS */}
        <div className="project-detail-stats">
          <div className="project-detail-stat-card">
            <span>Total Issues</span>
            <strong>{totalIssues}</strong>
          </div>

          <div className="project-detail-stat-card">
            <span>Open</span>
            <strong>{openIssues}</strong>
          </div>

          <div className="project-detail-stat-card">
            <span>In Progress</span>
            <strong>{inProgressIssues}</strong>
          </div>

          <div className="project-detail-stat-card">
            <span>Testing</span>
            <strong>{testingIssues}</strong>
          </div>

          <div className="project-detail-stat-card">
            <span>Completed</span>
            <strong>{completedIssues}</strong>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="project-detail-section">
          <div className="section-heading">
            <div>
              <h2>Project Progress</h2>
              <p>Based on resolved and closed issues</p>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className="project-progress-track">
            <div
              className="project-progress-value"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* PROJECT INFO */}
        <div className="project-detail-section">
          <h2>Project Information</h2>

          <div className="project-information-grid">
            <div>
              <span>Created By</span>
              <strong>{project.createdBy?.name || "Unknown"}</strong>
            </div>

            <div>
              <span>Creator Role</span>
              <strong>{project.createdBy?.role || "Unknown"}</strong>
            </div>

            <div>
              <span>Members</span>
              <strong>{project.members?.length || 0}</strong>
            </div>

            <div>
              <span>Total Issues</span>
              <strong>{totalIssues}</strong>
            </div>
          </div>
        </div>

        {/* MEMBER MANAGEMENT */}
        {canManage && (
          <div className="project-detail-section">
            <h2>Add Team Member</h2>

            <div className="member-add-row">
              <select
                value={selectedUser}
                onChange={(event) => setSelectedUser(event.target.value)}
              >
                <option value="">Select Developer or Tester</option>

                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.role}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="primary-button"
                onClick={handleAddMember}
              >
                + Add Member
              </button>
            </div>
          </div>
        )}

        {/* MEMBERS */}
        <div className="project-detail-section">
          <div className="section-heading">
            <h2>Project Members</h2>

            <span>{project.members?.length || 0} members</span>
          </div>

          {project.members?.length === 0 ? (
            <div className="empty-members">
              <p>No members have been added yet.</p>
            </div>
          ) : (
            <div className="modern-members-grid">
              {project.members.map((member) => (
                <div className="modern-member-card" key={member._id}>
                  <div className="member-avatar">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="member-information">
                    <strong>{member.name}</strong>

                    <span>{member.email}</span>

                    <small>{member.role}</small>
                  </div>

                  {canManage && (
                    <button
                      type="button"
                      className="member-remove-button"
                      onClick={() => handleRemoveMember(member._id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ISSUES */}
        <div className="project-detail-section">
          <div className="section-heading">
            <div>
              <h2>Project Issues</h2>

              <p>Issues reported under this project</p>
            </div>

            <Link to="/create-issue" className="create-small-link">
              + Create Issue
            </Link>
          </div>

          {issues.length === 0 ? (
            <div className="empty-project-issues">
              <p>No issues have been created for this project yet.</p>
            </div>
          ) : (
            <div className="project-issue-list">
              {issues.map((issue) => (
                <Link
                  key={issue._id}
                  to={`/issues/${issue._id}`}
                  className="project-issue-row"
                >
                  <div>
                    <strong>{issue.title}</strong>

                    <span>{issue.type}</span>
                  </div>

                  <div className="project-issue-badges">
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProjectDetails;
