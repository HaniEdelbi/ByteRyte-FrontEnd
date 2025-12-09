
import React from "react";

const PlatformShowcase = () => {
  return (
    <section className="w-full pt-0 pb-8 sm:pb-12 bg-background" id="showcase">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 animate-on-scroll">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3 sm:mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Security Meets Simplicity
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            ByteRyte's intuitive interface makes managing hundreds of passwords effortless, 
            while military-grade encryption keeps them safe from any threat.
          </p>
        </div>
        
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-4xl animate-on-scroll border border-border">
          <div className="w-full bg-card">
            <img 
              src="/byteryte-uploads/Security.png" 
              alt="ByteRyte password wallet dashboard interface" 
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="bg-card p-4 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Enterprise-Grade Security for Everyone</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Built with zero-knowledge architecture and AES-256 encryption, ByteRyte ensures 
              that your passwords remain accessible only to you. Perfect for individuals, families, 
              and teams who demand the highest level of security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformShowcase;
