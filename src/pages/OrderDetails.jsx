import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  FileText,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import ordersApis from "../api/orders/orders-apis";

// Consistent Status Tones
const tone = {
  delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  paid: "bg-blue-500/10 text-blue-600 border-blue-200",
  pending: "bg-orange-500/10 text-orange-600 border-orange-200",
  cancelled: "bg-red-500/10 text-red-600 border-red-200",
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const [res, error] = await ordersApis.getOrder(id);
      if (res && res.data) {
        setOrder(res.data.data || res.data);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (!order)
    return (
      <p className="p-8 text-center text-muted-foreground">
        Loading details...
      </p>
    );

  const currentStatus = order?.status?.toLowerCase() || "pending";
  const badgeStyle = tone[currentStatus] || tone.pending;

  return (
    <div className="container max-w-6xl py-12 lg:py-20 animate-fade-up">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display text-3xl flex items-center gap-3">
            Order #{order?.orderId || order?._id?.slice(-6).toUpperCase()}
            <Badge
              variant="outline"
              className={`rounded-full border capitalize text-sm px-3 py-1 ${badgeStyle}`}
            >
              {currentStatus}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" />
            Placed on{" "}
            {order?.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT: ITEMS & FINANCIALS ================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-muted-foreground" /> Order Items
            </h3>
            <div className="divide-y divide-border">
              {order?.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="h-16 w-16 rounded-xl border border-border overflow-hidden bg-muted flex-shrink-0">
                    {item?.image ? (
                      <img
                        src={item?.image}
                        alt={item?.name || "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-base">
                      {item?.name || "Unknown Product"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item?.quantity || 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${((item?.price || 0) * (item?.quantity || 1)).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${(item?.price || 0).toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corrected Order Summary block using real DB values */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${(order?.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>${(order?.shippingCost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>${(order?.taxAmount || 0).toFixed(2)}</span>
              </div>

              {/* Optional: Only show discount if it exists and is > 0 */}
              {order?.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-${(order?.discountAmount || 0).toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 mt-3 border-t border-dashed border-border flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(order?.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: LOGISTICS ================= */}
        <div className="space-y-6">
          {/* Shipping Address - Optional Chaining Added */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-muted-foreground" /> Shipping
              Details
            </h3>
            <div className="text-sm space-y-3">
              <div>
                <p className="font-medium">
                  {order?.shipping?.firstName || ""}{" "}
                  {order?.shipping?.lastName || ""}
                </p>
                {/* Contact info from your JSON */}
                {order?.shipping?.email && (
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" /> {order?.shipping?.email}
                  </p>
                )}
                {order?.shipping?.phone && (
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {order?.shipping?.phone}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-muted-foreground">
                  {order?.shipping?.address || "No address provided"}
                </p>
                <p className="text-muted-foreground">
                  {order?.shipping?.city && `${order.shipping.city},`}{" "}
                  {order?.shipping?.region} {order?.shipping?.zip}
                </p>
                <p className="text-muted-foreground">
                  {order?.shipping?.country}
                </p>
              </div>
            </div>

            {order?.shipping?.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-2">
                  <FileText className="h-3 w-3" /> Notes
                </h4>
                <p className="text-sm italic text-muted-foreground bg-muted/50 p-3 rounded-lg border">
                  {order?.shipping?.notes}
                </p>
              </div>
            )}
          </div>

          {/* Payment Info - Optional Chaining Added */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-muted-foreground" /> Payment
              Info
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium capitalize flex items-center gap-2">
                {order?.payment?.method || "Standard Checkout"}
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </p>
              {order?.payment?.cardLast4 && (
                <p className="text-muted-foreground">
                  Card ending in •••• {order?.payment?.cardLast4}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
