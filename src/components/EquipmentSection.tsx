import { EquipmentCard } from "./EquipmentCard";
import { Tractor } from "lucide-react";
import { motion } from "framer-motion";

export const EquipmentSection = () => {
  const equipment = [
    {
      name: "John Deere 5050D",
      image: "🚜",
      pricePerDay: "₹2,500",
      location: "Pune District",
      available: true,
      specifications: [
        "50 HP Engine",
        "4WD Capability",
        "Fuel efficient diesel"
      ]
    },
    {
      name: "Rotavator - 7 Feet",
      image: "🔧",
      pricePerDay: "₹800",
      location: "Nashik District",
      available: true,
      specifications: [
        "7 feet working width",
        "Heavy duty blades",
        "Suitable for hard soil"
      ]
    },
    {
      name: "Harvester Combine",
      image: "🌾",
      pricePerDay: "₹5,000",
      location: "Ahmednagar",
      available: false,
      specifications: [
        "Multi-crop harvesting",
        "10 feet cutting width",
        "High efficiency"
      ]
    },
    {
      name: "Seed Drill Machine",
      image: "🌱",
      pricePerDay: "₹600",
      location: "Solapur District",
      available: true,
      specifications: [
        "9-row planting",
        "Adjustable spacing",
        "Uniform seed depth"
      ]
    }
  ];

  return (
    <section id="equipment" className="py-20 md:py-28 bg-muted/30">
      <div className="container px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <Tractor className="h-4 w-4" />
            Equipment Rental
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Rent Farming Equipment</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Affordable equipment rental near you — tractors, harvesters, and farming tools
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipment.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <EquipmentCard {...item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
