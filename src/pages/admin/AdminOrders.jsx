import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Loader2,
  Search,
  ChevronDown,
  Package,
  Clock,
  Truck,
  XCircle,
  MoreVertical,
  Printer,
  UserPlus,
  CheckCircle,
  Ban,
  DollarSign,
  Boxes,
  ShieldAlert,
  CheckSquare,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useDebounce from "../../hooks/debouce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import ordersApis from "../../api/orders/orders-apis";
import { orderActions } from "../../store/slices/orders/slice";

const statuses = [
  "pending",
  "accepted",
  "rejected",
  "paid",
  "assigned",
  "packed",
  "dispatched",
  "delivered",
  "cancelled",
  "refunded",
  "partial_refund",
];

const tone = {
  delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  accepted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  packed: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  dispatched: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  pending: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  refunded: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  partial_refund: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

const AdminOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order = {} } = useSelector((state) => state.admin || {});
  const { orders = [], orderPagination } = order || {};

  const { page, totalPages, limit, total } = orderPagination || {
    page: 1,
    totalPages: 1,
    limit: 10,
    total: 0,
  };

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sort: "latest",
  });
  const debouncedSearchTerm = useDebounce(filters.search, 500);

  const fetchNextPage = () => {
    if (page < totalPages)
      dispatch(orderActions.setOrdersPagination({ page: page + 1 }));
  };

  useEffect(() => {
    dispatch(orderActions.setOrdersPagination({ page: 1 }));
  }, [filters, dispatch]);

  useEffect(() => {
    ordersApis.getAdminOrders({
      page,
      limit,
      search: debouncedSearchTerm,
      status: filters.status !== "all" ? filters.status : undefined,
      sort: filters.sort,
    });
  }, [
    page,
    limit,
    filters.search,
    filters.status,
    filters.sort,
    debouncedSearchTerm,
  ]);

  const updateStatus = (id, status) => {
    toast.success(`Order status updating to ${status.replace("_", " ")}...`);
    ordersApis.updateStatus({ id, status }).then(() => {
      ordersApis.getAdminOrders({
        page,
        limit,
        search: filters.search,
        status: filters.status !== "all" ? filters.status : undefined,
        sort: filters.sort,
      });
    });
  };

  const handlePrintInvoice = (orderId) => {
    toast.info(`Generating invoice for Order #${orderId}`);
    window.print();
  };

  // ==========================================
  // EXCEL EXPORT ENGINE
  // ==========================================
  const exportToExcelReport = () => {
    if (!orders || orders.length === 0) {
      return toast.error("No order data available to export.");
    }

    // 1. Initialize Workbook
    const workbook = XLSX.utils.book_new();

    // 2. Build Summary Data
    const summaryRows = [];
    let overallGrandTotal = 0;

    statuses.forEach((statusGroup) => {
      const grouped = orders.filter(
        (o) => o.status?.toLowerCase() === statusGroup,
      );
      const totalRevenue = grouped.reduce((sum, o) => sum + (o.total || 0), 0);
      overallGrandTotal += totalRevenue;

      summaryRows.push({
        "Fulfillment Stage": statusGroup.toUpperCase().replace("_", " "),
        "Total Orders": grouped.length,
        "Total Value ($)": totalRevenue.toFixed(2),
      });
    });

    // Add final global aggregate row to Summary
    summaryRows.push({});
    summaryRows.push({
      "Fulfillment Stage": "GRAND TOTALS",
      "Total Orders": orders.length,
      "Total Value ($)": overallGrandTotal.toFixed(2),
    });

    const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Report Summary");

    // 3. Build Raw, Flattened Orders Data Sheet
    const rawFlattenedOrders = orders.map((o) => ({
      "Order Unique ID": o.orderId || o._id,
      Status: o.status?.toUpperCase() || "PENDING",
      "Order Date": new Date(o.createdAt).toLocaleDateString(),
      "Customer Name": o.user?.name || "Guest",
      "Customer Email": o.user?.email || o.shipping?.email || "N/A",
      "Financial Total ($)": o.total || 0,
      "Payment Method": o.payment?.method || "N/A",
      "Card Last 4": o.payment?.cardLast4 || "N/A",
      "MoMo Number": o.payment?.momoNumber || "N/A",
      "Shipping Name":
        `${o.shipping?.firstName || ""} ${o.shipping?.lastName || ""}`.trim(),
      "Contact Number": o.shipping?.phone || "N/A",
      "Delivery Address": o.shipping?.address || "N/A",
      Apartment: o.shipping?.apartment || "N/A",
      City: o.shipping?.city || "N/A",
      Region: o.shipping?.region || "N/A",
      "Zip Code": o.shipping?.zip || "N/A",
      Country: o.shipping?.country || "N/A",
      "Fulfillment Notes": o.shipping?.notes || "None",
      "Purchased Items Summary":
        o.items?.map((i) => `${i.name} (x${i.quantity})`).join(" | ") ||
        "No Items",
    }));

    const rawDataSheet = XLSX.utils.json_to_sheet(rawFlattenedOrders);
    XLSX.utils.book_append_sheet(workbook, rawDataSheet, "Master Orders Data");

    // 4. Save and Download Document
    XLSX.writeFile(
      workbook,
      `Fulfillment_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    toast.success("Excel fulfillment matrix report exported successfully!");
  };

  // ==========================================
  // GRANULAR STATS CARDS CALCULATION
  // ==========================================
  const statsData = useMemo(() => {
    const pendingCount =
      orders?.filter((o) =>
        ["pending", "paid"].includes(o?.status?.toLowerCase()),
      ).length || 0;
    const processingCount =
      orders?.filter((o) =>
        ["accepted", "assigned", "packed"].includes(o?.status?.toLowerCase()),
      ).length || 0;
    const transitCount =
      orders?.filter((o) =>
        ["dispatched", "shipped"].includes(o?.status?.toLowerCase()),
      ).length || 0;
    const successCount =
      orders?.filter((o) => o?.status?.toLowerCase() === "delivered").length ||
      0;
    const issueCount =
      orders?.filter((o) =>
        ["cancelled", "rejected", "refunded", "partial_refund"].includes(
          o?.status?.toLowerCase(),
        ),
      ).length || 0;

    return [
      {
        title: "Total Orders",
        value: total || orders?.length || 0,
        icon: Package,
      },
      { title: "Pending Action", value: pendingCount, icon: Clock },
      { title: "In Processing", value: processingCount, icon: Boxes },
      { title: "Out for Delivery", value: transitCount, icon: Truck },
      { title: "Delivered", value: successCount, icon: CheckSquare },
      { title: "Cancelled/Refunded", value: issueCount, icon: ShieldAlert },
    ];
  }, [orders, total]);

  return (
    <div className="space-y-6  mx-auto">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Fulfillment Dashboard
          </p>
          <h1 className="font-display text-4xl">Orders</h1>
        </div>
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2 self-start sm:self-auto border-primary/20 text-primary hover:bg-primary/5"
          onClick={exportToExcelReport}
        >
          <Download className="h-4 w-4" /> Export Report Matrix
        </Button>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground tracking-tight">
                  {item.title}
                </p>
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">{item.value}</h3>
            </div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="pl-9"
              placeholder="Search Order ID, Email, or Customer..."
            />
          </div>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.sort}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, sort: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="total_desc">Highest Amount</SelectItem>
              <SelectItem value="total_asc">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div
        id="scrollableOrdersContainer"
        className="bg-card border border-border rounded-2xl scrollbar-hide overflow-auto h-[60vh] relative"
      >
        <InfiniteScroll
          dataLength={orders?.length || 0}
          next={fetchNextPage}
          hasMore={page < totalPages}
          scrollableTarget="scrollableOrdersContainer"
          loader={
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <table className="w-full text-sm whitespace-nowrap min-w-[1000px]">
            <thead className="bg-muted sticky top-0 z-20 shadow-sm text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-5 font-medium">Order</th>
                <th className="text-left p-5 font-medium">Customer</th>
                <th className="text-left p-5 font-medium hidden md:table-cell">
                  Date
                </th>
                <th className="text-left p-5 font-medium">Status</th>
                <th className="text-left p-5 font-medium">Total</th>
                <th className="text-right p-5 font-medium">Quick Update</th>
                <th className="text-center p-5 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {orders?.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-12 text-muted-foreground"
                  >
                    No orders found matching your filters.
                  </td>
                </tr>
              ) : (
                orders?.map((o) => {
                  const currentStatus = o?.status?.toLowerCase() || "pending";
                  const badgeStyle = tone[currentStatus] || tone.pending;

                  return (
                    <tr
                      key={o?._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-5 font-medium uppercase">
                        #{o?.orderId || o?._id?.slice(-6)}
                      </td>
                      <td className="p-5">
                        <p className="font-medium">
                          {o?.user?.name || "Guest"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {o?.user?.email || o?.email}
                        </p>
                      </td>
                      <td className="p-5 hidden md:table-cell text-muted-foreground">
                        {new Date(o?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-5">
                        <Badge
                          variant="outline"
                          className={`rounded-full border capitalize ${badgeStyle}`}
                        >
                          {currentStatus.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-5 tabular-nums font-medium">
                        ${o?.total?.toFixed(2) || "0.00"}
                      </td>

                      <td className="p-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="outline-none" asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-8 rounded-full ${badgeStyle}`}
                            >
                              <span className="capitalize mr-2">
                                {currentStatus.replace("_", " ")}
                              </span>
                              <ChevronDown className="h-3 w-3 opacity-60" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px] max-h-[300px] overflow-y-auto"
                          >
                            {statuses.map((statusOption) => (
                              <DropdownMenuItem
                                key={statusOption}
                                className="cursor-pointer capitalize font-medium"
                                onClick={() =>
                                  updateStatus(o?._id, statusOption)
                                }
                              >
                                {statusOption.replace("_", " ")}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>

                      <td className="p-5 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>
                              Order Management
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/admin/orders-details/${o?._id}`)
                              }
                            >
                              View Full Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handlePrintInvoice(o?.orderId || o?._id)
                              }
                            >
                              <Printer className="mr-2 h-4 w-4" /> Print Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast.info("Assign Picker feature coming soon!")
                              }
                            >
                              <UserPlus className="mr-2 h-4 w-4" /> Assign
                              Picker
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-emerald-600"
                              onClick={() => updateStatus(o?._id, "accepted")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" /> Accept
                              Order
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => updateStatus(o?._id, "rejected")}
                            >
                              <Ban className="mr-2 h-4 w-4" /> Reject Order
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-slate-600"
                              onClick={() => updateStatus(o?._id, "refunded")}
                            >
                              <DollarSign className="mr-2 h-4 w-4" /> Issue
                              Refund
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AdminOrders;
