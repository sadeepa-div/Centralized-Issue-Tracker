import { Link } from 'react-router-dom'

function Dashboard() {
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
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Overview of your projects and issues.</p>
          </div>

          <button>Logout</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Issues</h3>
            <p>0</p>
          </div>

          <div className="stat-card">
            <h3>Open</h3>
            <p>0</p>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <p>0</p>
          </div>

          <div className="stat-card">
            <h3>Resolved</h3>
            <p>0</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Issues</h2>
          <p>No issues available yet.</p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard