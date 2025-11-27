import { TestimonialCard } from "./TestimonialCard";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ramesh Patil",
      location: "Satara, Maharashtra",
      text: "Direct access to fertilizers at 30% lower price has saved me thousands. The platform is very easy to use.",
      rating: 5
    },
    {
      name: "Suresh Deshmukh",
      location: "Kolhapur, Maharashtra",
      text: "Found reliable labor groups within minutes. The weather updates help me plan my farming activities better.",
      rating: 5
    },
    {
      name: "Prakash Jadhav",
      location: "Pune, Maharashtra",
      text: "Equipment rental feature is excellent. Rented a tractor for harvest season at reasonable rates without any hassle.",
      rating: 5
    },
    {
      name: "Vijay Shinde",
      location: "Nashik, Maharashtra",
      text: "Market price updates are accurate and real-time. Helped me get better prices for my produce this season.",
      rating: 4
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Farmers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from farmers across Maharashtra
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
