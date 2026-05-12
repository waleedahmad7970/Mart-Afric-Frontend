import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import ordersApis from "../api/orders/orders-apis";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
const statusTone = {
  Delivered: "bg-primary/10 text-primary",
  Shipped: "bg-accent/15 text-accent-foreground",
  Processing: "bg-secondary text-secondary-foreground",
  Pending: "bg-muted text-muted-foreground",
};

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const { orders = [] } = useSelector((state) => state.orders);

  useEffect(() => {
    ordersApis.myOrders({}).then(() => {});
  }, [user?._id]);
  const CopyOrderId = ({ id }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      toast.info("Copy to Clip board");
      setTimeout(() => setCopied(false), 1500);
    };

    return (
      <button
        onClick={handleCopy}
        className="group flex items-center uppercase gap-2 text-sm font-semibold tracking-wide hover:text-primary transition"
      >
        <span className="select-all">{id}</span>

        <span className="relative">
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 opacity-50 group-hover:opacity-100 transition" />
          )}
        </span>
      </button>
    );
  };
  return (
    <div className="container py-12 lg:py-16">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
        Account
      </p>
      <h1 className="font-display text-5xl md:text-6xl mb-10">Your orders</h1>

      {orders?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-6">No orders yet.</p>
          <Button asChild className="rounded-full">
            <Link to="/shop">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((o) => {
            const itemCount = o?.items?.reduce((s, i) => s + i.quantity, 0);

            return (
              <div
                key={o?._id}
                className="border border-border rounded-2xl bg-card overflow-hidden"
              >
                {/* HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-border">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <CopyOrderId id={o?.orderId} />

                    <p className="text-xs text-muted-foreground mt-2">
                      Placed on{" "}
                      {new Date(o?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right space-y-2">
                    <span
                      className={`text-xs px-3 capitalize py-1 rounded-full font-medium ${
                        statusTone[o?.status] || "bg-muted"
                      }`}
                    >
                      {o?.status}
                    </span>

                    <p className="font-semibold text-lg tabular-nums">
                      ${o?.total.toFixed(2)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {itemCount} item{itemCount > 1 && "s"}
                    </p>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="p-6 space-y-4">
                  {o?.items?.map((i, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl overflow-hidden border bg-background">
                          <img
                            src={i?.image}
                            alt={i?.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div>
                          <p className="font-medium">{i?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Quantity: {i?.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="font-medium tabular-nums">
                        ${(i.price * i.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-muted/40 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Shipped to{" "}
                    <span className="font-medium text-foreground">
                      {o?.shipping?.firstName} {o?.shipping?.lastName}
                    </span>
                  </div>

                  {/* <Button asChild size="sm" className="rounded-full">
                    <Link to={`/orders/${o?._id}`}>View details</Link>
                  </Button> */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
