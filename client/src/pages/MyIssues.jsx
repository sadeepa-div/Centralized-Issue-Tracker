import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API_BASE_URL from '../config/api'

function MyIssues() {
  const [issues, setIssues] = useState([])
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')

  const storedUser = localStorage.getItem('user')

  const user = storedUser
    ? JSON.parse(storedUser)
    : null

  const fetchMyIssues = async () => {
    try {
      const params = new URLSearchParams()

      if (user?.role === 'Developer') {
        params.append('assignee', user.id)
      }

      if (user?.role === 'Tester') {
        params.append('status', 'Testing')
      }

      const response = await fetch(
        `${API_BASE_URL}/issues?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
    fetchMyIssues()
  }, [])

  const getPageTitle = () => {
    if (user?.role === 'Developer') {
      return 'My Assigned Issues'
    }

    if (user?.role === 'Tester') {
      return 'Issues Ready for Testing'
    }

    return 'All Issues'
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
          <h1>{getPageTitle()}</h1>

          <p>
            Logged in as {user?.name} ({user?.role})
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
                  <th>Assignee</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id}>

                    <td>
                      <Link
                        to={`/issues/${issue._id}`}
                      >
                        {issue.title}
                      </Link>
                    </td>

                    <td>
                      {issue.project?.name}
                    </td>

                    <td>
                      {issue.type}
                    </td>

                    <td>
                      {issue.priority}
                    </td>

                    <td>
                      {issue.status}
                    </td>

                    <td>
                      {issue.assignee?.name ||
                        'Not Assigned'}
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

export default MyIssues
