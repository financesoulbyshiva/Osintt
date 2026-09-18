import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ToastProvider } from '@/components/ui/Toast'

const Home = lazy(() => import('@/pages/Home'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Investigations = lazy(() => import('@/pages/Investigations'))
const Workspace = lazy(() => import('@/pages/Workspace'))
const Search = lazy(() => import('@/pages/Search'))
const EntityList = lazy(() => import('@/pages/EntityList'))
const EntityDetail = lazy(() => import('@/pages/EntityDetail'))
const NetworkGraph = lazy(() => import('@/pages/NetworkGraph'))
const Reports = lazy(() => import('@/pages/Reports'))
const ReportDetail = lazy(() => import('@/pages/ReportDetail'))
const Watchlists = lazy(() => import('@/pages/Watchlists'))
const Activity = lazy(() => import('@/pages/Activity'))
const Settings = lazy(() => import('@/pages/Settings'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function PageFallback() {
  return (
    <div className="page stack">
      <div className="skeleton skeleton--title" style={{ width: 220 }} />
      <div className="skeleton skeleton--card" />
      <div className="skeleton skeleton--card" style={{ height: 220 }} />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investigations" element={<Investigations />} />
            <Route path="/investigations/:id" element={<Workspace />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/search" element={<Search />} />
            <Route path="/entities/:kind" element={<EntityList />} />
            <Route path="/entity/:id" element={<EntityDetail />} />
            <Route path="/graph" element={<NetworkGraph />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:id" element={<ReportDetail />} />
            <Route path="/watchlists" element={<Watchlists />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ToastProvider>
  )
}
