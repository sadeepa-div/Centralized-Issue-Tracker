import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from "../config/api";
import Sidebar from "../components/Sidebar";
import { useToast } from "../context/ToastContext";

function CreateIssue() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Bug");
  const [priority, setPriority] = useState("Medium");
  const [project, setProject] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ============================
  // FETCH PROJECTS
  // ============================
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to load projects", "error");

        return;
      }

      setProjects(data);
    } catch {
      showToast("Cannot load projects", "error");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ============================
  // VALIDATION
  // ============================
  const validateForm = () => {
    if (!title.trim()) {
      return "Issue title is required";
    }

    if (title.trim().length < 5) {
      return "Title must contain at least 5 characters";
    }

    if (!description.trim()) {
      return "Description is required";
    }

    if (description.trim().length < 10) {
      return "Description must contain at least 10 characters";
    }

    if (!project) {
      return "Please select a project";
    }

    return "";
  };

  // ============================
  // CREATE ISSUE
  // ============================
  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      showToast(validationMessage, "error");
      setMessage(validationMessage);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          type,
          priority,
          project,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to create issue", "error");

        return;
      }

      showToast("Issue created successfully", "success");

      if (data.issue?._id) {
        setTimeout(() => {
          navigate(`/issues/${data.issue._id}`);
        }, 500);
      } else {
        navigate("/issues");
      }
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("Bug");
    setPriority("Medium");
    setProject("");
    setMessage("");
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-content">
        {/* HEADER */}
        <div className="create-issue-header">
          <div>
            <h1>Create Issue</h1>

            <p>Report a bug, task or feature request.</p>
          </div>

          <button
            type="button"
            className="cancel-create-button"
            onClick={() => navigate("/issues")}
          >
            Cancel
          </button>
        </div>

        {message && <div className="create-issue-message">{message}</div>}

        <div className="create-issue-layout">
          {/* FORM */}
          <form className="modern-create-issue-form" onSubmit={handleSubmit}>
            {/* TITLE */}
            <div className="form-group">
              <div className="field-heading">
                <label>Issue Title</label>

                <span>{title.length}/100</span>
              </div>

              <input
                type="text"
                placeholder="Example: Login button does not work"
                value={title}
                maxLength={100}
                onChange={(event) => setTitle(event.target.value)}
              />

              <small>Give the issue a short and clear title.</small>
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <div className="field-heading">
                <label>Description</label>

                <span>{description.length}/1000</span>
              </div>

              <textarea
                placeholder="Describe what happened, what you expected, and any useful details..."
                value={description}
                maxLength={1000}
                onChange={(event) => setDescription(event.target.value)}
              />

              <small>
                Provide enough information for the team to understand the issue.
              </small>
            </div>

            {/* PROJECT */}
            <div className="form-group">
              <label>Project</label>

              <select
                value={project}
                onChange={(event) => setProject(event.target.value)}
              >
                <option value="">Select a project</option>

                {projects.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TYPE + PRIORITY */}
            <div className="create-form-grid">
              <div className="form-group">
                <label>Issue Type</label>

                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                >
                  <option value="Bug">Bug</option>

                  <option value="Task">Task</option>

                  <option value="Feature">Feature</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>

                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                >
                  <option value="Low">Low</option>

                  <option value="Medium">Medium</option>

                  <option value="High">High</option>

                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="create-form-actions">
              <button
                type="button"
                className="reset-button"
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </button>

              <button
                type="submit"
                className="create-submit-button"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Issue"}
              </button>
            </div>
          </form>

          {/* INFORMATION PANEL */}
          <aside className="create-issue-help">
            <h3>Creating a Good Issue</h3>

            <div className="issue-help-item">
              <strong>1. Clear title</strong>

              <p>Describe the main problem in a few words.</p>
            </div>

            <div className="issue-help-item">
              <strong>2. Good description</strong>

              <p>Explain the problem and expected result.</p>
            </div>

            <div className="issue-help-item">
              <strong>3. Correct priority</strong>

              <p>Use Critical only for serious problems.</p>
            </div>

            <div className="issue-help-item">
              <strong>4. Select project</strong>

              <p>Connect the issue with the correct project.</p>
            </div>

            <div className="issue-type-guide">
              <h4>Issue Types</h4>

              <p>
                <strong>Bug</strong>
                {" — "}
                Something is not working.
              </p>

              <p>
                <strong>Task</strong>
                {" — "}
                Work that needs to be completed.
              </p>

              <p>
                <strong>Feature</strong>
                {" — "}
                New functionality.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CreateIssue;
