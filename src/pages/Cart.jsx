import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus, Plus, Trash2, ShoppingBag, Truck, ShieldCheck, RotateCcw,
  Tag, Gift, Heart, Lock, ChevronRight, Sparkles, Check, Info,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import PersonalizedRails from "@/components/PersonalizedRails";

const PROMOS = {
  WELCOME10: { type: "pct", value: 10, label: "10% off" },
  MART5: { type: "fixed", value: 5, label: "$5 off" },
  FREESHIP: { type: "ship", value: 0, label: "Free shipping" },
};

const FREE_SHIP_THRESHOLD = 60;

const Cart = () => {
  const { items, remove, setQty, subtotal } = useCart();
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [insurance, setInsurance] = useState(false);

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMOS[code]) {
      setAppliedPromo({ code, ...PROMOS[code] });
      toast.success(`Promo ${code} applied — ${PROMOS[code].label}`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const clearPromo = () => {
    setAppliedPromo(null);
    setPromo("");
  };

  const discount =
    appliedPromo?.type === "pct"
      ? subtotal * (appliedPromo.value / 100)
      : appliedPromo?.type === "fixed"
      ? Math.min(appliedPromo.value, subtotal)
      : 0;

  const giftFee = giftWrap ? 3.5 : 0;
  const insuranceFee = insurance ? 1.99 : 0;
  const baseShipping =
    subtotal === 0 ? 0 : subtotal - discount > FREE_SHIP_THRESHOLD ? 0 : 6.5;
  const shipping = appliedPromo?.type === "ship" ? 0 : baseShipping;
  const tax = (subtotal - discount) * 0.05;
  const total = Math.max(0, subtotal - discount + shipping + tax + giftFee + insuranceFee);

  const remainingForFreeShip = Math.max(0, FREE_SHIP_THRESHOLD - (subtotal - discount));
  const shipProgress = Math.min(100, ((subtotal - discount) / FREE_SHIP_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="container py-20 lg:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-warm/10 flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Your basket is waiting
          </p>
          <h1 className="font-display text-5xl md:text-6xl mb-5">
            Nothing here yet.
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
            Discover thousands of African groceries, spices, electronics and home essentials —
            curated and delivered to your door.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 bg-gradient-warm text-primary-foreground shadow-glow">
              <Link to="/shop">Start shopping</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20">
          <PersonalizedRails />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 lg:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Cart</span>
      </nav>

      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Step 1 of 3 — Review your basket
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl">Your cart</h1>
          <p className="text-muted-foreground mt-3">
            {items.length} item{items.length === 1 ? "" : "s"} · Reserved for the next 60 minutes
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 text-sm">
          {["Cart", "Shipping", "Payment"].map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {i === 0 ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={i === 0 ? "font-medium" : "text-muted-foreground"}>{label}</span>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>
      </header>

      {/* Free shipping progress */}
      <div className="mb-10 rounded-2xl border border-border bg-secondary/30 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Truck className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm flex-1">
            {remainingForFreeShip > 0 ? (
              <>Add <strong className="text-primary">${remainingForFreeShip.toFixed(2)}</strong> more for <strong>FREE shipping</strong></>
            ) : (
              <><strong className="text-primary">Congrats!</strong> You've unlocked free shipping 🎉</>
            )}
          </p>
        </div>
        <Progress value={shipProgress} className="h-2" />
      </div>

      <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
        {/* LEFT — items + extras */}
        <div className="lg:col-span-2 space-y-10">
          {/* Items list */}
          <section>
            <div className="flex items-center justify-between pb-4 border-b border-border mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              <span>Item</span>
              <div className="hidden md:flex gap-16">
                <span>Qty</span>
                <span>Total</span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {items.map((i) => (
                <div key={i.id} className="flex flex-col md:flex-row gap-5 py-7">
                  <Link
                    to={`/product/${i.id}`}
                    className="h-32 w-32 md:h-36 md:w-36 rounded-2xl overflow-hidden bg-secondary shrink-0"
                  >
                    <img src={i.image} alt={i.name} className="h-full w-full object-cover hover:scale-105 transition-smooth" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link to={`/product/${i.id}`} className="font-display text-xl hover:text-primary line-clamp-1">
                        {i.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="secondary" className="rounded-full text-xs">In stock</Badge>
                        <Badge variant="outline" className="rounded-full text-xs">
                          <Truck className="h-3 w-3 mr-1" /> Ships in 24h
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 tabular-nums">
                        ${i.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <button
                        onClick={() => toast.success("Saved for later")}
                        className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1.5"
                      >
                        <Heart className="h-3.5 w-3.5" /> Save for later
                      </button>
                      <button
                        onClick={() => remove(i.id)}
                        className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 md:w-32">
                    <div className="flex items-center border border-border rounded-full">
                      <Button
                        variant="ghost" size="icon" className="rounded-full h-9 w-9"
                        onClick={() => setQty(i.id, i.qty - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm tabular-nums font-medium">{i.qty}</span>
                      <Button
                        variant="ghost" size="icon" className="rounded-full h-9 w-9"
                        onClick={() => setQty(i.id, i.qty + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="font-display text-xl tabular-nums">${(i.price * i.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Extras / add-ons */}
          <section className="rounded-3xl bg-secondary/30 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <Gift className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl">Make it special</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-background hover:bg-background/70 transition-smooth cursor-pointer">
                <Checkbox
                  checked={giftWrap}
                  onCheckedChange={(v) => setGiftWrap(!!v)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <p className="font-medium">Premium gift wrap</p>
                    <p className="text-sm tabular-nums">+$3.50</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Hand-wrapped in recycled kraft with a fabric ribbon.
                  </p>
                </div>
              </label>

              {giftWrap && (
                <Textarea
                  placeholder="Add a personal gift note (optional)…"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className="rounded-2xl resize-none"
                  rows={3}
                />
              )}

              <label className="flex items-start gap-3 p-4 rounded-2xl bg-background hover:bg-background/70 transition-smooth cursor-pointer">
                <Checkbox
                  checked={insurance}
                  onCheckedChange={(v) => setInsurance(!!v)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <p className="font-medium flex items-center gap-2">
                      Shipping protection
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    </p>
                    <p className="text-sm tabular-nums">+$1.99</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Covers loss, theft and damage in transit.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* Trust badges */}
          <section className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, title: "Secure checkout", desc: "256-bit SSL encryption" },
              { icon: RotateCcw, title: "30-day returns", desc: "Hassle-free refunds" },
              { icon: Truck, title: "Fast delivery", desc: "1-3 business days" },
            ].map((t) => (
              <div key={t.title} className="rounded-2xl border border-border p-4">
                <t.icon className="h-5 w-5 text-primary mb-2" />
                <p className="font-medium text-sm">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </section>
        </div>

        {/* RIGHT — sticky summary */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-5">
          <div className="rounded-3xl bg-card border border-border p-6 md:p-7 shadow-elevated">
            <h2 className="font-display text-2xl mb-1">Order summary</h2>
            <p className="text-xs text-muted-foreground mb-5">
              Prices include all applicable fees.
            </p>

            {/* Promo code */}
            <div className="mb-5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Promo code
              </label>
              {appliedPromo ? (
                <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="font-medium">{appliedPromo.code}</span>
                    <span className="text-muted-foreground">— {appliedPromo.label}</span>
                  </div>
                  <button onClick={clearPromo} className="text-xs text-muted-foreground hover:text-destructive">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    className="rounded-xl h-11"
                  />
                  <Button onClick={applyPromo} variant="outline" className="rounded-xl h-11 px-5">
                    Apply
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="h-3 w-3" /> Try <code className="font-mono">WELCOME10</code> for 10% off
              </p>
            </div>

            {/* Totals */}
            <div className="space-y-2.5 text-sm border-t border-border pt-5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} item{items.length === 1 ? "" : "s"})</span>
                <span className="tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Discount</span>
                  <span className="tabular-nums">−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="tabular-nums">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated tax</span>
                <span className="tabular-nums">${tax.toFixed(2)}</span>
              </div>
              {giftFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gift wrap</span>
                  <span className="tabular-nums">${giftFee.toFixed(2)}</span>
                </div>
              )}
              {insuranceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping protection</span>
                  <span className="tabular-nums">${insuranceFee.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-4 mt-4 flex justify-between font-display text-2xl">
                <span>Total</span>
                <span className="tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 rounded-full h-13 py-6 bg-gradient-warm text-primary-foreground shadow-glow text-base"
            >
              <Lock className="h-4 w-4 mr-2" />
              Secure checkout
            </Button>

            <div className="mt-5 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span>We accept</span>
              <div className="flex gap-1.5">
                {["VISA", "MC", "AMEX", "PayPal"].map((m) => (
                  <span key={m} className="px-2 py-0.5 rounded bg-secondary font-mono text-[10px]">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-warm/5 border border-primary/20 p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Member perks active</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You're earning <strong>{Math.floor(total)} mart points</strong> with this order.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* AI rails */}
      <div className="mt-20">
        <PersonalizedRails />
      </div>
    </div>
  );
};

export default Cart;
