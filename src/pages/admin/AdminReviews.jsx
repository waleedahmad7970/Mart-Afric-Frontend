import { useState, useEffect } from "react";
import {
  Star,
  Search,
  MessageSquare,
  Trash2,
  StarHalf,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import reviewsApis from "../../api/reviews/reviews-apis";
import { useFormik } from "formik";
import * as Yup from "yup";
import productsApis from "../../api/products/products-apis";
import { useSelector } from "react-redux";
import useDebounce from "../../hooks/debouce";

const AdminReviews = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    rating: "all",
    sort: "newest",
  });

  const { review = {} } = useSelector((state) => state.admin);
  const { reviewPagination = {}, reviews = [] } = review || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    const [res, error] = await productsApis.getAdminProducts({ limit: 500 });
    const { success, data } = res?.data || {};
    if (success) {
      setProducts(data);
    }
  };

  const handleDelete = async (id) => {
    await reviewsApis.deleteReview({ id });
  };

  // --- FORMIK SETUP ---
  const formik = useFormik({
    initialValues: {
      product: "",
      rating: 0,
      title: "",
      comment: "",
    },
    validationSchema: Yup.object({
      product: Yup.string().required("Please select a product"),
      rating: Yup.number()
        .min(1, "Please select a star rating")
        .required("Rating is required"),
      title: Yup.string(),
      comment: Yup.string().required("Please write a comment").trim(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const [res, error] = await reviewsApis.createReview(values);
        const { data, success } = res?.data || {};
        if (success) {
          toast.success("Review added successfully");
          setIsModalOpen(false);
          resetForm();
          reviewsApis.getAllReviews({
            search: filters.search,
            rating: filters.rating,
            sort: filters.sort,
          });
        }
      } catch (error) {
        toast.error("Failed to add review");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Helper to close modal and reset form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    formik.resetForm();
    setHoverRating(0);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              rating >= star
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const debouncedQ = useDebounce(filters.search, 600);

  useEffect(() => {
    fetchProducts();

    reviewsApis.getAllReviews({
      search: debouncedQ,
      rating: filters.rating,
      sort: filters.sort,
    });
  }, [debouncedQ, filters.rating, filters.sort]);

  return (
    <div className="space-y-6 animate-fade-up relative">
      {/* HEADER WITH ADD BUTTON */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">
            Customer Reviews
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and manage product feedback from your customers.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Review
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Reviews
            </p>
            <h3 className="text-3xl font-bold">{totalReviews}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Average Rating
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold">{averageRating}</h3>
              <span className="text-sm text-muted-foreground mb-1">/ 5.0</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <StarHalf className="h-6 w-6 text-amber-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              5-Star Reviews
            </p>
            <h3 className="text-3xl font-bold">{fiveStarCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product or customer..."
              className="pl-9"
              value={filters.search}
              onChange={(e) =>
                setFilters((p) => ({ ...p, search: e.target.value }))
              }
            />
          </div>
          <Select
            value={filters.rating}
            onValueChange={(val) => setFilters((p) => ({ ...p, rating: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
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
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* REVIEWS TABLE */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4 min-w-[200px]">Customer</th>
                <th className="px-6 py-4 min-w-[200px]">Product</th>
                <th className="px-6 py-4 min-w-[150px]">Rating</th>
                <th className="px-6 py-4 min-w-[300px]">Review</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr
                    key={review._id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {review.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {review.user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                          {review.product.image ? (
                            <img
                              src={review.product.image}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-secondary"></div>
                          )}
                        </div>
                        <span className="font-medium text-foreground line-clamp-2">
                          {review.product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {renderStars(review.rating)}
                        {review.rating <= 2 && (
                          <span className="flex items-center gap-1 text-[10px] text-red-500 font-semibold uppercase mt-0.5">
                            <AlertCircle className="w-3 h-3" /> Needs Attention
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-[350px]">
                        {review.title && (
                          <span className="font-semibold text-foreground mb-0.5 truncate">
                            {review.title}
                          </span>
                        )}
                        <span className="text-muted-foreground text-sm line-clamp-2">
                          "{review.comment}"
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(review._id)}
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          ADD REVIEW MODAL OVERLAY (FORMIK)
      ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-lg overflow-hidden animate-fade-up">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Add New Review
                </h3>
                <p className="text-sm text-muted-foreground">
                  Attach a custom review to a product.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>

            {/* Connect Formik handleSubmit */}
            <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Target Product <span className="text-red-500">*</span>
                </label>
                <Select
                  name="product"
                  value={formik.values.product}
                  onValueChange={(val) => formik.setFieldValue("product", val)}
                >
                  <SelectTrigger
                    className={
                      formik.touched.product && formik.errors.product
                        ? "border-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((prod) => (
                      <SelectItem key={prod?._id} value={prod?._id}>
                        {prod?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.product && formik.errors.product && (
                  <p className="text-xs text-red-500">
                    {formik.errors.product}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      onClick={() => formik.setFieldValue("rating", star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors duration-200 ${
                          (hoverRating || formik.values.rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    {formik.values.rating > 0
                      ? `${formik.values.rating} Stars`
                      : ""}
                  </span>
                </div>
                {formik.touched.rating && formik.errors.rating && (
                  <p className="text-xs text-red-500">{formik.errors.rating}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Review Title</label>
                <Input
                  name="title"
                  placeholder="e.g., Amazing Quality!"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Comment <span className="text-red-500">*</span>
                </label>
                <Textarea
                  name="comment"
                  placeholder="Write the customer's feedback here..."
                  className={`resize-y min-h-[100px] ${formik.touched.comment && formik.errors.comment ? "border-red-500" : ""}`}
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.comment && formik.errors.comment && (
                  <p className="text-xs text-red-500">
                    {formik.errors.comment}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                {/* Use formik.isSubmitting for loading state */}
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="rounded-full"
                >
                  {formik.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Attach Review"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
