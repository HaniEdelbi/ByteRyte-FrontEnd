import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ShieldAlert, Home, ArrowLeft, Lock } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="text-center z-10 px-4 max-w-2xl mx-auto">
        {/* Animated Icon */}
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative bg-card border-2 border-primary/30 rounded-full p-8 shadow-2xl">
            <ShieldAlert className="w-24 h-24 text-primary animate-bounce" strokeWidth={1.5} />
          </div>
        </div>

        {/* 404 Text with gradient */}
        <h1 
          className="text-8xl sm:text-9xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-fade-in"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          404
        </h1>
        
        {/* Error message */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
          Access Denied: Page Not Found
        </h2>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for has been encrypted beyond recognition or doesn't exist in our secure vault.
        </p>

        {/* Decorative lock icons */}
        <div className="flex justify-center gap-4 mb-8 opacity-20">
          <Lock className="w-6 h-6 animate-pulse" />
          <Lock className="w-6 h-6 animate-pulse delay-200" />
          <Lock className="w-6 h-6 animate-pulse delay-500" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-card border-2 border-border rounded-lg hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Go Back</span>
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Return Home</span>
          </button>
        </div>

        {/* Additional info */}
        <p className="mt-12 text-sm text-muted-foreground">
          Error Code: <span className="font-mono text-primary">404_NOT_FOUND</span>
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
