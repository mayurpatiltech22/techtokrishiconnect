import { SchemeCard } from "./SchemeCard";
import { Scroll } from "lucide-react";
import { motion } from "framer-motion";

export const SchemesSection = () => {
  const schemes = [
    {
      title: "PM-KISAN Samman Nidhi",
      department: "Central Govt",
      subsidy: "₹6,000/year",
      eligibility: [
        "All landholding farmers",
        "Family income less than ₹2 lakh/year",
        "Aadhaar card mandatory"
      ],
      deadline: "Open all year"
    },
    {
      title: "Pradhan Mantri Fasal Bima Yojana",
      department: "Agriculture Dept",
      subsidy: "Up to 90% premium",
      eligibility: [
        "All farmers growing notified crops",
        "Applicable for loanee and non-loanee farmers",
        "Valid land records required"
      ],
      deadline: "Before sowing season"
    },
    {
      title: "Maharashtra Drip Irrigation Scheme",
      department: "State Govt",
      subsidy: "80% subsidy",
      eligibility: [
        "Farmers with minimum 0.5 hectare land",
        "Maharashtra domicile",
        "Water source availability"
      ],
      deadline: "31 March 2024"
    },
    {
      title: "Soil Health Card Scheme",
      department: "Agriculture Dept",
      subsidy: "Free service",
      eligibility: [
        "All farmers",
        "Land ownership documents",
        "Valid contact information"
      ],
      deadline: "Ongoing"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Scroll className="h-4 w-4" />
            Government Schemes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Subsidies & Benefits</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access various subsidies and benefits available for Maharashtra farmers
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schemes.map((scheme, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SchemeCard {...scheme} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
