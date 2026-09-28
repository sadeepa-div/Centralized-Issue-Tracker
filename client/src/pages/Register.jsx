import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Developer')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/dashboard')
    } catch (error) {
      setMessage('Cannot connect to server')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        {message && <p className="error-message">{message}</p>}

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