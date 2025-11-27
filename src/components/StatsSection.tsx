export const StatsSection = () => {
  const stats = [
    { value: "25,000+", label: "Registered Farmers" },
    { value: "500+", label: "Labor Groups" },
    { value: "₹5 Cr+", label: "Savings Generated" },
    { value: "1,200+", label: "Equipment Listed" }
  ];

  return (
    <section className="py-16 bg-gradient-primary">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </p>
              <p className="text-primary-foreground/90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
