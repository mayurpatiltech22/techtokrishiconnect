import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { WeatherWidget } from "@/components/WeatherWidget";
import { MarketPrices } from "@/components/MarketPrices";
import { SchemesSection } from "@/components/SchemesSection";
import { EquipmentSection } from "@/components/EquipmentSection";
import { StatsSection } from "@/components/StatsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <StatsSection />
        <ServicesSection />
        
        <section id="weather" className="py-20 md:py-28 bg-background">
          <div className="container px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Real-Time Data
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Updates</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real-time weather and market information at your fingertips
              </p>
            </div>
            <div id="market" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WeatherWidget />
              <MarketPrices />
            </div>
          </div>
        </section>

        <div id="schemes">
          <SchemesSection />
        </div>
        <div id="equipment">
          <EquipmentSection />
        </div>
        <TestimonialsSection />
        <FAQSection />
        
        <section id="cta" className="py-20 md:py-28 bg-primary relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container px-4 text-center relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
              Join 25,000+ Maharashtra Farmers
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Start accessing better prices, connecting with labor groups, and staying informed today. Free registration for all farmers.
            </p>
            <Button 
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 shadow-elevated h-12 px-8 text-base"
            >
              <Link to="/auth">Register Now — It's Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

