import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import slide1 from "@/assets/hero-mart-aisle.jpg";
import slide2 from "@/assets/hero-mart-flatlay.jpg";
import slide3 from "@/assets/hero-mart-cart.jpg";

const slides = [
  {
    eyebrow: "Everything in one place",
    title: "Your everyday mart, delivered.",
    subtitle: "Electronics, groceries, home, beauty and fashion — one cart, one checkout, free shipping over $60.",
    image: slide1,
    cta: { label: "Start shopping", to: "/shop" },
    alt: "Bright modern mart aisle full of products",
  },
  {
    eyebrow: "New season tech",
    title: "The latest tech, at fair prices.",
    subtitle: "Phones, laptops, headphones and accessories — handpicked and price-matched.",
    image: slide2,
    cta: { label: "Shop electronics", to: "/shop?cat=electronics" },
    alt: "Flatlay of modern lifestyle products and electronics",
  },
  {
    eyebrow: "Fresh every day",
    title: "Groceries, fresh to your door.",
    subtitle: "Dairy, bread, pantry staples and produce — restocked daily, delivered with care.",
    image: slide3,
    cta: { label: "Shop groceries", to: "/shop?cat=groceries" },
    alt: "Shopping cart full of groceries and household items",
  },
];

const HeroSlider = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const go = (n) => setI((n + slides.length) % slides.length);
  const s = slides[i];

  return (
    <section className="relative overflow-hidden bg-secondary/40">
      <div className="container relative grid lg:grid-cols-12 gap-10 lg:gap-16 pt-12 lg:pt-20 pb-16 lg:pb-24 items-center">
        <div className="lg:col-span-6 relative z-10">
          <div key={`t-${i}`} className="animate-fade-up">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">{s.eyebrow}</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-balance">
              {s.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg text-balance">{s.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7 h-12 bg-gradient-warm text-primary-foreground shadow-glow hover:opacity-95">
                <Link to={s.cta.to}>{s.cta.label} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7 h-12">
                <Link to="/about">About us</Link>
              </Button>
            </div>
            <div className="mt-12 flex gap-8 text-sm text-muted-foreground">
              <div><p className="font-display text-2xl text-foreground">10k+</p>Products</div>
              <div><p className="font-display text-2xl text-foreground">6</p>Departments</div>
              <div><p className="font-display text-2xl text-foreground">4.9★</p>Rating</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-elevated relative bg-muted">
            {slides.map((sl, idx) => (
              <img
                key={sl.image}
                src={sl.image}
                alt={sl.alt}
                width={1600}
                height={1200}
                loading={idx === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>

          <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-4 shadow-soft hidden md:block">
            <p className="text-xs text-muted-foreground">Now featured</p>
            <p className="font-display text-lg">{s.eyebrow}</p>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => go(i - 1)} aria-label="Previous slide" className="h-9 w-9 rounded-full bg-background/85 backdrop-blur border border-border flex items-center justify-center hover:bg-background transition-smooth">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => go(i + 1)} aria-label="Next slide" className="h-9 w-9 rounded-full bg-background/85 backdrop-blur border border-border flex items-center justify-center hover:bg-background transition-smooth">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex gap-1.5 justify-center lg:justify-start">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-4 bg-border hover:bg-muted-foreground/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
