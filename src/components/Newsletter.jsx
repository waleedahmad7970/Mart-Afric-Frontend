import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter = ({ variant = "section" }) => {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("You're on the list! Check your inbox for 10% off.");
    setEmail("");
  };

  if (variant === "footer") {
    return (
      <form onSubmit={submit} className="flex gap-2">
        <Input
          type="email"
          required
          placeholder="you@kitchen.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-full bg-background"
        />
        <Button
          type="submit"
          className="rounded-full bg-gradient-warm text-primary-foreground shrink-0"
        >
          Join
        </Button>
      </form>
    );
  }

  return (
    <section className="container py-20 lg:py-28">
      <div className="rounded-[2rem] bg-card border border-border p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center shadow-soft">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary mb-4">
            <Mail className="h-3.5 w-3.5" /> The Mart Afric Newsletter
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance">
            Weekly deals, new arrivals & 10% off your first order.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            One email a week. The best deals across electronics, groceries and
            lifestyle — straight to your inbox.
          </p>
        </div>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-full px-5"
          />
          <Button
            type="submit"
            size="lg"
            className="rounded-full h-12 px-8 bg-gradient-warm text-primary-foreground shadow-glow shrink-0"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
