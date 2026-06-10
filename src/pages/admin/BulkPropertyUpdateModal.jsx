import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  SlidersHorizontal,
  Loader2,
  CheckCircle,
  Search,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import productsApis from "../../api/products/products-apis";
import useDebounce from "../../hooks/debouce";

// --- COMPONENT: Live Match Counter With Table Rows ---
const LiveMatchCounter = ({ values }) => {
  const [matchCount, setMatchCount] = useState(null);
  const [previewProducts, setPreviewProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSku = useDebounce(values.matchSku, 500);
  const debouncedBrand = useDebounce(values.matchBrand, 500);
  const category = values.matchCategory;
  const subCategory = values.matchSubCategory;

  useEffect(() => {
    const fetchMatchCount = async () => {
      if (
        !debouncedSku &&
        !debouncedBrand &&
        category === "all" &&
        subCategory === "all"
      ) {
        setMatchCount(null);
        setPreviewProducts([]);
        return;
      }

      setIsSearching(true);
      try {
        const [res, error] = await productsApis.getAdminProducts({
          limit: 5,
          page: 1,
          sku: debouncedSku || undefined,
          brand: debouncedBrand || undefined,
          category: category !== "all" ? category : undefined,
          subCategory: subCategory !== "all" ? subCategory : undefined,
        });

        if (error) {
          setMatchCount(0);
          setPreviewProducts([]);
          return;
        }

        let dataObj = res?.data;
        if (dataObj?.data) dataObj = dataObj.data;

        const items =
          dataObj?.items ||
          dataObj?.products ||
          (Array.isArray(dataObj) ? dataObj : []);
        const total =
          dataObj?.meta?.total || dataObj?.total || items.length || 0;

        setMatchCount(total);
        setPreviewProducts(items);
      } catch (error) {
        console.error("Failed to fetch match count", error);
        setMatchCount(0);
        setPreviewProducts([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchMatchCount();
  }, [debouncedSku, debouncedBrand, category, subCategory]);

  if (isSearching) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 bg-muted/30 p-3 rounded-lg border border-dashed">
        <Loader2 className="h-4 w-4 animate-spin" /> Calculating affected
        products...
      </div>
    );
  }

  if (matchCount !== null) {
    return (
      <div
        className={`flex flex-col gap-3 mt-3 p-3 rounded-lg border ${
          matchCount > 0
            ? "bg-blue-500/5 border-blue-500/20"
            : "bg-destructive/10 border-destructive/20 text-destructive font-medium"
        }`}
      >
        {matchCount > 0 ? (
          <>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <CheckCircle className="h-4 w-4" />
              <span>
                This update will modify <strong>{matchCount}</strong> matching
                product{matchCount !== 1 ? "s" : ""}.
              </span>
            </div>

            <div className="border rounded-lg overflow-hidden bg-background mt-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">SKU / Brand</th>
                    <th className="px-4 py-3 font-medium text-right">Price</th>
                    <th className="px-4 py-3 font-medium text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {previewProducts.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-muted shrink-0 overflow-hidden border">
                            {p.image && (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <p className="font-medium truncate max-w-[150px]">
                            {p.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold">{p.sku || "-"}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                          {p.brand || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        ${p.price?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-secondary px-2 py-1 rounded-full text-xs">
                          {p.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {matchCount > previewProducts.length && (
                <div className="bg-muted/30 px-4 py-2 text-center text-xs text-muted-foreground font-medium border-t">
                  + {matchCount - previewProducts.length} more matching products
                  not shown
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>0 products found. Try adjusting your search targets.</span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// --- MAIN MODAL COMPONENT ---
const BulkPropertyUpdateModal = ({ open, setOpen, onRefreshList }) => {
  const [stats, setStats] = useState(null);
  const { category = {}, subCategory = {} } = useSelector(
    (state) => state.admin || {},
  );
  const { categories = [] } = category;
  const { subCategories = [] } = subCategory;

  const initialValues = {
    matchSku: "",
    matchBrand: "",
    matchCategory: "all",
    matchSubCategory: "all",
    updatePrice: "",
    updateSalePrice: "",
    updateStock: "",
    updateBrand: "",
    updateStatus: "",
  };

  // --- NEW STRICT YUP VALIDATION ENGINE ---
  const validationSchema = Yup.object()
    .shape({
      matchSku: Yup.string().when(
        ["matchBrand", "matchCategory", "matchSubCategory"],
        {
          is: (brand, cat, sub) => !brand && cat === "all" && sub === "all",
          then: () =>
            Yup.string().required(
              "Provide at least one lookup criterion to protect database integrity.",
            ),
        },
      ),
      updatePrice: Yup.number()
        .nullable()
        .transform((_, val) => (val === "" ? null : Number(val)))
        .typeError("Price must be a valid number")
        .positive("Price must be greater than 0"),
      updateSalePrice: Yup.number()
        .nullable()
        .transform((_, val) => (val === "" ? null : Number(val)))
        .typeError("Sale price must be a valid number")
        .positive("Sale price must be greater than 0"),
      updateStock: Yup.number()
        .nullable()
        .transform((_, val) => (val === "" ? null : Number(val)))
        .typeError("Stock must be a valid number")
        .integer("Stock must be a whole number")
        .min(0, "Stock cannot be negative"),
      updateBrand: Yup.string(),
      updateStatus: Yup.string(),
    })
    .test(
      "at-least-one-update",
      "You must provide at least one value to update.",
      function (value) {
        // Prevents submitting a completely blank update form
        const hasUpdate = !!(
          value.updatePrice ||
          value.updateSalePrice ||
          (value.updateStock !== null &&
            value.updateStock !== undefined &&
            value.updateStock !== "") ||
          value.updateBrand ||
          value.updateStatus
        );

        if (!hasUpdate) {
          return this.createError({
            path: "updatePrice", // Maps the global error to display under the first update field
            message: "⚠️ Please enter at least one new value to update.",
          });
        }
        return true;
      },
    );

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      filters: {
        sku: values.matchSku || undefined,
        brand: values.matchBrand || undefined,
        category:
          values.matchCategory !== "all" ? values.matchCategory : undefined,
        subCategory:
          values.matchSubCategory !== "all"
            ? values.matchSubCategory
            : undefined,
      },
      updates: {
        price: values.updatePrice !== "" ? values.updatePrice : undefined,
        salePrice:
          values.updateSalePrice !== "" ? values.updateSalePrice : undefined,
        stock: values.updateStock !== "" ? values.updateStock : undefined,
        brandName: values.updateBrand || undefined,
        status: values.updateStatus || undefined,
      },
    };

    const [res, error] = await productsApis.bulkPropertyUpdate(payload);
    if (res?.data?.success) {
      setStats(res.data.data);
      toast.success("Bulk update executed successfully!");
      if (onRefreshList) onRefreshList();
    } else {
      toast.error(error?.message || "Bulk target update sequence dropped.");
    }
    setSubmitting(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) setStats(null);
      }}
    >
      <DialogContent className="sm:max-w-[750px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            Bulk Property Conditional Update
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            setFieldValue,
            isSubmitting,
            errors,
            touched,
          }) => (
            <Form className="space-y-6 py-2">
              {/* SECTION 1: SEARCH FILTER TARGETS */}
              <div className="space-y-4 rounded-xl border p-4 bg-muted/20">
                <h3 className="font-semibold text-sm flex items-center gap-1 text-muted-foreground uppercase tracking-wider">
                  <Search className="h-4 w-4" /> 1. Set Targets (Matches Group
                  Items)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Lookup SKU</Label>
                    <Input
                      name="matchSku"
                      value={values.matchSku}
                      onChange={handleChange}
                      placeholder="e.g. PRK-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Lookup Brand</Label>
                    <Input
                      name="matchBrand"
                      value={values.matchBrand}
                      onChange={handleChange}
                      placeholder="e.g. Nature Farms"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Lookup Category</Label>
                    <Select
                      value={values.matchCategory}
                      onValueChange={(val) => {
                        setFieldValue("matchCategory", val);
                        setFieldValue("matchSubCategory", "all");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={String(cat._id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Lookup Sub-Category</Label>
                    <Select
                      value={values.matchSubCategory}
                      onValueChange={(val) =>
                        setFieldValue("matchSubCategory", val)
                      }
                      disabled={values.matchCategory === "all"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sub-Categories</SelectItem>
                        {subCategories
                          .filter(
                            (sub) =>
                              String(sub.category?._id || sub.category) ===
                              String(values.matchCategory),
                          )
                          .map((subCat) => (
                            <SelectItem
                              key={subCat._id}
                              value={String(subCat._id)}
                            >
                              {subCat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {errors.matchSku && touched.matchSku && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.matchSku}
                  </p>
                )}

                <LiveMatchCounter values={values} />
              </div>

              {/* SECTION 2: NEW UPDATE VALUES */}
              <div className="space-y-4 rounded-xl border p-4">
                <h3 className="font-semibold text-sm text-primary uppercase tracking-wider">
                  2. Values to Apply (Leave blank to keep current values)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>New Base Price ($)</Label>
                    <Input
                      name="updatePrice"
                      type="number"
                      step="0.01"
                      value={values.updatePrice}
                      onChange={handleChange}
                      placeholder="Keep current"
                    />
                    {errors.updatePrice && touched.updatePrice && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        {errors.updatePrice}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>New Sale Price ($)</Label>
                    <Input
                      name="updateSalePrice"
                      type="number"
                      step="0.01"
                      value={values.updateSalePrice}
                      onChange={handleChange}
                      placeholder="Keep current"
                    />
                    {errors.updateSalePrice && touched.updateSalePrice && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        {errors.updateSalePrice}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1 col-span-1">
                    <Label>New Stock Level</Label>
                    <Input
                      name="updateStock"
                      type="number"
                      value={values.updateStock}
                      onChange={handleChange}
                      placeholder="Keep current"
                    />
                    {errors.updateStock && touched.updateStock && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        {errors.updateStock}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1 col-span-1">
                    <Label>Overwrite Status</Label>
                    <Select
                      value={values.updateStatus}
                      onValueChange={(val) =>
                        setFieldValue("updateStatus", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Keep current" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="out_of_stock">
                          Out of Stock
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 col-span-1">
                    <Label>Overwrite Brand Name</Label>
                    <Input
                      name="updateBrand"
                      value={values.updateBrand}
                      onChange={handleChange}
                      placeholder="Keep current"
                    />
                  </div>
                </div>
              </div>

              {/* STATS ANALYTICS OUTPUT */}
              {stats && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                    <CheckCircle className="h-4 w-4" /> Batch Property
                    Synchronization Complete
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Located <strong>{stats.matchedCount}</strong> target items.
                    Updated values for <strong>{stats.modifiedCount}</strong>{" "}
                    specific product records inside the database.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 font-semibold text-base rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Applying
                    Property Modifications...
                  </>
                ) : (
                  "Execute Group Field Update"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default BulkPropertyUpdateModal;
