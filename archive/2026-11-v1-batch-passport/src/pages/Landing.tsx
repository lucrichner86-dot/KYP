import { Link } from 'react-router-dom'
import Wordmark from './Wordmark'
import { DEMO_CODE, DEMO_RECALLED_CODE } from '../lib/format'

export default function Landing() {
  return (
    <div className="page">
      <header className="topbar">
        <Wordmark />
        <Link to="/office" className="quiet-link">
          Producer sign-in
        </Link>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">Know Your Product</p>
          <h1>Scan the pack. See the batch.</h1>
          <p className="lead">
            KYP is a product passport for medical cannabis. The code on a pack opens a page for that exact batch:
            what the laboratory measured, where it was grown, the steps it went through, and whether it has been
            recalled.
          </p>
          <div className="actions">
            <Link to={`/p/${DEMO_CODE}`} className="button">
              Open a demo passport
            </Link>
            <Link to={`/p/${DEMO_RECALLED_CODE}`} className="button secondary">
              See a recalled batch
            </Link>
          </div>
          <p className="hint">The demo batches are invented examples.</p>
        </section>

        <section className="grid-3">
          <div className="card">
            <h2>For patients</h2>
            <p>
              No app and no account. Scan the code with a phone camera and read the laboratory results, the
              certificate of analysis, the origin and the current status of your batch.
            </p>
          </div>
          <div className="card">
            <h2>For producers</h2>
            <p>
              Enter a batch with its laboratory results and journey, publish it, and print the code on the pack. If
              a batch is recalled, every passport for it says so at once.
            </p>
          </div>
          <div className="card">
            <h2>Facts only</h2>
            <p>
              A passport lists contents, test results, origin and status. It makes no statements about effects and
              gives no advice on use.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>KYP is a product of Cannavigia (Vigia AG).</p>
      </footer>
    </div>
  )
}
