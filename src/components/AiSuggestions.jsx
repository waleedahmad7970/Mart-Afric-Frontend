import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getSuggestions } from "@/lib/suggestions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/**
 * AI-style "Picked for you" slider.
 * Either:
 *   - pass `seeds` and we'll compute suggestions, OR
 *   - pass `_override={ items, chip, Icon }` to render a preset list.
 */
const AiSuggestions = ({
  seeds = [],
  limit = 8,
  title = "Picked for you",
  subtitle,
  _override = null,
}) => {
  const [items, setItems] = useState(_override?.items || []);
  const [loading, setLoading] = useState(!_override);

  useEffect(() => {
    if (_override) {
      setItems(_override.items);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      setItems(getSuggestions(seeds, limit));
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(seeds.map((s) => s.id)), limit, _override?.items?.length]);

  if (!loading && items.length === 0) return null;

  const ChipIcon = _override?.Icon || Sparkles;
  const chipLabel = _override?.chip || "AI suggestions";

  return (
    <section className="mt-20">
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <div className="flex items-end justify-between mb-8 gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
              <ChipIcon className="h-3.5 w-3.5" />
              {chipLabel}
            </div>
            <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-2 max-w-xl">{subtitle}</p>}
          </div>
          <div className="hidden sm:flex items-center gap-2 relative">
            <CarouselPrevious className="static translate-y-0 h-10 w-10" />
            <CarouselNext className="static translate-y-0 h-10 w-10" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-muted" />
                <div className="h-4 bg-muted rounded mt-4 w-3/4" />
                <div className="h-3 bg-muted rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <CarouselContent className="-ml-5">
            {items.map((p) => (
              <CarouselItem
                key={p.id}
                className="pl-5 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
      </Carousel>
    </section>
  );
};

export default AiSuggestions;

