import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { WeatherWidget } from "@/components/WeatherWidget";
import { MarketPrices } from "@/components/MarketPrices";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        
        <section id="weather" className="py-16 bg-background">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherWidget />
              <MarketPrices />
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-accent">
          <div className="container px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent-foreground">
              Join Thousands of Maharashtra Farmers
            </h2>
            <p className="text-lg text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
              Start accessing better prices, connecting with labor groups, and staying informed today.
            </p>
            <button className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Register Now
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
