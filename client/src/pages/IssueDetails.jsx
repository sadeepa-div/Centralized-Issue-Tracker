import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import API_BASE_URL from '../config/api'

function IssueDetails() {
  const { id } = useParams()

  const [issue, setIssue] = useState(null)
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')

  const [developers, setDevelopers] = useState([])
  const [assignee, setAssignee] = useState('')

  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')

  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  const canAssign = user?.role === 'Admin' || user?.role === 'Project Manager'

  const fetchIssue = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setIssue(data)
      setStatus(data.status)
      setAssignee(data.assignee?._id || '')
    } catch (error) {
      setMessage('Cannot connect to server')
    }
  }

  const fetchDevelopers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/developers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setDevelopers(data)
    } catch (error) {
      setMessage('Cannot connect to server')
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setComments(data)
    } catch (error) {
      setMessage('Cannot connect to server')
    }
  }

  useEffect(() => {
    fetchIssue()
    fetchComments()

    if (canAssign) {
      fetchDevelopers()
    }
  }, [id])

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setMessage('Issue status updated successfully')
      fetchIssue()
    } catch (error) {
      setMessage('Cannot connect to server')
    }
  }

  const handleAssignIssue = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${id}/assignee`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ assignee })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setMessage('Issue assigned successfully')
      fetchIssue()
    } catch (error) {
      setMessage('Cannot connect to server')
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()

    if (!commentText.trim()) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setCommentText('')
      fetchComments()
    } catch (error) {
      setMessage('Cannot connect to server')
    }
  }

  if (!issue) {
    return (
      <div className="dashboard-content">
        {message ? <p>{message}</p> : <p>Loading issue...</p>}
      </div>
    )
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
          <h1>Issue Details</h1>
          <Link to="/issues">Back to Issues</Link>
        </div>

        {message && <p className="error-message">{message}</p>}

        <div className="issue-detail-card">
          <h2>{issue.title}</h2>
          <p>{issue.description}</p>

          <div className="issue-meta-row">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Testing">Testing</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <button type="button" onClick={handleStatusUpdate}>Update Status</button>
          </div>

          {canAssign && (
            <div className="issue-meta-row">
              <span>Assignee</span>
              <select value={assignee} onChange={(event) => setAssignee(event.target.value)}>
                <option value="">Unassigned</option>
                {developers.map((developer) => (
                  <option key={developer._id} value={developer._id}>
                    {developer.name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleAssignIssue}>Assign</button>
            </div>
          )}
        </div>

        <div className="comment-section">
          <h3>Comments</h3>

          <form onSubmit={handleAddComment}>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Add a comment"
              required
            />
            <button type="submit">Add Comment</button>
          </form>

          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <strong>{comment.user?.name || 'User'}</strong>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default IssueDetails
