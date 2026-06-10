import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  Search,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  SlidersHorizontal,
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

import { productActions } from "../../store/slices/product/slice";
import productsApis from "../../api/products/products-apis";
import CreateUpdateProductModel from "./ProductCreateUpdateModal";
import BulkPropertyUpdateModal from "./BulkPropertyUpdateModal";
import useDebounce from "../../hooks/debouce";
import categoriesApis from "../../api/categories/categories-apis";
import { adminActions } from "../../store/slices/admin/slice";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const {
    product = {},
    category = {},
    subCategory = {},
  } = useSelector((state) => state.admin || {});
  const { products = [], productsPagination = {}, stats = {} } = product || {};

  const { categories = [] } = category || {};
  const { subCategories = [] } = subCategory || {};

  const { page, totalPages, limit } = productsPagination || {};

  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editing, setEditing] = useState({});

  // --- THE FIX: Create a strict lock to prevent InfiniteScroll from spamming APIs ---
  const isFetchingRef = useRef(false);

  const [filters, setFilters] = useState({
    search: "",
    sku: "",
    brand: "",
    category: "all",
    subCategory: "all",
    stock: "all",
    sort: "latest",
  });
  const debouncedSearchTerm = useDebounce(filters.search, 500);
  const debouncedSku = useDebounce(filters.sku, 500);
  const debouncedBrand = useDebounce(filters.brand, 500);

  const triggerCatalogRefresh = () => {
    productsApis.getAdminProducts({
      limit: limit,
      page: 1,
      search: debouncedSearchTerm,
      sku: debouncedSku,
      brand: debouncedBrand,
      category: filters.category !== "all" ? filters.category : undefined,
      subCategory:
        filters.subCategory !== "all" ? filters.subCategory : undefined,
      stock: filters.stock,
      sort: filters.sort,
    });
    productsApis.getProductsStats({});
  };

  // 1. Fetch Products Effect WITH THE REF LOCK
  useEffect(() => {
    const fetchTableData = async () => {
      // Lock the fetching engine
      isFetchingRef.current = true;

      await productsApis.getAdminProducts({
        limit: limit,
        page: page,
        search: debouncedSearchTerm,
        sku: debouncedSku,
        brand: debouncedBrand,
        category: filters.category !== "all" ? filters.category : undefined,
        subCategory:
          filters.subCategory !== "all" ? filters.subCategory : undefined,
        stock: filters.stock,
        sort: filters.sort,
      });

      // Unlock the fetching engine once the data is safely in Redux
      isFetchingRef.current = false;
    };

    fetchTableData();
  }, [
    page,
    limit,
    debouncedSearchTerm,
    debouncedSku,
    debouncedBrand,
    filters.category,
    filters.subCategory,
    filters.stock,
    filters.sort,
  ]);

  useEffect(() => {
    dispatch(adminActions.setProductsPagination({ page: 1 }));
  }, [
    debouncedSearchTerm,
    debouncedSku,
    debouncedBrand,
    filters.category,
    filters.subCategory,
    filters.stock,
    filters.sort,
    dispatch,
  ]);

  useEffect(() => {
    productsApis.getProductsStats({});
    categoriesApis.getAdminCategories({});
    categoriesApis.getAdminSubCategories({});
  }, [dispatch]);

  const fetchNextPage = () => {
    // THE FIX: Check the lock before dispatching a new page request
    if (page < totalPages && !isFetchingRef.current) {
      dispatch(adminActions.setProductsPagination({ page: page + 1 }));
    }
  };

  const handleDelete = (id) => {
    productsApis.deleteProduct({ id });
  };

  const filteredProducts = products;

  const statsData = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
    },
    {
      title: "Active Products",
      value: stats?.activeProducts || 0,
      icon: CheckCircle2,
    },
    { title: "Out of Stock", value: stats?.outOfStock || 0, icon: XCircle },
    { title: "Low Stock", value: stats?.lowStock || 0, icon: AlertTriangle },
    {
      title: "Total Stock Units",
      value: stats?.totalStock || 0,
      icon: Package,
    },
    {
      title: "Top Selling Products",
      value: stats?.topSellingProducts || 0,
      icon: TrendingUp,
    },
    {
      title: "Total Revenue (Est.)",
      value: stats?.totalRevenue || 0,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <CreateUpdateProductModel
        product={editing}
        setOpen={setOpen}
        setEditing={setEditing}
        open={open}
      />

      <BulkPropertyUpdateModal
        open={bulkOpen}
        setOpen={setBulkOpen}
        onRefreshList={triggerCatalogRefresh}
      />

      {/* Top Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-4xl">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage products, inventory and orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-full flex items-center gap-1 border-primary text-primary hover:bg-primary/5"
            onClick={() => setBulkOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" /> Bulk Group Edit
          </Button>
          <Button
            className="rounded-full"
            onClick={() => {
              setEditing({});
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> New Product
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
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Grid */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) =>
                setFilters((p) => ({ ...p, search: e.target.value }))
              }
              className="pl-9"
              placeholder="Search..."
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.brand}
              onChange={(e) =>
                setFilters((p) => ({ ...p, brand: e.target.value }))
              }
              className="pl-9"
              placeholder="Search by Brand..."
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.sku}
              onChange={(e) =>
                setFilters((p) => ({ ...p, sku: e.target.value }))
              }
              className="pl-9"
              placeholder="Search by SKU..."
            />
          </div>

          <Select
            value={filters.category}
            onValueChange={(val) =>
              setFilters((p) => ({ ...p, category: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat?._id} value={cat?._id}>
                  {cat?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.subCategory}
            onValueChange={(val) =>
              setFilters((p) => ({ ...p, subCategory: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sub Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sub Categories</SelectItem>
              {subCategories?.map((subCat) => (
                <SelectItem key={subCat?._id} value={subCat?._id}>
                  {subCat?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.stock}
            onValueChange={(val) => setFilters((p) => ({ ...p, stock: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
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
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price_asc">Price Low → High</SelectItem>
              <SelectItem value="price_desc">Price High → Low</SelectItem>
              <SelectItem value="name_asc">Name A → Z</SelectItem>
              <SelectItem value="name_desc">Name Z → A</SelectItem>
              <SelectItem value="stock_desc">Stock High → Low</SelectItem>
              <SelectItem value="stock_asc">Stock Low → High</SelectItem>
              <SelectItem value="sku_asc">SKU A → Z</SelectItem>
              <SelectItem value="brand_asc">Brand A → Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Badges */}
        {(filters.search ||
          filters.category !== "all" ||
          filters.subCategory !== "all" ||
          filters.stock !== "all" ||
          filters.brand ||
          filters.sku) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.search && (
              <Badge variant="secondary" className="rounded-full">
                Search: {filters.search}
              </Badge>
            )}
            {filters.sku && (
              <Badge variant="secondary" className="rounded-full">
                SKU: {filters.sku}
              </Badge>
            )}
            {filters.brand && (
              <Badge variant="secondary" className="rounded-full">
                Brand: {filters.brand}
              </Badge>
            )}
            {filters.category !== "all" && (
              <Badge variant="secondary" className="rounded-full">
                Filtered by Category
              </Badge>
            )}
            {filters.subCategory !== "all" && (
              <Badge variant="secondary" className="rounded-full">
                Filtered by Sub-Category
              </Badge>
            )}
            {filters.stock !== "all" && (
              <Badge variant="secondary" className="rounded-full capitalize">
                {filters.stock}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Table Section */}
      <div
        id="scrollableTableContainer"
        className="bg-card border border-border rounded-2xl overflow-auto h-[70vh] relative scrollbar-hide"
      >
        <InfiniteScroll
          dataLength={filteredProducts.length}
          next={fetchNextPage}
          hasMore={page < totalPages}
          scrollableTarget="scrollableTableContainer"
          loader={
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
          endMessage={
            <p className="text-center p-6 text-xs text-muted-foreground">
              End of catalog ({filteredProducts.length} products)
            </p>
          }
        >
          <table className="w-full min-w-[1600px] text-sm whitespace-nowrap">
            <thead className="sticky top-0 z-30 bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">SKU</th>
                <th className="text-left p-4">Brand</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Sale Price</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Unit</th>
                <th className="text-left p-4">Weight</th>
                <th className="text-left p-4">VAT</th>
                <th className="text-left p-4">Views</th>
                <th className="text-left p-4">Sold</th>
                <th className="text-left p-4">Rating</th>
                <th className="text-left p-4">Origin</th>
                <th className="text-left p-4">Updated</th>
                <th className="p-4"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredProducts?.map((p) => (
                <tr
                  key={p?._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 min-w-[260px]">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-secondary border border-border shrink-0">
                        <img
                          src={p.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.tagline}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{p?.sku || "-"}</td>
                  <td className="p-4">{p?.brand || "-"}</td>
                  <td className="p-4 capitalize">
                    <Badge variant="outline" className="rounded-full">
                      {p?.category?.name || "-"}
                    </Badge>
                  </td>
                  <td className="p-4 tabular-nums font-medium">
                    ${p.price?.toFixed(2)}
                  </td>
                  <td className="p-4 tabular-nums">
                    {p?.salePrice > 0 ? `$${p.salePrice?.toFixed(2)}` : "-"}
                  </td>
                  <td className="p-4">
                    {p?.stock < 10 ? (
                      <Badge variant="secondary" className="rounded-full">
                        Low Stock ({p.stock})
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="rounded-full min-w-[100px]"
                      >
                        {p.stock} in stock
                      </Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        p?.status === "active"
                          ? "default"
                          : p?.status === "inactive"
                            ? "secondary"
                            : "destructive"
                      }
                      className="rounded-full capitalize"
                    >
                      {p?.status || "-"}
                    </Badge>
                  </td>
                  <td className="p-4 capitalize">{p?.unit || "-"}</td>
                  <td className="p-4">{p?.weight || 0}</td>
                  <td className="p-4">
                    {p?.vatEnabled ? `${p?.vatPercentage}%` : "No VAT"}
                  </td>
                  <td className="p-4">{p?.views || 0}</td>
                  <td className="p-4">{p?.sold || 0}</td>
                  <td className="p-4">{p?.rating || "-"}</td>
                  <td className="p-4">{p?.origin || "-"}</td>
                  <td className="p-4">
                    {new Date(p?.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(p);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p?._id)}
                      >
                        <Trash2 className="h-4 w-4" />
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

export default AdminProducts;
