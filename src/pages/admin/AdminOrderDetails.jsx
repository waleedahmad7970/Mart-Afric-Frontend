import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  FileText,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ordersApis from "../../api/orders/orders-apis";
import { useNavigate, useParams } from "react-router-dom";

// You will likely use React Router's useNavigate and useParams
// import { useParams, useNavigate } from "react-router-dom";

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

const tone = {
  delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  paid: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  pending: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // MOCK DATA (Replaced with your exact provided data)
  // ==========================================
  const [order, setOrder] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const [res, error] = await ordersApis.getAdminOrder(id);

      if (res && res.data) {
        setOrder(res.data.data || res.data);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);
  const handleStatusChange = async (newStatus) => {
    // Optimistic UI Update
    setOrder((prev) => ({ ...prev, status: newStatus }));
    toast.success(`Order status updated to ${newStatus}`);

    // API Call
    try {
      await ordersApis.updateStatus({ id: order._id, status: newStatus });
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!order)
    return <p className="p-8 text-muted-foreground">Loading order...</p>;

  const currentStatus = order.status?.toLowerCase() || "pending";
  const badgeStyle = tone[currentStatus] || tone.pending;

  return (
    <div className="container max-w-6xl py-12 lg:py-20 animate-fade-up">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          size="icon"
          className="rounded-full" /* onClick={() => navigate(-1)} */
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display uppercase text-3xl flex items-center gap-3">
            Order #{order.orderId || order._id.slice(-6).toUpperCase()}
            <Badge
              variant="outline"
              className={`rounded-full border capitalize text-sm px-3 py-1 ${badgeStyle}`}
            >
              {currentStatus}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" />
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Status Update Dropdown aligned to the right */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Update Status:
          </span>
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[160px] capitalize font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT COLUMN: ITEMS & FINANCIALS ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-muted-foreground" /> Order Items
            </h3>

            <div className="divide-y divide-border">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="h-16 w-16 rounded-xl border border-border overflow-hidden bg-muted flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 m-4 text-muted-foreground opacity-20" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-base">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary Card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4">Payment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="pt-3 mt-3 border-t border-dashed border-border flex justify-between items-center">
                <span className="font-semibold text-base">Total</span>
                <span className="font-bold text-xl">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: CUSTOMER LOGISTICS ================= */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-muted-foreground" /> Customer
              Profile
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Name</p>
                <p className="font-medium">
                  {order.user?.name || "Guest Checkout"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="font-medium">{order.shipping.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Phone</p>
                <p className="font-medium">{order.shipping.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-muted-foreground" /> Shipping
              Address
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">
                {order.shipping.firstName} {order.shipping.lastName}
              </p>
              <p className="text-muted-foreground">{order.shipping.address}</p>
              {order.shipping.apartment && (
                <p className="text-muted-foreground">
                  {order.shipping.apartment}
                </p>
              )}
              <p className="text-muted-foreground">
                {order.shipping.city}, {order.shipping.region}{" "}
                {order.shipping.zip}
              </p>
              <p className="text-muted-foreground">{order.shipping.country}</p>
            </div>

            {order.shipping.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-2">
                  <FileText className="h-3 w-3" /> Order Notes
                </h4>
                <p className="text-sm italic bg-muted/50 p-3 rounded-lg border border-border">
                  "{order.shipping.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Payment Details Card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-muted-foreground" /> Payment
              Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Method</p>
                <p className="font-medium capitalize flex items-center gap-2">
                  {order.payment.method}
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </p>
              </div>

              {order.payment.method === "card" && (
                <div>
                  <p className="text-muted-foreground text-xs">Card Used</p>
                  <p className="font-medium tracking-widest">
                    •••• {order.payment.cardLast4 || "****"}
                  </p>
                </div>
              )}

              {order.payment.momoNumber && (
                <div>
                  <p className="text-muted-foreground text-xs">MoMo Number</p>
                  <p className="font-medium">{order.payment.momoNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
