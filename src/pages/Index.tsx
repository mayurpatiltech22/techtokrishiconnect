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

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <StatsSection />
        <ServicesSection />
        
        <section id="weather" className="py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Updates</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real-time weather and market information at your fingertips
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherWidget />
              <MarketPrices />
            </div>
          </div>
        </section>

        <SchemesSection />
        <EquipmentSection />
        <TestimonialsSection />
        <FAQSection />
        
        <section className="py-16 bg-gradient-accent">
          <div className="container px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent-foreground">
              Join 25,000+ Maharashtra Farmers
            </h2>
            <p className="text-lg text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
              Start accessing better prices, connecting with labor groups, and staying informed today. Free registration for all farmers.
            </p>
            <button className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-elevated">
              Register Now - It's Free
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
