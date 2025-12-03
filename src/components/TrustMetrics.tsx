
import React from "react";
import { Check } from "lucide-react";

const TrustMetrics = () => {
  const stats = [
    { value: "256-bit", label: "AES Encryption" },
    { value: "100M+", label: "Passwords Protected" },
    { value: "99.99%", label: "Uptime" },
    { value: "0", label: "Data Breaches" },
  ];

  return (
    <section className="w-full py-12 sm:py-20 bg-card" id="specifications">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header with badge and line */}
        <div className="flex items-center gap-4 mb-10 sm:mb-16">
          <div className="flex items-center gap-4">
            <div className="vault-chip">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground mr-2 text-xs font-bold">3</span>
              <span>Trust</span>
            </div>
          </div>
          <div className="flex-1 h-[1px] bg-border"></div>
        </div>
        
        {/* Main statement */}
        <div className="max-w-4xl mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Stop reusing passwords. Stop writing them on sticky notes. 
            <span className="gradient-text"> Start living securely with ByteRyte.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            ByteRyte generates, stores, and autofills unique passwords for every account, 
            so you only need to remember one master password. Zero-knowledge encryption means not even we can see your data.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-muted/50 border border-border"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustMetrics;
