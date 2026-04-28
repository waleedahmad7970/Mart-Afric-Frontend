import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const MAX_PRICE = Math.ceil(Math.max(...products.map((p) => p.price)));

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";
  const initialCat = params.get("cat");

  const [q, setQ] = useState(initialQ);
  const [selectedCats, setSelectedCats] = useState(initialCat ? [initialCat] : []);
  const [price, setPrice] = useState([0, MAX_PRICE]);
  const [minRating, setMinRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync URL query param into local state if it changes externally
  useEffect(() => {
    const urlQ = params.get("q") || "";
    if (urlQ !== q) setQ(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const toggleCat = (slug) => {
    setSelectedCats((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const clearAll = () => {
    setQ("");
    setSelectedCats([]);
    setPrice([0, MAX_PRICE]);
    setMinRating(0);
    setInStock(false);
    setParams({});
  };

  const list = useMemo(() => {
    let arr = [...products];
    if (selectedCats.length) arr = arr.filter((p) => selectedCats.includes(p.category));
    if (q.trim()) {
      const needle = q.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.tagline.toLowerCase().includes(needle) ||
          p.origin.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle)
      );
    }
    arr = arr.filter((p) => p.price >= price[0] && p.price <= price[1]);
    if (minRating > 0) arr = arr.filter((p) => p.rating >= minRating);
    if (inStock) arr = arr.filter((p) => p.stock > 0);
    if (sort === "low") arr.sort((a, b) => a.price - b.price);
    if (sort === "high") arr.sort((a, b) => b.price - a.price);
    if (sort === "rating") arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [selectedCats, q, sort, price, minRating, inStock]);

  const FiltersPanel = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Filters</h3>
          <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
            Clear all
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="pl-9 rounded-full"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3 uppercase tracking-wider text-muted-foreground">Category</h4>
        <div className="space-y-2.5">
          {categories.map((c) => (
            <label key={c.slug} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={selectedCats.includes(c.slug)}
                onCheckedChange={() => toggleCat(c.slug)}
                id={`cat-${c.slug}`}
              />
              <span className="text-sm group-hover:text-primary transition-smooth">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3 uppercase tracking-wider text-muted-foreground">Price range</h4>
        <Slider
          value={price}
          onValueChange={setPrice}
          min={0}
          max={MAX_PRICE}
          step={1}
          className="my-5"
        />
        <div className="flex items-center justify-between text-sm tabular-nums">
          <span>${price[0]}</span>
          <span className="text-muted-foreground">—</span>
          <span>${price[1]}</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3 uppercase tracking-wider text-muted-foreground">Minimum rating</h4>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <Button
              key={r}
              type="button"
              variant={minRating === r ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setMinRating(r)}
            >
              {r === 0 ? "Any" : `${r}★+`}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3 uppercase tracking-wider text-muted-foreground">Availability</h4>
        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox checked={inStock} onCheckedChange={(v) => setInStock(!!v)} id="in-stock" />
          <Label htmlFor="in-stock" className="text-sm cursor-pointer">In stock only</Label>
        </label>
      </div>
    </div>
  );

  return (
    <div className="container py-12 lg:py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">All departments</p>
        <h1 className="font-display text-5xl md:text-6xl">Shop everything</h1>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-14">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <FiltersPanel />
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden rounded-full"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
              </Button>
              <p className="text-sm text-muted-foreground">{list.length} products</p>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-background border border-input rounded-full px-4 py-2 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {list.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-3xl">
              <p className="font-display text-2xl mb-2">Nothing matches</p>
              <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters or search query.</p>
              <Button onClick={clearAll} variant="outline" className="rounded-full">Reset filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-10">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-background border-l border-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="font-display text-xl">Filters</p>
              <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FiltersPanel />
            <Button className="w-full mt-8 rounded-full" onClick={() => setMobileFiltersOpen(false)}>
              Show {list.length} products
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
