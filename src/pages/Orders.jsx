// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // <-- Make sure Input is imported
// import { useSelector } from "react-redux";
// import ordersApis from "../api/orders/orders-apis";
// import {
//   Copy,
//   Check,
//   Package,
//   Truck,
//   CheckCircle,
//   Clock,
//   MapPin,
//   ChevronRight,
//   Search, // <-- Added Search icon
// } from "lucide-react";
// import { toast } from "sonner";

// // 1. Sleek Copy Component
// const CopyOrderId = ({ id }) => {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = async () => {
//     if (!id) return;
//     await navigator.clipboard.writeText(id);
//     setCopied(true);
//     toast.success("Order ID copied to clipboard");
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <span className="font-mono text-sm font-semibold tracking-wider text-foreground uppercase select-all">
//         {id}
//       </span>
//       <button
//         onClick={handleCopy}
//         className="p-1.5 rounded-md hover:bg-muted transition-colors group"
//         aria-label="Copy Order ID"
//       >
//         {copied ? (
//           <Check className="h-3.5 w-3.5 text-emerald-500" />
//         ) : (
//           <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
//         )}
//       </button>
//     </div>
//   );
// };

// // 2. Visual Timeline Component
// const OrderStatusTimeline = ({ status }) => {
//   const steps = [
//     { label: "Pending", icon: Clock },
//     { label: "Processing", icon: Package },
//     { label: "Shipped", icon: Truck },
//     { label: "Delivered", icon: CheckCircle },
//   ];

//   const currentIndex = steps.findIndex(
//     (s) => s.label.toLowerCase() === status?.toLowerCase(),
//   );
//   const activeIndex = currentIndex === -1 ? 0 : currentIndex;

//   return (
//     <div className="relative flex items-center justify-between w-full mt-8 mb-6 px-4 md:px-12">
//       <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full mx-4 md:mx-12" />
//       <div
//         className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full mx-4 md:mx-12 transition-all duration-700 ease-in-out"
//         style={{
//           width: `calc(${(activeIndex / (steps.length - 1)) * 100}% - 2rem)`,
//         }}
//       />
//       {steps.map((step, idx) => {
//         const isActive = idx <= activeIndex;
//         const Icon = step.icon;

//         return (
//           <div
//             key={step.label}
//             className="relative z-10 flex flex-col items-center gap-3"
//           >
//             <div
//               className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-500 bg-background
//                 ${
//                   isActive
//                     ? "border-primary text-primary shadow-sm"
//                     : "border-muted text-muted-foreground"
//                 }`}
//             >
//               <Icon className="h-4 w-4 md:h-5 md:w-5" />
//             </div>
//             <span
//               className={`text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:block transition-colors duration-500 ${
//                 isActive ? "text-foreground" : "text-muted-foreground"
//               }`}
//             >
//               {step.label}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// // 3. Main Component
// const Orders = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { orders = [] } = useSelector((state) => state.orders);

//   // NEW: Search State
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     ordersApis.myOrders({}).then(() => {});
//   }, [user?._id]);

//   // NEW: Filter Logic
//   const filteredOrders = orders.filter((o) => {
//     const query = searchQuery.toLowerCase();
//     // Search by Order ID, Status, or Item Name
//     return (
//       o?.orderId?.toLowerCase().includes(query) ||
//       o?.status?.toLowerCase().includes(query) ||
//       o?.items?.some((item) => item.name.toLowerCase().includes(query))
//     );
//   });

//   return (
//     <div className="container max-w-5xl py-12 lg:py-20 animate-fade-up">
//       {/* Page Header with Search Bar */}
//       <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
//             Your Account
//           </p>
//           <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
//             Order History
//           </h1>
//           <p className="text-muted-foreground mt-2">
//             Track, manage, and review your recent purchases.
//           </p>
//         </div>

//         {/* NEW: Search Bar UI */}
//         {orders.length > 0 && (
//           <div className="relative w-full md:w-80">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by order ID, item, or status..."
//               className="pl-9 rounded-full bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-primary transition-colors"
//             />
//           </div>
//         )}
//       </div>

//       {orders?.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-32 bg-muted/30 rounded-3xl border border-dashed border-border">
//           <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
//           <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
//           <p className="text-muted-foreground mb-8 text-center max-w-sm">
//             Looks like you haven't made your first purchase. Discover our latest
//             products!
//           </p>
//           <Button asChild size="lg" className="rounded-full px-8">
//             <Link to="/shop">Start Shopping</Link>
//           </Button>
//         </div>
//       ) : filteredOrders.length === 0 ? (
//         // NEW: No Search Results UI
//         <div className="text-center py-20 border border-border rounded-3xl bg-card">
//           <p className="text-muted-foreground">
//             No orders match "{searchQuery}"
//           </p>
//           <Button variant="link" onClick={() => setSearchQuery("")}>
//             Clear search
//           </Button>
//         </div>
//       ) : (
//         <div className="space-y-8">
//           {filteredOrders?.map((o) => {
//             const itemCount = o?.items?.reduce((s, i) => s + i.quantity, 0);

//             return (
//               <div
//                 key={o?._id}
//                 className="group border border-border/60 rounded-3xl bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
//               >
//                 {/* 1. ORDER HEADER */}
//                 <div className="bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:px-8 border-b border-border/60">
//                   <div className="grid grid-cols-2 md:flex md:gap-12 gap-y-4">
//                     <div className="space-y-1">
//                       <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
//                         Order Placed
//                       </p>
//                       <p className="text-sm font-medium">
//                         {new Date(o?.createdAt).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })}
//                       </p>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
//                         Total Amount
//                       </p>
//                       <p className="text-sm font-semibold tabular-nums">
//                         ${o?.total?.toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="col-span-2 md:col-span-1 space-y-1">
//                       <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
//                         Order ID
//                       </p>
//                       <CopyOrderId id={o?.orderId} />
//                     </div>
//                   </div>
//                 </div>

//                 {/* 2. ORDER TIMELINE */}
//                 <div className="p-6 md:px-8 border-b border-border/40">
//                   <OrderStatusTimeline status={o?.status} />
//                 </div>

//                 {/* 3. ORDER ITEMS */}
//                 <div className="p-6 md:px-8 bg-background">
//                   <h4 className="text-sm font-semibold mb-4 text-foreground/80">
//                     Items in this shipment ({itemCount})
//                   </h4>
//                   <div className="space-y-4">
//                     {o?.items?.map((i, idx) => (
//                       <div
//                         key={idx}
//                         className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-muted/10 hover:bg-muted/30 transition-colors"
//                       >
//                         <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden border border-border bg-background shrink-0">
//                           <img
//                             src={i?.image}
//                             alt={i?.name}
//                             className="h-full w-full object-cover"
//                           />
//                         </div>

//                         <div className="flex-1 min-w-0">
//                           <p className="font-semibold text-sm md:text-base text-foreground truncate">
//                             {i?.name}
//                           </p>
//                           <p className="text-sm text-muted-foreground mt-1">
//                             Qty:{" "}
//                             <span className="font-medium text-foreground">
//                               {i?.quantity}
//                             </span>
//                           </p>
//                         </div>

//                         <div className="text-right pl-4">
//                           <p className="font-bold text-base tabular-nums">
//                             ${(i.price * i.quantity).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* 4. ORDER FOOTER */}
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 md:px-8 bg-muted/20 border-t border-border/60">
//                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
//                     <div className="p-2 bg-background border border-border rounded-full shadow-sm">
//                       <MapPin className="h-4 w-4 text-primary" />
//                     </div>
//                     <div>
//                       <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5">
//                         Shipping to
//                       </p>
//                       <span className="font-medium text-foreground">
//                         {o?.shipping?.firstName} {o?.shipping?.lastName}
//                       </span>
//                     </div>
//                   </div>

//                   <Button
//                     asChild
//                     className="w-full sm:w-auto rounded-full group"
//                   >
//                     <Link
//                       to={`/orders/${o?._id}`}
//                       className="flex items-center"
//                     >
//                       Track Package
//                       <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;

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
        {orders.length > 0 && (
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
      ) : filteredOrders.length === 0 ? (
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
                {filteredOrders.map((o) => {
                  const itemCount = o?.items?.reduce(
                    (s, i) => s + i.quantity,
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
                                src={o.items[0].image}
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
