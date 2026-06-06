import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FileText,
  Eye,
  Plus,
  Search,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Tag,
  Loader2,
  X,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Filter States
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sort: "newest",
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        setBlogs([
          {
            _id: "b1",
            title: "Top 10 E-Commerce Trends for 2026",
            excerpt:
              "Discover the technologies shaping the future of online shopping...",
            content: "Full content here...",
            coverImage:
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop",
            status: "published",
            views: 12450,
            tags: ["Trends", "Technology"],
            createdAt: "2026-05-15T10:00:00Z",
          },
        ]);
        setLoading(false);
      }, 600);
    } catch (error) {
      toast.error("Failed to load blogs");
      setLoading(false);
    }
  };

  // ==========================================
  // FORMIK CONFIGURATION
  // ==========================================
  const formik = useFormik({
    initialValues: {
      title: "",
      excerpt: "",
      content: "",
      coverImage: null, // Stores the actual File object or URL
      tags: "",
      status: "draft",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Article title is required"),
      excerpt: Yup.string().max(160, "Excerpt must be 160 characters or less"),
      content: Yup.string().required("Article content is required"),
      status: Yup.string().required("Please select a status"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Create FormData to handle the image file + text fields properly
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("excerpt", values.excerpt);
        formData.append("content", values.content);
        formData.append("tags", values.tags);
        formData.append("status", values.status);

        // Only append the image if it's an actual File object (new upload)
        if (values.coverImage instanceof File) {
          formData.append("coverImage", values.coverImage);
        }

        // NOTE: Send formData to your backend API here
        // await axios.post('/api/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

        toast.success(
          editingId ? "Blog updated successfully!" : "New blog published!",
        );
        setIsModalOpen(false);
        resetForm();
        setImagePreview(null);
        fetchBlogs();
      } catch (error) {
        toast.error("Failed to save blog post");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const openModal = (blog = null) => {
    if (blog) {
      setEditingId(blog._id);
      formik.setValues({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: blog.coverImage, // Existing URL
        tags: blog.tags.join(", "),
        status: blog.status,
      });
      setImagePreview(blog.coverImage); // Show existing image
    } else {
      setEditingId(null);
      formik.resetForm();
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  // Handle local image selection and preview generation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("coverImage", file);
      setImagePreview(URL.createObjectURL(file)); // Generate temporary URL for preview
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;
    setBlogs((prev) => prev.filter((b) => b._id !== id));
    toast.success("Blog post deleted");
  };

  const totalPosts = blogs.length;
  const publishedPosts = blogs.filter((b) => b.status === "published").length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">
            Blogs & Articles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your store's content marketing.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="rounded-full flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Write New Post
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Posts
            </p>
            <h3 className="text-3xl font-bold">{totalPosts}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Published
            </p>
            <h3 className="text-3xl font-bold">{publishedPosts}</h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Views
            </p>
            <h3 className="text-3xl font-bold">
              {totalViews.toLocaleString()}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Eye className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>

      {/* BLOGS TABLE */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4 w-[400px]">Article</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {blogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-20 rounded-md overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground line-clamp-1">
                          {blog.title}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        blog.status === "published" ? "default" : "secondary"
                      }
                      className="capitalize rounded-full"
                    >
                      {blog.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 tabular-nums text-muted-foreground">
                    {blog.views}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openModal(blog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(blog._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          FORMIK CREATE / UPDATE MODAL
      ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-up">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <div>
                <h3 className="text-xl font-display font-semibold">
                  {editingId ? "Edit Article" : "Write New Article"}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form
                id="formik-blog-form"
                onSubmit={formik.handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* LEFT COLUMN: Main Content */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        Article Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="title"
                        placeholder="Enter a catchy title..."
                        className={`h-12 text-lg font-medium ${formik.touched.title && formik.errors.title ? "border-red-500" : ""}`}
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.title && formik.errors.title && (
                        <p className="text-xs text-red-500 font-medium">
                          {formik.errors.title}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        Short Excerpt
                      </label>
                      <Textarea
                        name="excerpt"
                        placeholder="A brief summary..."
                        className="resize-none h-20"
                        value={formik.values.excerpt}
                        onChange={formik.handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        Full Content <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        name="content"
                        placeholder="Write your article content here..."
                        className={`min-h-[300px] resize-y ${formik.touched.content && formik.errors.content ? "border-red-500" : ""}`}
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.content && formik.errors.content && (
                        <p className="text-xs text-red-500 font-medium">
                          {formik.errors.content}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Settings & Upload */}
                  <div className="space-y-6 md:border-l md:border-border md:pl-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        Publishing Status
                      </label>
                      {/* Shadcn Select requires onValueChange manually hooked to Formik */}
                      <Select
                        name="status"
                        value={formik.values.status}
                        onValueChange={(val) =>
                          formik.setFieldValue("status", val)
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Save as Draft</SelectItem>
                          <SelectItem value="published">
                            Published (Live)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* NEW: IMAGE UPLOAD FEATURE */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" /> Cover Image
                      </label>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImageChange}
                      />

                      {imagePreview ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-border group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              Change
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                formik.setFieldValue("coverImage", null);
                                setImagePreview(null);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center cursor-pointer text-muted-foreground"
                        >
                          <UploadCloud className="h-8 w-8 mb-2 opacity-50" />
                          <p className="text-sm font-medium">
                            Click to upload image
                          </p>
                          <p className="text-xs opacity-70">
                            JPG, PNG or WEBP (Max 2MB)
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Tag className="h-4 w-4" /> Tags
                      </label>
                      <Input
                        name="tags"
                        placeholder="e.g. Technology, Guide"
                        value={formik.values.tags}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border shrink-0 bg-muted/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="formik-blog-form"
                disabled={formik.isSubmitting}
                className="rounded-full px-8"
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : editingId ? (
                  "Update Article"
                ) : (
                  "Save Article"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
