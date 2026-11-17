import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Record from './pages/Record'
import NotFound from './pages/NotFound'

// The workspace loads on demand so the public pages stay small.
const Shell = lazy(() => import('./pages/app/Shell'))
const Dashboard = lazy(() => import('./pages/app/Dashboard'))
const NewLot = lazy(() => import('./pages/app/NewLot'))
const LotPage = lazy(() => import('./pages/app/LotPage'))
const RequestPage = lazy(() => import('./pages/app/RequestPage'))
const Admin = lazy(() => import('./pages/admin/Admin'))

export default function App() {
  return (
    <Suspense fallback={<p className="loading">Loading…</p>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/r/:code" element={<Record />} />
        <Route path="/app" element={<Shell />}>
          <Route index element={<Dashboard />} />
          <Route path="lots/new" element={<NewLot />} />
          <Route path="lots/:id" element={<LotPage />} />
          <Route path="requests/:id" element={<RequestPage />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
