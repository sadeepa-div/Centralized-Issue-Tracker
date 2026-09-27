import { Link } from 'react-router-dom'

function Issues() {
  const issues = [
    {
      id: 1,
      title: 'Login button not working',
      priority: 'High',
      status: 'Open',
      project: 'E-Commerce Website',
    },
    {
      id: 2,
      title: 'Dashboard loading slowly',
      priority: 'Medium',
      status: 'In Progress',
      project: 'E-Commerce Website',
    },
  ]

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
        <div className="page-header">
          <h1>Issues</h1>
          <p>View and manage reported issues.</p>
        </div>

        <div className="issues-table-container">
          <table className="issues-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.title}</td>
                  <td>{issue.project}</td>
                  <td>{issue.priority}</td>
                  <td>{issue.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Issues