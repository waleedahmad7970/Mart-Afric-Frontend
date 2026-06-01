import { useState, useEffect } from "react";
import { Search, Star, TrendingUp, Award, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import your actual Carousel components!
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import productsApis from "../../../api/products/products-apis";
import { useSelector } from "react-redux";
import ProductCard from "../../../components/ProductCard";
import useDebounce from "../../../hooks/debouce";

const CustomSectionsManager = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  console.log("searchResults", searchResults);

  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const {
    bestSellers = [],
    featuredProducts = [],
    trendingsProducts = [],
  } = useSelector((state) => state.products) || {};

  const searchdeb = useDebounce(search, 500);

  // 1. Fetch the actual custom sections directly from your dedicated endpoints
  const fetchSections = async () => {
    setIsLoadingSections(true);
    try {
      await Promise.all([
        productsApis.getBestSellers(),
        productsApis.trendingProducts(),
        productsApis.featuredProducts(),
      ]);

      // Handle the data extraction based on your API response structure
    } catch (error) {
      console.error("Failed to fetch custom sections", error);
    } finally {
      setIsLoadingSections(false);
    }
  };

  // 2. Fetch search results specifically for the search bar
  const fetchSearchResults = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const [res, error] = await productsApis.getAdminProducts({
        search: searchQuery,
        page: 1,
        limit: 20,
      });
      const { success, data } = res?.data || {};
      if (success) {
        setSearchResults(data.products || data);
      }
    } catch (error) {
      console.error("Failed to search products", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    fetchSearchResults(searchdeb);
  }, [searchdeb]);

  // 3. Toggle Logic
  const toggleSectionFlag = async (product, field) => {
    console.log("toggleSectionFlag", product, field);
    const newValue = !product[field];

    setSearchResults((prev) =>
      prev.map((p) =>
        p?._id === product._id ? { ...p, [field]: newValue } : p,
      ),
    );

    try {
      await productsApis.updateProduct({
        productId: product._id,
        body: { [field]: newValue },
      });
      fetchSections(); // Refresh carousels after change
    } catch (error) {
      console.error(`Failed to update ${field}`, error);
      fetchSearchResults(search);
    }
  };

  // Reusable Wrapper for the Product Card + Tags to keep code clean inside the Carousel
  const AdminProductItem = ({ product }) => (
    <div className="flex flex-col h-full">
      {/* We pass empty wishlist props so the card doesn't crash on the admin side */}
      <ProductCard
        product={product}
        isWishlisted={false}
        onToggleWishlist={() => {}}
      />
      <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-border/50">
        <button
          onClick={() => toggleSectionFlag(product, "isBestSeller")}
          className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${
            product?.isBestSeller
              ? "bg-yellow-50 border-yellow-200 text-yellow-700 shadow-sm"
              : "border-transparent text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <Star
            className={`h-4 w-4 mb-1 ${product?.isBestSeller ? "fill-yellow-500" : ""}`}
          />
          <span className="text-[10px] font-semibold">Best</span>
        </button>

        <button
          onClick={() => toggleSectionFlag(product, "isTrending")}
          className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${
            product?.isTrending
              ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
              : "border-transparent text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <TrendingUp className="h-4 w-4 mb-1" />
          <span className="text-[10px] font-semibold">Trending</span>
        </button>

        <button
          onClick={() => toggleSectionFlag(product, "isFeatured")}
          className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${
            product?.isFeatured
              ? "bg-purple-50 border-purple-200 text-purple-700 shadow-sm"
              : "border-transparent text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <Award
            className={`h-4 w-4 mb-1 ${product?.isFeatured ? "fill-purple-500" : ""}`}
          />
          <span className="text-[10px] font-semibold">Featured</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl">Custom Sections</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search products and click the tags to pin them to your storefront
          sections.
        </p>
      </div>

      {/* SEARCH BAR UI */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            placeholder="Search products to pin..."
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* SEARCH RESULTS AREA */}
      {search.trim().length > 0 && searchResults.length > 0 && (
        <div className="bg-muted/30 border border-border rounded-2xl p-6 shadow-inner">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-lg">Search Results</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            {searchResults.map((p) => (
              <AdminProductItem key={p?._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE SECTIONS AREA WITH CAROUSELS */}
      {isLoadingSections ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-16">
          {/* CAROUSEL: BEST SELLERS */}
          <Carousel
            opts={{ align: "start", loop: false, dragFree: true }}
            className="w-full"
          >
            <div className="flex items-end justify-between mb-6 gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-800">
                  <Star className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">Best Sellers</h2>
                <Badge variant="secondary" className="ml-2 rounded-full">
                  {bestSellers.length}
                </Badge>
              </div>
              <div className="hidden sm:flex items-center gap-2 relative">
                <CarouselPrevious className="static translate-y-0 h-9 w-9" />
                <CarouselNext className="static translate-y-0 h-9 w-9" />
              </div>
            </div>

            {bestSellers?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No products found.
              </p>
            ) : (
              <CarouselContent className="-ml-5">
                {bestSellers?.map((p) => (
                  <CarouselItem
                    key={p?._id}
                    className="pl-5 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
                  >
                    <AdminProductItem product={p} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            )}
          </Carousel>

          {/* CAROUSEL: TRENDING */}
          <Carousel
            opts={{ align: "start", loop: false, dragFree: true }}
            className="w-full"
          >
            <div className="flex items-end justify-between mb-6 gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-800">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">Trending Now</h2>
                <Badge variant="secondary" className="ml-2 rounded-full">
                  {trendingsProducts.length}
                </Badge>
              </div>
              <div className="hidden sm:flex items-center gap-2 relative">
                <CarouselPrevious className="static translate-y-0 h-9 w-9" />
                <CarouselNext className="static translate-y-0 h-9 w-9" />
              </div>
            </div>

            {trendingsProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No products found.
              </p>
            ) : (
              <CarouselContent className="-ml-5">
                {trendingsProducts.map((p) => (
                  <CarouselItem
                    key={p?._id}
                    className="pl-5 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
                  >
                    <AdminProductItem product={p} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            )}
          </Carousel>

          {/* CAROUSEL: FEATURED */}
          <Carousel
            opts={{ align: "start", loop: false, dragFree: true }}
            className="w-full"
          >
            <div className="flex items-end justify-between mb-6 gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-800">
                  <Award className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">Featured Items</h2>
                <Badge variant="secondary" className="ml-2 rounded-full">
                  {featuredProducts?.length || 0}
                </Badge>
              </div>
              <div className="hidden sm:flex items-center gap-2 relative">
                <CarouselPrevious className="static translate-y-0 h-9 w-9" />
                <CarouselNext className="static translate-y-0 h-9 w-9" />
              </div>
            </div>

            {featuredProducts?.length === 0 || !featuredProducts ? (
              <p className="text-sm text-muted-foreground">
                No products found.
              </p>
            ) : (
              <CarouselContent className="-ml-5">
                {featuredProducts.map((p) => (
                  <CarouselItem
                    key={p?._id}
                    className="pl-5 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
                  >
                    <AdminProductItem product={p} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default CustomSectionsManager;
