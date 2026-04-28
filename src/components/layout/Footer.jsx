import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import Newsletter from "@/components/Newsletter";

const Footer = () => (
  <footer className="border-t border-border/60 mt-24 bg-secondary/30">
    <div className="container py-16 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5">
        <h3 className="font-display text-3xl mb-3">Mart Afric</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          Your everyday mart for electronics, groceries, home, beauty, fashion
          and more — one cart, one checkout, delivered to your door.
        </p>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Join the Mart Afric newsletter
        </p>
        <Newsletter variant="footer" />
        <div className="flex gap-2 mt-6">
          {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label="social"
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-background hover:text-primary transition-smooth"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Shop
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/shop" className="hover:text-primary transition-smooth">
                All products
              </Link>
            </li>
            <li>
              <Link
                to="/shop?cat=electronics"
                className="hover:text-primary transition-smooth"
              >
                Electronics
              </Link>
            </li>
            <li>
              <Link
                to="/shop?cat=groceries"
                className="hover:text-primary transition-smooth"
              >
                Groceries
              </Link>
            </li>
            <li>
              <Link
                to="/shop?cat=home"
                className="hover:text-primary transition-smooth"
              >
                Home & Kitchen
              </Link>
            </li>
            <li>
              <Link
                to="/shop?cat=beauty"
                className="hover:text-primary transition-smooth"
              >
                Beauty
              </Link>
            </li>
            <li>
              <Link
                to="/shop?cat=fashion"
                className="hover:text-primary transition-smooth"
              >
                Fashion
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Company
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/about"
                className="hover:text-primary transition-smooth"
              >
                Our story
              </Link>
            </li>
            <li>
              <Link
                to="/journal"
                className="hover:text-primary transition-smooth"
              >
                Journal
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-smooth">
                Wholesale
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-smooth">
                Press
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-smooth">
                Careers
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Help
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/contact"
                className="hover:text-primary transition-smooth"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-primary transition-smooth">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="hover:text-primary transition-smooth"
              >
                My orders
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-smooth">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-smooth">
                Returns
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Legal
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#" className="hover:text-primary transition-smooth">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-smooth">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-smooth">
                Cookies
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-smooth">
                Accessibility
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-border/60">
      <div className="container py-6 flex flex-col md:flex-row gap-2 items-center justify-between text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Mart Afric. All rights reserved.</p>
        <p>Shop smart · Shop everything</p>
      </div>
    </div>
  </footer>
);

export default Footer;
