const brands = [
  "TECHCRUNCH", "WIRED", "FORBES", "VOGUE", "GQ", "BLOOMBERG",
];

const Brands = () => (
  <section className="border-y border-border/60">
    <div className="container py-10">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">As featured in</p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        {brands.map((b) => (
          <span key={b} className="font-display text-xl md:text-2xl text-muted-foreground/60 tracking-tight">
            {b}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default Brands;
