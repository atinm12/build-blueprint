import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import { Header } from './components/ui'
import Home from './pages/Home'
import Library from './pages/Library'
import ProblemPage from './pages/ProblemPage'
import Validate from './pages/Validate'
import Shortlist from './pages/Shortlist'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/:industry" element={<Library />} />
              <Route path="/problem/:id" element={<ProblemPage />} />
              <Route path="/validate" element={<Validate />} />
              <Route path="/shortlist" element={<Shortlist />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
            Build Blueprint · Research via OpenAlex · News via GDELT · Always read the original source before citing it
          </footer>
        </div>
      </HashRouter>
    </StoreProvider>
  )
}
