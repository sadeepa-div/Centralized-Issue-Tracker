import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

function Projects() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const canCreateProject =
    user?.role === "Admin" || user?.role === "Project Manager";

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setProjects(data);
    } catch (error) {
      setMessage("Cannot connect to server");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: projectName,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Project created successfully");
      setProjectName("");
      setDescription("");
      fetchProjects();
    } catch (error) {
      setMessage("Cannot connect to server");
    }
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
          <h1>Projects</h1>
          <p>Create and manage software projects.</p>
        </div>

        {message && <p className="project-message">{message}</p>}

        {canCreateProject && (
          <div className="project-form-card">
            <h2>Create Project</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
              </div>

              <button className="primary-button" type="submit">
                Create Project
              </button>
            </form>
          </div>
        )}

        <div className="project-list">
          <h2>Project List</h2>

          {projects.length === 0 ? (
            <p>No projects available.</p>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <div className="project-card" key={project._id}>
                  <h3>
                    <Link to={`/projects/${project._id}`}>{project.name}</Link>
                  </h3>
                  <p>{project.description}</p>

                  {project.createdBy && (
                    <p>
                      <strong>Created by:</strong> {project.createdBy.name}
                    </p>
                  )}

                  <p>
                    <strong>Members:</strong> {project.members?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Projects;
