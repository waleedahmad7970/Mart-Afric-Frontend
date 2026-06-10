import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ArrowLeft,
  Moon,
  Sun,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Store,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/slices/auth/slice";

// 1. Refactored nav array to support groups and regular links
const nav = [
  {
    type: "link",
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },

  // NEW: Collapsible Catalog Group
  {
    type: "group",
    label: "Catalog",
    icon: Package,
    items: [
      { to: "/admin/products", label: "Products" },
      { to: "/admin/categories", label: "Categories" },
      { to: "/admin/inventory", label: "Inventory" },
      { to: "/admin/custom-product-section", label: "Custom Sections" },
      { to: "/admin/bulk-upload", label: "Bulk Upload" },
    ],
  },

  { type: "link", to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { type: "link", to: "/admin/customers", label: "Customers", icon: Users },

  // NEW: Collapsible Integrations Group
  {
    type: "group",
    label: "Integrations",
    icon: Layers,
    items: [
      { to: "/admin/deliveroo", label: "Deliveroo" },
      { to: "/admin/uber-eats", label: "Uber Eats" },
      { to: "/admin/delivery", label: "Delivery" },
    ],
  },
  {
    type: "link",
    to: "/admin/reports",
    label: "Reports",
    icon: Sparkles,
  },
  {
    type: "link",
    to: "/admin/reviews",
    label: "Reviews",
    icon: Sparkles,
  },
  {
    type: "link",
    to: "/admin/blogs",
    label: "Blogs",
    icon: Sparkles,
  },
  {
    type: "link",
    to: "/admin/coupons",
    label: "Coupons",
    icon: Sparkles,
  },
];

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const dispatch = useDispatch();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  // 2. State to track which sub-menus are open (default Catalog to open)
  const [openGroups, setOpenGroups] = useState({ Catalog: true });

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 hidden md:flex flex-col border-r border-border bg-sidebar text-sidebar-foreground">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="font-display text-2xl">
            Mart Afric
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">Admin console</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {nav.map((n) => {
            // Render a standard link
            if (n.type === "link") {
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-smooth ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-sidebar-accent/60"
                    }`
                  }
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </NavLink>
              );
            }

            // Render a collapsible group
            if (n.type === "group") {
              const isOpen = openGroups[n.label];
              return (
                <div key={n.label} className="space-y-1 pt-1">
                  <button
                    onClick={() => toggleGroup(n.label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-smooth hover:bg-sidebar-accent/60 text-sidebar-foreground/80 font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <n.icon className="h-4 w-4" />
                      {n.label}
                    </div>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    ) : (
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    )}
                  </button>

                  {/* The Nested Items */}
                  {isOpen && (
                    <div className="pl-9 pr-2 space-y-1 pb-1">
                      {n.items.map((subItem) => (
                        <NavLink
                          key={subItem.to}
                          to={subItem.to}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-sm transition-smooth ${
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            }`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-sm font-medium truncate">
            {user?.name || "Admin User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || "admin@martafric.com"}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 rounded-full"
            onClick={() => {
              dispatch(authActions.logout());
              navigate("/");
            }}
          >
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to store
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle}>
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
