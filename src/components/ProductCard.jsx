import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, Heart, Star } from "lucide-react"; // <-- Added Star here

const ProductCard = ({ product, isWishlisted, onToggleWishlist }) => {
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleWishlist) {
      onToggleWishlist(product._id);
    }
  };

  const regularRetailPrice = product?.salePrice || 0;
  const currentDiscountPrice = product?.discountPrice || 0;

  const hasDiscount =
    currentDiscountPrice > 0 && currentDiscountPrice < regularRetailPrice;

  const currentPrice = hasDiscount ? currentDiscountPrice : regularRetailPrice;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((regularRetailPrice - currentPrice) / regularRetailPrice) * 100,
      )
    : 0;

  const afterDiscount = hasDiscount ? regularRetailPrice - currentPrice : 0;

  const rating = product?.rating || 0;
  let formattedEndDate = null;
  if (hasDiscount && product?.promotionEndDate) {
    const endDate = new Date(product.promotionEndDate);
    formattedEndDate = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  return (
    <Link
      to={`${product?.expired ? "" : `/product/${product?._id}`}`}
      className="group block animate-fade-up"
    >
      <Card className="relative overflow-hidden border-0 bg-secondary/40 rounded-2xl transition-smooth group-hover:shadow-elevated">
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
            {discountPercentage}% OFF
          </div>
        )}

        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 hover:bg-white backdrop-blur-sm transition-all duration-200 shadow-sm"
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product?.image}
            alt={product?.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />
        </div>
      </Card>

      {product?.expired && (
        <div className="absolute pointer-events-none inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[3px] dark:bg-black/50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg rotate-[-5deg]">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest uppercase">
              Expired
            </span>
          </div>
        </div>
      )}

      <div className="pt-4 px-1 flex justify-between items-start gap-3">
        <div>
          <h3 className="font-display line-clamp-2 text-lg leading-tight">
            {product?.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product?.tagline || product?.category?.name}
          </p>

          {/* NEW UI: Star Rating Array */}
          <div className="flex items-center gap-0.5 mt-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  rating >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-right shrink-0 flex flex-col">
          <p
            className={`text-md font-display leading-4 font-semibold tabular-nums ${
              hasDiscount
                ? "text-emerald-600 dark:text-emerald-500"
                : "text-foreground"
            }`}
          >
            ${currentPrice.toFixed(2)}
          </p>

          {hasDiscount && (
            <p className="text-sm font-normal font-display leading-4 text-gray-500 line-through tabular-nums mt-0.5">
              ${regularRetailPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
