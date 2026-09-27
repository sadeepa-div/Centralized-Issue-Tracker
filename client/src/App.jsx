import Header from './components/Header'
import IssueStatus from './components/IssueStatus'
import './App.css'

function App() {
  return (
    <>
      <Header
        title="Centralized Issue & Bug Tracking System"
        description="Track and manage software issues in one place."
      />

      <IssueStatus />
    </>
  )
}

export default App