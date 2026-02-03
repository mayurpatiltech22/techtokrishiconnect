import { motion } from "framer-motion";
import { Users, UsersRound, IndianRupee, Tractor } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    { value: "25,000+", label: "Registered Farmers", icon: Users },
    { value: "500+", label: "Labor Groups", icon: UsersRound },
    { value: "₹5 Cr+", label: "Savings Generated", icon: IndianRupee },
    { value: "1,200+", label: "Equipment Listed", icon: Tractor }
  ];

  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="container px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
                <stat.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-primary-foreground/80 text-sm md:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
