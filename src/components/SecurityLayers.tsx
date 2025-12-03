
import React, { useEffect, useRef, useState } from "react";
import { Shield, Eye, Fingerprint } from "lucide-react";

const SecurityLayers = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ticking = useRef(false);

  const cardStyle = {
    height: '60vh',
    maxHeight: '600px',
    borderRadius: '24px',
    transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
    willChange: 'transform, opacity'
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          
          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const totalScrollDistance = viewportHeight * 2;
          
          let progress = 0;
          if (sectionRect.top <= 0) {
            progress = Math.min(1, Math.max(0, Math.abs(sectionRect.top) / totalScrollDistance));
          }
          
          if (progress >= 0.66) {
            setActiveCardIndex(2);
          } else if (progress >= 0.33) {
            setActiveCardIndex(1);
          } else {
            setActiveCardIndex(0);
          }
          
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const isFirstCardVisible = isIntersecting;
  const isSecondCardVisible = activeCardIndex >= 1;
  const isThirdCardVisible = activeCardIndex >= 2;

  return (
    <div 
      ref={sectionRef} 
      className="relative" 
      style={{ height: '300vh' }}
    >
      <section className="w-full h-screen py-10 md:py-16 sticky top-0 overflow-hidden bg-background" id="why-secure">
        <div className="container px-6 lg:px-8 mx-auto h-full flex flex-col">
          <div className="mb-2 md:mb-3">
            <div className="flex items-center gap-4 mb-2 md:mb-2 pt-8 sm:pt-6 md:pt-4">
              <div className="vault-chip opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground mr-2 text-xs font-bold">02</span>
                <span>Security</span>
              </div>
            </div>
            
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl mb-1 md:mb-2">
              Why Zero-Knowledge?
            </h2>
          </div>
          
          <div ref={cardsContainerRef} className="relative flex-1 perspective-1000">
            {/* First Card */}
            <div 
              className={`absolute inset-0 overflow-hidden shadow-2xl ${isFirstCardVisible ? 'animate-card-enter' : ''}`} 
              style={{
                ...cardStyle,
                zIndex: 10,
                transform: `translateY(${isFirstCardVisible ? '90px' : '200px'}) scale(0.9)`,
                opacity: isFirstCardVisible ? 1 : 0
              }}
            >
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary to-primary/70"></div>
              
              <div className="absolute top-4 right-4 z-20">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Zero-Knowledge</span>
                </div>
              </div>
              
              <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-center">
                <div className="max-w-lg">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Your data is encrypted before it leaves your device
                  </h3>
                </div>
              </div>
            </div>
            
            {/* Second Card */}
            <div 
              className={`absolute inset-0 overflow-hidden shadow-2xl ${isSecondCardVisible ? 'animate-card-enter' : ''}`} 
              style={{
                ...cardStyle,
                zIndex: 20,
                transform: `translateY(${isSecondCardVisible ? activeCardIndex === 1 ? '55px' : '45px' : '200px'}) scale(0.95)`,
                opacity: isSecondCardVisible ? 1 : 0,
                pointerEvents: isSecondCardVisible ? 'auto' : 'none'
              }}
            >
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-accent to-accent/70"></div>
              
              <div className="absolute top-4 right-4 z-20">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Privacy First</span>
                </div>
              </div>
              
              <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-center">
                <div className="max-w-lg">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    We can never see or access your passwords
                  </h3>
                </div>
              </div>
            </div>
            
            {/* Third Card */}
            <div 
              className={`absolute inset-0 overflow-hidden shadow-2xl ${isThirdCardVisible ? 'animate-card-enter' : ''}`} 
              style={{
                ...cardStyle,
                zIndex: 30,
                transform: `translateY(${isThirdCardVisible ? activeCardIndex === 2 ? '15px' : '0' : '200px'}) scale(1)`,
                opacity: isThirdCardVisible ? 1 : 0,
                pointerEvents: isThirdCardVisible ? 'auto' : 'none'
              }}
            >
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/80 to-accent/80"></div>
              
              <div className="absolute top-4 right-4 z-20">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  <Fingerprint className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Biometric Security</span>
                </div>
              </div>
              
              <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-center">
                <div className="max-w-lg">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold leading-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Unlock your vault with your fingerprint or face
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecurityLayers;
