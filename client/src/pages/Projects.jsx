import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Search } from "lucide-react";
import API_BASE_URL from "../config/api";
import Sidebar from "../components/Sidebar";
import { useToast } from "../context/ToastContext";

function Projects() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);

  const [search, setSearch] = useState("");
  const [summaryView, setSummaryView] = useState("projects");

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
    } catch {
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
    } catch {
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
    } catch {
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
  const matchingProjects = projects.filter((project) => {
    const text = search.toLowerCase();

    return (
      project.name?.toLowerCase().includes(text) ||
      project.description?.toLowerCase().includes(text)
    );
  });

  const filteredProjects =
    summaryView === "projects-with-issues"
      ? matchingProjects.filter(
          (project) => getProjectStats(project._id).totalIssues > 0,
        )
      : matchingProjects;

  const completedIssues = issues
    .filter(
      (issue) => issue.status === "Resolved" || issue.status === "Closed",
    )
    .filter((issue) => {
      const text = search.toLowerCase();
      return (
        issue.title?.toLowerCase().includes(text) ||
        issue.description?.toLowerCase().includes(text) ||
        issue.project?.name?.toLowerCase().includes(text)
      );
    });

  const completedIssueCount = issues.filter(
    (issue) => issue.status === "Resolved" || issue.status === "Closed",
  ).length;

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
          <button
            type="button"
            className={`project-summary-card ${
              summaryView === "projects" ? "active" : ""
            }`}
            onClick={() => setSummaryView("projects")}
            aria-pressed={summaryView === "projects"}
          >
            <span>Total Projects</span>

            <strong>{projects.length}</strong>
            <small>Show all projects</small>
          </button>

          <button
            type="button"
            className={`project-summary-card ${
              summaryView === "projects-with-issues" ? "active" : ""
            }`}
            onClick={() => setSummaryView("projects-with-issues")}
            aria-pressed={summaryView === "projects-with-issues"}
          >
            <span>Total Issues</span>

            <strong>{issues.length}</strong>
            <small>Show projects with issues</small>
          </button>

          <button
            type="button"
            className={`project-summary-card ${
              summaryView === "completed-issues" ? "active" : ""
            }`}
            onClick={() => setSummaryView("completed-issues")}
            aria-pressed={summaryView === "completed-issues"}
          >
            <span>Completed Issues</span>

            <strong>{completedIssueCount}</strong>
            <small>Show completed issues</small>
          </button>
        </div>

        {/* SEARCH */}
        <div className="project-search">
          <Search size={19} aria-hidden="true" />
          <input
            type="text"
            placeholder={
              summaryView === "completed-issues"
                ? "Search completed issues..."
                : "Search projects..."
            }
            aria-label={
              summaryView === "completed-issues"
                ? "Search completed issues"
                : "Search projects"
            }
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <span>
            {summaryView === "completed-issues"
              ? `${completedIssues.length} completed issue${
                  completedIssues.length === 1 ? "" : "s"
                }`
              : `${filteredProjects.length} project${
                  filteredProjects.length === 1 ? "" : "s"
                }`}
          </span>
        </div>

        {/* SUMMARY RESULTS */}
        {loading ? (
          <div className="projects-loading">
            <div className="loading-spinner"></div>

            <p>
              {summaryView === "completed-issues"
                ? "Loading issues..."
                : "Loading projects..."}
            </p>
          </div>
        ) : summaryView === "completed-issues" ? (
          completedIssues.length === 0 ? (
            <div className="empty-projects">
              <h3>No Completed Issues Found</h3>
              <p>
                {search
                  ? "No completed issues match your search."
                  : "There are no resolved or closed issues yet."}
              </p>
            </div>
          ) : (
            <div className="project-summary-issue-list">
              {completedIssues.map((issue) => (
                <Link
                  key={issue._id}
                  to={`/issues/${issue._id}`}
                  className="project-summary-issue-card"
                >
                  <div className="project-summary-issue-main">
                    <span className="type-badge">{issue.type}</span>
                    <h3>{issue.title}</h3>
                    <p>{issue.description}</p>
                  </div>
                  <div className="project-summary-issue-meta">
                    <span>{issue.project?.name || "No Project"}</span>
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
          )
        ) : filteredProjects.length === 0 ? (
          <div className="empty-projects">
            <h3>
              {summaryView === "projects-with-issues"
                ? "No Projects with Issues"
                : "No Projects Found"}
            </h3>

            <p>
              {summaryView === "projects-with-issues"
                ? "No projects with issues match your search."
                : "No projects match your search."}
            </p>
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
                      <FolderKanban size={22} aria-hidden="true" />
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
