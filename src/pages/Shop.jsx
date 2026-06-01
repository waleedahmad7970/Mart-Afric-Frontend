import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { Filter } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

import productsApis from "../api/products/products-apis";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../hooks/debouce";
import { productActions } from "../store/slices/product/slice";
import ProductCardSkeleton from "../components/skeletons/product-skeleton";
import { updateParams } from "../helpers/helpers";
import categoriesApis from "../api/categories/categories-apis";

// FIX 1: Set a static max price so the slider doesn't shrink to $0 when filtering
const MAX_PRICE = 1000;

/* ---------------- FILTER PANEL ---------------- */

const FiltersPanel = ({
  q,
  setQ,
  clearAll,
  selectedCats,
  toggleCat,
  price,
  setPrice,
  handlePriceCommit,
  minRating,
  setMinRating,
  inStock,
  setInStock,
  params,
  setParams,
  categories,
}) => (
  <div className="space-y-8">
    <div>
      <div className="flex justify-between mb-4">
        <h3>Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          Clear
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4" />
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            updateParams(params, setParams, { q: e.target.value });
          }}
          className="pl-9"
          placeholder="Search..."
        />
      </div>
    </div>

    <div>
      <h4>Category</h4>
      {categories?.map((c) => (
        <label
          key={c._id}
          className="flex gap-2 mb-2 items-center cursor-pointer"
        >
          <Checkbox
            checked={selectedCats.includes(c._id)}
            onCheckedChange={() => toggleCat(c._id)}
          />
          {c.name}
        </label>
      ))}
    </div>

    {/* --- UPGRADED PRICE FILTER --- */}
    <div className="pt-2">
      <h4 className="font-semibold mb-6">Price Range</h4>

      <Slider
        value={price}
        onValueChange={setPrice}
        onValueCommit={handlePriceCommit}
        min={0}
        max={MAX_PRICE}
        step={1}
        className="mb-8"
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full">
          <span className="absolute left-3 top-2 text-sm text-muted-foreground font-medium">
            $
          </span>
          <Input
            type="number"
            value={price[0]}
            onChange={(e) => setPrice([Number(e.target.value), price[1]])}
            onBlur={() => handlePriceCommit(price)}
            className="pl-7 h-9 text-sm rounded-lg"
            placeholder="Min"
          />
        </div>

        <span className="text-muted-foreground font-medium">-</span>

        <div className="relative w-full">
          <span className="absolute left-3 top-2 text-sm text-muted-foreground font-medium">
            $
          </span>
          <Input
            type="number"
            value={price[1]}
            onChange={(e) => setPrice([price[0], Number(e.target.value)])}
            onBlur={() => handlePriceCommit(price)}
            className="pl-7 h-9 text-sm rounded-lg"
            placeholder="Max"
          />
        </div>
      </div>
    </div>

    <div>
      <h4>Rating</h4>
      <div className="flex gap-2 flex-wrap mt-2">
        {[0, 4, 4.5, 4.8].map((r) => (
          <Button
            key={r}
            size="sm"
            variant={minRating === r ? "default" : "outline"}
            onClick={() => setMinRating(r)}
          >
            {r === 0 ? "Any" : `${r}+`}
          </Button>
        ))}
      </div>
    </div>

    <label className="flex gap-2 items-center cursor-pointer">
      <Checkbox checked={inStock} onCheckedChange={(v) => setInStock(!!v)} />
      In stock only
    </label>
  </div>
);

/* ---------------- SHOP ---------------- */

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();

  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 600);

  const [selectedCats, setSelectedCats] = useState([]);
  const [price, setPrice] = useState([0, MAX_PRICE]);
  const [committedPrice, setCommittedPrice] = useState([0, MAX_PRICE]); // Triggers the API
  const [minRating, setMinRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");

  const { products, productsPagination } = useSelector(
    (state) => state.products,
  );
  const { categories = [] } = useSelector((state) => state.categories);
  const { loaders = {} } = useSelector((state) => state.loader) || {};
  const { productsLoader } = loaders || {};

  const page = productsPagination.page || 1;
  const totalPages = productsPagination.totalPages || 1;

  const sortMap = {
    featured: "",
    low: "price_asc",
    high: "price_desc",
    rating: "rating_desc",
  };

  /* ---------------- FETCH ---------------- */

  const fetchProducts = (pageNumber) => {
    productsApis.products({
      page: pageNumber,
      limit: 12,
      search: debouncedQ,
      category: selectedCats.join(","),
      minPrice: committedPrice[0], // Use committedPrice
      maxPrice: committedPrice[1],
      rating: minRating,
      inStock,
      sort: sortMap[sort],
    });
  };

  /* ---------------- CLEAR ALL FIX ---------------- */
  // FIX 5: Actually clear the local state variables so the UI resets
  const handleClearAll = () => {
    setQ("");
    setSelectedCats([]);
    setPrice([0, MAX_PRICE]);
    setCommittedPrice([0, MAX_PRICE]);
    setMinRating(0);
    setInStock(false);
    setSort("featured");
    setParams({});
    dispatch(productActions.setProductsPagination({ page: 1 }));
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    dispatch(productActions.resetProducts());
    fetchProducts(1);
    // Listen to committedPrice instead of price
  }, [debouncedQ, selectedCats, committedPrice, minRating, inStock, sort]);

  useEffect(() => {
    const urlQ = params.get("q") || "";
    setQ(urlQ);
  }, [params]);

  useEffect(() => {
    categoriesApis.getAllCategories();
  }, []);
  const onToggleWishlist = (productId) => {
    // Implement the logic to add/remove from wishlist
    // For example, you might call an API endpoint here
    console.log("Toggling wishlist for product ID:", productId);
  };

  /* ---------------- LOAD MORE ---------------- */

  const loadMore = () => {
    if (page < totalPages) {
      fetchProducts(page + 1);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container py-12">
      <h1 className="text-4xl mb-8">Shop everything</h1>

      <div className="grid lg:grid-cols-[260px_1fr] gap-10">
        {/* =========================================
    DESKTOP VIEW: Standard Sidebar
========================================= */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar pr-2">
          <FiltersPanel
            q={q}
            setQ={setQ}
            clearAll={handleClearAll}
            selectedCats={selectedCats}
            toggleCat={(id) =>
              setSelectedCats((prev) =>
                prev.includes(id)
                  ? prev.filter((s) => s !== id)
                  : [...prev, id],
              )
            }
            price={price}
            setPrice={setPrice}
            handlePriceCommit={(val) => setCommittedPrice(val)}
            minRating={minRating}
            setMinRating={setMinRating}
            inStock={inStock}
            setInStock={setInStock}
            params={params}
            setParams={setParams}
            categories={categories}
          />
        </aside>

        {/* =========================================
    MOBILE VIEW: Floating Button & Bottom Sheet
========================================= */}
        <div className="lg:hidden">
          {/* Floating Pill Button at bottom of screen */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="lg"
                  className="rounded-full shadow-elevated px-6 h-12 flex items-center gap-2 font-medium"
                >
                  <Filter className="h-4 w-4" />
                  Filter & Sort
                  {/* Optional: Show badge if filters are active */}
                  {(selectedCats.length > 0 || price[1] < 1000) && (
                    <span className="ml-1 flex h-2 w-2 rounded-full bg-destructive" />
                  )}
                </Button>
              </SheetTrigger>

              {/* Bottom Drawer Content */}
              <SheetContent
                side="bottom"
                className="h-[85vh] rounded-t-[2rem] p-0 flex flex-col"
              >
                <SheetHeader className="px-6 py-4 border-b border-border/50 text-left">
                  <SheetTitle className="text-xl font-display">
                    Filters
                  </SheetTitle>
                </SheetHeader>

                {/* Scrollable area for the FiltersPanel */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <FiltersPanel
                    q={q}
                    setQ={setQ}
                    clearAll={handleClearAll}
                    selectedCats={selectedCats}
                    toggleCat={(id) =>
                      setSelectedCats((prev) =>
                        prev.includes(id)
                          ? prev.filter((s) => s !== id)
                          : [...prev, id],
                      )
                    }
                    price={price}
                    setPrice={setPrice}
                    handlePriceCommit={(val) => setCommittedPrice(val)}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    inStock={inStock}
                    setInStock={setInStock}
                    params={params}
                    setParams={setParams}
                    categories={categories}
                  />
                </div>

                {/* Optional: Quick action footer to close drawer */}
                <div className="p-4 border-t border-border/50 bg-background">
                  <SheetTrigger asChild>
                    <Button className="w-full h-12 rounded-xl text-base">
                      Show Results
                    </Button>
                  </SheetTrigger>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-6 items-center">
            <p className="text-gray-500">
              {productsPagination.total || 0} products
            </p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="featured">Featured</option>
              <option value="low">Low → High</option>
              <option value="high">High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {productsLoader && products?.length === 0 ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <InfiniteScroll
              dataLength={products?.length || 0}
              next={loadMore}
              hasMore={page < totalPages}
              loader={
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <div className="min-h-screen">
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 no-scrollbar">
                  {products?.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      isWishlisted={true}
                      onToggleWishlist={onToggleWishlist}
                    />
                  ))}
                </div>
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
