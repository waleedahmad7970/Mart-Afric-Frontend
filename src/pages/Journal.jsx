import jollof from "@/assets/hero-jollof.jpg";
import spices from "@/assets/hero-spices.jpg";
import farmer from "@/assets/hero-farmer.jpg";
import hero from "@/assets/hero-ingredients.jpg";

const posts = [
  { tag: "Recipe", title: "The only jollof rice technique you need this year", excerpt: "Long-bottom pot, parboiled rice, and the right tomato base — the trinity of perfect jollof.", image: jollof, read: "6 min", date: "Apr 12, 2026" },
  { tag: "Origin", title: "Inside the spice markets of Northern Nigeria", excerpt: "We spent a week with the Kano traders who supply our suya blend.", image: spices, read: "8 min", date: "Apr 02, 2026" },
  { tag: "Producers", title: "Meet Aïcha, the woman behind our hibiscus", excerpt: "Her cooperative of 40 farmers in Senegal has changed what fair trade means to us.", image: farmer, read: "5 min", date: "Mar 24, 2026" },
  { tag: "Recipe", title: "Egusi soup: a beginner's guide to the West African classic", excerpt: "The right melon seed, the right oil, the right pace.", image: hero, read: "7 min", date: "Mar 18, 2026" },
  { tag: "Pantry", title: "Storing spices: the small habits that change everything", excerpt: "Light, air and heat are the silent killers of flavor.", image: spices, read: "4 min", date: "Mar 09, 2026" },
  { tag: "Origin", title: "Cold-pressed palm oil — what to look for", excerpt: "Color, viscosity, smell. A short field guide.", image: jollof, read: "5 min", date: "Feb 27, 2026" },
];

const Journal = () => (
  <div>
    <section className="container pt-16 lg:pt-24 pb-12 text-center max-w-3xl">
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">The journal</p>
      <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-balance">Stories, recipes & origin notes.</h1>
      <p className="mt-5 text-lg text-muted-foreground">From farms to kitchens — long-form, slow, and worth your time.</p>
    </section>

    <section className="container pb-24">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((p) => (
          <article key={p.title} className="group cursor-pointer">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted mb-5">
              <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-smooth group-hover:scale-105" />
            </div>
            <p className="text-xs uppercase tracking-widest text-primary mb-2">{p.tag} · {p.read} · {p.date}</p>
            <h3 className="font-display text-2xl leading-tight group-hover:text-primary transition-smooth">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
);

export default Journal;
