import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Truck, ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import Brands from "@/components/Brands";
import PromoBanner from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials";
import Journal from "@/components/Journal";
import Newsletter from "@/components/Newsletter";
import Instagram from "@/components/Instagram";
import FaqAccordion from "@/components/FaqAccordion";
import { faqItems } from "@/components/FaqAccordion";
import AiSuggestions from "@/components/AiSuggestions";
import PersonalizedRails from "@/components/PersonalizedRails";
import { products, categories } from "@/data/products";

const Home = () => {
  const featured = products.slice(0, 4);
  const bestsellers = products.slice(4, 8);

  return (
    <div>
      <HeroSlider />

      {/* VALUE PROPS */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="container py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: "Free shipping", desc: "On orders over $60" },
            { icon: ShieldCheck, title: "30-day returns", desc: "Hassle-free" },
            {
              icon: Award,
              title: "Best price promise",
              desc: "We price-match",
            },
            {
              icon: Leaf,
              title: "Fresh daily",
              desc: "Groceries restocked daily",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-20 lg:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Departments
            </p>
            <h2 className="font-display text-4xl md:text-5xl">
              Shop every aisle
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm hover:text-primary hidden md:inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to={`/shop?cat=${c.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-sheen p-8 h-44 flex flex-col justify-between transition-smooth hover:shadow-elevated"
            >
              <p className="text-xs text-muted-foreground tabular-nums">
                0{i + 1}
              </p>
              <div>
                <h3 className="font-display text-2xl">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                  Shop now{" "}
                  <ArrowRight className="h-3 w-3 transition-smooth group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container pb-20 lg:pb-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              This week
            </p>
            <h2 className="font-display text-4xl md:text-5xl">
              Featured picks
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* PROMO BANNERS */}
      <PromoBanner />

      {/* BESTSELLERS */}
      <section className="container py-20 lg:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Loved most
            </p>
            <h2 className="font-display text-4xl md:text-5xl">Bestsellers</h2>
          </div>
          <Link
            to="/shop"
            className="text-sm hover:text-primary hidden md:inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* AI RECOMMENDATIONS — multi-rail, personalized */}
      <section className="container pb-8">
        <PersonalizedRails />
      </section>

      <Brands />

      <Testimonials />

      <Journal />

      {/* FAQ */}
      <section className="container py-20 lg:py-28 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Help center
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-balance">
            Questions, answered.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            From shipping to storage — the things our customers ask most.
          </p>
          <Button asChild variant="outline" className="mt-6 rounded-full">
            <Link to="/faq">
              Visit help center <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="lg:col-span-7">
          <FaqAccordion items={faqItems.slice(0, 5)} />
        </div>
      </section>

      <Newsletter />

      <Instagram />

      {/* CTA */}
      <section className="container pb-20 lg:pb-28">
        <div className="rounded-[2rem] bg-gradient-warm p-10 md:p-16 text-primary-foreground relative overflow-hidden">
          <div className="max-w-xl relative z-10">
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Everything you need, one mart away.
            </h2>
            <p className="mt-4 text-primary-foreground/85">
              Join 50,000+ smart shoppers who get groceries, gadgets and more
              delivered with Mart Afric.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-background text-foreground hover:bg-background/90 px-7 h-12"
              >
                <Link to="/signup">Create your account</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-7 h-12"
              >
                <Link to="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
