
import React, { useState } from "react";
import { ArrowRight, Shield, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitted(true);
      setEmail("");
      setIsSubmitting(false);
      toast({
        title: "Welcome to ByteRyte!",
        description: "Check your email to get started."
      });
    }, 1000);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-primary to-primary/80" id="get-started">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Ready to Secure Your Digital Life?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of users who trust ByteRyte to protect their passwords. Start your free trial today.
          </p>

          {isSubmitted ? (
            <div className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl py-4 px-6 max-w-md mx-auto">
              <Check className="w-6 h-6 text-white" />
              <span className="text-white font-medium">Thanks! Check your email to get started.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? "..." : "Get Started"}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          <p className="text-sm text-white/60 mt-4">
            Free forever. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
