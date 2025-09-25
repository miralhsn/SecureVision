import { Outlet } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1220] to-black">
      <Navigation />
      <main className="relative z-0">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}


