import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Issues() {
  const [issues, setIssues] = useState([])
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')

  const fetchIssues = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/issues',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setIssues(data)
    } catch (error) {
      setMessage('Cannot connect to server')
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2>Bug Tracker</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/issues">Issues</Link>
          <Link to="/create-issue">
            Create Issue
          </Link>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="page-header">
          <h1>Issues</h1>
          <p>
            View and manage reported issues.
          </p>
        </div>

        {message && (
          <p className="error-message">
            {message}
          </p>
        )}

        <div className="issues-table-container">
          {issues.length === 0 ? (
            <p>No issues available.</p>
          ) : (
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Project</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reporter</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id}>
                    <td>{issue.title}</td>

                    <td>
                      {issue.project?.name}
                    </td>

                    <td>{issue.type}</td>

                    <td>{issue.priority}</td>

                    <td>{issue.status}</td>

                    <td>
                      {issue.reporter?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

export default Issues