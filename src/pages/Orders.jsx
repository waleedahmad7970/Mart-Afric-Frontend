import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const statusTone = {
  Delivered: "bg-primary/10 text-primary",
  Shipped: "bg-accent/15 text-accent-foreground",
  Processing: "bg-secondary text-secondary-foreground",
  Pending: "bg-muted text-muted-foreground",
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sahel-orders") || "[]");
    setOrders(stored.filter((o) => !user?.email || o.email === user.email));
  }, [user]);

  return (
    <div className="container py-12 lg:py-16">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Account</p>
      <h1 className="font-display text-5xl md:text-6xl mb-10">Your orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-6">No orders yet.</p>
          <Button asChild className="rounded-full"><Link to="/shop">Start shopping</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-border rounded-2xl p-6 bg-card">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-display text-lg">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.date}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${statusTone[o.status] || "bg-muted"}`}>{o.status}</span>
                <p className="font-medium tabular-nums">${o.total.toFixed(2)}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {o.items.map((i) => (
                  <div key={i.id} className="flex items-center gap-2 bg-secondary/50 rounded-full pl-1 pr-3 py-1 text-xs">
                    {i.image && (
                      <div className="h-6 w-6 rounded-full overflow-hidden bg-background">
                        <img src={i.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <span>{i.name} × {i.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
