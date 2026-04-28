import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import tech from "@/assets/hero-mart-flatlay.jpg";
import groceries from "@/assets/hero-mart-cart.jpg";

const PromoBanner = () => (
  <section className="container py-10 lg:py-16">
    <div className="grid md:grid-cols-2 gap-5">
      <div className="relative overflow-hidden rounded-[2rem] aspect-[5/3] md:aspect-auto md:h-[28rem] group">
        <img src={tech} alt="Electronics deals" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-tr from-foreground/70 via-foreground/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10 text-background">
          <p className="text-xs uppercase tracking-[0.25em] mb-3 opacity-90">Tech week · up to 30% off</p>
          <h3 className="font-display text-3xl md:text-4xl leading-tight max-w-sm">Big savings on electronics</h3>
          <p className="mt-3 text-sm opacity-90 max-w-sm">Phones, laptops, headphones and smart watches — refreshed weekly with our best prices.</p>
          <Button asChild className="mt-5 rounded-full bg-background text-foreground hover:bg-background/90 w-fit">
            <Link to="/shop?cat=electronics">Shop electronics <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[2rem] aspect-[5/3] md:aspect-auto md:h-[28rem] group bg-secondary">
        <img src={groceries} alt="Weekly grocery essentials" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 transition-smooth group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/80 to-primary/30" />
        <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10 text-primary-foreground">
          <p className="text-xs uppercase tracking-[0.25em] mb-3 opacity-90">Fresh & daily</p>
          <h3 className="font-display text-3xl md:text-4xl leading-tight max-w-sm">Weekly grocery essentials</h3>
          <p className="mt-3 text-sm opacity-90 max-w-sm">Dairy, bread, pantry staples and snacks — all the essentials for the week ahead.</p>
          <Button asChild variant="secondary" className="mt-5 rounded-full w-fit">
            <Link to="/shop?cat=groceries">Shop groceries <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default PromoBanner;
