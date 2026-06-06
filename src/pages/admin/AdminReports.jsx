import { useEffect, useState, useRef } from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter,
  FileSpreadsheet,
  Activity, // Changed icon to represent a line graph
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// 1. IMPORT CHART.JS LINE & FILL ELEMENTS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Required to fill the area under the line
} from "chart.js";
import { Line } from "react-chartjs-2";
import reportsApis from "../../api/reports/reports-apis";
import { useSelector } from "react-redux";

// 2. REGISTER THE NEW ELEMENTS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const AdminReports = () => {
  const chartRef = useRef(null);
  const [filters, setFilters] = useState({
    period: "yearly",
    startDate: "",
    endDate: "",
    category: "all",
    status: "all",
  });

  const { reports = {} } = useSelector((state) => state.admin);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    reportsApis.getSalesReports(filters).then(([res, error]) => {
      setLoading(false);
    });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ==========================================
  // PREMIUM AREA CHART CONFIGURATION
  // ==========================================

  const chartDataConfig = {
    labels: reports.chartData.map((data) => data.name),
    datasets: [
      {
        label: "Revenue",
        data: reports.chartData.map((data) => data.revenue),
        borderColor: "#10b981", // Emerald green line
        borderWidth: 3,
        tension: 0.4, // This creates the beautiful smooth curves
        fill: true, // Tells Chart.js to fill the area underneath

        // Dynamic Gradient Fill Logic
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;

          // Creates a gradient from top to bottom
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)"); // Semi-transparent emerald at top
          gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)"); // Fades to fully transparent at bottom
          return gradient;
        },

        // Styling the dots on the line
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#10b981",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#10b981",
        pointHoverBorderColor: "#ffffff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false, // Makes the tooltip appear even if you aren't hovering exactly on the dot
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 12,
        titleFont: { size: 13, family: "Inter, sans-serif" },
        bodyFont: { size: 14, weight: "bold", family: "Inter, sans-serif" },
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { family: "Inter, sans-serif" } },
        border: { display: false },
      },
      y: {
        grid: {
          color: "#e5e7eb",
          drawBorder: false,
          tickLength: 0, // Removes the little dashes next to the numbers
        },
        ticks: {
          color: "#6b7280",
          font: { family: "Inter, sans-serif" },
          padding: 10,
          callback: (value) => `$${value}`,
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  const statsCards = [
    {
      title: "Total Revenue",
      value: `$${reports.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Orders",
      value: reports.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Avg. Order Value",
      value: `$${reports.averageOrderValue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "New Customers",
      value: reports.totalCustomers,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* HEADER & EXPORT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold">
            Analytics & Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your store's performance and download financial statements.
          </p>
        </div>
        <Button className="rounded-xl flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
          <FileSpreadsheet className="h-4 w-4" /> Export to Excel
        </Button>
      </div>

      {/* ADVANCED FILTER BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-muted-foreground">
          <Filter className="h-4 w-4" /> Report Filters
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Select
            value={filters.period}
            onValueChange={(v) => handleFilterChange("period", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="weekly">Last 7 Days</SelectItem>
              <SelectItem value="monthly">Last 30 Days</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 lg:col-span-2">
            <Input
              type="date"
              disabled={filters.period !== "custom"}
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="text-sm"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="date"
              disabled={filters.period !== "custom"}
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="text-sm"
            />
          </div>

          <Select
            value={filters.status}
            onValueChange={(v) => handleFilterChange("status", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="Delivered">Completed/Delivered</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.category}
            onValueChange={(v) => handleFilterChange("category", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Beauty">Beauty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* STATS OVERVIEW GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-display font-bold text-foreground">
                    {loading ? "..." : stat.value}
                  </h3>
                </div>
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg}`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==========================================
          CHART.JS CANVAS CONTAINER (LINE CHART)
      ========================================== */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Revenue Trend
          </h3>
          <Badge variant="secondary" className="rounded-full capitalize">
            {filters.period} Trend
          </Badge>
        </div>

        <div className="h-[400px] w-full relative">
          {/* Changed <Bar> to <Line> */}
          <Line ref={chartRef} data={chartDataConfig} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
