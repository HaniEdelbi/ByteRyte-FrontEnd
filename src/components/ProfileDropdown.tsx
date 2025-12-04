import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Shield, ChevronDown, Monitor } from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setIsOpen(false);
        navigate('/');
      },
      onError: () => {
        setIsOpen(false);
        navigate('/');
      }
    });
  };

  if (!user) return null;

  // Get initials from user name
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getFirstName = (name?: string) => {
    if (!name) return 'User';
    return name.split(' ')[0];
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Profile menu"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {getInitials(user.name)}
        </div>
        <span className="hidden lg:inline-block text-sm font-medium text-foreground">
          {getFirstName(user.name)}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in slide-in-from-top-2">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-sm font-semibold text-foreground">{user.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email || ''}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/vault"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-muted transition-colors"
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">My Vault</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-muted transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Settings</span>
            </Link>

            <Link
              to="/sessions"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-muted transition-colors"
            >
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Sessions</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-muted transition-colors"
            >
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Profile</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-border py-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 w-full hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
