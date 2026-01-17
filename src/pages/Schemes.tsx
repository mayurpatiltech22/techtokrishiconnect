import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Scroll, Search, ExternalLink, Users, Tractor, Landmark, FileText, IndianRupee } from "lucide-react";

interface Scheme {
  id: string;
  title: string;
  department: string;
  subsidy: string;
  eligibility: string[];
  deadline: string;
  description: string;
  category: "farmer" | "labor";
  applyUrl: string;
  documents: string[];
  benefits: string[];
}

const schemes: Scheme[] = [
  // Farmer Schemes
  {
    id: "pm-kisan",
    title: "PM-KISAN Samman Nidhi",
    department: "Ministry of Agriculture",
    subsidy: "₹6,000/year",
    eligibility: [
      "All landholding farmers",
      "Family income less than ₹2 lakh/year",
      "Aadhaar card mandatory",
      "Valid bank account linked with Aadhaar"
    ],
    deadline: "Open all year",
    description: "Direct income support of ₹6,000 per year to all farmer families across the country, paid in three equal instalments of ₹2,000 each.",
    category: "farmer",
    applyUrl: "https://pmkisan.gov.in/",
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook", "Mobile Number"],
    benefits: ["₹2,000 every 4 months", "Direct bank transfer", "No intermediaries"]
  },
  {
    id: "pmfby",
    title: "Pradhan Mantri Fasal Bima Yojana",
    department: "Ministry of Agriculture",
    subsidy: "Up to 90% premium subsidy",
    eligibility: [
      "All farmers growing notified crops",
      "Loanee and non-loanee farmers",
      "Valid land records required",
      "Crop sown in notified area"
    ],
    deadline: "Before sowing season",
    description: "Comprehensive crop insurance scheme providing financial support to farmers in case of crop failure due to natural calamities, pests, and diseases.",
    category: "farmer",
    applyUrl: "https://pmfby.gov.in/",
    documents: ["Land Records", "Sowing Certificate", "Bank Account", "Aadhaar Card"],
    benefits: ["Low premium rates", "Full sum insured", "Quick claim settlement"]
  },
  {
    id: "drip-irrigation",
    title: "Pradhan Mantri Krishi Sinchai Yojana",
    department: "Ministry of Agriculture",
    subsidy: "55-75% subsidy",
    eligibility: [
      "Farmers with minimum 0.5 hectare land",
      "Valid land ownership documents",
      "Water source availability",
      "No pending dues on previous subsidy"
    ],
    deadline: "Ongoing",
    description: "Promotes efficient water use through micro-irrigation including drip and sprinkler systems, reducing water wastage and improving crop yield.",
    category: "farmer",
    applyUrl: "https://pmksy.gov.in/",
    documents: ["Land Records", "Water Source Proof", "Quotation from Supplier", "Aadhaar Card"],
    benefits: ["Reduced water consumption", "Higher crop yield", "Lower electricity costs"]
  },
  {
    id: "soil-health",
    title: "Soil Health Card Scheme",
    department: "Ministry of Agriculture",
    subsidy: "Free service",
    eligibility: [
      "All farmers",
      "Land ownership documents",
      "Valid contact information",
      "Willingness to adopt recommendations"
    ],
    deadline: "Ongoing",
    description: "Provides soil health cards to farmers with crop-wise nutrient recommendations, helping them use appropriate fertilizers for better productivity.",
    category: "farmer",
    applyUrl: "https://soilhealth.dac.gov.in/",
    documents: ["Land Details", "Contact Information", "Location Coordinates"],
    benefits: ["Free soil testing", "Nutrient recommendations", "Improved crop planning"]
  },
  {
    id: "kcc",
    title: "Kisan Credit Card (KCC)",
    department: "Ministry of Finance",
    subsidy: "4% interest subvention",
    eligibility: [
      "All farmers - owner cultivators",
      "Tenant farmers with valid documents",
      "Share croppers and oral lessees",
      "Self-help groups of farmers"
    ],
    deadline: "Open all year",
    description: "Provides farmers with affordable credit for agricultural and allied activities, including fisheries and animal husbandry, at subsidized interest rates.",
    category: "farmer",
    applyUrl: "https://www.pmkisan.gov.in/kcc/",
    documents: ["Land Records", "Identity Proof", "Address Proof", "Passport Photo"],
    benefits: ["Low interest rate", "Flexible repayment", "Crop insurance included"]
  },
  {
    id: "e-nam",
    title: "National Agriculture Market (e-NAM)",
    department: "Ministry of Agriculture",
    subsidy: "Free platform",
    eligibility: [
      "All farmers with produce to sell",
      "Valid identity proof",
      "Bank account for payment",
      "Mobile number for OTP"
    ],
    deadline: "Open all year",
    description: "Pan-India electronic trading portal linking existing APMC mandis to create a unified national market for agricultural commodities.",
    category: "farmer",
    applyUrl: "https://enam.gov.in/",
    documents: ["Aadhaar Card", "Bank Details", "Mobile Number", "Produce Details"],
    benefits: ["Better price discovery", "Transparent trading", "Direct payment"]
  },
  {
    id: "pkvy",
    title: "Paramparagat Krishi Vikas Yojana",
    department: "Ministry of Agriculture",
    subsidy: "₹50,000/hectare",
    eligibility: [
      "Groups of 50+ farmers",
      "Minimum 50 hectare cluster",
      "Commitment to organic farming",
      "No chemical farming for 3 years"
    ],
    deadline: "Ongoing",
    description: "Promotes organic farming through cluster approach, providing support for inputs, certification, and marketing of organic produce.",
    category: "farmer",
    applyUrl: "https://pgsindia-ncof.gov.in/",
    documents: ["Group Formation Papers", "Land Records", "Organic Plan", "Bank Account"],
    benefits: ["Organic certification", "Premium prices", "Training support"]
  },
  {
    id: "agri-infra",
    title: "Agriculture Infrastructure Fund",
    department: "Ministry of Agriculture",
    subsidy: "3% interest subvention",
    eligibility: [
      "Farmers and FPOs",
      "Agri-entrepreneurs",
      "State agencies",
      "Viable project proposal"
    ],
    deadline: "Until 2032-33",
    description: "Financing facility for post-harvest management and community farming assets, offering medium to long-term debt financing.",
    category: "farmer",
    applyUrl: "https://agriinfra.dac.gov.in/",
    documents: ["Project Report", "Land Documents", "Identity Proof", "Financial Statements"],
    benefits: ["Long repayment tenure", "Credit guarantee", "Online application"]
  },
  // Labor Schemes
  {
    id: "mgnrega",
    title: "MGNREGA (Mahatma Gandhi NREGA)",
    department: "Ministry of Rural Development",
    subsidy: "₹230-300/day wages",
    eligibility: [
      "Any adult member of rural household",
      "Willing to do unskilled manual work",
      "Job card holder",
      "Resident of gram panchayat"
    ],
    deadline: "Open all year",
    description: "Guarantees 100 days of wage employment per year to rural households willing to do unskilled manual work, with special focus on agriculture-related activities.",
    category: "labor",
    applyUrl: "https://nrega.nic.in/",
    documents: ["Job Card", "Aadhaar Card", "Bank Account", "Photo"],
    benefits: ["Guaranteed 100 days work", "Minimum wages", "Unemployment allowance"]
  },
  {
    id: "pmsby",
    title: "Pradhan Mantri Suraksha Bima Yojana",
    department: "Ministry of Finance",
    subsidy: "₹12/year premium",
    eligibility: [
      "Age 18-70 years",
      "Bank account holder",
      "Aadhaar linked to bank",
      "Valid mobile number"
    ],
    deadline: "Renewal by May 31",
    description: "Accident insurance scheme offering coverage of ₹2 lakh for accidental death and full disability, and ₹1 lakh for partial disability.",
    category: "labor",
    applyUrl: "https://www.jansuraksha.gov.in/",
    documents: ["Aadhaar Card", "Bank Passbook", "Consent Form"],
    benefits: ["Low premium", "₹2 lakh coverage", "Auto-renewal option"]
  },
  {
    id: "pmjjby",
    title: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    department: "Ministry of Finance",
    subsidy: "₹436/year premium",
    eligibility: [
      "Age 18-50 years",
      "Bank account holder",
      "Aadhaar linked to bank",
      "One bank account only"
    ],
    deadline: "Renewal by May 31",
    description: "Life insurance scheme providing life cover of ₹2 lakh in case of death due to any reason, available at minimal premium.",
    category: "labor",
    applyUrl: "https://www.jansuraksha.gov.in/",
    documents: ["Aadhaar Card", "Bank Passbook", "Consent Form", "Nominee Details"],
    benefits: ["Affordable life cover", "Simple enrollment", "₹2 lakh coverage"]
  },
  {
    id: "pmuy",
    title: "Pradhan Mantri Ujjwala Yojana",
    department: "Ministry of Petroleum",
    subsidy: "Free LPG connection",
    eligibility: [
      "BPL household",
      "Women above 18 years",
      "No existing LPG connection",
      "Valid BPL card/ration card"
    ],
    deadline: "Ongoing",
    description: "Provides free LPG connections to rural and poor households, improving health and reducing dependence on traditional cooking fuels.",
    category: "labor",
    applyUrl: "https://www.pmuy.gov.in/",
    documents: ["BPL Card", "Aadhaar Card", "Passport Photo", "Bank Account"],
    benefits: ["Free LPG connection", "First refill free", "Subsidized cylinders"]
  },
  {
    id: "pmay",
    title: "Pradhan Mantri Awas Yojana - Gramin",
    department: "Ministry of Rural Development",
    subsidy: "₹1.2-1.3 lakh",
    eligibility: [
      "Houseless or living in kutcha house",
      "No pucca house in family",
      "Not received housing benefit before",
      "SECC 2011 eligible"
    ],
    deadline: "Ongoing",
    description: "Provides financial assistance for construction of pucca houses with basic amenities to all houseless and those living in kutcha/dilapidated houses.",
    category: "labor",
    applyUrl: "https://pmayg.nic.in/",
    documents: ["SECC Inclusion Letter", "Aadhaar Card", "Bank Account", "Land Documents"],
    benefits: ["Cash assistance", "Technical support", "Toilet construction included"]
  },
  {
    id: "skill-india",
    title: "Pradhan Mantri Kaushal Vikas Yojana",
    department: "Ministry of Skill Development",
    subsidy: "Free training + certification",
    eligibility: [
      "Indian citizen",
      "Age 15-45 years",
      "Unemployed or underemployed",
      "Basic education preferred"
    ],
    deadline: "Ongoing",
    description: "Skill development initiative providing industry-relevant training and certification to youth, including agriculture and allied sector skills.",
    category: "labor",
    applyUrl: "https://pmkvyofficial.org/",
    documents: ["Aadhaar Card", "Education Certificate", "Photo", "Bank Account"],
    benefits: ["Free training", "Industry certification", "Placement assistance"]
  },
  {
    id: "esic",
    title: "ESIC (Employees' State Insurance)",
    department: "Ministry of Labour",
    subsidy: "Medical + cash benefits",
    eligibility: [
      "Employees earning up to ₹21,000/month",
      "Working in covered establishment",
      "Employer contribution mandatory",
      "Family members covered"
    ],
    deadline: "Ongoing",
    description: "Comprehensive social security scheme providing medical care, sickness benefits, maternity benefits, and more to organized sector workers.",
    category: "labor",
    applyUrl: "https://www.esic.nic.in/",
    documents: ["Aadhaar Card", "Salary Slip", "Employer Letter", "Photo"],
    benefits: ["Free medical care", "Sickness benefit", "Maternity benefit"]
  },
  {
    id: "epfo",
    title: "Employees' Provident Fund",
    department: "Ministry of Labour",
    subsidy: "Employer matching contribution",
    eligibility: [
      "Employees in establishments with 20+ workers",
      "Monthly wage up to ₹15,000",
      "UAN registration",
      "Aadhaar linked"
    ],
    deadline: "Ongoing",
    description: "Retirement savings scheme where employees contribute 12% of salary matched by employer, providing pension and insurance benefits.",
    category: "labor",
    applyUrl: "https://www.epfindia.gov.in/",
    documents: ["Aadhaar Card", "PAN Card", "Bank Account", "Employer Details"],
    benefits: ["Retirement corpus", "Pension benefits", "Life insurance"]
  }
];

const Schemes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = 
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeTab === "all" || scheme.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });

  const farmerSchemes = filteredSchemes.filter(s => s.category === "farmer");
  const laborSchemes = filteredSchemes.filter(s => s.category === "labor");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-accent/10 to-background py-12 md:py-20">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Scroll className="h-10 w-10 text-primary" />
                <h1 className="text-3xl md:text-5xl font-bold">Government Schemes</h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Explore and apply for various central and state government schemes designed for farmers and agricultural laborers. Get direct access to official portals.
              </p>
              
              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search schemes by name, department, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-b">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Tractor className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold">{farmerSchemes.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Farmer Schemes</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold">{laborSchemes.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Labor Schemes</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Landmark className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold">10+</span>
                </div>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <IndianRupee className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold">₹1Cr+</span>
                </div>
                <p className="text-sm text-muted-foreground">Benefits Available</p>
              </div>
            </div>
          </div>
        </section>

        {/* Schemes List */}
        <section className="py-12">
          <div className="container px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                <TabsTrigger value="all">All Schemes</TabsTrigger>
                <TabsTrigger value="farmer">For Farmers</TabsTrigger>
                <TabsTrigger value="labor">For Laborers</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSchemes.map((scheme) => (
                    <SchemeCardFull key={scheme.id} scheme={scheme} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="farmer" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {farmerSchemes.map((scheme) => (
                    <SchemeCardFull key={scheme.id} scheme={scheme} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="labor" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {laborSchemes.map((scheme) => (
                    <SchemeCardFull key={scheme.id} scheme={scheme} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {filteredSchemes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No schemes found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const SchemeCardFull = ({ scheme }: { scheme: Scheme }) => {
  return (
    <Card className="h-full border-2 hover:shadow-elevated transition-all flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={scheme.category === "farmer" ? "default" : "secondary"}>
            {scheme.category === "farmer" ? "Farmer" : "Labor"}
          </Badge>
          <Badge variant="outline" className="border-primary text-primary shrink-0">
            {scheme.subsidy}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight">{scheme.title}</CardTitle>
        <CardDescription className="text-sm">
          {scheme.department} • {scheme.deadline}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {scheme.description}
        </p>
        
        <div className="space-y-3 mb-4 flex-1">
          <div>
            <p className="font-semibold text-sm mb-2">Eligibility:</p>
            <ul className="space-y-1.5">
              {scheme.eligibility.slice(0, 3).map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="font-semibold text-sm mb-2">Key Benefits:</p>
            <div className="flex flex-wrap gap-1.5">
              {scheme.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-gradient-primary mt-auto" 
          asChild
        >
          <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer">
            Apply Now
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default Schemes;
