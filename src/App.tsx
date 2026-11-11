import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import AppShell from './pages/app/AppShell'
import Home from './pages/app/Home'
import Overview from './pages/app/Overview'
import Streams from './pages/app/Streams'
import StreamDetail from './pages/app/StreamDetail'
import Editor from './pages/app/Editor'
import Library from './pages/app/Library'
import Publishing from './pages/app/Publishing'
import Settings from './pages/app/Settings'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <div className="backdrop" aria-hidden />
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Demo site: no real auth, so login and signup drop straight into the app */}
        <Route path="/login" element={<Navigate to="/app" replace />} />
        <Route path="/signup" element={<Navigate to="/app" replace />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="overview" element={<Overview />} />
          <Route path="streams" element={<Streams />} />
          <Route path="streams/:id" element={<StreamDetail />} />
          <Route path="editor/:clipId" element={<Editor />} />
          <Route path="library" element={<Library />} />
          <Route path="publishing" element={<Publishing />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  )
}
