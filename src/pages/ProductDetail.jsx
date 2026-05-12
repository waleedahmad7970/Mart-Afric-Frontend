import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Minus, Plus, Star, ArrowLeft } from "lucide-react";
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
  } = productDetails || {};
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    // if (product?.id) tracproductkInteraction(product.id, "view");
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
  return (
    <div className="container py-10 lg:py-16">
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

          <p className="font-display text-3xl mt-6 tabular-nums">
            ${price?.toFixed(2)}
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
              Add to cart · ${(price * qty).toFixed(2)}
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

      <PersonalizedRails contextSeed={productDetails} />
    </div>
  );
};

export default ProductDetail;
