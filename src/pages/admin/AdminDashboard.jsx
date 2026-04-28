import { TrendingUp, DollarSign, Package, Users } from "lucide-react";
import { products } from "@/data/products";
import { seedOrders, seedUsers } from "@/data/seed";

const Stat = ({ icon: Icon, label, value, hint }) => (
  <div className="bg-card border border-border rounded-2xl p-6">
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p className="font-display text-3xl mt-3">{value}</p>
    <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
      <TrendingUp className="h-3 w-3 text-primary" /> {hint}
    </p>
  </div>
);

const AdminDashboard = () => {
  const revenue = seedOrders.reduce((s, o) => s + o.total, 0);
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Overview</p>
        <h1 className="font-display text-4xl">Dashboard</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={DollarSign} label="Revenue" value={`$${revenue.toFixed(2)}`} hint="+12.4% this week" />
        <Stat icon={Package} label="Products" value={products.length} hint="2 new this month" />
        <Stat icon={Users} label="Customers" value={seedUsers.length} hint="+3 today" />
        <Stat icon={TrendingUp} label="Orders" value={seedOrders.length} hint="2 pending" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display text-2xl mb-4">Recent orders</h2>
          <div className="divide-y divide-border">
            {seedOrders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.customer} · {o.date}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary">{o.status}</span>
                <p className="font-medium tabular-nums">${o.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display text-2xl mb-4">Top products</h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-secondary">
                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.stock} in stock</p>
                </div>
                <p className="text-sm tabular-nums">${p.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
