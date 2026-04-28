import { Instagram as IG } from "lucide-react";
import suya from "@/assets/product-suya.jpg";
import rice from "@/assets/product-rice.jpg";
import palmoil from "@/assets/product-palmoil.jpg";
import hibiscus from "@/assets/product-hibiscus.jpg";
import egusi from "@/assets/product-egusi.jpg";
import plantain from "@/assets/product-plantain.jpg";

const grid = [suya, rice, palmoil, hibiscus, egusi, plantain];

const Instagram = () => (
  <section className="py-20 lg:py-28">
    <div className="container text-center mb-10">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">@sahelpantry</p>
      <h2 className="font-display text-4xl md:text-5xl">Cooked with us</h2>
      <p className="mt-3 text-muted-foreground">Tag your dishes — we feature our favorites every week.</p>
    </div>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 px-1.5">
      {grid.map((src, i) => (
        <a key={i} href="#" className="relative aspect-square overflow-hidden group">
          <img src={src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-110" />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-smooth flex items-center justify-center">
            <IG className="h-6 w-6 text-background opacity-0 group-hover:opacity-100 transition-smooth" />
          </div>
        </a>
      ))}
    </div>
  </section>
);

export default Instagram;
