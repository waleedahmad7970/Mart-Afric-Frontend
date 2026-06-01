import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  Plus,
  Trash2,
  Pencil,
  FolderTree,
  Tags,
  Layers,
  Package,
  Loader2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// APIs
import categoriesApis from "../../api/categories/categories-apis";
import productsApis from "../../api/products/products-apis";

const AdminCategories = () => {
  const dispatch = useDispatch();

  const { category = {}, subCategory = {} } = useSelector(
    (state) => state.admin || {},
  );

  const { categories = [] } = category || {};
  const { subCategories = [] } = subCategory || {};

  // ==========================================
  // UI STATE
  // ==========================================
  const [activeTab, setActiveTab] = useState("categories"); // 'categories' | 'subCategories'
  const [catOpen, setCatOpen] = useState(false);
  const [subCatOpen, setSubCatOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState({});
  const [editingSubCategory, setEditingSubCategory] = useState({});

  const refreshData = () => {
    categoriesApis.getAdminCategories();
    categoriesApis.getAdminSubCategories();
  };

  useEffect(() => {
    refreshData();
  }, []);

  // ==========================================
  // DELETE HANDLERS
  // ==========================================
  const handleDeleteCategory = async (id) => {
    await categoriesApis.deleteCategory({ id });
  };

  const handleDeleteSubCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this sub-category?")) {
      try {
        await categoriesApis.deleteSubCategory({ id });
        toast.success("Sub-Category deleted");
        refreshData();
      } catch (error) {
        toast.error("Failed to delete sub-category");
      }
    }
  };

  // ==========================================
  // STATS CALCULATION
  // ==========================================
  const statsData = useMemo(() => {
    return [
      {
        title: "Total Categories",
        value: categories?.length || 0,
        icon: FolderTree,
      },
      {
        title: "Total Sub-Categories",
        value: subCategories?.length || 0,
        icon: Tags,
      },
    ];
  }, [categories, subCategories]);

  return (
    <div className="space-y-6 m mx-auto">
      {/* ========================================== */}
      {/* MODALS */}
      {/* ========================================== */}
      <CategoryModal
        open={catOpen}
        setOpen={setCatOpen}
        data={editingCategory}
        onSuccess={refreshData}
      />

      <SubCategoryModal
        open={subCatOpen}
        setOpen={setSubCatOpen}
        data={editingSubCategory}
        categories={categories}
        onSuccess={refreshData}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Catalog Organization
          </p>
          <h1 className="font-display text-4xl">Taxonomy</h1>
        </div>

        {/* ACTION BUTTONS */}
        <div>
          {activeTab === "categories" ? (
            <Button
              className="rounded-full"
              onClick={() => {
                setEditingCategory({});
                setCatOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> New Category
            </Button>
          ) : (
            <Button
              className="rounded-full"
              onClick={() => {
                setEditingSubCategory({});
                setSubCatOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> New Sub-Category
            </Button>
          )}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <h3 className="text-3xl font-semibold mt-1">{item.value}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          );
        })}
      </div>

      {/* SEGMENTED TAB CONTROL */}
      <div className="bg-muted p-1 rounded-full inline-flex w-full sm:w-auto">
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex-1 sm:w-40 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            activeTab === "categories"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab("subCategories")}
          className={`flex-1 sm:w-40 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            activeTab === "subCategories"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sub-Categories
        </button>
      </div>

      {/* FULL WIDTH TABLE CONTAINER */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* ========================================== */}
        {/* CATEGORIES TAB CONTENT */}
        {/* ========================================== */}
        {activeTab === "categories" && (
          <div className="overflow-auto h-[60vh] scrollbar-hide">
            <table className="w-full text-sm whitespace-nowrap min-w-[800px]">
              <thead className="bg-muted/50 sticky top-0 z-20 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left p-5 font-medium">Category</th>
                  <th className="text-left p-5 font-medium">Slug</th>
                  <th className="text-left p-5 font-medium">Items Count</th>
                  <th className="text-right p-5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center p-12 text-muted-foreground"
                    >
                      <FolderTree className="h-12 w-12 mx-auto opacity-20 mb-3" />
                      <p>No categories found. Create one to get started.</p>
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-5 font-medium capitalize flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FolderTree className="h-5 w-5 text-muted-foreground opacity-50" />
                          )}
                        </div>
                        {cat.name}
                      </td>
                      <td className="p-5 text-muted-foreground font-mono text-xs">
                        {cat.slug}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span className="font-medium text-foreground">
                            {cat.quantity || 0}
                          </span>{" "}
                          Products
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingCategory(cat);
                              setCatOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(cat._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================== */}
        {/* SUB-CATEGORIES TAB CONTENT */}
        {/* ========================================== */}
        {activeTab === "subCategories" && (
          <div className="overflow-auto h-[60vh] scrollbar-hide">
            <table className="w-full text-sm whitespace-nowrap min-w-[800px]">
              <thead className="bg-muted/50 sticky top-0 z-20 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left p-5 font-medium">Sub-Category</th>
                  <th className="text-left p-5 font-medium">Slug</th>
                  <th className="text-left p-5 font-medium">Parent Category</th>
                  <th className="text-right p-5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subCategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center p-12 text-muted-foreground"
                    >
                      <Tags className="h-12 w-12 mx-auto opacity-20 mb-3" />
                      <p>
                        No sub-categories found. Create one to organize your
                        catalog.
                      </p>
                    </td>
                  </tr>
                ) : (
                  subCategories.map((sub) => (
                    <tr
                      key={sub._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-5 font-medium capitalize flex items-center gap-3">
                        <Tags className="h-4 w-4 text-muted-foreground shrink-0" />
                        {sub.name}
                      </td>
                      <td className="p-5 text-muted-foreground font-mono text-xs">
                        {sub.slug}
                      </td>
                      <td className="p-5">
                        <span className="bg-secondary px-3 py-1.5 rounded-full text-xs font-medium capitalize border border-border">
                          {categories.find((c) => c._id === sub.category)
                            ?.name ||
                            sub.category?.name ||
                            "Unassigned"}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingSubCategory(sub);
                              setSubCatOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSubCategory(sub._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;

// =====================================================================
// FORMIK CATEGORY MODAL
// =====================================================================
const CategoryModal = ({ open, setOpen, data = {}, onSuccess }) => {
  const isEditing = !!data?._id;

  // NEW: States for image uploading
  const [preview, setPreview] = useState(data?.image || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Pulling the global uploader loader (optional, matches your Product modal pattern)
  const { uploaderLoader } = useSelector(
    (state) => state.loader?.loaders || {},
  );

  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      slug: data?.slug || "",
      image: data?.image || null, // NEW: added image field
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!values.name.trim()) {
        toast.error("Category name is required");
        setSubmitting(false);
        return;
      }

      try {
        if (isEditing) {
          // Note: ensure your update API handles the 'values' object structure correctly
          await categoriesApis.updateCategory({ id: data._id, values });
          toast.success("Category updated successfully");
        } else {
          await categoriesApis.adminCreateCategory(values);
          toast.success("Category created successfully");
        }
        onSuccess();
        setOpen(false);
        resetForm();
        setPreview(null); // Reset preview on success
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // NEW: Function to handle the S3 Upload
  const handleThumbnailUpload = async (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    // Optimistically set the preview
    setPreview(URL.createObjectURL(file));
    setIsUploadingImage(true);

    try {
      // Re-using the same upload function from your products API
      const [res, error] = await productsApis.uploadImage({ file });
      const { success, url } = res?.data || {};

      if (success && url) {
        setFieldValue("image", url);
      } else {
        toast.error("Image upload failed");
        setPreview(formik.values.image); // Revert to previous image if failed
      }
    } catch (err) {
      toast.error("Something went wrong during upload");
      setPreview(formik.values.image);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          {/* NEW: Media Upload Section */}
          <div className="space-y-2">
            <Label>Category Image</Label>
            <div
              className={`border-2 border-dashed rounded-xl p-4 transition flex flex-col items-center justify-center gap-2 relative ${
                isUploadingImage
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-muted/50 cursor-pointer"
              }`}
              onClick={() =>
                !isUploadingImage &&
                document.getElementById("catFileInput").click()
              }
            >
              {isUploadingImage && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 rounded-xl backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              )}

              {preview || formik.values.image ? (
                <img
                  src={preview || formik.values.image}
                  className="h-32 w-full object-cover rounded-lg"
                  alt="Category Preview"
                />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                </>
              )}
              <input
                id="catFileInput"
                type="file"
                accept="image/*"
                hidden
                onChange={(event) =>
                  handleThumbnailUpload(event, formik.setFieldValue)
                }
              />
            </div>
          </div>

          {/* Original Form Fields */}
          <div className="space-y-2">
            <Label htmlFor="cat_name">Category Name</Label>
            <Input
              id="cat_name"
              name="name"
              placeholder="e.g. Body Care"
              value={formik.values.name}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat_slug">Custom URL Slug (Optional)</Label>
            <Input
              id="cat_slug"
              name="slug"
              placeholder="e.g. body-care"
              value={formik.values.slug}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to automatically generate from the name.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={formik.isSubmitting || isUploadingImage}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || isUploadingImage}
            >
              {(formik.isSubmitting || uploaderLoader) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// =====================================================================
// FORMIK SUB-CATEGORY MODAL
// =====================================================================
const SubCategoryModal = ({
  open,
  setOpen,
  data = {},
  categories = [],
  onSuccess,
}) => {
  const isEditing = !!data?._id;

  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      slug: data?.slug || "",
      category: data?.category?._id || data?.category || "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!values.category) {
        toast.error("Please select a parent category");
        setSubmitting(false);
        return;
      }
      if (!values.name.trim()) {
        toast.error("Sub-category name is required");
        setSubmitting(false);
        return;
      }

      try {
        if (isEditing) {
          await categoriesApis.updateSubCategory({ id: data._id, ...values });
        } else {
          await categoriesApis.adminCreateSubCategory(values);
        }
        onSuccess();
        setOpen(false);
        resetForm();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Sub-Category" : "Add Sub-Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Parent Category</Label>
            <Select
              value={formik.values.category}
              onValueChange={(val) => formik.setFieldValue("category", val)}
              disabled={formik.isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a parent category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat._id}
                    value={cat._id}
                    className="capitalize"
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub_name">Sub-Category Name</Label>
            <Input
              id="sub_name"
              name="name"
              placeholder="e.g. Lotions"
              value={formik.values.name}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub_slug">Custom URL Slug (Optional)</Label>
            <Input
              id="sub_slug"
              name="slug"
              placeholder="e.g. lotions"
              value={formik.values.slug}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
