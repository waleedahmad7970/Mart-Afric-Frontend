import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import ordersApis from "../api/orders/orders-apis";
import {
  Copy,
  Check,
  Package,
  Truck,
  ChevronRight,
  Search,
} from "lucide-react";
import { toast } from "sonner";

// 1. Sleek Copy Component (Maintained for the Table)
const CopyOrderId = ({ id }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!id) return;
    await navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm font-semibold tracking-wider text-foreground uppercase select-all">
        {id}
      </span>
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-muted transition-colors group"
        aria-label="Copy Order ID"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </button>
    </div>
  );
};

// 2. Status Badge Helper
const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === "delivered")
    return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
  if (s === "shipped") return "bg-blue-500/10 text-blue-600 border-blue-200";
  if (s === "processing")
    return "bg-amber-500/10 text-amber-600 border-amber-200";
  if (s === "cancelled") return "bg-red-500/10 text-red-600 border-red-200";
  return "bg-gray-500/10 text-gray-600 border-gray-200";
};

// 3. Main Component
const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const { orders = [] } = useSelector((state) => state.orders);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    ordersApis.myOrders({}).then(() => {});
  }, [user?._id]);

  // Filter Logic
  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    return (
      o?.orderId?.toLowerCase().includes(query) ||
      o?.status?.toLowerCase().includes(query) ||
      o?.items?.some((item) => item.name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="container max-w-6xl py-12 lg:py-20 animate-fade-up">
      {/* Page Header with Search Bar */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Your Account
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Order History
          </h1>
          <p className="text-muted-foreground mt-2">
            Track, manage, and review your recent purchases.
          </p>
        </div>

        {/* Search Bar UI */}
        {orders?.length > 0 && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, item, or status..."
              className="pl-9 rounded-full bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-primary transition-colors h-11"
            />
          </div>
        )}
      </div>

      {orders?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-muted/30 rounded-3xl border border-dashed border-border">
          <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-8 text-center max-w-sm">
            Looks like you haven't made your first purchase. Discover our latest
            products!
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : filteredOrders?.length === 0 ? (
        <div className="text-center py-20 border border-border rounded-3xl bg-card">
          <p className="text-muted-foreground">
            No orders match "{searchQuery}"
          </p>
          <Button
            variant="link"
            onClick={() => setSearchQuery("")}
            className="mt-2"
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border/60">
                <tr>
                  <th className="px-6 py-5 whitespace-nowrap">Order ID</th>
                  <th className="px-6 py-5 whitespace-nowrap">Date Placed</th>
                  <th className="px-6 py-5 whitespace-nowrap">Items</th>
                  <th className="px-6 py-5 whitespace-nowrap">Total</th>
                  <th className="px-6 py-5 whitespace-nowrap">Status</th>
                  <th className="px-6 py-5 whitespace-nowrap text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders?.map((o) => {
                  const itemCount = o?.items?.reduce(
                    (s, i) => s + i?.quantity,
                    0,
                  );

                  return (
                    <tr
                      key={o?._id}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CopyOrderId id={o?.orderId} />
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(o?.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Items Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {/* Display the first item's image as a tiny thumbnail */}
                          {o?.items?.[0]?.image && (
                            <div className="h-8 w-8 rounded-md overflow-hidden border border-border shrink-0">
                              <img
                                src={o?.items?.[0]?.image}
                                alt="Item thumbnail"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <span className="text-muted-foreground font-medium">
                            {itemCount} item{itemCount !== 1 && "s"}
                          </span>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="px-6 py-4 font-semibold whitespace-nowrap tabular-nums">
                        ${o?.total?.toFixed(2)}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(
                            o?.status,
                          )}`}
                        >
                          {o?.status || "Pending"}
                        </span>
                      </td>

                      {/* Action / Track Button */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        >
                          <Link to={`/orders/${o?._id}`}>
                            <Truck className="h-4 w-4 mr-2" />
                            Track Order
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
