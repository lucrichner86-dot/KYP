import { Link } from 'react-router-dom'
import { LevelBadge, Wordmark } from './parts'
import { DEMO_CODE, DEMO_RECALLED_CODE, LEVELS, LEVEL_ORDER } from '../lib/format'

export default function Landing() {
  return (
    <div className="page">
      <header className="topbar">
        <Wordmark />
        <Link to="/app" className="quiet-link">Sign in</Link>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">Know Your Product</p>
          <h1>Know who stands behind every fact.</h1>
          <p className="lead">
            KYP is a verification layer for regulated goods, starting with cannabis. A code on the pack opens the record
            of that exact lot. Each fact on it names who stated it and how far it can be trusted: an accredited lab, an
            independent party, a track-and-trace system, or only the producer.
          </p>
          <div className="actions">
            <Link to={`/r/${DEMO_CODE}`} className="button">Open a demo record</Link>
            <Link to={`/r/${DEMO_RECALLED_CODE}`} className="button secondary">See a recalled lot</Link>
          </div>
          <p className="hint">The demo organisations and lots are invented.</p>
        </section>

        <section className="card">
          <h2>Five levels of assurance</h2>
          <ul className="level-list">
            {LEVEL_ORDER.map((level) => (
              <li key={level}>
                <LevelBadge level={level} />
                <span>{LEVELS[level].explain}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid-3">
          <div className="card">
            <h2>Know your business first</h2>
            <p>
              Every organisation is checked by KYP before it can publish or count as a third party. Accreditations are
              recorded only after KYP has seen them.
            </p>
          </div>
          <div className="card">
            <h2>Statements cannot be hidden</h2>
            <p>
              A lab's statement belongs to the lab. The producer cannot edit or remove it; only the lab can revoke it,
              and a revocation stays visible. A recall shows on every record at once.
            </p>
          </div>
          <div className="card">
            <h2>Built on real records</h2>
            <p>
              Events can come straight from track-and-trace systems. Identifiers and events follow GS1 and EPCIS
              patterns, so records can line up with the EU Digital Product Passport.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>KYP attests facts, not quality. It gives no medical advice and makes no statements about effects.</p>
      </footer>
    </div>
  )
}
