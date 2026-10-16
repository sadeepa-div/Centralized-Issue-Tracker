import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import Sidebar from "../components/Sidebar";
import { useToast } from "../context/ToastContext";

function Projects() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);

  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const canCreateProject =
    user?.role === "Admin" || user?.role === "Project Manager";

  // ===============================
  // FETCH PROJECTS
  // ===============================
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

  // ===============================
  // FETCH ISSUES
  // ===============================
  const fetchIssues = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues`, {
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

  // ===============================
  // LOAD DATA
  // ===============================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([fetchProjects(), fetchIssues()]);

      setLoading(false);
    };

    loadData();
  }, []);

  // ===============================
  // CREATE PROJECT
  // ===============================
  const handleCreateProject = async (event) => {
    event.preventDefault();

    if (!name.trim() || !description.trim()) {
      showToast("Project name and description are required", "error");

      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to create project", "error");

        return;
      }

      showToast("Project created successfully", "success");

      setName("");
      setDescription("");
      setShowCreateForm(false);

      fetchProjects();
    } catch (error) {
      showToast("Cannot connect to server", "error");
    }
  };

  // ===============================
  // PROJECT STATISTICS
  // ===============================
  const getProjectStats = (projectId) => {
    const projectIssues = issues.filter(
      (issue) =>
        issue.project?._id === projectId || issue.project === projectId,
    );

    const totalIssues = projectIssues.length;

    const completedIssues = projectIssues.filter(
      (issue) => issue.status === "Resolved" || issue.status === "Closed",
    ).length;

    const openIssues = projectIssues.filter(
      (issue) => issue.status !== "Resolved" && issue.status !== "Closed",
    ).length;

    const progress =
      totalIssues === 0 ? 0 : Math.round((completedIssues / totalIssues) * 100);

    return {
      totalIssues,
      completedIssues,
      openIssues,
      progress,
    };
  };

  // ===============================
  // SEARCH
  // ===============================
  const filteredProjects = projects.filter((project) => {
    const text = search.toLowerCase();

    return (
      project.name?.toLowerCase().includes(text) ||
      project.description?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        {/* HEADER */}
        <div className="projects-header">
          <div>
            <h1>Projects</h1>

            <p>Manage projects, members and project issues.</p>
          </div>

          {canCreateProject && (
            <button
              className="create-project-button"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Cancel" : "+ New Project"}
            </button>
          )}
        </div>

        {message && <p className="project-message">{message}</p>}

        {/* CREATE PROJECT */}
        {canCreateProject && showCreateForm && (
          <form className="modern-project-form" onSubmit={handleCreateProject}>
            <h2>Create New Project</h2>

            <div className="form-group">
              <label>Project Name</label>

              <input
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                placeholder="Enter project description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <button type="submit" className="primary-button">
              Create Project
            </button>
          </form>
        )}

        {/* TOP SUMMARY */}
        <div className="project-summary-grid">
          <div className="project-summary-card">
            <span>Total Projects</span>

            <strong>{projects.length}</strong>
          </div>

          <div className="project-summary-card">
            <span>Total Issues</span>

            <strong>{issues.length}</strong>
          </div>

          <div className="project-summary-card">
            <span>Completed Issues</span>

            <strong>
              {
                issues.filter(
                  (issue) =>
                    issue.status === "Resolved" || issue.status === "Closed",
                ).length
              }
            </strong>
          </div>
        </div>

        {/* SEARCH */}
        <div className="project-search">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <span>
            {filteredProjects.length} project
            {filteredProjects.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* PROJECTS */}
        {loading ? (
          <div className="projects-loading">
            <div className="loading-spinner"></div>

            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-projects">
            <h3>No Projects Found</h3>

            <p>No projects match your search.</p>
          </div>
        ) : (
          <div className="modern-project-grid">
            {filteredProjects.map((project) => {
              const stats = getProjectStats(project._id);

              return (
                <Link
                  to={`/projects/${project._id}`}
                  className="modern-project-card"
                  key={project._id}
                >
                  {/* CARD HEADER */}
                  <div className="project-card-header">
                    <div className="project-icon">
                      {project.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3>{project.name}</h3>

                      <span>Project</span>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="project-description">{project.description}</p>

                  {/* INFORMATION */}
                  <div className="project-card-stats">
                    <div>
                      <span>Members</span>

                      <strong>{project.members?.length || 0}</strong>
                    </div>

                    <div>
                      <span>Issues</span>

                      <strong>{stats.totalIssues}</strong>
                    </div>

                    <div>
                      <span>Open</span>

                      <strong>{stats.openIssues}</strong>
                    </div>
                  </div>

                  {/* PROGRESS */}
                  <div className="project-progress-section">
                    <div className="project-progress-heading">
                      <span>Project Progress</span>

                      <strong>{stats.progress}%</strong>
                    </div>

                    <div className="project-progress-track">
                      <div
                        className="project-progress-value"
                        style={{
                          width: `${stats.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="project-card-footer">
                    <span>{stats.completedIssues} completed</span>

                    <strong>View Project →</strong>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Projects;
