import { Link } from 'react-router-dom'

// Placeholder for the KYP logo (see "Not done yet" in the README).
export default function Wordmark({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="wordmark" aria-label="KYP, Know Your Product">
      KYP
    </Link>
  )
}
