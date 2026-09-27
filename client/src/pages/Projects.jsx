import { useState } from 'react'
import { Link } from 'react-router-dom'

function Projects() {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [projects, setProjects] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()

    const newProject = {
      id: Date.now(),
      name: projectName,
      description: description,
    }

    setProjects([...projects, newProject])

    setProjectName('')
    setDescription('')
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
        <div className="page-header">
          <div>
            <h1>Projects</h1>
            <p>Create and manage your software projects.</p>
          </div>
        </div>

        <div className="project-form-card">
          <h2>Create Project</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name</label>

              <input
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
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

            <button className="primary-button" type="submit">
              Create Project
            </button>
          </form>
        </div>

        <div className="project-list">
          <h2>Project List</h2>

          {projects.length === 0 ? (
            <p>No projects created yet.</p>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <div className="project-card" key={project.id}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Projects