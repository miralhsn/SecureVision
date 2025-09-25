import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search, LogIn, UserPlus } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const results = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Demo', path: '/workflow' },
    { label: 'About', path: '/about' },
  ].filter(r => r.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <span className="text-xl font-bold text-white">SecureVision</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white transition ${isActive ? 'text-white border-b-2 border-brand-500 pb-1' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white transition ${isActive ? 'text-white border-b-2 border-brand-500 pb-1' : ''}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/features"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white transition ${isActive ? 'text-white border-b-2 border-brand-500 pb-1' : ''}`
              }
            >
              Solutions
            </NavLink>
            <NavLink
              to="/workflow"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white transition ${isActive ? 'text-white border-b-2 border-brand-500 pb-1' : ''}`
              }
            >
              Demo
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-gray-300 hover:text-white transition ${isActive ? 'text-white border-b-2 border-brand-500 pb-1' : ''}`
              }
            >
              About
            </NavLink>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-300 hover:text-white transition">
                <Search className="h-5 w-5" />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-black/90 border border-white/10 rounded-lg p-2 backdrop-blur">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm outline-none"
                  />
                  {searchQuery && (
                    <div className="mt-2 max-h-48 overflow-auto">
                      {results.length === 0 ? (
                        <div className="text-xs text-white/60 px-2 py-1">No results</div>
                      ) : (
                        results.map(r => (
                          <NavLink key={r.path} to={r.path} onClick={() => setIsSearchOpen(false)} className="block px-2 py-1 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded">
                            {r.label}
                          </NavLink>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition hover-glow"
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/features"
                className="text-gray-300 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Use Cases
              </Link>
              <Link
                to="/workflow"
                className="text-gray-300 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Demo
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                <button className="p-2 text-gray-300 hover:text-white transition">
                  <Search className="h-5 w-5" />
                </button>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
