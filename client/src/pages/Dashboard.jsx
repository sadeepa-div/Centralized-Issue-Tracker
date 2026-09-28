import { Link, useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    navigate('/login')
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
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>

            {user && (
              <p>
                Welcome, {user.name} ({user.role})
              </p>
            )}
          </div>

          <button onClick={handleLogout}>
            Logout
          </button>
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