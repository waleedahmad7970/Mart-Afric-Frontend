import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";
import hero from "@/assets/hero-mart-aisle.jpg";
import flatlay from "@/assets/hero-mart-flatlay.jpg";
import cart from "@/assets/hero-mart-cart.jpg";
import { Button } from "@/components/ui/button";

const stats = [
  { n: "10k+", l: "Products in stock" },
  { n: "6", l: "Departments" },
  { n: "50k", l: "Happy shoppers" },
  { n: "4.9★", l: "Customer rating" },
];

const values = [
  {
    icon: Sparkles,
    t: "Everything in one cart",
    d: "From a smartphone to a loaf of bread — one checkout, one delivery.",
  },
  {
    icon: Truck,
    t: "Fast delivery",
    d: "Free shipping on orders over $60. Same-day in select cities.",
  },
  {
    icon: ShieldCheck,
    t: "30-day returns",
    d: "Not in love with it? Return it within 30 days, no questions asked.",
  },
  {
    icon: HeartHandshake,
    t: "Best price promise",
    d: "See it cheaper elsewhere? We'll match the price.",
  },
];

const team = [
  { name: "Aisha Khan", role: "Founder · CEO" },
  { name: "Daniel Roy", role: "Head of Operations" },
  { name: "Maya Lee", role: "Head of Merchandising" },
  { name: "Omar Diallo", role: "Customer Experience" },
];

const About = () => (
  <div>
    <section className="container py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">
          Our story
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-balance">
          One mart for <em className="not-italic text-primary">everything</em>{" "}
          you need.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground text-balance">
          Mart Afric started with a simple idea: shopping for the things you
          need every day shouldn't mean juggling five different apps.
        </p>
        <p className="mt-4 text-foreground/80">
          From the latest electronics to weekly groceries, beauty to fashion to
          toys for the kids — we bring it all into one cart, one checkout and
          one trusted delivery.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full px-7 h-12 bg-gradient-warm text-primary-foreground shadow-glow"
          >
            <Link to="/shop">Start shopping</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-7 h-12"
          >
            <Link to="/contact">Get in touch</Link>
          </Button>
        </div>
      </div>
      <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-elevated">
        <img
          src={hero}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    </section>

    <section className="border-y border-border bg-secondary/30">
      <div className="container py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.l} className="text-center md:text-left">
            <p className="font-display text-4xl md:text-5xl text-primary">
              {s.n}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{s.l}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="container py-20 lg:py-28 grid lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-6 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-elevated">
        <img
          src={flatlay}
          alt="Modern lifestyle products"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="lg:col-span-6">
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">
          What we promise
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-balance">
          Four promises, every order.
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 gap-8">
          {values.map((v) => (
            <div key={v.t}>
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <v.icon className="h-5 w-5" />
              </div>
              <p className="font-display text-xl">{v.t}</p>
              <p className="text-sm text-muted-foreground mt-1">{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="border-y border-border bg-gradient-sheen">
      <div className="container py-20 grid md:grid-cols-3 gap-10">
        {[
          {
            n: "01",
            t: "Curate every aisle",
            d: "We hand-pick products across every department so you don't have to wade through endless choices.",
          },
          {
            n: "02",
            t: "Price fairly",
            d: "We negotiate hard with suppliers and pass the savings on. If you find it cheaper, we'll match it.",
          },
          {
            n: "03",
            t: "Deliver with care",
            d: "Quality packaging, careful handling and reliable couriers — straight to your door.",
          },
        ].map((s) => (
          <div key={s.n}>
            <p className="font-display text-3xl text-primary mb-3">{s.n}</p>
            <h3 className="font-display text-2xl mb-2">{s.t}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.d}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="container py-20 lg:py-28">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          The team
        </p>
        <h2 className="font-display text-4xl md:text-5xl">
          A small team, big ambitions.
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((m, i) => (
          <div
            key={m.name}
            className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-soft transition-smooth"
          >
            <div className="aspect-square bg-gradient-sheen flex items-end justify-center overflow-hidden">
              <img
                src={[hero, flatlay, cart, hero][i]}
                alt={m.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="font-display text-xl">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default About;
