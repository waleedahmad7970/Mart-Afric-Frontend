import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Loader2,
  Search,
  Users,
  ShieldCheck,
  User,
  Plus,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import userApi from "../../api/user/user-apis";
import { authActions } from "../../store/slices/auth/slice";
import useDebounce from "../../hooks/debouce";
import productsApis from "../../api/products/products-apis";

const AdminUsers = () => {
  const dispatch = useDispatch();

  const { users, userPagination } = useSelector((state) => state.auth);
  const { page, totalPages, limit, total } = userPagination || {
    page: 1,
    totalPages: 1,
    limit: 10,
    total: 0,
  };

  // ==========================================
  // UI & FILTER STATE
  // ==========================================
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
  });
  const debouncedSearchTerm = useDebounce(filters.search, 500);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({});

  const refreshData = () => {
    userApi.getUsers({
      page: 1,
      limit,
      search: debouncedSearchTerm,
      role: filters.role !== "all" ? filters.role : undefined,
      status: filters.status !== "all" ? filters.status : undefined,
    });
  };

  // Reset page to 1 whenever a filter changes
  useEffect(() => {
    dispatch(authActions.setUserPagination({ page: 1 }));
  }, [filters.role, filters.status, debouncedSearchTerm, dispatch]);

  // Fetch users when page, limit, or filters change
  useEffect(() => {
    userApi.getUsers({
      page,
      limit,
      search: debouncedSearchTerm,
      role: filters.role !== "all" ? filters.role : undefined,
      status: filters.status !== "all" ? filters.status : undefined,
    });
  }, [page, limit, debouncedSearchTerm, filters.role, filters.status]);

  const fetchNextPage = () => {
    if (page < totalPages) {
      dispatch(authActions.setUserPagination({ page: page + 1 }));
    }
  };

  // ==========================================
  // DELETE HANDLER
  // ==========================================
  const handleDeleteUser = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This cannot be undone.",
      )
    ) {
      try {
        await userApi.deleteUser({ id });
        toast.success("User deleted successfully");
        refreshData();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete user");
      }
    }
  };

  // ==========================================
  // STATS CALCULATION
  // ==========================================
  const statsData = useMemo(() => {
    const totalAdmins = users?.filter((u) => u?.role === "admin").length || 0;
    const totalCustomers = users?.filter((u) => u?.role === "user").length || 0;
    const activeUsers =
      users?.filter((u) => u?.status === "active").length || 0;
    const inactiveUsers =
      users?.filter((u) => u?.status === "inactive").length || 0;

    return [
      { title: "Total Users", value: total || users?.length || 0, icon: Users },
      { title: "Admins", value: totalAdmins, icon: ShieldCheck },
      { title: "Customers", value: totalCustomers, icon: User },
      { title: "Active", value: activeUsers, icon: UserCheck },
      { title: "Inactive", value: inactiveUsers, icon: UserX },
    ];
  }, [users, total]);

  return (
    <div className="space-y-6 m mx-auto">
      {/* MODAL */}
      <UserModal
        open={modalOpen}
        setOpen={setModalOpen}
        data={editingUser}
        onSuccess={refreshData}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            People
          </p>
          <h1 className="font-display text-4xl">Users & Customers</h1>
        </div>
        <Button
          className="rounded-full"
          onClick={() => {
            setEditingUser({});
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> Add User
        </Button>
      </div>

      {/* ========================================== */}
      {/* STATS CARDS GRID UI */}
      {/* ========================================== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {item.title}
                </p>
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">{item.value}</h3>
            </div>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* FILTERS GRID UI */}
      {/* ========================================== */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="pl-9"
              placeholder="Search Name or Email..."
            />
          </div>

          {/* Role Dropdown */}
          <Select
            value={filters.role}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">Customer</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Dropdown */}
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ========================================== */}
      {/* TABLE DATA */}
      {/* ========================================== */}
      <div
        id="scrollableUsersContainer"
        className="bg-card border border-border rounded-2xl overflow-auto h-[60vh] relative scrollbar-hide"
      >
        <InfiniteScroll
          dataLength={users?.length || 0}
          next={fetchNextPage}
          hasMore={page < totalPages}
          scrollableTarget="scrollableUsersContainer"
          loader={
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
          endMessage={
            <p className="text-center p-6 text-xs text-muted-foreground">
              End of users ({users?.length || 0} total)
            </p>
          }
        >
          <table className="w-full text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-muted sticky top-0 z-20 shadow-sm text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-5 font-medium">User Profile</th>
                <th className="text-left p-5 font-medium">Email</th>
                <th className="text-left p-5 font-medium">Role</th>
                <th className="text-left p-5 font-medium">Status</th>
                <th className="text-right p-5 font-medium hidden md:table-cell">
                  Joined Date
                </th>
                <th className="text-right p-5 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {users?.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-12 text-muted-foreground"
                  >
                    <Users className="h-10 w-10 mx-auto opacity-20 mb-3" />
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                users?.map((u) => (
                  <tr
                    key={u?._id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="p-5 font-medium">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-10 w-10 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                            {u?.name
                              ?.split(" ")
                              ?.map((n) => n[0])
                              ?.join("")
                              ?.substring(0, 2)
                              ?.toUpperCase() || "U"}
                          </div>
                        )}
                        <span className="capitalize">{u?.name}</span>
                      </div>
                    </td>

                    <td className="p-5 text-muted-foreground">{u?.email}</td>

                    <td className="p-5">
                      <Badge
                        variant="outline"
                        className={`rounded-full capitalize ${
                          u?.role === "admin"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {u?.role || "user"}
                      </Badge>
                    </td>

                    <td className="p-5">
                      <span className="flex items-center gap-1.5 text-xs font-medium capitalize">
                        <span
                          className={`h-2 w-2 rounded-full ${u?.status === "active" ? "bg-emerald-500" : "bg-red-500"}`}
                        ></span>
                        {u?.status || "active"}
                      </span>
                    </td>

                    <td className="p-5 hidden md:table-cell text-muted-foreground text-right">
                      {new Date(u?.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingUser(u);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/10"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AdminUsers;

// =====================================================================
// FORMIK USER MODAL
// =====================================================================
const UserModal = ({ open, setOpen, data = {}, onSuccess }) => {
  const isEditing = !!data?._id;

  // NEW: States for Avatar Image uploading
  const [preview, setPreview] = useState(data?.avatar || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Pulling the global uploader loader (optional)
  const { uploaderLoader } = useSelector(
    (state) => state.loader?.loaders || {},
  );

  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      email: data?.email || "",
      password: "", // Left blank initially for security
      role: data?.role || "user",
      status: data?.status || "active",
      avatar: data?.avatar || null, // NEW: Added avatar field mapping
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!values.name.trim()) return toast.error("Name is required");
      if (!values.email.trim()) return toast.error("Email is required");
      if (!isEditing && !values.password)
        return toast.error("Password is required for new users");

      // Clean up the payload: don't send an empty password on update
      const payload = { ...values };
      if (isEditing && !payload.password) {
        delete payload.password;
      }

      try {
        if (isEditing) {
          await userApi.updateUser({ id: data._id, ...payload });
          toast.success("User updated successfully");
        } else {
          await userApi.createUser(payload);
          toast.success("User created successfully");
        }
        onSuccess();
        setOpen(false);
        resetForm();
        setPreview(null); // Clear preview on success
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // NEW: Function to handle the S3 Avatar Upload
  const handleAvatarUpload = async (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    // Optimistically set the preview
    setPreview(URL.createObjectURL(file));
    setIsUploadingImage(true);

    try {
      const [res, error] = await productsApis.uploadImage({ file });
      const { success, url } = res?.data || {};

      if (success && url) {
        setFieldValue("avatar", url);
        toast.success("Avatar uploaded successfully!");
      } else {
        toast.error("Avatar upload failed");
        setPreview(formik.values.avatar); // Revert to previous avatar if failed
      }
    } catch (err) {
      toast.error("Something went wrong during upload");
      setPreview(formik.values.avatar);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          {/* NEW: Avatar Media Upload Section */}
          <div className="space-y-2 flex flex-col items-center">
            <div
              className={`border-2 border-dashed rounded-full h-28 w-28 transition flex flex-col items-center justify-center relative overflow-hidden ${
                isUploadingImage
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-muted/50 cursor-pointer"
              }`}
              onClick={() =>
                !isUploadingImage &&
                document.getElementById("avatarFileInput").click()
              }
            >
              {isUploadingImage && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {preview || formik.values.avatar ? (
                <img
                  src={preview || formik.values.avatar}
                  className="h-full w-full object-cover"
                  alt="Avatar Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Upload className="h-6 w-6 mb-1" />
                  <span className="text-[10px] uppercase font-medium tracking-wider">
                    Avatar
                  </span>
                </div>
              )}
              <input
                id="avatarFileInput"
                type="file"
                accept="image/*"
                hidden
                onChange={(event) =>
                  handleAvatarUpload(event, formik.setFieldValue)
                }
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click to upload profile picture
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. John Doe"
              value={formik.values.name}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. john@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="text"
              placeholder={
                isEditing ? "Leave blank to keep current" : "Secure password"
              }
              value={formik.values.password}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
            />
            {isEditing && (
              <p className="text-xs text-muted-foreground">
                Only fill this if you want to change the user's password.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>User Role</Label>
              <Select
                value={formik.values.role}
                onValueChange={(val) => formik.setFieldValue("role", val)}
                disabled={formik.isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formik.values.status}
                onValueChange={(val) => formik.setFieldValue("status", val)}
                disabled={formik.isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
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
              {isEditing ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
