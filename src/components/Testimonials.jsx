import { Star } from "lucide-react";

const items = [
  { name: "Amara O.", role: "Home cook · London", quote: "The ofada rice is the closest thing to my grandmother's kitchen I've found outside Lagos. Genuinely emotional.", rating: 5 },
  { name: "Chef Kwame", role: "Accra · Pop-up dinners", quote: "Sahel's palm oil completely changed my banga stew. The depth of flavor is unmatched.", rating: 5 },
  { name: "Fatou D.", role: "Recipe developer · Paris", quote: "Beautifully packaged, fast shipping, and the hibiscus brews into the most stunning ruby tea.", rating: 5 },
  { name: "James R.", role: "New York", quote: "I came for the suya spice — I stayed for everything else. The quality is genuinely premium.", rating: 5 },
];

const Testimonials = () => (
  <section className="border-y border-border/60 bg-gradient-sheen">
    <div className="container py-20 lg:py-28">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Loved worldwide</p>
        <h2 className="font-display text-4xl md:text-5xl">Words from the table</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((t) => (
          <figure key={t.name} className="bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-elevated transition-smooth">
            <div className="flex gap-0.5 mb-4 text-accent">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="font-display text-lg leading-snug text-balance">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-border">
              <p className="font-medium text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
