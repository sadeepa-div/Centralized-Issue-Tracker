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
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="Developer">Developer</option>
              <option value="Tester">Tester</option>
              <option value="Project Manager">Project Manager</option>
            </select>
          </div>

          <button className="auth-button" type="submit">
            Register
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register