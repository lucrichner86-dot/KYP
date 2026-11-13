import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Passport from './pages/Passport'
import NotFound from './pages/NotFound'

// The back office is loaded on demand so the public pages stay small.
const Office = lazy(() => import('./pages/office/Office'))
const Dashboard = lazy(() => import('./pages/office/Dashboard'))
const NewBatch = lazy(() => import('./pages/office/NewBatch'))
const BatchPage = lazy(() => import('./pages/office/BatchPage'))

export default function App() {
  return (
    <Suspense fallback={<p className="loading">Loading…</p>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/p/:code" element={<Passport />} />
        <Route path="/office" element={<Office />}>
          <Route index element={<Dashboard />} />
          <Route path="batches/new" element={<NewBatch />} />
          <Route path="batches/:id" element={<BatchPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
