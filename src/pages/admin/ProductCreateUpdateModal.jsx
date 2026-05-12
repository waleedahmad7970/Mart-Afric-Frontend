import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Plus, Upload, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import productsApis from "../../api/products/products-apis";
import { productActions } from "../../store/slices/product/slice";
import { useSelector } from "react-redux";

// Validation Schema
const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  price: Yup.number().positive().required("Required"),
  stock: Yup.number().integer().min(0).required("Required"),
  description: Yup.string().required("Required"),
  tagline: Yup.string(),
  origin: Yup.string(),
  images: Yup.array().of(Yup.mixed()),
  category: Yup.string().required("Required"),
});

const CreateUpdateProductModel = ({ product, setOpen, open }) => {
  const [preview, setPreview] = useState(product?.image);
  const { uploaderLoader } = useSelector((state) => state.loader.loaders);
  const initialValues = product || {
    name: "",
    tagline: "",
    origin: "",
    price: 0,
    stock: 0,
    description: "",
    image: null,
    images: [],
    category: "69fb9437ef3705ecb578e3b4",
  };

  const hanlleTumbailUpload = async (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    const [res, error] = await productsApis.uploadImage({ file });
    const { success, url } = res?.data || {};
    if (success) {
      setFieldValue("image", url);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (product?._id) {
      const [res, error] = await productsApis.updateProduct({
        productId: product._id,
        body: values,
      });
      const { success, message } = res?.data || {};
      if (success) setOpen(false);
    } else {
      const [res, error] = await productsApis.createProduct({ body: values });
      const { success, message } = res?.data || {};
      if (success) setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initialValues?._id ? "Edit Product" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>

        <Formik
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
            <Form className="space-y-4 py-4">
              {/* Image Upload Area */}
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div
                  className="border-2 border-dashed rounded-xl p-4 hover:bg-muted/50 transition cursor-pointer flex flex-col items-center justify-center gap-2"
                  onClick={() => document.getElementById("fileInput").click()}
                >
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
                    onChange={(event) => {
                      hanlleTumbailUpload(event, setFieldValue);
                    }}
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="e.g. Prekese"
                />
              </div>
              {/* category */}
              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <Input
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  placeholder="e.g. Spices"
                />
              </div>

              {/* Tagline & Origin */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Tagline</Label>
                  <Input
                    name="tagline"
                    value={values.tagline}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Origin</Label>
                  <Input
                    name="origin"
                    value={values.origin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Price ($)</Label>
                  <Input
                    name="price"
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Stock</Label>
                  <Input
                    name="stock"
                    type="number"
                    value={values.stock}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label>Description</Label>
                <textarea
                  name="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                  value={values.description}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4">
                <Button
                  loading={uploaderLoader}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 text-lg rounded-xl"
                >
                  {isSubmitting
                    ? "Uploading..."
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
