import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import ordersApis from "../../api/orders/orders-apis";
import { orderActions } from "../../store/slices/orders/slice";

const statuses = ["Pending", "Processing", "Shipped", "Delivered"];

const tone = {
  Delivered: "bg-primary/10 text-primary",
  Shipped: "bg-accent/15 text-accent-foreground",
  Processing: "bg-secondary text-secondary-foreground",
  Pending: "bg-muted text-muted-foreground",
};

const AdminOrders = () => {
  const dispatch = useDispatch();

  const { orders, orderPagination } = useSelector((state) => state.orders);

  const { page, totalPages, limit } = orderPagination;

  const fetchNextPage = () => {
    if (page < totalPages) {
      dispatch(
        orderActions.setOrdersPagination({
          page: page + 1,
        }),
      );
    }
  };

  const advance = (id) => {
    dispatch(
      orderActions.setOrders(
        orders.map((o) => {
          if (o._id !== id) return o;

          const next =
            statuses[
              Math.min(statuses.indexOf(o.status) + 1, statuses.length - 1)
            ];

          toast.success(`${id} → ${next}`);

          return {
            ...o,
            status: next,
          };
        }),
      ),
    );
  };

  useEffect(() => {
    ordersApis.getOrders({
      page,
      limit,
    });
  }, [page, limit]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Fulfillment
        </p>

        <h1 className="font-display text-4xl">Orders</h1>
      </div>

      <div
        id="scrollableOrdersContainer"
        className="bg-card border border-border rounded-2xl overflow-auto h-[70vh] relative"
      >
        <InfiniteScroll
          dataLength={orders.length}
          next={fetchNextPage}
          hasMore={page < totalPages}
          scrollableTarget="scrollableOrdersContainer"
          loader={
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
          endMessage={
            <p className="text-center p-6 text-xs text-muted-foreground">
              End of orders ({orders.length} orders)
            </p>
          }
        >
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0 z-20 shadow-sm text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4">Order</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4 hidden md:table-cell">Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Total</th>
                <th className="p-4"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {orders?.map((o) => (
                <tr
                  key={o?._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium uppercase">
                    #{o?.orderId || o?._id?.slice(-6)}
                  </td>

                  <td className="p-4">
                    <p>{o?.user?.name}</p>

                    <p className="text-xs text-muted-foreground">{o?.email}</p>
                  </td>

                  <td className="p-4 hidden md:table-cell">
                    {new Date(o?.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-xs uppercase px-2.5 py-1 rounded-full ${tone[o?.status]}`}
                    >
                      {o?.status}
                    </span>
                  </td>

                  <td className="p-4 tabular-nums">${o?.total?.toFixed(2)}</td>

                  <td className="p-4 text-right">
                    {o?.status !== "Delivered" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => advance(o?._id)}
                      >
                        Advance
                      </Button>
                    )}
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

export default AdminOrders;
