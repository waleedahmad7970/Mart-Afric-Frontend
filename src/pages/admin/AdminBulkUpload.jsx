import { useState, useRef } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Papa from "papaparse";
import * as Yup from "yup";
import productsApis from "../../api/products/products-apis";

// --- YOUR EXACT YUP SCHEMAS ---
const validationSchemas = {
  products: Yup.object().shape({
    image: Yup.string().required("Image is required"),
    name: Yup.string()
      .required("Name is required")
      .min(20, "Name must be at least 20 characters"),
    brand: Yup.string().required("Brand is required"),
    category: Yup.string().required("Category is required"),
    subCategory: Yup.string().required("Sub-category is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .min(1, "Must be positive")
      .required("Price is required"),
    stock: Yup.number()
      .typeError("Stock must be a number")
      .integer()
      .min(1)
      .required("Stock is required"),
    description: Yup.string()
      .required("Description is required")
      .min(50, "Description must be at least 50 characters"),
    sku: Yup.string().required("SKU is required"),
    barcode: Yup.string().required("Barcode is required"),
    salePrice: Yup.number()
      .typeError("Sale price must be a number")
      .min(1)
      .required("Sale price is required"),
    vatEnabled: Yup.boolean()
      .typeError("VAT enabled must be true or false")
      .required("VAT enabled is required"),
    vatPercentage: Yup.number().typeError("VAT must be a number"),
    weight: Yup.number()
      .typeError("Weight must be a number")
      .min(1)
      .required("Weight is required"),
    unit: Yup.string()
      .oneOf(["kg", "g", "litre", "ml", "pack", "piece"], "Invalid unit type")
      .required("Unit is required"),
    status: Yup.string()
      .oneOf(["active", "inactive", "out_of_stock"], "Invalid status")
      .required("Status is required"),
    nutritionInfo: Yup.object().shape({
      calories: Yup.number()
        .typeError("Calories must be a number")
        .min(0)
        .required("Calories are required"),
      protein: Yup.number()
        .typeError("Protein must be a number")
        .min(0)
        .required("Protein is required"),
      carbs: Yup.number()
        .typeError("Carbs must be a number")
        .min(0)
        .required("Carbs are required"),
      fat: Yup.number()
        .typeError("Fat must be a number")
        .min(0)
        .required("Fat is required"),
    }),
  }),
  categories: Yup.object().shape({
    name: Yup.string().trim().required("Category name is required"),
    slug: Yup.string().trim().required("Category Slug is required"),
    image: Yup.string().required("Category image is required"),
  }),
  subCategories: Yup.object().shape({
    category: Yup.string().required("Please select a parent category"),
    name: Yup.string().trim().required("Sub-category name is required"),
    slug: Yup.string().trim().required("Sub-category slug is required"),
  }),
  blogs: Yup.object().shape({
    title: Yup.string().required("Title is required"),
    slug: Yup.string().required("Slug is required"),
  }),
};

// --- TEMPLATE HEADERS MATCHING SCHEMAS ---
const TEMPLATES = {
  products: [
    "image",
    "name",
    "brand",
    "category",
    "subCategory",
    "price",
    "stock",
    "description",
    "sku",
    "barcode",
    "salePrice",
    "vatEnabled",
    "vatPercentage",
    "weight",
    "unit",
    "status",
    "nutritionInfo.calories",
    "nutritionInfo.protein",
    "nutritionInfo.carbs",
    "nutritionInfo.fat",
  ],
  categories: ["name", "slug", "image"],
  subCategories: ["category", "name", "slug"],
  blogs: ["title", "slug"], // Add your blog fields here later
};

const AdminBulkUpload = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [hasErrors, setHasErrors] = useState(false);
  const fileInputRef = useRef(null);

  // Helper to convert flat CSV rows (nutritionInfo.calories) to nested objects
  const unflattenObject = (data) => {
    const result = {};
    for (const key in data) {
      const keys = key.split(".");
      keys.reduce((acc, part, index) => {
        if (index === keys.length - 1) acc[part] = data[key];
        else acc[part] = acc[part] || {};
        return acc[part];
      }, result);
    }
    return result;
  };

  const handleDownloadTemplate = () => {
    const headers = TEMPLATES[activeTab].join(",");
    const blob = new Blob([headers], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activeTab}_template.csv`;
    link.click();
    toast.success(`${activeTab} template downloaded!`);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (
      selectedFile.type !== "text/csv" &&
      !selectedFile.name.endsWith(".csv")
    ) {
      return toast.error("Please upload a valid CSV file.");
    }

    setFile(selectedFile);
    parseAndValidateCSV(selectedFile);
  };

  // --- REAL YUP VALIDATION ENGINE ---
  const parseAndValidateCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const schema = validationSchemas[activeTab];
        const validationResults = [];
        let foundError = false;

        for (let i = 0; i < results.data.length; i++) {
          // 1. Unflatten CSV row (handles nutritionInfo.calories)
          const rowData = unflattenObject(results.data[i]);

          try {
            // 2. Validate row strictly against your Yup schema
            await schema.validate(rowData, { abortEarly: false });
            validationResults.push({
              rowNumber: i + 1,
              status: "valid",
              message: `Row ${i + 1}: Valid`,
            });
          } catch (err) {
            foundError = true;
            // 3. Catch Yup errors and display them
            validationResults.push({
              rowNumber: i + 1,
              status: "error",
              message: `Row ${i + 1}: ${err.errors.join(", ")}`,
            });
          }
        }

        setParsedRows(validationResults);
        setHasErrors(foundError);

        if (foundError) {
          toast.error("Validation failed! Please fix the errors in your CSV.");
        } else {
          toast.success("All rows passed validation!");
        }
      },
    });
  };

  const clearFile = () => {
    setFile(null);
    setParsedRows([]);
    setHasErrors(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file || hasErrors) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", activeTab);

      const [data, error] = await productsApis.uploadBulkProducts(formData);

      if (error) {
        toast.error(error?.message || "Bulk upload failed.");
        return;
      }

      toast.success(
        data?.message || `Successfully uploaded bulk ${activeTab}!`,
      );
      clearFile();
    } catch (error) {
      console.error(error);
      toast.error("Bulk upload network failure.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-up">
      <div>
        <h1 className="font-display text-4xl font-medium tracking-tight">
          Bulk Upload
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Import and update records. Files are strictly validated before upload.
        </p>
      </div>

      <Tabs
        defaultValue="products"
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
          clearFile();
        }}
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="products" className="rounded-lg">
            Products
          </TabsTrigger>
          {/* <TabsTrigger value="categories" className="rounded-lg">
            Categories
          </TabsTrigger>
          <TabsTrigger value="subCategories" className="rounded-lg">
            Sub-categories
          </TabsTrigger>
          <TabsTrigger value="blogs" className="rounded-lg">
            Blogs
          </TabsTrigger> */}
        </TabsList>

        <div className="mt-6 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
            <div>
              <h3 className="text-lg font-semibold capitalize">
                {activeTab} Import
              </h3>
              <p className="text-sm text-muted-foreground">
                Download the exact template format required for validation.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="shrink-0 rounded-full"
            >
              <Download className="mr-2 h-4 w-4" /> CSV Template
            </Button>
          </div>

          {!file ? (
            <div
              className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-1">
                Click or drag file to this area
              </h4>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* REAL VALIDATION RESULTS */}
              {parsedRows.length > 0 && (
                <div
                  className={`border rounded-xl overflow-hidden ${hasErrors ? "border-red-500/50" : "border-border"}`}
                >
                  <div className="bg-muted/50 px-4 py-2 border-b border-border text-sm font-semibold flex justify-between">
                    <span>Validation Preview</span>
                    {hasErrors ? (
                      <span className="text-red-500">Errors Found</span>
                    ) : (
                      <span className="text-emerald-500">All Passed!</span>
                    )}
                  </div>
                  <div className="divide-y divide-border max-h-[300px] overflow-auto">
                    {parsedRows.map((row, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 text-sm ${row.status === "error" ? "bg-red-500/5" : ""}`}
                      >
                        {row.status === "valid" ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            row.status === "error"
                              ? "text-destructive font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {row.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || hasErrors} // Button stays disabled if ANY Yup errors exist!
                  className="rounded-full px-8"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    `Upload ${activeTab}`
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default AdminBulkUpload;
