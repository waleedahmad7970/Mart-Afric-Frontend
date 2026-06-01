// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import slide1 from "@/assets/hero-mart-aisle.jpg";
// // import slide2 from "@/assets/hero-mart-flatlay.jpg";
// // import slide3 from "@/assets/hero-mart-cart.jpg";

// // const slides = [
// //   {
// //     eyebrow: "Everything in one place",
// //     title: "Your everyday mart, delivered.",
// //     subtitle: "Electronics, groceries, home, beauty and fashion — one cart, one checkout, free shipping over $60.",
// //     image: slide1,
// //     cta: { label: "Start shopping", to: "/shop" },
// //     alt: "Bright modern mart aisle full of products",
// //   },
// //   {
// //     eyebrow: "New season tech",
// //     title: "The latest tech, at fair prices.",
// //     subtitle: "Phones, laptops, headphones and accessories — handpicked and price-matched.",
// //     image: slide2,
// //     cta: { label: "Shop electronics", to: "/shop?cat=electronics" },
// //     alt: "Flatlay of modern lifestyle products and electronics",
// //   },
// //   {
// //     eyebrow: "Fresh every day",
// //     title: "Groceries, fresh to your door.",
// //     subtitle: "Dairy, bread, pantry staples and produce — restocked daily, delivered with care.",
// //     image: slide3,
// //     cta: { label: "Shop groceries", to: "/shop?cat=groceries" },
// //     alt: "Shopping cart full of groceries and household items",
// //   },
// // ];

// // const HeroSlider = () => {
// //   const [i, setI] = useState(0);
// //   useEffect(() => {
// //     const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
// //     return () => clearInterval(t);
// //   }, []);
// //   const go = (n) => setI((n + slides.length) % slides.length);
// //   const s = slides[i];

// //   return (
// //     <section className="relative overflow-hidden bg-secondary/40">
// //       <div className="container relative grid lg:grid-cols-12 gap-10 lg:gap-16 pt-12 lg:pt-20 pb-16 lg:pb-24 items-center">
// //         <div className="lg:col-span-6 relative z-10">
// //           <div key={`t-${i}`} className="animate-fade-up">
// //             <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">{s.eyebrow}</p>
// //             <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-balance">
// //               {s.title}
// //             </h1>
// //             <p className="mt-6 text-lg text-muted-foreground max-w-lg text-balance">{s.subtitle}</p>
// //             <div className="mt-8 flex flex-wrap gap-3">
// //               <Button asChild size="lg" className="rounded-full px-7 h-12 bg-gradient-warm text-primary-foreground shadow-glow hover:opacity-95">
// //                 <Link to={s.cta.to}>{s.cta.label} <ArrowRight className="ml-1 h-4 w-4" /></Link>
// //               </Button>
// //               <Button asChild size="lg" variant="outline" className="rounded-full px-7 h-12">
// //                 <Link to="/about">About us</Link>
// //               </Button>
// //             </div>
// //             <div className="mt-12 flex gap-8 text-sm text-muted-foreground">
// //               <div><p className="font-display text-2xl text-foreground">10k+</p>Products</div>
// //               <div><p className="font-display text-2xl text-foreground">6</p>Departments</div>
// //               <div><p className="font-display text-2xl text-foreground">4.9★</p>Rating</div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="lg:col-span-6 relative">
// //           <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-elevated relative bg-muted">
// //             {slides.map((sl, idx) => (
// //               <img
// //                 key={sl.image}
// //                 src={sl.image}
// //                 alt={sl.alt}
// //                 width={1600}
// //                 height={1200}
// //                 loading={idx === 0 ? "eager" : "lazy"}
// //                 className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
// //               />
// //             ))}
// //           </div>

// //           <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-4 shadow-soft hidden md:block">
// //             <p className="text-xs text-muted-foreground">Now featured</p>
// //             <p className="font-display text-lg">{s.eyebrow}</p>
// //           </div>

// //           <div className="absolute top-4 right-4 flex gap-2">
// //             <button onClick={() => go(i - 1)} aria-label="Previous slide" className="h-9 w-9 rounded-full bg-background/85 backdrop-blur border border-border flex items-center justify-center hover:bg-background transition-smooth">
// //               <ChevronLeft className="h-4 w-4" />
// //             </button>
// //             <button onClick={() => go(i + 1)} aria-label="Next slide" className="h-9 w-9 rounded-full bg-background/85 backdrop-blur border border-border flex items-center justify-center hover:bg-background transition-smooth">
// //               <ChevronRight className="h-4 w-4" />
// //             </button>
// //           </div>

// //           <div className="mt-5 flex gap-1.5 justify-center lg:justify-start">
// //             {slides.map((_, idx) => (
// //               <button
// //                 key={idx}
// //                 onClick={() => setI(idx)}
// //                 aria-label={`Go to slide ${idx + 1}`}
// //                 className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-4 bg-border hover:bg-muted-foreground/40"}`}
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// export default HeroSlider;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import slide1 from "@/assets/hero-mart-aisle.jpg";
import slide2 from "@/assets/hero-mart-flatlay.jpg";
import slide3 from "@/assets/hero-mart-cart.jpg";

const slides = [
  {
    eyebrow: "Daily Essentials",
    title: "Everything you need, delivered today.",
    subtitle:
      "Groceries, tech, and home goods — one cart, one checkout, free shipping over $60.",
    image: slide1,
    cta: { label: "Start shopping", to: "/shop" },
  },
  {
    eyebrow: "New Arrivals",
    title: "Upgrade your everyday tech.",
    subtitle: "Laptops, audio, and smart home devices at unbeatable prices.",
    image: slide2,
    cta: { label: "Shop electronics", to: "/shop?cat=electronics" },
  },
  {
    eyebrow: "Farm Fresh",
    title: "Quality groceries to your door.",
    subtitle: "Restocked daily. From farm to your fridge with care.",
    image: slide3,
    cta: { label: "Shop groceries", to: "/shop?cat=groceries" },
  },
];

const HeroCinematic = () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const go = (n) => setI((n + slides.length) % slides.length);
  const s = slides[i];

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden rounded-b-[2.5rem] lg:rounded-b-[0rem]">
      {/* Background Images */}
      {slides.map((sl, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === i ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={sl.image}
            alt={sl.title}
            className="h-full w-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content Container */}
      <div className="container relative z-20 flex h-full flex-col justify-center text-white">
        <div className="max-w-2xl animate-fade-up" key={i}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-md border border-white/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {s.eyebrow}
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight text-white mb-6">
            {s.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg">
            {s.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 h-14 text-base bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all"
            >
              <Link to={s.cta.to}>
                <ShoppingBag className="mr-2 h-5 w-5" /> {s.cta.label}
              </Link>
            </Button>
            {/* <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 text-base border-white text-white hover:bg-white hover:text-black transition-all"
            >
              <Link to="/about">Learn More</Link>
            </Button> */}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-6">
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === i
                  ? "w-10 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2 hidden md:flex">
          <button
            onClick={() => go(i - 1)}
            className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(i + 1)}
            className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroCinematic;

// import { Link } from "react-router-dom";
// import { ArrowUpRight, Badge, Search, ShieldCheck, Zap } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import slide1 from "@/assets/hero-mart-aisle.jpg"; // Main big image
// import slide2 from "@/assets/hero-mart-flatlay.jpg"; // Top right image
// import slide3 from "@/assets/hero-mart-cart.jpg"; // Bottom right image

// const HeroBento = () => {
//   return (
//     <section className="relative bg-background pt-12 lg:pt-20 pb-16">
//       <div className="container">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
//           {/* Left Text Content */}
//           <div className="lg:col-span-5 space-y-8 pr-4">
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
//                 <Zap className="h-4 w-4 fill-primary" /> Fastest delivery in
//                 town
//               </div>
//               <h1 className="font-display text-5xl md:text-6xl lg:text-[4rem] leading-[1.1] tracking-tight text-balance">
//                 Your entire shopping list.{" "}
//                 <span className="text-muted-foreground">Sorted.</span>
//               </h1>
//               <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
//                 Skip the lines. From farm-fresh produce to the latest
//                 electronics, get thousands of items delivered directly to your
//                 door.
//               </p>
//             </div>

//             {/* Quick Search Bar directly in Hero */}
//             <div className="relative max-w-md">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//               <Input
//                 className="pl-12 pr-32 h-14 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary text-base"
//                 placeholder="Search for groceries, tech..."
//               />
//               <Button className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full px-6">
//                 Search
//               </Button>
//             </div>

//             <div className="flex items-center gap-6 pt-4">
//               <div className="flex items-center gap-2">
//                 <ShieldCheck className="h-5 w-5 text-emerald-500" />
//                 <span className="text-sm font-medium">Secure Payments</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <ArrowUpRight className="h-5 w-5 text-blue-500" />
//                 <span className="text-sm font-medium">Easy Returns</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Bento Grid */}
//           <div className="lg:col-span-7 grid grid-cols-2 grid-rows-2 gap-4 h-[500px] lg:h-[600px]">
//             {/* Big Left Image */}
//             <div className="row-span-2 relative rounded-[2rem] overflow-hidden group">
//               <img
//                 src={slide1}
//                 alt="Mart aisle"
//                 className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//               <div className="absolute bottom-6 left-6 right-6">
//                 <Badge
//                   variant="secondary"
//                   className="mb-3 bg-white text-black hover:bg-white/90"
//                 >
//                   Groceries
//                 </Badge>
//                 <h3 className="text-2xl font-semibold text-white">
//                   Fresh Daily Produce
//                 </h3>
//               </div>
//             </div>

//             {/* Top Right Image */}
//             <div className="relative rounded-[2rem] overflow-hidden group">
//               <img
//                 src={slide2}
//                 alt="Electronics"
//                 className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//               <div className="absolute bottom-5 left-5 right-5">
//                 <Badge
//                   variant="secondary"
//                   className="mb-2 bg-white text-black hover:bg-white/90"
//                 >
//                   Tech
//                 </Badge>
//                 <h3 className="text-lg font-semibold text-white">
//                   Latest Gadgets
//                 </h3>
//               </div>
//             </div>

//             {/* Bottom Right Image */}
//             <div className="relative rounded-[2rem] overflow-hidden group bg-primary/5 flex items-center justify-center p-6 border border-primary/10">
//               <div className="text-center space-y-4">
//                 <h3 className="font-display text-3xl text-primary">
//                   Up to 50% Off
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   On selected household items this weekend.
//                 </p>
//                 <Button
//                   asChild
//                   variant="outline"
//                   className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
//                 >
//                   <Link to="/shop/sale">Shop the Sale</Link>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroBento;
