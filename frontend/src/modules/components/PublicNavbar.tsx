import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, HeartHandshake } from "lucide-react";
import Button from "./ui/Button";

const PublicNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/", hash: null },
    { name: "Features", path: "/#features", hash: "features" },
    { name: "How It Works", path: "/#how-it-works", hash: "how-it-works" },
    { name: "Impact", path: "/#impact", hash: "impact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" && !location.hash;
    return (
      location.hash === path.replace("/#", "#") || location.pathname === path
    );
  };

  const handleNavClick = (e: React.MouseEvent, hash: string | null) => {
    if (hash) {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/#" + hash);
      } else {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <HeartHandshake className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900">FoodBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-primary-600"
                    : "text-gray-600 hover:text-primary-600"
                }`}
                onClick={(e) => handleNavClick(e, link.hash)}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium ${
                    isActive(link.path) ? "text-primary-600" : "text-gray-600"
                  }`}
                  onClick={(e) => handleNavClick(e, link.hash)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <Link to="/login" className="block">
                  <Button variant="ghost" className="cursor-pointer" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="block">
                  <Button variant="primary" fullWidth>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
