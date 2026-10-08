import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../config/api'

function CreateIssueForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('Bug')
  const [priority, setPriority] = useState('Medium')
  const [project, setProject] = useState('')
  const [projects, setProjects] = useState([])
  const [message, setMessage] = useState('')

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          setMessage(data.message)
          return
        }

        setProjects(data)

        if (data.length > 0) {
          setProject(data[0]._id)
        }
      } catch (error) {
        setMessage('Cannot connect to server')
      }
    }

    fetchProjects()
  }, [token])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          type,
          priority,
          project
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setTitle('')
      setDescription('')
      setType('Bug')
      setPriority('Medium')
      navigate('/issues')
    } catch (error) {
      setMessage('Cannot connect to server')
    }
  }

  return (
    <div>
      <h2>Create Issue</h2>

      {message && <p className="error-message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Issue Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Project</label>
          <select
            value={project}
            onChange={(event) => setProject(event.target.value)}
            required
          >
            {projects.length === 0 ? (
              <option value="">No projects available</option>
            ) : (
              projects.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-group">
          <label>Issue Type</label>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="Bug">Bug</option>
            <option value="Task">Task</option>
            <option value="Feature">Feature</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <button className="primary-button" type="submit" disabled={!project}>
          Create Issue
        </button>
      </form>
    </div>
  )
}

export default CreateIssueForm
