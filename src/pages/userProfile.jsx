import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Camera,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon,
  CheckCircle2,
  Badge,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import userApi from "../api/user/user-apis";
import productsApis from "../api/products/products-apis";
import { authActions } from "../store/slices/auth/slice";
import { handleFormikErrors } from "../helpers/helpers";

// Assuming you have these APIs. Adjust paths as needed.
// import { authActions } from "../../store/slices/auth/slice"; // If you need to update Redux after save

const UserProfile = () => {
  const dispatch = useDispatch();

  // Pull current user from Redux (Adjust 'auth.user' based on your actual Redux state)
  const { user } = useSelector((state) => state.auth || {});
  const [preview, setPreview] = useState(user?.avatar || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setPreview(user.avatar);
    }
  }, [user?.avatar]);

  // ==========================================
  // PROFILE INFO FORMIK
  // ==========================================
  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Replace with your actual profile update API
        const [res, error] = await userApi.updateUser(values);
        if (res?.data?.success) {
          toast.success("Profile updated successfully");
          dispatch(authActions.setUser(res.data.user)); // Update Redux state
        }
      } catch (err) {
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ==========================================
  // SECURITY (PASSWORD) FORMIK
  // ==========================================
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm your new password"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Replace with your actual password update API
        const [res, error] = await userApi.updateUserPassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });

        if (res?.data?.success) {
          toast.success("Password changed successfully");
          resetForm();
        }
      } catch (err) {
        handleFormikErrors(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ==========================================
  // S3 AVATAR UPLOAD HANDLER
  // ==========================================
  const handleAvatarUpload = async (event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setIsUploadingImage(true);

    try {
      const [res, error] = await userApi.uploadAvatar(file);
      const { success, avatar } = res?.data || {};

      if (success) {
        profileFormik.setFieldValue("avatar", avatar);
        toast.success(
          "Avatar uploaded successfully! Don't forget to save changes.",
        );
      } else {
        toast.error("Avatar upload failed");
        setPreview(profileFormik.values.avatar);
      }
    } catch (err) {
      setPreview(profileFormik.values.avatar);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="max-w-7xl px-[20px] mx-auto space-y-10 pb-10">
      {/* HEADER */}
      <div>
        <p className="pt-5 text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Settings
        </p>
        <h1 className="font-display text-4xl">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* LEFT COLUMN: MAIN SETTINGS */}
        <div className="space-y-8">
          {/* 1. GENERAL INFORMATION CARD */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Banner Background */}
            <div className="h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
            </div>

            <form
              onSubmit={profileFormik.handleSubmit}
              className="px-6 pb-6 sm:px-8 sm:pb-8"
            >
              {/* Avatar Section (Overlapping banner) */}
              <div className="relative -mt-16 mb-6 flex justify-between items-end">
                <div className="relative group">
                  <div
                    className={`h-32 w-32 rounded-full border-4 border-card bg-muted overflow-hidden relative ${isUploadingImage ? "opacity-70" : ""}`}
                  >
                    {isUploadingImage && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                    {preview || profileFormik.values.avatar ? (
                      <img
                        src={preview || profileFormik.values.avatar}
                        className="h-full w-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground text-4xl font-display uppercase">
                        {profileFormik.values.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>

                  {/* Upload Button Overlay */}
                  <button
                    type="button"
                    onClick={() =>
                      !isUploadingImage &&
                      document.getElementById("profileAvatarInput").click()
                    }
                    className="absolute bottom-1 right-1 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                    disabled={isUploadingImage}
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                  <input
                    id="profileAvatarInput"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarUpload}
                  />
                </div>

                <Badge
                  variant="secondary"
                  className="mb-4 rounded-full px-4 py-1 flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </Badge>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Update your photo and personal details here.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />{" "}
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className="rounded-xl bg-background/50"
                      value={profileFormik.values.name}
                      onChange={profileFormik.handleChange}
                      disabled={profileFormik.isSubmitting}
                    />
                    {profileFormik.errors.name &&
                      profileFormik.touched.name && (
                        <span className="text-xs text-red-500">
                          {profileFormik.errors.name}
                        </span>
                      )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" /> Email
                      Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="rounded-xl bg-background/50"
                      value={profileFormik.values.email}
                      onChange={profileFormik.handleChange}
                      disabled={profileFormik.isSubmitting}
                    />
                    {profileFormik.errors.email &&
                      profileFormik.touched.email && (
                        <span className="text-xs text-red-500">
                          {profileFormik.errors.email}
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border">
                  <Button
                    type="submit"
                    className="rounded-full px-8"
                    disabled={
                      profileFormik.isSubmitting ||
                      isUploadingImage ||
                      !profileFormik.dirty
                    }
                  >
                    {profileFormik.isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* 2. SECURITY CARD */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Security & Password</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure your account is using a long, random password to stay
                  secure.
                </p>
              </div>
            </div>

            <form
              onSubmit={passwordFormik.handleSubmit}
              className="space-y-5 max-w-md"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="rounded-xl"
                  placeholder="••••••••"
                  value={passwordFormik.values.currentPassword}
                  onChange={passwordFormik.handleChange}
                  disabled={passwordFormik.isSubmitting}
                />
                {passwordFormik.errors.currentPassword &&
                  passwordFormik.touched.currentPassword && (
                    <span className="text-xs text-red-500">
                      {passwordFormik.errors.currentPassword}
                    </span>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="rounded-xl"
                  placeholder="••••••••"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  disabled={passwordFormik.isSubmitting}
                />
                {passwordFormik.errors.newPassword &&
                  passwordFormik.touched.newPassword && (
                    <span className="text-xs text-red-500">
                      {passwordFormik.errors.newPassword}
                    </span>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="rounded-xl"
                  placeholder="••••••••"
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  disabled={passwordFormik.isSubmitting}
                />
                {passwordFormik.errors.confirmPassword &&
                  passwordFormik.touched.confirmPassword && (
                    <span className="text-xs text-red-500">
                      {passwordFormik.errors.confirmPassword}
                    </span>
                  )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="secondary"
                  className="rounded-full w-full sm:w-auto"
                  disabled={
                    passwordFormik.isSubmitting || !passwordFormik.dirty
                  }
                >
                  {passwordFormik.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: INFO WIDGETS */}
        <div className="space-y-6 hidden lg:block">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Account Status
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your account is fully active and verified. As an administrator,
              you have full access to manage products, categories, and other
              users.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Session Details
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Joined Date
                </p>
                <p className="text-sm font-medium">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    { month: "long", year: "numeric" },
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Login</p>
                <p className="text-sm font-medium">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
