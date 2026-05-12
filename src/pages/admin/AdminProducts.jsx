import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { productActions } from "../../store/slices/product/slice";
import productsApis from "../../api/products/products-apis";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateUpdateProductModel from "./ProductCreateUpdateModal";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, productsPagination } = useSelector(
    (state) => state.products,
  );
  const { page, totalPages, limit } = productsPagination || {
    page: 1,
    totalPages: 0,
    limit: 10,
  };

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState({});
  const fetchNextPage = () => {
    if (page < totalPages) {
      dispatch(
        productActions.setProductsPagination({
          page: page + 1,
        }),
      );
    }
  };

  useEffect(() => {
    productsApis.getAllProducts({ limit, page });
  }, [page, limit]);

  return (
    <div className="space-y-6">
      <CreateUpdateProductModel
        product={editing}
        setOpen={setOpen}
        open={open}
      />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Products</h1>
        <Button
          className="rounded-full"
          onClick={() => {
            setEditing({});
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> New product
        </Button>
      </div>

      {/* 
          1. FIXED HEIGHT CONTAINER 
          We give this div an ID so InfiniteScroll can target it.
      */}
      <div
        id="scrollableTableContainer"
        className="bg-card border border-border rounded-2xl overflow-auto h-[70vh] relative"
      >
        <InfiniteScroll
          dataLength={products.length}
          next={fetchNextPage}
          hasMore={page < totalPages}
          scrollableTarget="scrollableTableContainer" // 2. LINK TO CONTAINER ID
          loader={
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
          endMessage={
            <p className="text-center p-6 text-xs text-muted-foreground">
              End of catalog ({products.length} products)
            </p>
          }
        >
          <table className="w-full text-sm">
            {/* 3. STICKY HEADER - Important so user sees labels while scrolling */}
            <thead className="bg-muted sticky top-0 z-20 shadow-sm text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4 hidden md:table-cell">Category</th>
                <th className="text-left p-4 hidden md:table-cell">Stock</th>
                <th className="text-left p-4">Price</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products?.map((p) => (
                <tr
                  key={p?._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-secondary">
                        <img
                          src={p.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.tagline}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell capitalize">
                    {p?.category?.name}
                  </td>
                  <td className="p-4 hidden md:table-cell">{p.stock}</td>
                  <td className="p-4 tabular-nums">${p.price?.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(p);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(p);
                        setOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AdminProducts;
