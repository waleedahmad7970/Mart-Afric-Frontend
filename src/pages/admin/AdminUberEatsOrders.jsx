import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  DollarSign,
  Check,
  X,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// MOCK DATA
const MOCK_ORDERS = [
  {
    _id: "ORD-UE-9821",
    customer: "Sarah J.",
    items: "2x Spicy Chicken Burger (WC Stock: 45)",
    total: 34.5,
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    _id: "ORD-UE-9822",
    customer: "Emily R.",
    items: "4x Classic Cheeseburger (WC Stock: 12)",
    total: 58.0,
    status: "ready",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    _id: "ORD-UE-9823",
    customer: "David L.",
    items: "2x Fish and Chips (WC Stock: 0 - OOS)",
    total: 41.0,
    status: "delivered",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    _id: "ORD-UE-9824",
    customer: "Chris P.",
    items: "1x Vegan Wrap (WC Stock: 8)",
    total: 15.5,
    status: "preparing",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
];

const AdminUberEats = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sort: "latest",
  });

  // Mock Pagination State
  const page = 1;
  const totalPages = 1;

  const filteredOrders = useMemo(() => {
    let result = [...MOCK_ORDERS];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q),
      );
    }
    if (filters.status !== "all")
      result = result.filter((o) => o.status === filters.status);

    result.sort((a, b) => {
      if (filters.sort === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sort === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (filters.sort === "price_desc") return b.total - a.total;
      if (filters.sort === "price_asc") return a.total - b.total;
      return 0;
    });
    return result;
  }, [filters]);

  const stats = {
    totalOrders: MOCK_ORDERS.length,
    activeOrders: MOCK_ORDERS.filter((o) =>
      ["new", "preparing", "ready"].includes(o.status),
    ).length,
    completedToday: MOCK_ORDERS.filter((o) => o.status === "delivered").length,
    revenue: MOCK_ORDERS.filter((o) => o.status !== "cancelled").reduce(
      (acc, curr) => acc + curr.total,
      0,
    ),
  };

  const statsData = [
    { title: "Total Uber Orders", value: stats.totalOrders, icon: ShoppingBag },
    { title: "Active (Needs Action)", value: stats.activeOrders, icon: Clock },
    {
      title: "Completed Today",
      value: stats.completedToday,
      icon: CheckCircle2,
    },
    {
      title: "Uber Eats Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-4xl flex items-center gap-3">
            <span className="h-4 w-4 rounded-full bg-green-600"></span>
            Uber Eats
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage orders and sync your WooCommerce menu.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full">
            <RefreshCw className="h-4 w-4 mr-2" /> Sync WC Menu
          </Button>
          <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white">
            Store is Online
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsData?.map((item, index) => {
          const Icon = item?.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <h3 className="text-2xl font-semibold mt-1">{item.value}</h3>
                </div>
                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Grid */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) =>
                setFilters((p) => ({ ...p, search: e.target.value }))
              }
              className="pl-9"
              placeholder="Search Order ID or Customer..."
            />
          </div>
          <Select
            value={filters.status}
            onValueChange={(val) => setFilters((p) => ({ ...p, status: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready for Courier</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.sort}
            onValueChange={(val) => setFilters((p) => ({ ...p, sort: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_desc">Highest Value</SelectItem>
              <SelectItem value="price_asc">Lowest Value</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Badges */}
        {(filters.search || filters.status !== "all") && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.search && (
              <Badge variant="secondary" className="rounded-full">
                Search: {filters.search}
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary" className="rounded-full capitalize">
                {filters.status.replace(/_/g, " ")}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Table Section */}
      <div
        id="scrollableTableContainer"
        className="bg-card border border-border rounded-2xl overflow-auto scrollbar-hide h-[70vh] relative"
      >
        <InfiniteScroll
          dataLength={filteredOrders.length}
          next={() => {}} // Mock next page function
          hasMore={page < totalPages}
          scrollableTarget="scrollableTableContainer"
          loader={
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
          endMessage={
            <p className="text-center p-6 text-xs text-muted-foreground">
              End of orders ({filteredOrders.length})
            </p>
          }
        >
          <table className="w-full min-w-[1200px] text-sm whitespace-nowrap">
            <thead className="sticky top-0 z-30 bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4 w-[300px]">WooCommerce Items</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Time</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders?.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium">{order._id}</td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4 truncate max-w-[300px]">
                    {/* Highlight OOS items so the admin knows there's a WC sync issue */}
                    {order.items.includes("OOS") ? (
                      <span className="text-red-500 font-medium flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> {order.items}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {order.items}
                      </span>
                    )}
                  </td>
                  <td className="p-4 tabular-nums font-medium">
                    ${order.total?.toFixed(2)}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={order.status === "new" ? "default" : "secondary"}
                      className="rounded-full capitalize"
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {order.status === "new" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                          >
                            <Check className="h-4 w-4 mr-1" /> Accept
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-red-600 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
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

export default AdminUberEats;
