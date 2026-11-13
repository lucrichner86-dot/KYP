import { Link } from 'react-router-dom'
import Wordmark from './Wordmark'

export default function NotFound() {
  return (
    <div className="page narrow">
      <header className="topbar">
        <Wordmark />
      </header>
      <main className="card">
        <h1>Page not found</h1>
        <p>There is nothing at this address.</p>
        <p>
          <Link to="/">Go to the start page</Link>
        </p>
      </main>
    </div>
  )
}
