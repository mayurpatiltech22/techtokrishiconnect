import { ServiceCard } from "./ServiceCard";
import { Sprout, Users, Scroll, CloudRain, TrendingUp, Tractor } from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      icon: Sprout,
      title: "Seeds & Fertilizers",
      description: "Get seeds and fertilizers directly from companies at lower prices without middlemen.",
      action: "Browse Products"
    },
    {
      icon: Users,
      title: "Labor Groups",
      description: "Connect with organized landless labor groups for all your farming needs.",
      action: "Find Workers"
    },
    {
      icon: Scroll,
      title: "Government Schemes",
      description: "Access all Maharashtra farmer schemes and subsidies in one place.",
      action: "View Schemes"
    },
    {
      icon: CloudRain,
      title: "Live Weather",
      description: "24/7 real-time weather updates and forecasts for your region.",
      action: "Check Weather"
    },
    {
      icon: TrendingUp,
      title: "Market Prices",
      description: "Live market prices for crops and produce across Maharashtra markets.",
      action: "View Prices"
    },
    {
      icon: Tractor,
      title: "Equipment Rental",
      description: "Rent tractors and farming equipment at affordable rates nearby.",
      action: "Rent Equipment"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-hero">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions designed specifically for Maharashtra farmers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};
