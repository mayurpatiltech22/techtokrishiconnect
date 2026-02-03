import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Users, Scroll, CloudRain, TrendingUp, Tractor, LucideIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  link?: string;
  scrollTo?: string;
  index: number;
}

const ServiceItem = ({ icon: Icon, title, description, action, link, scrollTo, index }: ServiceItemProps) => {
  const handleClick = () => {
    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group h-full hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {link ? (
            <Button asChild variant="ghost" className="w-full justify-between group/btn hover:bg-primary/10">
              <Link to={link}>
                {action}
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" className="w-full justify-between group/btn hover:bg-primary/10" onClick={handleClick}>
              {action}
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const ServicesSection = () => {
  const services = [
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
    <section id="services" className="py-20 md:py-28 bg-muted/30">
      <div className="container px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Farming Solutions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed, designed specifically for Maharashtra farmers
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceItem key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
