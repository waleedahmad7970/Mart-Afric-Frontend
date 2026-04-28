import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "general",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
      form.message.trim().length < 10
    ) {
      toast.error("Please complete the form (message at least 10 characters).");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", topic: "general", message: "" });
      toast.success(
        "Message sent — we'll be in touch within one business day.",
      );
    }, 700);
  };

  return (
    <div>
      <section className="container pt-16 lg:pt-24 pb-12 text-center max-w-3xl">
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">
          Get in touch
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-balance">
          We'd love to hear from you.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Questions about an order, a recipe, or our farms — there's a real
          person on the other end.
        </p>
      </section>

      <section className="container pb-24">
        <div className="grid lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 space-y-8">
            {[
              {
                icon: Mail,
                t: "Email",
                v: "hello@Mart Afric.co",
                s: "Replies within 24h",
              },
              {
                icon: Phone,
                t: "Phone",
                v: "+1 (555) 010-2024",
                s: "Mon–Fri · 9am–6pm",
              },
              {
                icon: MapPin,
                t: "Head office",
                v: "32 Market Street, Suite 200",
                s: "By appointment",
              },
              {
                icon: Clock,
                t: "Support hours",
                v: "Mon – Sun",
                s: "8:00 — 22:00",
              },
            ].map((c) => (
              <div key={c.t} className="flex gap-4">
                <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-lg leading-none">{c.t}</p>
                  <p className="text-sm mt-1">{c.v}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.s}</p>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-border">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Follow
              </p>
              <div className="flex gap-2">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="social"
                    className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-smooth"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <form
            onSubmit={submit}
            className="lg:col-span-8 bg-card border border-border rounded-[2rem] p-8 md:p-10 shadow-soft space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@email.com"
                  className="h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Topic</Label>
              <Select
                value={form.topic}
                onValueChange={(v) => update("topic", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General enquiry</SelectItem>
                  <SelectItem value="order">Order support</SelectItem>
                  <SelectItem value="wholesale">
                    Wholesale & business
                  </SelectItem>
                  <SelectItem value="press">Press & partnerships</SelectItem>
                  <SelectItem value="returns">Returns & refunds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={6}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell us a little about what you need…"
              />
            </div>
            <Button
              type="submit"
              disabled={sending}
              size="lg"
              className="rounded-full h-12 px-8 bg-gradient-warm text-primary-foreground shadow-glow"
            >
              {sending ? "Sending…" : "Send message"}
            </Button>
            <p className="text-xs text-muted-foreground">
              By submitting, you agree to be contacted about your enquiry. We'll
              never share your email.
            </p>
          </form>
        </div>
      </section>

      <section className="container pb-24">
        <div className="rounded-[2rem] overflow-hidden border border-border shadow-soft aspect-[16/7] bg-muted">
          <iframe
            title="Mart Afric head office location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1135%2C51.4625%2C-0.1015%2C51.4685&layer=mapnik"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
};

export default Contact;
