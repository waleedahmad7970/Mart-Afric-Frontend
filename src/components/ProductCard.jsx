import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product.id}`}
    className="group block animate-fade-up"
  >
    <Card className="overflow-hidden border-0 bg-secondary/40 rounded-2xl transition-smooth group-hover:shadow-elevated">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
      </div>
    </Card>
    <div className="pt-4 px-1 flex justify-between items-start gap-3">
      <div>
        <h3 className="font-display text-lg leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{product.tagline}</p>
      </div>
      <p className="text-sm font-medium tabular-nums">${product.price.toFixed(2)}</p>
    </div>
  </Link>
);

export default ProductCard;
