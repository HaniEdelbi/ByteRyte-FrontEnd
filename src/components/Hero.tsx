
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Shield, Lock, Key } from "lucide-react";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <section 
      className="overflow-hidden relative bg-gradient-to-br from-background via-background to-primary/5" 
      id="hero" 
      style={{
        padding: isMobile ? '100px 12px 60px' : '140px 20px 80px'
      }}
    >
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          <div className="w-full lg:w-1/2">
            <div 
              className="vault-chip mb-4 sm:mb-6 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.1s" }}
            >
              <Shield className="w-4 h-4 mr-2" />
              <span>Military-Grade Encryption</span>
            </div>
            
            <h1 
              className="section-title text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.3s" }}
            >
              Your Passwords,<br className="hidden sm:inline" />
              <span className="gradient-text">Secured Forever</span>
            </h1>
            
            <p 
              style={{ animationDelay: "0.5s" }} 
              className="section-subtitle mt-4 sm:mt-6 mb-6 sm:mb-10 leading-relaxed opacity-0 animate-fade-in text-muted-foreground text-lg sm:text-xl"
            >
              ByteRyte is your ultimate password wallet with zero-knowledge architecture. Store, generate, and autofill passwords across all devices with unbreakable encryption.
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.7s" }}
            >
              <a 
                href="#get-started" 
                className="button-primary flex items-center justify-center group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a 
                href="#features" 
                className="button-secondary flex items-center justify-center"
              >
                Learn More
              </a>
            </div>

            {/* Trust indicators */}
            <div 
              className="mt-8 sm:mt-12 flex flex-wrap gap-6 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.9s" }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">256-bit AES</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Zero-Knowledge</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Key className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">2FA Support</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
            <div 
              className="relative z-10 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.9s" }}
            >
              {/* Vault illustration */}
              <div className="relative mx-auto max-w-md">
                <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border animate-float">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse-glow">
                      <Shield className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  
                  {/* Mock password entries */}
                  <div className="space-y-3">
                    {['Google', 'GitHub', 'Netflix', 'Amazon'].map((site, i) => (
                      <div 
                        key={site}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                        style={{ animationDelay: `${1.1 + i * 0.1}s` }}
                      >
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{site[0]}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{site}</p>
                          <p className="text-xs text-muted-foreground">••••••••••••</p>
                        </div>
                        <Lock className="w-4 h-4 text-accent" />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground p-3 rounded-xl shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                  <Key className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-3 rounded-xl shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                  <Lock className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
