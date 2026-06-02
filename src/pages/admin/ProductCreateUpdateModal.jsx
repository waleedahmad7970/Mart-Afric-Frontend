import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Plus, Upload, ImageIcon, Loader2 } from "lucide-react";
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
import productsApis from "../../api/products/products-apis";
import { useSelector } from "react-redux";

// Validation Schema
const ProductSchema = Yup.object().shape({
  image: Yup.string().required("Image is required"),
  name: Yup.string()
    .required("Name is required")
    .min(20, "Name must be at least 20 characters"),
  brand: Yup.string().required("Brand is required"),
  category: Yup.string().required("Category is required"),
  subCategory: Yup.string().required("Sub-category is required"),
  price: Yup.number().min(1, "Must be positive").required("Price is required"),
  stock: Yup.number().integer().min(1).required("Stock is required"),
  description: Yup.string()
    .required("Description is required")
    .min(50, "Description must be at least 50 characters"),
  sku: Yup.string().required("SKU is required"),
  barcode: Yup.string().required("Barcode is required"),
  salePrice: Yup.number().min(1).required("Sale price is required"),
  vatEnabled: Yup.boolean().required("VAT enabled is required"),
  vatPercentage: Yup.number(),
  weight: Yup.number().min(1).required("Weight is required"),
  unit: Yup.string()
    .oneOf(["kg", "g", "litre", "ml", "pack", "piece"])
    .required("Unit is required"),
  status: Yup.string()
    .oneOf(["active", "inactive", "out_of_stock"])
    .required("Status is required"),
  nutritionInfo: Yup.object().shape({
    calories: Yup.number().min(0).required("Calories are required"),
    protein: Yup.number().min(0).required("Protein is required"),
    carbs: Yup.number().min(0).required("Carbs are required"),
    fat: Yup.number().min(0).required("Fat is required"),
  }),
});

const CreateUpdateProductModel = ({ product, setOpen, setEditing, open }) => {
  const [preview, setPreview] = useState(product?.image);

  // 1. Pull Loaders AND Categories/SubCategories from Redux
  const { uploaderLoader } = useSelector((state) => state.loader.loaders);
  const { category = {}, subCategory = {} } = useSelector(
    (state) => state.admin || {},
  );
  const { categories = [] } = category;
  const { subCategories = [] } = subCategory;
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // 2. Initialize values securely (handle objects vs strings)
  const initialValues = {
    ...product,

    name: product?.name || "",
    description: product?.description || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    brand: product?.brand || "",

    category: product?.category?._id
      ? String(product.category._id)
      : product?.category
        ? String(product.category)
        : "",

    subCategory: product?.subCategory?._id
      ? String(product.subCategory._id)
      : product?.subCategory
        ? String(product.subCategory)
        : "",

    price: product?.price || 0,
    salePrice: product?.salePrice || 0,
    vatEnabled: product?.vatEnabled || false,
    vatPercentage: product?.vatPercentage || 0,
    stock: product?.stock || 0,
    weight: product?.weight || 0,
    unit: product?.unit || "piece",
    status: product?.status || "active",
    image: product?.image || null,
    images: product?.images || [],
    ingredients: product?.ingredients ? product.ingredients.join(", ") : "",
    allergens: product?.allergens ? product.allergens.join(", ") : "",
    nutritionInfo: {
      calories: product?.nutritionInfo?.calories || 0,
      protein: product?.nutritionInfo?.protein || 0,
      carbs: product?.nutritionInfo?.carbs || 0,
      fat: product?.nutritionInfo?.fat || 0,
    },
  };

  const handleThumbnailUpload = async (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setIsUploadingImage(true);
    const [res, error] = await productsApis.uploadImage({ file });
    setIsUploadingImage(false);
    const { success, url } = res?.data || {};
    if (success) {
      setFieldValue("image", url);
    } else {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      ...values,
      ingredients:
        typeof values.ingredients === "string"
          ? values.ingredients
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean)
          : values.ingredients,
      allergens:
        typeof values.allergens === "string"
          ? values.allergens
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean)
          : values.allergens,
    };

    if (payload._id) {
      const [res, error] = await productsApis.updateProduct({
        productId: payload._id,
        body: payload,
      });
      const { success } = res?.data || {};
      if (success) {
        toast.success("Product updated successfully");
        setEditing({});
        setOpen(false);
      }
    } else {
      const [res, error] = await productsApis.createProduct({ body: payload });
      const { success } = res?.data || {};
      if (success) {
        toast.success("Product created successfully");
        setEditing({});
        setOpen(false);
      }
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initialValues?._id ? "Edit Product" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={ProductSchema}
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
            <Form className="space-y-6 py-4">
              {console.log("Formik values:", errors, values)}
              {/* Media Section */}
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div
                  className="relative border-2 border-dashed rounded-xl p-4 hover:bg-muted/50 transition cursor-pointer flex flex-col items-center justify-center gap-2"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {isUploadingImage && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                  {preview || values?.image ? (
                    <img
                      src={preview || values?.image}
                      className="h-32 w-full object-cover rounded-lg"
                      alt="Preview"
                    />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload to S3
                      </span>
                    </>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    hidden
                    onChange={(event) =>
                      handleThumbnailUpload(event, setFieldValue)
                    }
                  />
                </div>
                {errors.image && touched.image && (
                  <span className="text-xs text-red-500">{errors.image}</span>
                )}
              </div>

              {/* Basic Information */}
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-semibold text-lg">Basic Details</h3>
                <div className="space-y-1">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="e.g. Organic Prekese"
                  />
                  {errors.name && touched.name && (
                    <span className="text-xs text-red-500">{errors.name}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Brand</Label>
                    <Input
                      name="brand"
                      value={values.brand}
                      onChange={handleChange}
                      placeholder="e.g. Nature Farms"
                    />
                    {errors.brand && touched.brand && (
                      <span className="text-xs text-red-500">
                        {errors.brand}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Status</Label>
                    <Select
                      value={values.status}
                      onValueChange={(val) => setFieldValue("status", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
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
                </div>

                {/* 3. DYNAMIC CATEGORY & SUB-CATEGORY DROPDOWNS */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category Dropdown */}
                  <div className="space-y-1">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={values.category}
                      onValueChange={(val) => {
                        setFieldValue("category", val);
                        setFieldTouched("category", true);

                        setFieldValue("subCategory", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={String(cat._id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && touched.category && (
                      <span className="text-xs text-red-500">
                        {errors.category}
                      </span>
                    )}
                  </div>

                  {/* Sub-Category Dropdown */}
                  <div className="space-y-1">
                    <Label htmlFor="subCategory">Sub-Category</Label>
                    <Select
                      value={values.subCategory}
                      onValueChange={(val) => {
                        setFieldValue("subCategory", val);
                        setFieldTouched("subCategory", true);
                      }}
                      // Optional: Disable if no category is selected yet
                      disabled={!values.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Sub-Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories
                          // Filter sub-categories to only show ones belonging to the selected category
                          .filter((sub) => {
                            const parentId = sub.category?._id || sub.category;
                            return String(parentId) === String(values.category);
                          })
                          .map((subCat) => (
                            <SelectItem
                              key={subCat._id}
                              value={String(subCat._id)}
                            >
                              {subCat.name}
                            </SelectItem>
                          ))}
                        {/* Fallback if filtering returns nothing */}
                        {values.category &&
                          subCategories.filter(
                            (sub) =>
                              String(sub.category?._id || sub.category) ===
                              String(values.category),
                          ).length === 0 && (
                            <SelectItem value="none" disabled>
                              No sub-categories found
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                    {errors.subCategory && touched.subCategory && (
                      <span className="text-xs text-red-500">
                        {errors.subCategory}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Identifiers */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div className="space-y-1">
                  <Label>SKU</Label>
                  <Input
                    name="sku"
                    value={values.sku}
                    onChange={handleChange}
                    placeholder="e.g. PRK-001"
                  />
                  {errors.sku && touched.sku && (
                    <span className="text-xs text-red-500">{errors.sku}</span>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Barcode</Label>
                  <Input
                    name="barcode"
                    value={values.barcode}
                    onChange={handleChange}
                    placeholder="Scan or enter barcode"
                  />
                  {errors.barcode && touched.barcode && (
                    <span className="text-xs text-red-500">
                      {errors.barcode}
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing & VAT */}
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-semibold text-lg">Pricing & Taxes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Regular Price ($) *</Label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      value={values.price}
                      onChange={handleChange}
                    />
                    {errors.price && touched.price && (
                      <span className="text-xs text-red-500">
                        {errors.price}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Sale Price ($)</Label>
                    <Input
                      name="salePrice"
                      type="number"
                      step="0.01"
                      value={values.salePrice}
                      onChange={handleChange}
                    />
                    {errors.salePrice && touched.salePrice && (
                      <span className="text-xs text-red-500">
                        {errors.salePrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                  <div className="flex items-center space-x-2 h-10">
                    <input
                      type="checkbox"
                      id="vatEnabled"
                      name="vatEnabled"
                      checked={values.vatEnabled}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="vatEnabled" className="cursor-pointer">
                      Enable VAT
                    </Label>
                  </div>
                  {values.vatEnabled && (
                    <div className="space-y-1">
                      <Label>VAT Percentage (%)</Label>
                      <Input
                        name="vatPercentage"
                        type="number"
                        value={values.vatPercentage}
                        onChange={handleChange}
                      />
                      {errors.vatPercentage && touched.vatPercentage && (
                        <span className="text-xs text-red-500">
                          {errors.vatPercentage}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Inventory & Physical */}
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-semibold text-lg">Inventory & Shipping</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>Stock *</Label>
                    <Input
                      name="stock"
                      type="number"
                      value={values.stock}
                      onChange={handleChange}
                    />
                    {errors.stock && touched.stock && (
                      <span className="text-xs text-red-500">
                        {errors.stock}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Weight</Label>
                    <Input
                      name="weight"
                      type="number"
                      value={values.weight}
                      onChange={handleChange}
                    />
                    {errors.weight && touched.weight && (
                      <span className="text-xs text-red-500">
                        {errors.weight}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Unit</Label>
                    <Select
                      value={values.unit}
                      onValueChange={(val) => setFieldValue("unit", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="kg">KG</SelectItem>
                        <SelectItem value="g">Grams</SelectItem>
                        <SelectItem value="litre">Litre</SelectItem>
                        <SelectItem value="ml">ML</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Composition */}
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-semibold text-lg">
                  Ingredients & Allergens
                </h3>
                <div className="space-y-1">
                  <Label>Ingredients (Comma Separated)</Label>
                  <Input
                    name="ingredients"
                    value={values.ingredients}
                    onChange={handleChange}
                    placeholder="e.g. Sugar, Flour, Water"
                  />
                  {errors.ingredients && touched.ingredients && (
                    <span className="text-xs text-red-500">
                      {errors.ingredients}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Allergens (Comma Separated)</Label>
                  <Input
                    name="allergens"
                    value={values.allergens}
                    onChange={handleChange}
                    placeholder="e.g. Nuts, Dairy"
                  />
                  {errors.allergens && touched.allergens && (
                    <span className="text-xs text-red-500">
                      {errors.allergens}
                    </span>
                  )}
                </div>

                <Label className="mt-4 block">
                  Nutrition Info (per serving)
                </Label>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Calories
                    </Label>
                    <Input
                      name="nutritionInfo.calories"
                      type="number"
                      value={values.nutritionInfo.calories}
                      onChange={handleChange}
                    />
                    {errors.nutritionInfo?.calories &&
                      touched.nutritionInfo?.calories && (
                        <span className="text-xs text-red-500">
                          {errors.nutritionInfo.calories}
                        </span>
                      )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Protein (g)
                    </Label>
                    <Input
                      name="nutritionInfo.protein"
                      type="number"
                      value={values.nutritionInfo.protein}
                      onChange={handleChange}
                    />
                    {errors.nutritionInfo?.protein &&
                      touched.nutritionInfo?.protein && (
                        <span className="text-xs text-red-500">
                          {errors.nutritionInfo.protein}
                        </span>
                      )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Carbs (g)
                    </Label>
                    <Input
                      name="nutritionInfo.carbs"
                      type="number"
                      value={values.nutritionInfo.carbs}
                      onChange={handleChange}
                    />
                    {errors.nutritionInfo?.carbs &&
                      touched.nutritionInfo?.carbs && (
                        <span className="text-xs text-red-500">
                          {errors.nutritionInfo.carbs}
                        </span>
                      )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Fat (g)
                    </Label>
                    <Input
                      name="nutritionInfo.fat"
                      type="number"
                      value={values.nutritionInfo.fat}
                      onChange={handleChange}
                    />
                    {errors.nutritionInfo?.fat &&
                      touched.nutritionInfo?.fat && (
                        <span className="text-xs text-red-500">
                          {errors.nutritionInfo.fat}
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label>Description</Label>
                <textarea
                  name="description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  value={values.description}
                  onChange={handleChange}
                  placeholder="Enter full product description..."
                />
                {errors.description && touched.description && (
                  <span className="text-xs text-red-500">
                    {errors.description}
                  </span>
                )}
              </div>

              <div className="pt-4 sticky bottom-0 bg-background/80 backdrop-blur-sm pb-2">
                <Button
                  loading={uploaderLoader}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 text-lg rounded-xl"
                >
                  {isSubmitting
                    ? "Saving..."
                    : values._id
                      ? "Update Product"
                      : "Create Product"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateProductModel;
