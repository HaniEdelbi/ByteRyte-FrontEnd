
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Shield } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToFeatures: true } });
    } else {
      const featuresSection = document.getElementById('features');
      featuresSection?.scrollIntoView({ behavior: 'smooth' });
    }
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
        navigate('/');
      },
      onError: () => {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
        navigate('/');
      }
    });
  };

  useEffect(() => {
    if (location.state?.scrollToFeatures) {
      setTimeout(() => {
        const featuresSection = document.getElementById('features');
        featuresSection?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);


  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          aria-label="ByteRyte"
        >
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            ByteRyte
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <a href="#features" onClick={handleFeaturesClick} className="nav-link cursor-pointer">Features</a>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/test" className="nav-link">Challenge</Link>
          
          {user ? (
            <ProfileDropdown />
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="nav-link">
                Sign Up
              </Link>
              <Link to="/login" className="button-primary text-sm py-2 px-4">
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-foreground p-3 focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 z-40 bg-background flex flex-col pt-16 px-6 md:hidden transition-all duration-300 ease-in-out",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        <nav className="flex flex-col space-y-6 items-center mt-8">
          <Link 
            to="/"
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-xl hover:bg-muted transition-colors" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Home
          </Link>
          <a 
            href="#features" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-xl hover:bg-muted transition-colors cursor-pointer" 
            onClick={handleFeaturesClick}
          >
            Features
          </a>
          <Link 
            to="/pricing" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-xl hover:bg-muted transition-colors" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Pricing
          </Link>
          <Link 
            to="/test" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-xl hover:bg-muted transition-colors" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Challenge
          </Link>

          {user ? (
            <>
              {/* User Info Section */}
              <div className="w-full py-4 px-6 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email || ''}</p>
                  </div>
                </div>
              </div>

              <Link 
                to="/vault" 
                className="text-xl font-medium py-3 px-6 w-full text-center rounded-xl hover:bg-muted transition-colors" 
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                My Vault
              </Link>

              <Link 
                to="/settings" 
                className="text-xl font-medium py-3 px-6 w-full text-center rounded-xl hover:bg-muted transition-colors" 
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                Settings
              </Link>

              <Link 
                to="/profile" 
                className="text-xl font-medium py-3 px-6 w-full text-center rounded-xl hover:bg-muted transition-colors" 
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                Profile
              </Link>

              <button 
                onClick={handleLogout}
                className="button-destructive w-full text-center mt-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-xl font-medium py-3 px-6 w-full text-center rounded-xl hover:bg-muted transition-colors" 
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                Sign Up
              </Link>
              <Link 
                to="/login" 
                className="button-primary w-full text-center mt-4" 
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
