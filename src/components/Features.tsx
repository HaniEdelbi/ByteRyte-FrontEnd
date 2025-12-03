
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Key, Shield, Smartphone, Globe, Lock, Zap, RefreshCw, Users } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  expandedContent?: string;
  onHover?: (isHovered: boolean) => void;
}

const FeatureCard = ({ icon, title, description, index, expandedContent, onHover }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (cardRef.current && expandedContent) {
      // Set a 3-second delay before showing the expanded card
      hoverTimeoutRef.current = setTimeout(() => {
        const rect = cardRef.current!.getBoundingClientRect();
        setCardPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
        setIsHovered(true);
        setIsOpening(true);
        // Reset opening state after animation completes
        setTimeout(() => {
          setIsOpening(false);
        }, 300);
        onHover?.(true);
      }, 2000);
    }
  };

  const handleMouseLeave = () => {
    // Clear the timeout if user leaves before 3 seconds
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsHovered(false);
      setIsClosing(false);
      onHover?.(false);
    }, 200); // Match the animation duration
  };
  
  return (
    <>
      <div 
        ref={cardRef}
        className={cn(
          "glass-card opacity-0 p-5 sm:p-6",
          "transition-all duration-300",
          expandedContent && "cursor-pointer hover:scale-105"
        )}
        style={{ animationDelay: `${0.1 * index}s` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="rounded-xl bg-primary/10 w-12 h-12 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
        <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
      </div>

      {isHovered && expandedContent && createPortal(
        <div 
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300",
            isClosing ? "opacity-0" : "opacity-100"
          )}
        >
          {/* Backdrop with blur - clicking on it closes the modal */}
          <div 
            className="absolute inset-0 bg-background/40 backdrop-blur-sm cursor-pointer" 
            onClick={handleClose}
          />
          
          {/* Expanded card */}
          <div 
            className={cn(
              "glass-card p-8 max-w-md w-full mx-4 relative z-10 transition-all duration-300",
              isClosing && "opacity-0 scale-95",
              isOpening && "animate-in fade-in zoom-in",
              !isClosing && !isOpening && "opacity-100 scale-100"
            )}
            onMouseLeave={handleClose}
          >
            <div className="rounded-xl bg-primary/10 w-16 h-16 flex items-center justify-center text-primary mb-6">
              {icon}
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {title}
            </h3>
            <p className="text-muted-foreground text-base mb-4">{description}</p>
            <div className="border-t border-border/50 pt-4">
              <p className="text-foreground/90 text-sm leading-relaxed">{expandedContent}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
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
            expandedContent="Our advanced password generator uses cryptographically secure random number generation to create truly unpredictable passwords. Customize password length from 8 to 128 characters, choose character sets (uppercase, lowercase, numbers, symbols), avoid ambiguous characters, and even exclude specific characters. The generator includes a strength meter that provides real-time feedback on password quality, ensuring your accounts are protected with military-grade passwords."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Auto-Fill"
            description="Instantly fill login forms across websites and apps with a single click or tap."
            index={1}
            expandedContent="Save time and eliminate typing errors with intelligent auto-fill technology. ByteRyte automatically detects login forms, payment fields, and contact information across all your favorite websites and applications. Our browser extension integrates seamlessly with Chrome, Firefox, Safari, and Edge, while our mobile apps work with in-app browsers. Simply tap or click to fill credentials instantly. The auto-fill feature also supports multi-step login processes and can handle complex forms with multiple fields."
          />
          <FeatureCard
            icon={<Smartphone className="w-6 h-6" />}
            title="Cross-Platform Sync"
            description="Access your vault from any device - desktop, mobile, or browser extension."
            index={2}
            expandedContent="Your passwords are always with you, no matter which device you're using. ByteRyte syncs your vault in real-time across Windows, macOS, Linux, iOS, and Android devices. Install our browser extensions for Chrome, Firefox, Safari, and Edge for seamless web access. All synchronization uses end-to-end encryption, meaning your data is encrypted on your device before being transmitted. Changes made on one device appear instantly on all others, and offline access ensures you can retrieve passwords even without an internet connection."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Breach Monitoring"
            description="Get instant alerts if your credentials appear in known data breaches."
            index={3}
            expandedContent="Stay protected with continuous dark web monitoring and breach detection. ByteRyte scans billions of breached credentials from known data leaks and compares them against your stored passwords. If any of your credentials are found in a breach, you'll receive instant alerts via push notification, email, or in-app message. Our breach monitoring runs 24/7 and checks against newly discovered breaches in real-time. The system provides detailed information about each breach, including what data was exposed and recommended actions to secure your accounts."
          />
          <FeatureCard
            icon={<Lock className="w-6 h-6" />}
            title="Secure Notes"
            description="Store sensitive documents, credit cards, and private notes with full encryption."
            index={4}
            expandedContent="Beyond passwords, ByteRyte is your secure vault for all sensitive information. Store credit card details, bank account numbers, secure notes, passport information, software licenses, and confidential documents. Each item is encrypted with AES-256 encryption and can include attachments up to 100MB. Organize notes with tags and categories, add custom fields for any type of data, and use our secure note templates for common items like credit cards, IDs, and memberships. Rich text formatting lets you structure information clearly, and you can share specific notes securely with trusted contacts."
          />
          <FeatureCard
            icon={<RefreshCw className="w-6 h-6" />}
            title="Password Health"
            description="Identify weak, reused, or old passwords that need to be updated."
            index={5}
            expandedContent="Get a comprehensive security score for your password vault with actionable insights. ByteRyte's password health checker analyzes all your passwords and identifies weak, reused, or old credentials that put your accounts at risk. The security dashboard shows you which passwords are compromised in known breaches, which ones are too weak, and which are used across multiple sites. You'll also see passwords that haven't been changed in over a year. Each issue comes with a priority rating and one-click access to change the password, helping you maintain optimal security hygiene."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Secure Sharing"
            description="Share passwords safely with family or team members without revealing them."
            index={6}
            expandedContent="Share credentials securely without compromising security. ByteRyte allows you to share passwords, notes, and other vault items with family members, team members, or trusted friends without ever revealing the actual password. Recipients can use the credentials to log in, but the password itself remains hidden. You can grant different permission levels (view only, use, or full access), set expiration dates for shared items, and revoke access instantly at any time. All sharing is end-to-end encrypted, and you can see a complete audit trail of who accessed what and when."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="Emergency Access"
            description="Designate trusted contacts who can access your vault in emergencies."
            index={7}
            expandedContent="Ensure your loved ones can access important accounts and information in case of an emergency. With Emergency Access, you can designate trusted family members or friends who can request access to your vault during critical situations. You set a waiting period (from 24 hours to 30 days) during which you can deny the request if it's not legitimate. If you don't respond within the waiting period, the trusted contact gains access. This feature is perfect for estate planning, ensuring your family can access important accounts, financial information, and digital assets if something happens to you."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
