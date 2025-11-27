import { SchemeCard } from "./SchemeCard";
import { Scroll } from "lucide-react";

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
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scroll className="h-8 w-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">Government Schemes</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access various subsidies and benefits available for Maharashtra farmers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schemes.map((scheme, index) => (
            <SchemeCard key={index} {...scheme} />
          ))}
        </div>
      </div>
    </section>
  );
};
