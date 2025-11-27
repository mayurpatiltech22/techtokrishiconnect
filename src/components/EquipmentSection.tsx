import { EquipmentCard } from "./EquipmentCard";
import { Tractor } from "lucide-react";

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
    <section id="equipment" className="py-16 md:py-24 bg-gradient-hero">
      <div className="container px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Tractor className="h-8 w-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">Rent Equipment</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Affordable equipment rental near you - tractors, harvesters, and farming tools
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipment.map((item, index) => (
            <EquipmentCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};
