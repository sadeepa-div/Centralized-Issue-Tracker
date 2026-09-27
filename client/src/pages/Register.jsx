import { useState } from 'react'
import { Link } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Developer')

  const handleSubmit = (event) => {
    event.preventDefault()

    console.log({
      name,
      email,
      password,
      role
    })
  }

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <br />

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Role</label>
          <br />

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="Developer">Developer</option>
            <option value="Tester">Tester</option>
            <option value="Project Manager">Project Manager</option>
          </select>
        </div>

        <br />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default Register