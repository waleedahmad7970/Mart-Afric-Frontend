import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Minus, Plus, Star, ArrowLeft, PoundSterling } from "lucide-react";
import { findProduct } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import PersonalizedRails from "@/components/PersonalizedRails";
import { trackInteraction } from "@/lib/userTaste";
import productsApis from "../api/products/products-apis";
import { useSelector } from "react-redux";
import cartApis from "../api/cart/cart-apis";

const ProductDetail = () => {
  const { id: _id } = useParams();
  const { productDetails = {} } = useSelector((state) => state.products) || {};
  const { addToCartLoader } =
    useSelector((state) => state.loader?.loaders) || {};

  const {
    name,
    image,
    price,
    rating,
    stock,
    description,
    origin,
    tagline,
    category,
    reviews = [],
  } = productDetails || {};

  const { add } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    productsApis.getProduct(_id).then(
      ([res, error]) => {},
      (error) => {},
    );
  }, [_id]);

  if (!_id) return <Navigate to="/shop" replace />;

  const handleAddToCart = () => {
    const body = {
      product: productDetails._id,
      quantity: qty,
    };
    cartApis.addToCart(body);
  };

  const renderStars = (ratingValue) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              ratingValue >= star
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted/30"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container py-10 lg:py-16 overflow-hidden">
      <Link
        to="/shop"
        className="text-sm text-muted-foreground inline-flex items-center gap-1 mb-8 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="rounded-[2rem] overflow-hidden bg-secondary/40 aspect-square">
          <img
            src={image}
            alt={name}
            width={800}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:py-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {origin}
          </p>
          <h1 className="font-display text-4xl md:text-5xl mt-2">{name}</h1>
          <p className="text-muted-foreground mt-2">{tagline}</p>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-accent text-accent" /> {rating}
            </div>
            <span className="text-muted-foreground text-sm">
              · {stock} in stock
            </span>
          </div>

          <p className="font-display flex items-center text-3xl mt-6 tabular-nums">
            <PoundSterling />
            {price?.toFixed(2)}
          </p>

          <p className="mt-6 text-foreground/80 leading-relaxed">
            {description}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-border rounded-full">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center tabular-nums">{qty}</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="lg"
              className="rounded-full px-8 h-12 bg-gradient-warm text-primary-foreground shadow-glow flex-1 sm:flex-initial"
              loading={addToCartLoader}
              onClick={() => handleAddToCart()}
            >
              Add to cart ·{" "}
              <div className="flex justify-start items-center">
                <PoundSterling className="!h-[14px] !w-[14px]" />{" "}
                {(price * qty).toFixed(2)}
              </div>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 pt-6 border-t border-border/60 text-xs">
            <div>
              <p className="text-muted-foreground mb-1">Origin</p>
              <p>{origin}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Shipping</p>
              <p className="font-medium">2–4 business days</p>
              <p className="text-xs text-muted-foreground">
                Fast delivery across major cities
              </p>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Returns</p>
              <p className="font-medium">30-day easy returns</p>
              <p className="text-xs text-muted-foreground">
                No questions asked refund policy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONTINUOUS SCROLLING REVIEWS SECTION */}
      <div className="mt-16 lg:mt-24 border-t border-border/60 pt-12">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-semibold">
            Customer Reviews
          </h2>
        </div>

        {reviews.length === 0 ? (
          /* Sleek & minimal empty state */
          <p className="text-muted-foreground text-sm">
            No reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          /* Infinite X-Axis Scroll Track */
          <div className="relative flex overflow-hidden w-full group py-4 -mx-4 px-4">
            {/* Inline CSS for the continuous marquee animation */}
            <style>{`
              @keyframes scroll-x {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-100% - 1.5rem)); } /* 1.5rem accounts for gap-6 */
              }
              .animate-scroll-x {
                animation: scroll-x 25s linear infinite;
              }
              .group:hover .animate-scroll-x {
                animation-play-state: paused;
              }
            `}</style>

            {/* We duplicate the review array wrapper 4 times to ensure it perfectly loops across any screen size */}
            {[...Array(4)].map((_, arrayIndex) => (
              <div
                key={arrayIndex}
                className="flex gap-6 w-max animate-scroll-x pr-6 shrink-0"
              >
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="w-[320px] sm:w-[380px] shrink-0 bg-card border border-border rounded-2xl p-6 shadow-sm whitespace-normal"
                  >
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground line-clamp-1">
                            {review.user?.name || "Anonymous Customer"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 pt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    {review.title && (
                      <h4 className="font-semibold text-foreground mb-1.5 text-sm">
                        {review.title}
                      </h4>
                    )}
                    <p className="text-muted-foreground text-sm line-clamp-4">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <PersonalizedRails contextSeed={productDetails} />
    </div>
  );
};

export default ProductDetail;
