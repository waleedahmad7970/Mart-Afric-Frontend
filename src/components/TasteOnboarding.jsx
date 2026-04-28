import { useEffect, useState } from "react";
import { Sparkles, Check, ArrowRight, ChevronLeft, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/data/products";
import { trackInteraction } from "@/lib/userTaste";
import { cn } from "@/lib/utils";

const SEEN_KEY = "Mart Afric-taste-onboarded";
const PREF_KEY = "Mart Afric-taste-prefs";

const DIETS = [
  {
    id: "everyday",
    label: "Everyday cooking",
    desc: "Staples, stews, weekly basics",
  },
  {
    id: "traditional",
    label: "Traditional Ghanaian",
    desc: "Fufu, kenkey, palm soup, banku",
  },
  {
    id: "healthy",
    label: "Health-conscious",
    desc: "Whole grains, low-sugar, nutrient-dense",
  },
  {
    id: "quick",
    label: "Quick & easy",
    desc: "Ready mixes, instant porridges",
  },
  {
    id: "entertaining",
    label: "Hosting & feasts",
    desc: "Big batches for family events",
  },
  {
    id: "beauty",
    label: "Beauty & wellness",
    desc: "Shea, black soap, herbal goods",
  },
];

const BUDGETS = [
  { id: "value", label: "Value", range: "Under $8" },
  { id: "mid", label: "Mid", range: "$8 – $20" },
  { id: "premium", label: "Premium", range: "$20+" },
];

/**
 * 3-step taste onboarding for first-time visitors. Captured signals
 * are written into the same localStorage taste profile used by AI rails.
 */
const TasteOnboarding = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [diets, setDiets] = useState([]);
  const [cats, setCats] = useState([]);
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(SEEN_KEY)) {
      const t = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const toggle = (arr, setArr, id) =>
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const finish = () => {
    localStorage.setItem(SEEN_KEY, "1");
    localStorage.setItem(
      PREF_KEY,
      JSON.stringify({ diets, cats, budget, at: Date.now() }),
    );

    // Seed taste profile with virtual "views" so AI rails light up immediately.
    const budgetRange =
      budget === "value" ? [0, 8] : budget === "premium" ? [20, 1000] : [8, 20];

    const seedPool = products.filter((p) => {
      const catMatch = cats.length === 0 || cats.includes(p.category);
      const priceMatch = p.price >= budgetRange[0] && p.price <= budgetRange[1];
      return catMatch && (priceMatch || cats.length > 0);
    });

    // Boost by rating, take top picks per category for diversity
    const grouped = {};
    seedPool
      .sort((a, b) => b.rating - a.rating)
      .forEach((p) => {
        grouped[p.category] = grouped[p.category] || [];
        if (grouped[p.category].length < 3) grouped[p.category].push(p);
      });

    Object.values(grouped)
      .flat()
      .slice(0, 12)
      .forEach((p) => trackInteraction(p.id, "view"));

    setOpen(false);
  };

  const skip = () => {
    localStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  };

  const canNext =
    (step === 0 && diets.length > 0) ||
    (step === 1 && cats.length > 0) ||
    (step === 2 && !!budget);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && skip()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 rounded-3xl">
        {/* Header band */}
        <div className="bg-gradient-warm text-primary-foreground p-8 relative">
          <button
            onClick={skip}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/25 flex items-center justify-center transition-smooth"
            aria-label="Skip"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/15 text-xs font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Personalize your mart
          </div>
          <h2 className="font-display text-3xl md:text-4xl leading-tight">
            {step === 0 && "How do you usually cook?"}
            {step === 1 && "Which aisles excite you?"}
            {step === 2 && "What's your typical budget?"}
          </h2>
          <p className="text-primary-foreground/85 mt-2 text-sm">
            Three quick taps. We'll tune your homepage and AI picks to match.
          </p>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mt-5">
            {[0, 1, 2].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  s === step
                    ? "w-8 bg-primary-foreground"
                    : "w-4 bg-primary-foreground/30",
                )}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 max-h-[55vh] overflow-y-auto">
          {step === 0 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {DIETS.map((d) => {
                const active = diets.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggle(diets, setDiets, d.id)}
                    className={cn(
                      "text-left p-4 rounded-2xl border-2 transition-smooth relative",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    {active && (
                      <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <p className="font-medium">{d.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {d.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((c) => {
                const active = cats.includes(c.slug);
                return (
                  <button
                    key={c.slug}
                    onClick={() => toggle(cats, setCats, c.slug)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-sm font-medium transition-smooth relative",
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    {active && (
                      <Check className="absolute top-2 right-2 h-3.5 w-3.5 text-primary" />
                    )}
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="grid sm:grid-cols-3 gap-3">
              {BUDGETS.map((b) => {
                const active = budget === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    className={cn(
                      "p-6 rounded-2xl border-2 text-center transition-smooth",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <p className="font-display text-xl">{b.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {b.range}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-border bg-secondary/30">
          {step > 0 ? (
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={skip}
              className="rounded-full text-muted-foreground"
            >
              Skip for now
            </Button>
          )}
          <Button
            disabled={!canNext}
            onClick={() => (step < 2 ? setStep(step + 1) : finish())}
            className="rounded-full px-7 bg-gradient-warm text-primary-foreground shadow-glow"
          >
            {step < 2 ? (
              <>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Tune my mart <Sparkles className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TasteOnboarding;
