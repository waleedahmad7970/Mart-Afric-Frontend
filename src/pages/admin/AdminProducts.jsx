import { useEffect, useState } from "react";
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
  const [editing, setEditing] = useState({});

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

  // 1. Fetch Products Effect
  useEffect(() => {
    productsApis.getAdminProducts({
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
    if (page < totalPages) {
      console.log("fetching next page", page + 1);
      dispatch(adminActions.setProductsPagination({ page: page + 1 }));
    }
  };

  const handleDelete = (id) => {
    productsApis.deleteProduct({ id });
  };

  // Safely extract unique Categories and SubCategories as Objects { id, name }
  const uniqueCategories = Array.from(
    new Map(
      products
        .filter((p) => p?.category?._id)
        .map((p) => [p.category._id, p.category.name]),
    ).entries(),
  ).map(([id, name]) => ({ id, name }));

  const uniqueSubCategories = Array.from(
    new Map(
      products
        .filter((p) => p?.subCategory?._id)
        .map((p) => [p.subCategory._id, p.subCategory.name]),
    ).entries(),
  ).map(([id, name]) => ({ id, name }));

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
        open={open}
      />

      {/* Top Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-4xl">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage products, inventory and orders.
          </p>
        </div>
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
          {/* Search Inputs */}
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

          {/* Category */}
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

          {/* Sub Category */}
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

          {/* Stock */}
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

          {/* Sort */}
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

      {/* table */}
      {/* table */}
      <div
        id="scrollableTableContainer"
        className="bg-card border border-border rounded-2xl overflow-auto scrollbar-hide h-[70vh] relative scrollbar-hide"
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
            {/* table header */}
            <thead className="sticky top-0 z-30 bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              {" "}
              <tr>
                <th className="text-left p-4 whitespace-nowrap">Product</th>
                <th className="text-left p-4 whitespace-nowrap">SKU</th>

                <th className="text-left p-4 whitespace-nowrap">Brand</th>

                <th className="text-left p-4 whitespace-nowrap">Category</th>

                <th className="text-left p-4 whitespace-nowrap">Price</th>

                <th className="text-left p-4 whitespace-nowrap">Sale Price</th>

                <th className="text-left p-4 whitespace-nowrap">Stock</th>

                <th className="text-left p-4 whitespace-nowrap">Status</th>

                <th className="text-left p-4 whitespace-nowrap">Unit</th>

                <th className="text-left p-4 whitespace-nowrap">Weight</th>

                <th className="text-left p-4 whitespace-nowrap">VAT</th>

                <th className="text-left p-4 whitespace-nowrap">Views</th>

                <th className="text-left p-4 whitespace-nowrap">Sold</th>

                <th className="text-left p-4 whitespace-nowrap">Rating</th>

                <th className="text-left p-4 whitespace-nowrap">Origin</th>

                <th className="text-left p-4 whitespace-nowrap">Updated</th>

                <th className="p-4"></th>
              </tr>
            </thead>

            {/* table body */}
            <tbody className="divide-y divide-border">
              {filteredProducts?.map((p) => (
                <tr
                  key={p?._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* product */}
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
                        <p className="font-medium whitespace-nowrap">
                          {p.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {p.tagline}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{p?.sku || 0}</td>

                  {/* brand */}
                  <td className="p-4">{p?.brand || "-"}</td>

                  {/* category */}
                  <td className="p-4 capitalize">
                    <Badge variant="outline" className="rounded-full">
                      {p?.category?.name || "-"}
                    </Badge>
                  </td>

                  {/* price */}
                  <td className="p-4 tabular-nums font-medium">
                    ${p.price?.toFixed(2)}
                  </td>

                  {/* sale price */}
                  <td className="p-4 tabular-nums">
                    {p?.salePrice > 0 ? `$${p.salePrice?.toFixed(2)}` : "-"}
                  </td>

                  {/* stock */}
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

                  {/* status */}
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

                  {/* unit */}
                  <td className="p-4 capitalize">{p?.unit || "-"}</td>

                  {/* weight */}
                  <td className="p-4">{p?.weight || 0}</td>

                  {/* vat */}
                  <td className="p-4">
                    {p?.vatEnabled ? `${p?.vatPercentage}%` : "No VAT"}
                  </td>

                  {/* views */}
                  <td className="p-4">{p?.views || 0}</td>

                  {/* sold */}
                  <td className="p-4">{p?.sold || 0}</td>

                  {/* rating */}
                  <td className="p-4">{p?.rating || "-"}</td>

                  {/* origin */}
                  <td className="p-4">{p?.origin || "-"}</td>

                  {/* updated */}
                  <td className="p-4 whitespace-nowrap">
                    {new Date(p?.updatedAt).toLocaleDateString()}
                  </td>

                  {/* actions */}
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
