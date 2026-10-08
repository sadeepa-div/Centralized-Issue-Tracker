import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API_BASE_URL from "../config/api";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  const currentUser = storedUser ? JSON.parse(storedUser) : null;

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

  useEffect(() => {
    fetchProject();
    fetchUsers();
  }, [id]);

  const canManage =
    currentUser?.role === "Admin" ||
    project?.createdBy?._id === currentUser?.id;

  const handleAddMember = async () => {
    if (!selectedUser) {
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
        setMessage(data.message);
        return;
      }

      setMessage("Member added successfully");
      setSelectedUser("");

      fetchProject();
    } catch (error) {
      setMessage("Cannot connect to server");
    }
  };

  const handleRemoveMember = async (userId) => {
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
        setMessage(data.message);
        return;
      }

      setMessage("Member removed successfully");

      fetchProject();
    } catch (error) {
      setMessage("Cannot connect to server");
    }
  };

  if (!project) {
    return (
      <div className="dashboard-content">
        <p>{message || "Loading project..."}</p>
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

          <Link to="/my-issues">My Issues</Link>
          
          <Link to="/create-issue">Create Issue</Link>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="page-header">
          <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
          </div>

          <Link to="/projects">Back to Projects</Link>
        </div>

        {message && <p className="project-message">{message}</p>}

        <div className="project-details-card">
          <h2>Project Information</h2>

          <p>
            <strong>Created By:</strong> {project.createdBy?.name}
          </p>

          <p>
            <strong>Role:</strong> {project.createdBy?.role}
          </p>

          <p>
            <strong>Total Members:</strong> {project.members?.length || 0}
          </p>
        </div>

        {canManage && (
          <div className="member-management">
            <h2>Add Project Member</h2>

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
              className="primary-button"
              onClick={handleAddMember}
              disabled={!selectedUser}
            >
              Add Member
            </button>
          </div>
        )}

        <div className="project-members">
          <h2>Project Members</h2>

          {project.members?.length === 0 ? (
            <p>No members available.</p>
          ) : (
            project.members.map((member) => (
              <div className="member-card" key={member._id}>
                <div>
                  <strong>{member.name}</strong>

                  <p>{member.email}</p>

                  <span>{member.role}</span>
                </div>

                {canManage && member._id !== project.createdBy?._id && (
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveMember(member._id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default ProjectDetails;
