/**
 * Pricing Page
 * Displays pricing plans and features
 */

import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out ByteRyte",
      features: [
        "Store up to 50 passwords",
        "Basic password generator",
        "Single device access",
        "Email support",
        "Standard encryption"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$9.99",
      description: "For individuals who need more",
      features: [
        "Unlimited passwords",
        "Advanced password generator",
        "Sync across all devices",
        "Priority support",
        "Military-grade encryption",
        "Breach monitoring",
        "Secure file storage (1GB)",
        "Emergency access"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Family",
      price: "$19.99",
      description: "Protect your whole family",
      features: [
        "Everything in Pro",
        "Up to 6 family members",
        "Shared folders",
        "Family dashboard",
        "Individual vaults",
        "Secure file storage (5GB)",
        "Admin controls"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Business",
      price: "Custom",
      description: "For teams and organizations",
      features: [
        "Everything in Family",
        "Unlimited team members",
        "Advanced admin controls",
        "SSO integration",
        "Audit logs",
        "API access",
        "Dedicated support",
        "Custom security policies"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />
      
      {/* Header */}
      <div className="container mx-auto px-4 pt-32 pb-12 text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for you. All plans include a 30-day money-back guarantee.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col bg-card border rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in ${
                plan.popular 
                  ? 'border-primary shadow-xl shadow-primary/20 lg:scale-105' 
                  : 'border-border'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              
              <div className="text-center pb-4 p-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                </div>
              </div>

              <div className="flex-grow p-6 pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0">
                <button 
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90 text-white' 
                      : 'bg-accent hover:bg-accent/90 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/50 animate-fade-in">
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/50 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and wire transfers for Business plans.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! Pro and Family plans come with a 14-day free trial. No credit card required.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/50 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="font-semibold mb-2">How secure is my data?</h3>
              <p className="text-muted-foreground text-sm">
                All plans use zero-knowledge encryption, meaning we never have access to your unencrypted data. Your master password is never sent to our servers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg p-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Terms and Conditions</h2>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Subscription Terms</h3>
              <p>All subscriptions are billed monthly or annually based on your selected plan. You may cancel at any time, and your subscription will remain active until the end of your current billing period.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Money-Back Guarantee</h3>
              <p>We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team within 30 days of your initial purchase for a full refund.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Data Privacy</h3>
              <p>ByteRyte uses zero-knowledge encryption architecture. We cannot access your unencrypted data. You are solely responsible for remembering your master password.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">4. Service Availability</h3>
              <p>We strive to maintain 99.9% uptime. However, we reserve the right to perform scheduled maintenance with advance notice. We are not liable for any service interruptions beyond our control.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">5. Account Responsibility</h3>
              <p>You are responsible for maintaining the confidentiality of your account credentials. ByteRyte is not responsible for unauthorized access resulting from your failure to protect your credentials.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">6. Changes to Terms</h3>
              <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs">
                Last updated: December 3, 2025. For questions about our terms, please contact{" "}
                <a href="mailto:support@byteryte.com" className="text-primary hover:underline">
                  support@byteryte.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;