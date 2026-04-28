import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqItems = [
  {
    q: "Where do you deliver?",
    a: "We deliver to over 40 countries worldwide. Free shipping on orders over $60, with same-day delivery available in select cities.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery: 2–4 business days. Express: 1–2 days. International: 5–10 days. Every order is fully tracked from dispatch to your door.",
  },
  {
    q: "Do you offer a price-match guarantee?",
    a: "Yes. If you find any in-stock product cheaper at a major competitor, we'll match the price within 14 days of your purchase.",
  },
  {
    q: "Can I return an item?",
    a: "Absolutely — within 30 days for a full refund. Electronics must be unopened or in like-new condition; groceries are non-refundable for hygiene reasons unless damaged.",
  },
  {
    q: "Are groceries fresh?",
    a: "Yes. Dairy, bread and produce are restocked daily and shipped in temperature-controlled packaging to keep everything fresh.",
  },
  {
    q: "Do you sell to businesses?",
    a: "We have a wholesale programme for offices, cafés and resellers. Email business@Mart Afric.co for our trade catalogue and pricing.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit and debit cards, Apple Pay, Google Pay, and buy-now-pay-later options at checkout.",
  },
  {
    q: "Do you offer gift cards?",
    a: "Yes — digital gift cards from $25 to $500, delivered instantly with a personal message.",
  },
];

const FaqAccordion = ({ items = faqItems }) => (
  <Accordion type="single" collapsible className="w-full">
    {items.map((item, i) => (
      <AccordionItem key={i} value={`item-${i}`} className="border-border">
        <AccordionTrigger className="font-display text-lg md:text-xl text-left hover:no-underline hover:text-primary py-5">
          {item.q}
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
          {item.a}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default FaqAccordion;
