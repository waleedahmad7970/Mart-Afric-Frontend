import { Link } from "react-router-dom";
import { LifeBuoy, Truck, RefreshCcw, Mail } from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import { Button } from "@/components/ui/button";

const helpCards = [
  { icon: Truck, title: "Shipping", desc: "Tracking, delivery times & carriers." },
  { icon: RefreshCcw, title: "Returns", desc: "Our 30-day no-questions guarantee." },
  { icon: LifeBuoy, title: "Orders", desc: "Modify, cancel, or track an order." },
  { icon: Mail, title: "Wholesale", desc: "Trade pricing for cafés & shops." },
];

const Faq = () => (
  <div>
    <section className="container pt-16 lg:pt-24 pb-10 text-center max-w-3xl">
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Help center</p>
      <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-balance">How can we help?</h1>
      <p className="mt-5 text-lg text-muted-foreground">
        Answers to the questions we hear most. Can't find what you need? <Link to="/contact" className="text-primary underline-offset-4 hover:underline">Talk to a human</Link>.
      </p>
    </section>

    <section className="container pb-12">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpCards.map((c) => (
          <div key={c.title} className="bg-card border border-border rounded-2xl p-6 hover:shadow-soft transition-smooth">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <c.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-xl">{c.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="container pb-24 max-w-3xl">
      <h2 className="font-display text-3xl md:text-4xl mb-6">Frequently asked</h2>
      <FaqAccordion />
      <div className="mt-12 rounded-2xl bg-secondary/50 border border-border p-8 text-center">
        <h3 className="font-display text-2xl">Still curious?</h3>
        <p className="text-muted-foreground mt-2">Our team replies within one business day.</p>
        <Button asChild className="mt-5 rounded-full bg-gradient-warm text-primary-foreground">
          <Link to="/contact">Contact us</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default Faq;
