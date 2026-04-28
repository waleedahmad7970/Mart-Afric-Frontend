import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import jollof from "@/assets/hero-jollof.jpg";
import spices from "@/assets/hero-spices.jpg";
import farmer from "@/assets/hero-farmer.jpg";

const posts = [
  {
    tag: "Recipe",
    title: "The only jollof rice technique you need this year",
    excerpt: "Long-bottom pot, parboiled rice, and the right tomato base — the trinity of perfect jollof.",
    image: jollof,
    read: "6 min read",
  },
  {
    tag: "Origin",
    title: "Inside the spice markets of Northern Nigeria",
    excerpt: "We spent a week with the Kano traders who supply our suya blend. Here's what they taught us.",
    image: spices,
    read: "8 min read",
  },
  {
    tag: "Producers",
    title: "Meet Aïcha, the woman behind our hibiscus",
    excerpt: "Her cooperative of 40 farmers in Senegal has changed what 'fair trade' means to us.",
    image: farmer,
    read: "5 min read",
  },
];

const Journal = () => (
  <section className="container py-20 lg:py-28">
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">From the journal</p>
        <h2 className="font-display text-4xl md:text-5xl">Stories & recipes</h2>
      </div>
      <Link to="/journal" className="text-sm hover:text-primary hidden md:inline-flex items-center gap-1">
        Read the journal <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {posts.map((p) => (
        <article key={p.title} className="group cursor-pointer">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted mb-5">
            <img src={p.image} alt={p.title} loading="lazy" width={800} height={1000} className="w-full h-full object-cover transition-smooth group-hover:scale-105" />
          </div>
          <p className="text-xs uppercase tracking-widest text-primary mb-2">{p.tag} · {p.read}</p>
          <h3 className="font-display text-2xl leading-tight group-hover:text-primary transition-smooth">{p.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
        </article>
      ))}
    </div>
  </section>
);

export default Journal;
