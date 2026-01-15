import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Users, Scroll, CloudRain, TrendingUp, Tractor, LucideIcon } from "lucide-react";

interface ServiceItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  link?: string;
  scrollTo?: string;
}

const ServiceItem = ({ icon: Icon, title, description, action, link, scrollTo }: ServiceItemProps) => {
  const handleClick = () => {
    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {link ? (
          <Button asChild className="w-full">
            <Link to={link}>{action}</Link>
          </Button>
        ) : (
          <Button className="w-full" onClick={handleClick}>
            {action}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const ServicesSection = () => {
  const services: ServiceItemProps[] = [
    {
      icon: Sprout,
      title: "Seeds & Fertilizers",
      description: "Get seeds and fertilizers directly from companies at lower prices without middlemen.",
      action: "Browse Products",
      link: "/products"
    },
    {
      icon: Users,
      title: "Labor Groups",
      description: "Connect with organized landless labor groups for all your farming needs.",
      action: "Find Workers",
      link: "/labor"
    },
    {
      icon: Scroll,
      title: "Government Schemes",
      description: "Access all Maharashtra farmer schemes and subsidies in one place.",
      action: "View Schemes",
      scrollTo: "schemes"
    },
    {
      icon: CloudRain,
      title: "Live Weather",
      description: "24/7 real-time weather updates and forecasts for your region.",
      action: "Check Weather",
      scrollTo: "weather"
    },
    {
      icon: TrendingUp,
      title: "Market Prices",
      description: "Live market prices for crops and produce across Maharashtra markets.",
      action: "View Prices",
      scrollTo: "market"
    },
    {
      icon: Tractor,
      title: "Equipment Rental",
      description: "Rent tractors and farming equipment at affordable rates nearby.",
      action: "Rent Equipment",
      link: "/equipment"
    }
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-gradient-hero">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions designed specifically for Maharashtra farmers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceItem key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};
