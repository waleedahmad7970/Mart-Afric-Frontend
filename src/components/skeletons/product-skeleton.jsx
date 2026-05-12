import { Card } from "@/components/ui/card";

const ProductCardSkeleton = () => (
  <div className="block animate-pulse">
    {/* Image Skeleton */}
    <Card className="overflow-hidden border-0 bg-muted rounded-2xl">
      <div className="aspect-square w-full bg-secondary/60" />
    </Card>

    {/* Content Skeleton */}
    <div className="pt-4 px-1 flex justify-between items-start gap-3">
      <div className="flex-1 space-y-2">
        {/* Title Line */}
        <div className="h-5 bg-muted rounded-md w-3/4" />
        {/* Tagline Line */}
        <div className="h-3 bg-muted rounded-md w-1/2" />
      </div>

      {/* Price Skeleton */}
      <div className="h-4 bg-muted rounded-md w-12" />
    </div>
  </div>
);

export default ProductCardSkeleton;
