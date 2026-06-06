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
  LogOut,
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
import userApi from "../../api/user/user-apis";

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
    userApi.getMe();
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/75 border-b border-border/60 relative">
      <div className="container flex items-center justify-between h-16 md:h-20 relative">
        {/* =========================================
            LEFT SECTION (Mobile: Menu & Search | Desktop: Logo) 
        ========================================= */}
        <div className="flex items-center gap-1 md:gap-0 flex-1 md:flex-none">
          {/* Mobile Hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden -ml-2 text-foreground"
                aria-label="Menu"
              >
                <Menu className="h-[18px] w-[18px]" />
              </Button>
            </SheetTrigger>

            {/* Mobile App Drawer */}
            <SheetContent
              side="left"
              className="w-[85%] sm:w-[400px] flex flex-col p-0 overflow-hidden border-r-0 shadow-2xl"
            >
              <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-10 pb-6">
                {/* Search in Drawer */}
                <form onSubmit={submitSearch} className="relative w-full mb-8">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                  <Input
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search store..."
                    className="pl-10 pr-12 w-full rounded-full bg-muted/50 border-transparent h-10 transition-colors focus-visible:bg-background focus-visible:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={!searchQ.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                {/* Primary Links */}
                <nav className="flex flex-col gap-5 mb-8">
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
                </nav>

                <div className="h-px w-full bg-border/60 mb-6" />

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

                  <div
                    className={`flex flex-col gap-2 pl-4 overflow-hidden transition-all duration-500 ease-in-out ${showCategories ? "max-h-[1500px] mt-2 opacity-100" : "max-h-0 opacity-0"} border-l-2 border-primary/20`}
                  >
                    {categories?.map((c) => (
                      <div key={c?._id || c?.slug} className="flex flex-col">
                        <div className="flex items-center justify-between py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                          <Link
                            to={`/shop?cat=${c?.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex-1 text-base text-muted-foreground hover:text-primary transition-colors"
                          >
                            {c?.name}
                          </Link>
                          {c?.subcategories?.length > 0 && (
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
                                className={`h-4 w-4 transition-transform duration-300 ${expandedCategory === c._id ? "rotate-180 text-primary" : ""}`}
                              />
                            </button>
                          )}
                        </div>

                        {c.subcategories?.length > 0 && (
                          <div
                            className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${expandedCategory === c._id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
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
                                  key={subCat._id}
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
                  </div>
                </div>
              </div>

              {/* Drawer Footer (Theme & Auth) */}
              <div className="p-6 bg-muted/30 border-t border-border/50 flex items-center justify-between shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggle}
                  className="gap-2"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4" /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" /> Dark Mode
                    </>
                  )}
                </Button>

                {!user ? (
                  <Button
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                  >
                    Sign in
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-red-500 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground"
            onClick={() => setSearchOpen((s) => !s)}
          >
            {searchOpen ? (
              <X className="h-[18px] w-[18px]" />
            ) : (
              <Search className="h-[18px] w-[18px]" />
            )}
          </Button>

          {/* Desktop Logo (Hidden on Mobile) */}
          <Link to="/" className="hidden md:flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              Mart Afric
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              — Everything you need
            </span>
          </Link>
        </div>

        {/* =========================================
            CENTER SECTION (Mobile: Logo | Desktop: Links)
        ========================================= */}

        {/* Mobile Logo (Absolute Center) */}
        <Link
          to="/"
          className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <span className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
            Mart Afric
          </span>
        </Link>

        {/* Desktop Links (Exactly original styling) */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm transition-smooth hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground/80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* =========================================
            RIGHT SECTION (Icons)
        ========================================= */}
        <div className="flex items-center justify-end gap-1 md:gap-2 flex-1 md:flex-none">
          {/* Desktop Search */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setSearchOpen((s) => !s)}
          >
            {searchOpen ? (
              <X className="h-[18px] w-[18px]" />
            ) : (
              <Search className="h-[18px] w-[18px]" />
            )}
          </Button>

          {/* Desktop Theme */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={toggle}
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </Button>

          {/* User Account */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
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

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/wishlist")}
          >
            <Heart
              className="h-[18px] w-[18px]"
              color={total > 0 ? "red" : ""}
              fill={total > 0 ? "red" : ""}
            />
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cart")}
            className="relative"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* =========================================
          FLOATING SEARCH BAR (Original Styling)
      ========================================= */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full border-t border-border/60 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 z-50">
          <form
            onSubmit={submitSearch}
            className="container py-2 flex items-center gap-3"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              autoFocus
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search electronics, groceries, fashion…"
              className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
            <Button type="submit" size="sm" className="rounded-full px-6">
              Search
            </Button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
