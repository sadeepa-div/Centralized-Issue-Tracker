import { useState } from 'react'

function CreateIssueForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')

  const handleSubmit = (event) => {
    event.preventDefault()

    console.log({
      title,
      description,
      priority
    })

    setTitle('')
    setDescription('')
    setPriority('Medium')
  }

  return (
    <div>
      <h2>Create Issue</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Issue Title</label>
          <br />

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Priority</label>
          <br />

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

        <br />

        <button type="submit">Create Issue</button>
      </form>
    </div>
  )
}

export default CreateIssueForm