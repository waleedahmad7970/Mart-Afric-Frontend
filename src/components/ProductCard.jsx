import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { AlertCircle, Heart } from "lucide-react";

const ProductCard = ({ product, isWishlisted, onToggleWishlist }) => {
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleWishlist) {
      onToggleWishlist(product._id);
    }
  };

  return (
    <Link
      to={`${product?.expired ? "" : `/product/${product?._id}`}`}
      className="group block animate-fade-up"
    >
      <Card className="relative overflow-hidden border-0 bg-secondary/40 rounded-2xl transition-smooth group-hover:shadow-elevated">
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 hover:bg-white backdrop-blur-sm transition-all duration-200 shadow-sm"
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted
                ? "fill-red-500 text-red-500" // Filled red heart if in wishlist
                : "text-gray-600 hover:text-red-500" // Outline heart if not
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
        <div className="absolute  pointer-events-none inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[3px] dark:bg-black/50">
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
          <p className="text-xs  text-muted-foreground mt-0.5">
            {product?.tagline}
          </p>
        </div>
        <p className="text-sm font-medium tabular-nums">
          ${product?.price?.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
