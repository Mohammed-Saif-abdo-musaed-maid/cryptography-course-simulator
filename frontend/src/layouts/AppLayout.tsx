import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { Breadcrumbs } from './Breadcrumbs'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="app-content">
          <div className="container">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
        <footer className="app-footer">
          {`© ${new Date().getFullYear()} — Cryptography & Information Security Course Simulator`}
        </footer>
      </div>
    </div>
  )
}