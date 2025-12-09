
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
    // Prevent background scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
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
    closeMenu();
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        closeMenu();
        navigate('/');
      },
      onError: () => {
        closeMenu();
        navigate('/');
      }
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

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
          {!user && <a href="#features" onClick={handleFeaturesClick} className="nav-link cursor-pointer">Features</a>}
          <Link to="/pricing" className="nav-link">Pricing</Link>
          {user && <Link to="/vault" className="nav-link">Vault</Link>}
          
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
      <div 
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            isMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={closeMenu}
        />
        
        {/* Sidebar */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-[80%] max-w-sm bg-background shadow-2xl transition-transform duration-300 ease-out overflow-y-auto",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Close button */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                ByteRyte
              </span>
            </div>
            <button 
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col p-4 space-y-2">
            {user && (
              <>
                {/* User Info Section */}
                <div className="mb-4 p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email || ''}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Link 
              to="/"
              className="text-base font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors" 
              onClick={closeMenu}
            >
              Home
            </Link>

            {!user && (
              <a 
                href="#features" 
                className="text-base font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors cursor-pointer" 
                onClick={handleFeaturesClick}
              >
                Features
              </a>
            )}

            <Link 
              to="/pricing" 
              className="text-base font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors" 
              onClick={closeMenu}
            >
              Pricing
            </Link>

            {user && (
              <>
                <div className="border-t border-border my-2"></div>
                
                <Link 
                  to="/vault" 
                  className="text-base font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors" 
                  onClick={closeMenu}
                >
                  My Vault
                </Link>

                <Link 
                  to="/settings" 
                  className="text-base font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors" 
                  onClick={closeMenu}
                >
                  Settings
                </Link>

                <Link 
                  to="/profile" 
                  className="text-base font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors" 
                  onClick={closeMenu}
                >
                  Profile
                </Link>

                <Link 
                  to="/sessions" 
                  className="text-base font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors" 
                  onClick={closeMenu}
                >
                  Sessions
                </Link>

                <div className="border-t border-border my-2"></div>

                <button 
                  onClick={handleLogout}
                  className="text-base font-medium py-3 px-4 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <div className="border-t border-border my-2"></div>
                
                <Link 
                  to="/login" 
                  className="text-base font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors" 
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
                
                <Link 
                  to="/login" 
                  className="button-primary text-center mt-2" 
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
