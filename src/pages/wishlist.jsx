import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingBag, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import wishlistApis from "../api/wishlist/wishlist-apis";
import { useSelector } from "react-redux";

// Replace this import with however you make API calls in your app!
// Example: import api from "../api/axios";

const WishlistPage = () => {
  const {
    wishlist = null,
    items = [],
    total = 0,
  } = useSelector((state) => state.wishlist) || {};
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- FETCH WISHLIST ---------------- */
  const fetchWishlist = async () => {};

  useEffect(() => {
    wishlistApis.getWishlist().then(([res, error]) => {});
  }, []);

  /* ---------------- TOGGLE / REMOVE ITEM ---------------- */
  const handleToggleWishlist = async (productId) => {
    const [res, error] = await wishlistApis.toggleWishlist(productId);
  };

  /* ---------------- CLEAR ALL ---------------- */
  const handleClearAll = async () => {
    wishlistApis.clearWishlist().then(([res, error]) => {});
  };

  /* ---------------- LOADING STATE ---------------- */
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your wishlist...</p>
      </div>
    );
  }

  console.log("Wishlist items:", items); // Debug log to check the structure of items

  /* ---------------- EMPTY STATE ---------------- */
  if (items?.length === 0) {
    return (
      <div className="container py-20 min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-up">
        <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-display font-semibold mb-3">
          Your wishlist is empty
        </h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Save items you love to your wishlist. Review them anytime and easily
          move them to your cart.
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link to="/shop">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }

  /* ---------------- POPULATED STATE ---------------- */
  return (
    <div className="container py-12 min-h-screen animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold">
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-2">
            {items?.length} {items?.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        <Button
          variant="outline"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleClearAll}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Wishlist
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items?.map((item) => (
          <ProductCard
            key={item?.product?._id}
            product={item?.product}
            isWishlisted={true}
            onToggleWishlist={handleToggleWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
