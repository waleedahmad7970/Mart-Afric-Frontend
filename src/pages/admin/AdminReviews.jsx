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
import { Textarea } from "@/components/ui/textarea"; // <-- Added Textarea import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// import reviewApis from "../../api/reviews/review-apis";
// import productsApis from "../../api/products/products-apis";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]); // Stores products for the dropdown
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    rating: "all",
    sort: "newest",
  });

  // --- NEW: Add Review Modal States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [newReview, setNewReview] = useState({
    productId: "",
    rating: 0,
    title: "",
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
    fetchProducts(); // Fetch products so we can select them in the modal
  }, [filters]);

  const fetchProducts = async () => {
    // NOTE: Replace with your actual API call to get a list of products
    // const [res] = await productsApis.getAllProducts();
    // if (res?.data) setProducts(res.data);

    // DUMMY PRODUCTS FOR THE DROPDOWN
    setProducts([
      { _id: "p1", name: "Premium Wireless Headphones" },
      { _id: "p2", name: "Smart Fitness Watch" },
      { _id: "p3", name: "Organic Face Cleanser" },
    ]);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // NOTE: Replace with actual API call
      // const [res, err] = await reviewApis.getAllReviews(filters);
      // if (res?.data) setReviews(res.data);

      setTimeout(() => {
        setReviews([
          {
            _id: "r1",
            user: { name: "Sarah Jenkins", email: "sarah@example.com" },
            product: {
              name: "Premium Wireless Headphones",
              image: "https://via.placeholder.com/150",
            },
            rating: 5,
            title: "Absolutely fantastic!",
            comment:
              "The sound quality is amazing and the battery lasts for days.",
            createdAt: "2026-06-01T10:30:00Z",
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      // await reviewApis.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  // --- NEW: Handle Form Submit ---
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.productId) return toast.error("Please select a product");
    if (newReview.rating === 0)
      return toast.error("Please select a star rating");
    if (!newReview.comment.trim()) return toast.error("Please write a comment");

    setIsSubmitting(true);
    try {
      // NOTE: Replace with actual API call
      // await reviewApis.submitReview(newReview);

      // Simulate API Delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Review successfully attached to product!");
      setIsModalOpen(false);
      setNewReview({ productId: "", rating: 0, title: "", comment: "" }); // Reset form
      fetchReviews(); // Refresh the table
    } catch (error) {
      toast.error("Failed to add review");
    } finally {
      setIsSubmitting(false);
    }
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

        {/* NEW ADD BUTTON */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Review
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ... (Your existing Stats Cards) ... */}
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
          ADD REVIEW MODAL OVERLAY
      ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-lg w-full max-w-lg overflow-hidden animate-fade-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Add New Review
                </h3>
                <p className="text-sm text-muted-foreground">
                  Attach a custom review to a product.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleAddReview} className="p-6 space-y-6">
              {/* Product Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Target Product <span className="text-red-500">*</span>
                </label>
                <Select
                  value={newReview.productId}
                  onValueChange={(val) =>
                    setNewReview((prev) => ({ ...prev, productId: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((prod) => (
                      <SelectItem key={prod._id} value={prod._id}>
                        {prod.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Interactive Stars */}
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
                      onClick={() =>
                        setNewReview((prev) => ({ ...prev, rating: star }))
                      }
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors duration-200 ${
                          (hoverRating || newReview.rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    {newReview.rating > 0 ? `${newReview.rating} Stars` : ""}
                  </span>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Review Title</label>
                <Input
                  placeholder="e.g., Amazing Quality!"
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              {/* Comment Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Comment <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Write the customer's feedback here..."
                  className="resize-y min-h-[100px]"
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full"
                >
                  {isSubmitting ? (
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
