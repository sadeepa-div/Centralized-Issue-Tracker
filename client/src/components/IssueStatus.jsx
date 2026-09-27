import { useState } from 'react'

function IssueStatus() {
  const [status, setStatus] = useState('Open')

  return (
    <div>
      <h2>Issue Status</h2>

      <p>Current Status: {status}</p>

      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Testing">Testing</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>
    </div>
  )
}

export default IssueStatus