import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Spinner } from './components/ui/Spinner'

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Theory = lazy(() => import('./pages/Theory').then((m) => ({ default: m.Theory })))
const AlgorithmRoute = lazy(() => import('./pages/AlgorithmRoute').then((m) => ({ default: m.AlgorithmRoute })))
const Playground = lazy(() => import('./pages/Playground').then((m) => ({ default: m.Playground })))
const Compare = lazy(() => import('./pages/Compare').then((m) => ({ default: m.Compare })))
const Mathematics = lazy(() => import('./pages/Mathematics').then((m) => ({ default: m.Mathematics })))
const Exercises = lazy(() => import('./pages/Exercises').then((m) => ({ default: m.Exercises })))
const Quizzes = lazy(() => import('./pages/Quizzes').then((m) => ({ default: m.Quizzes })))
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })))
const Docs = lazy(() => import('./pages/Docs').then((m) => ({ default: m.Docs })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--sp-7)' }}>
      <Spinner />
    </div>
  )
}

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="theory" element={<Theory />} />
          <Route path="algorithms/:id" element={<AlgorithmRoute />} />
          <Route path="playground" element={<Playground />} />
          <Route path="compare" element={<Compare />} />
          <Route path="mathematics" element={<Mathematics />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="settings" element={<Settings />} />
          <Route path="docs" element={<Docs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}