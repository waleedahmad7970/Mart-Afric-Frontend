const CategorySkeleton = () => {
  return (
    <div className="grid sm:grid-cols-2 w-full lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          /* We use the exact same layout classes:
             h-44, p-8, flex-col, justify-between, rounded-2xl 
          */
          className="h-44 p-8 flex flex-col justify-between rounded-2xl bg-muted/40 animate-pulse border border-border/50"
        >
          {/* Top Number (matches the text-xs) */}
          <div className="h-3 w-6 bg-muted-foreground/20 rounded" />

          <div className="space-y-3">
            {/* Title (matches font-display text-2xl) */}
            <div className="h-7 w-3/4 bg-muted-foreground/20 rounded-md" />

            {/* "Shop now" link (matches the bottom text) */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-16 bg-muted-foreground/20 rounded" />
              <div className="h-3 w-3 bg-muted-foreground/20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
