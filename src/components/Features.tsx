
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Key, Shield, Smartphone, Globe, Lock, Zap, RefreshCw, Users } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className={cn(
        "glass-card opacity-0 p-5 sm:p-6",
        "transition-all duration-300"
      )}
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <div className="rounded-xl bg-primary/10 w-12 h-12 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
      <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
    </div>
  );
};

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-fade-in");
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section className="py-12 sm:py-16 md:py-20 relative bg-background" id="features" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-10 sm:mb-16">
          <div className="vault-chip mx-auto mb-4 opacity-0 fade-in-element">
            <span>Features</span>
          </div>
          <h2 className="section-title mb-4 opacity-0 fade-in-element">
            Everything You Need for<br className="hidden sm:block" />
            <span className="gradient-text">Complete Password Security</span>
          </h2>
          <p className="section-subtitle mx-auto opacity-0 fade-in-element">
            Powerful features designed to keep your digital life secure and organized.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <FeatureCard
            icon={<Key className="w-6 h-6" />}
            title="Password Generator"
            description="Create strong, unique passwords with customizable length, characters, and complexity."
            index={0}
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Auto-Fill"
            description="Instantly fill login forms across websites and apps with a single click or tap."
            index={1}
          />
          <FeatureCard
            icon={<Smartphone className="w-6 h-6" />}
            title="Cross-Platform Sync"
            description="Access your vault from any device - desktop, mobile, or browser extension."
            index={2}
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Breach Monitoring"
            description="Get instant alerts if your credentials appear in known data breaches."
            index={3}
          />
          <FeatureCard
            icon={<Lock className="w-6 h-6" />}
            title="Secure Notes"
            description="Store sensitive documents, credit cards, and private notes with full encryption."
            index={4}
          />
          <FeatureCard
            icon={<RefreshCw className="w-6 h-6" />}
            title="Password Health"
            description="Identify weak, reused, or old passwords that need to be updated."
            index={5}
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Secure Sharing"
            description="Share passwords safely with family or team members without revealing them."
            index={6}
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="Emergency Access"
            description="Designate trusted contacts who can access your vault in emergencies."
            index={7}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
