import { Link } from "react-router-dom";
import CreateIssueForm from "../components/CreateIssueForm";

function CreateIssue() {
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
          <h1>Create Issue</h1>
          <p>Report a new software issue or bug.</p>
        </div>

        <div className="issue-form-card">
          <CreateIssueForm />
        </div>
      </main>
    </div>
  );
}

export default CreateIssue;
