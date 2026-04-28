import { useState } from "react";
import { seedOrders } from "@/data/seed";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
const tone = {
  Delivered: "bg-primary/10 text-primary",
  Shipped: "bg-accent/15 text-accent-foreground",
  Processing: "bg-secondary text-secondary-foreground",
  Pending: "bg-muted text-muted-foreground",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState(seedOrders);

  const advance = (id) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const next = statuses[Math.min(statuses.indexOf(o.status) + 1, statuses.length - 1)];
      toast.success(`${id} → ${next}`);
      return { ...o, status: next };
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Fulfillment</p>
        <h1 className="font-display text-4xl">Orders</h1>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4 hidden md:table-cell">Date</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Total</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-4 font-medium">{o.id}</td>
                <td className="p-4">
                  <p>{o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.email}</p>
                </td>
                <td className="p-4 hidden md:table-cell">{o.date}</td>
                <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-full ${tone[o.status]}`}>{o.status}</span></td>
                <td className="p-4 tabular-nums">${o.total.toFixed(2)}</td>
                <td className="p-4 text-right">
                  {o.status !== "Delivered" && (
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => advance(o.id)}>Advance</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
