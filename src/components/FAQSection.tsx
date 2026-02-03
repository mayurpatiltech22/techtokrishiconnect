import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

export const FAQSection = () => {
  const faqs = [
    {
      question: "How do I get seeds and fertilizers at lower prices?",
      answer: "Register on our platform and browse products directly from company suppliers. By eliminating middlemen, we help you save 20-40% on your purchases. Simply select your products, place an order, and get delivery to your location."
    },
    {
      question: "How can I hire labor groups?",
      answer: "Go to the Labor Groups section, post your requirement with details like number of workers needed, duration, and location. Verified labor groups in your area will respond with their availability and rates. You can review their profiles and ratings before hiring."
    },
    {
      question: "Are the weather forecasts reliable?",
      answer: "Yes, we provide real-time weather data from IMD (India Meteorological Department) and other verified sources. Our 7-day forecasts are updated every 3 hours to help you plan your farming activities accurately."
    },
    {
      question: "How do I rent equipment?",
      answer: "Browse available equipment in your district, check specifications and daily rates. Select your preferred dates, make a booking request, and the equipment owner will confirm. Payment is processed securely through our platform."
    },
    {
      question: "How can I apply for government schemes?",
      answer: "Visit the Schemes section to browse all available programs. Each scheme shows eligibility criteria, required documents, and application deadlines. You can apply directly through our platform with your digital documents."
    },
    {
      question: "Is my data secure on this platform?",
      answer: "Absolutely. We use bank-grade encryption for all data. Your personal information, financial details, and documents are stored securely. We never share your data with third parties without your explicit consent."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our services
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background rounded-lg px-6 border-0 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5 font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
