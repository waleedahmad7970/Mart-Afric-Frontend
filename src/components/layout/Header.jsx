import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ArrowRight,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/slices/auth/slice";
import wishlistApis from "../../api/wishlist/wishlist-apis";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
];

const Header = () => {
  const { theme, toggle } = useTheme();
  const { count } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const { user = {} } = useSelector((state) => state.auth);
  const { total = 0 } = useSelector((state) => state.wishlist) || {};
  const { categories = [], subCategories = [] } =
    useSelector((state) => state.categories) || {};

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(searchQ.trim())}`);
    setSearchOpen(false);
    setOpen(false);
    setSearchQ("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(authActions.user(null));
    navigate("/");
  };

  useEffect(() => {
    wishlistApis.getWishlist().then(([res, error]) => {});
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/75 border-b border-border/60">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
            Mart Afric
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            — Everything you need
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm transition-smooth hover:text-primary ${isActive ? "text-primary" : "text-foreground/80"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
          >
            {searchOpen ? (
              <X className="h-[18px] w-[18px]" />
            ) : (
              <Search className="h-[18px] w-[18px]" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-[18px] w-[18px]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div onClick={() => navigate("/me")} className="px-2 py-1.5">
                  <p className="cursor-pointer text-sm font-medium">
                    {user.name}
                  </p>
                  <p className="cursor-pointer text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  My orders
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    Admin dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="hidden md:inline-flex"
            >
              Sign in
            </Button>
          )}

          {/* 2. ADD WISHLIST BUTTON HERE */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/wishlist")}
            aria-label="Wishlist"
          >
            <Heart
              className="h-[18px] w-[18px]"
              color={total > 0 ? "red" : ""}
              fill={total > 0 ? "red" : ""}
            />{" "}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cart")}
            aria-label="Cart"
            className="relative"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Menu"
              >
                <Menu className="h-[18px] w-[18px]" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[80%] overflow-y-auto custom-scrollbar"
            >
              <nav className="flex flex-col gap-5 mt-6">
                {/* NEW: Mobile Search Bar with Enter Button */}
                <form
                  onSubmit={submitSearch}
                  className="relative w-full mb-4 mt-2"
                >
                  {/* Left Search Icon */}
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />

                  <Input
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search store..."
                    className="pl-10 pr-12 w-full rounded-full bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary transition-colors h-10"
                  />

                  {/* Right Enter/Submit Button */}
                  <button
                    type="submit"
                    disabled={!searchQ.trim()} // Disables button if search is empty
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Submit Search"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                {/* Standard Links */}
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="text-lg font-display transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                ))}

                {/* Categories Accordion */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="flex items-center justify-between text-lg font-display text-left w-full transition-colors hover:text-primary"
                  >
                    Shop by Category
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-300 ${showCategories ? "rotate-180 text-primary" : "text-muted-foreground"}`}
                    />
                  </button>

                  {/* The actual category list that drops down */}
                  <div
                    className={`flex flex-col gap-2 pl-4 overflow-hidden transition-all duration-500 ease-in-out ${
                      showCategories
                        ? "max-h-[1500px] mt-2 opacity-100"
                        : "max-h-0 opacity-0"
                    } border-l-2 border-primary/20`}
                  >
                    {categories?.map((c) => (
                      <div key={c?._id || c?.slug} className="flex flex-col">
                        {/* Main Category Row (Text + Arrow Only) */}
                        <div className="flex items-center justify-between py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                          <Link
                            to={`/shop?cat=${c?.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex-1 text-base text-muted-foreground hover:text-primary transition-colors"
                          >
                            {c?.name}
                          </Link>

                          {/* Subcategory Toggle Arrow (Only shows if subcategories exist) */}
                          {c?.subcategories && c?.subcategories?.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setExpandedCategory(
                                  expandedCategory === c._id ? null : c._id,
                                );
                              }}
                              className="p-1.5 -mr-1.5 text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-300 ${
                                  expandedCategory === c._id
                                    ? "rotate-180 text-primary"
                                    : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Nested Subcategories Dropdown */}
                        {c.subcategories && c.subcategories.length > 0 && (
                          <div
                            className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                              expandedCategory === c._id
                                ? "max-h-[500px] opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="flex flex-col gap-2 pl-4 ml-2 my-1 border-l border-muted">
                              <Link
                                to={`/shop?cat=${c.slug}`}
                                onClick={() => setOpen(false)}
                                className="text-sm font-medium text-primary"
                              >
                                View all {c.name} &rarr;
                              </Link>

                              {c.subcategories.map((subCat) => (
                                <Link
                                  key={subCat._id || subCat.slug}
                                  to={`/shop?cat=${c.slug}&subcat=${subCat.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="text-sm text-muted-foreground/80 hover:text-primary transition-colors"
                                >
                                  {subCat.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* A link to view all categories if they want */}
                    <Link
                      to="/shop"
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-primary mt-2"
                    >
                      View All Departments &rarr;
                    </Link>
                  </div>
                </div>

                {/* Login Link */}
                {!user && (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="text-lg font-display text-primary mt-4"
                  >
                    Sign in
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <form
            onSubmit={submitSearch}
            className="container py-4 flex items-center gap-3"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              autoFocus
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search electronics, groceries, fashion…"
              className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
            <Button type="submit" size="sm" className="rounded-full">
              Search
            </Button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
