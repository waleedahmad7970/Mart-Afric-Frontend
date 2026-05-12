import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { Search } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import productsApis from "../api/products/products-apis";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../hooks/debouce";
import { productActions } from "../store/slices/product/slice";
import ProductCardSkeleton from "../components/skeletons/product-skeleton";
import { updateParams } from "../helpers/helpers";
import categoriesApis from "../api/categories/categories-apis";

/* ---------------- FILTER PANEL ---------------- */

const FiltersPanel = ({
  q,
  setQ,
  clearAll,
  selectedCats,
  toggleCat,
  price,
  setPrice,
  MAX_PRICE,
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
        <button onClick={clearAll}>Clear</button>
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
        <label key={c.slug} className="flex gap-2">
          <Checkbox
            checked={selectedCats.includes(c.slug)}
            onCheckedChange={() => toggleCat(c.slug)}
          />
          {c.name}
        </label>
      ))}
    </div>

    <div>
      <h4>Price</h4>
      <Slider value={price} onValueChange={setPrice} min={0} max={MAX_PRICE} />
    </div>

    <div>
      <h4>Rating</h4>
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

    <label className="flex gap-2">
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
  const [price, setPrice] = useState([0, 1000]);
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

  const MAX_PRICE = useMemo(() => {
    const prices = products?.map((p) => p.price) || [];
    return prices.length ? Math.ceil(Math.max(...prices)) : 1000;
  }, [products]);

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
      minPrice: price[0],
      maxPrice: price[1],
      rating: minRating,
      inStock,
      sort: sortMap[sort],
    });
  };

  /* ---------------- RESET ON FILTER ---------------- */

  useEffect(() => {
    dispatch(productActions.resetProducts());
    fetchProducts(1);
  }, [debouncedQ, selectedCats, price, minRating, inStock, sort]);

  useEffect(() => {
    const urlQ = params.get("q") || "";
    setQ(urlQ);
  }, [params]);

  useEffect(() => {
    categoriesApis.getAllCategories();
  }, []);

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
        <aside>
          <FiltersPanel
            q={q}
            setQ={setQ}
            clearAll={() =>
              dispatch(productActions.setProductsPagination({ page: 1 }))
            }
            selectedCats={selectedCats}
            toggleCat={(slug) =>
              setSelectedCats((prev) =>
                prev.includes(slug)
                  ? prev.filter((s) => s !== slug)
                  : [...prev, slug],
              )
            }
            price={price}
            setPrice={setPrice}
            MAX_PRICE={MAX_PRICE}
            minRating={minRating}
            setMinRating={setMinRating}
            inStock={inStock}
            setInStock={setInStock}
            params={params}
            setParams={setParams}
            categories={categories}
          />
        </aside>

        <div>
          <div className="flex justify-between mb-6">
            <p>{productsPagination.total} products</p>

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
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
              dataLength={products?.length}
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
                {" "}
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 no-scrollbar ">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
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
