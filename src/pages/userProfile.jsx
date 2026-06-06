import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon,
  CheckCircle2,
  MapPin,
  Wallet,
  PoundSterling, // Imported the Wallet icon
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import userApi from "../api/user/user-apis";
import { authActions } from "../store/slices/auth/slice";
import { handleFormikErrors } from "../helpers/helpers";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth || {});
  const [preview, setPreview] = useState(user?.avatar || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setPreview(user.avatar);
    }
  }, [user?.avatar]);

  // ==========================================
  // 1. PROFILE INFO FORMIK
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
        const [res, error] = await userApi.updateUser(values);
        if (res?.data?.success) {
          toast.success("Profile updated successfully");
          dispatch(authActions.setUser(res.data.user));
        }
      } catch (err) {
        handleFormikErrors(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ==========================================
  // 2. SECURITY (PASSWORD) FORMIK
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
  // 3. SHIPPING ADDRESS FORMIK
  // ==========================================
  const addressFormik = useFormik({
    initialValues: {
      firstName: user?.shipping?.firstName || "",
      lastName: user?.shipping?.lastName || "",
      email: user?.shipping?.email || user?.email || "",
      phone: user?.shipping?.phone || "",
      address: user?.shipping?.address || "",
      apartment: user?.shipping?.apartment || "",
      city: user?.shipping?.city || "",
      region: user?.shipping?.region || "",
      zip: user?.shipping?.zip || "",
      country: user?.shipping?.country || "",
      notes: user?.shipping?.notes || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      address: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      region: Yup.string().required("Region/State is required"),
      zip: Yup.string().required("Zip/Postal code is required"),
      country: Yup.string().required("Country is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const [res, error] = await userApi.updateAddress(values);
        if (res?.data?.success) {
          toast.success("Shipping address updated successfully");
          dispatch(authActions.setUser(res.data.user));
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
    <div className="max-w-7xl px-[20px] mx-auto space-y-10 pb-20 animate-fade-up">
      {/* HEADER */}
      <div>
        <p className="pt-8 text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Settings & History
        </p>
        <h1 className="font-display text-4xl font-semibold">My Account</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* LEFT COLUMN: MAIN SETTINGS */}
        <div className="space-y-8">
          {/* 1. GENERAL INFORMATION CARD */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
            </div>

            <form
              onSubmit={profileFormik.handleSubmit}
              className="px-6 pb-6 sm:px-8 sm:pb-8"
            >
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

                <div className="bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 border border-border">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </div>
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
                      className="rounded-xl bg-background/50"
                      value={profileFormik.values.name}
                      onChange={profileFormik.handleChange}
                      disabled={profileFormik.isSubmitting}
                    />
                    {profileFormik.errors.name &&
                      profileFormik.touched.name && (
                        <span className="text-xs text-red-500 font-medium">
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
                      className="rounded-xl bg-background/50"
                      value={profileFormik.values.email}
                      onChange={profileFormik.handleChange}
                      disabled={profileFormik.isSubmitting}
                    />
                    {profileFormik.errors.email &&
                      profileFormik.touched.email && (
                        <span className="text-xs text-red-500 font-medium">
                          {profileFormik.errors.email}
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
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

          {/* 2. SHIPPING ADDRESS CARD */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Default Address</h3>
                <p className="text-sm text-muted-foreground">
                  Manage where your orders should be delivered.
                </p>
              </div>
            </div>

            <form onSubmit={addressFormik.handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    className="rounded-xl bg-background/50"
                    value={addressFormik.values.firstName}
                    onChange={addressFormik.handleChange}
                    disabled={addressFormik.isSubmitting}
                  />
                  {addressFormik.errors.firstName &&
                    addressFormik.touched.firstName && (
                      <span className="text-xs text-red-500 font-medium">
                        {addressFormik.errors.firstName}
                      </span>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    className="rounded-xl bg-background/50"
                    value={addressFormik.values.lastName}
                    onChange={addressFormik.handleChange}
                    disabled={addressFormik.isSubmitting}
                  />
                  {addressFormik.errors.lastName &&
                    addressFormik.touched.lastName && (
                      <span className="text-xs text-red-500 font-medium">
                        {addressFormik.errors.lastName}
                      </span>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="shippingEmail">
                    Contact Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="shippingEmail"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="rounded-xl bg-background/50"
                    value={addressFormik.values.email}
                    onChange={addressFormik.handleChange}
                    disabled={addressFormik.isSubmitting}
                  />
                  {addressFormik.errors.email &&
                    addressFormik.touched.email && (
                      <span className="text-xs text-red-500 font-medium">
                        {addressFormik.errors.email}
                      </span>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    className="rounded-xl bg-background/50"
                    value={addressFormik.values.phone}
                    onChange={addressFormik.handleChange}
                    disabled={addressFormik.isSubmitting}
                  />
                  {addressFormik.errors.phone &&
                    addressFormik.touched.phone && (
                      <span className="text-xs text-red-500 font-medium">
                        {addressFormik.errors.phone}
                      </span>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  className="rounded-xl bg-background/50"
                  value={addressFormik.values.address}
                  onChange={addressFormik.handleChange}
                  disabled={addressFormik.isSubmitting}
                />
                {addressFormik.errors.address &&
                  addressFormik.touched.address && (
                    <span className="text-xs text-red-500 font-medium">
                      {addressFormik.errors.address}
                    </span>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apartment">
                  Apartment, suite, etc. (optional)
                </Label>
                <Input
                  id="apartment"
                  name="apartment"
                  placeholder="Apt 4B"
                  className="rounded-xl bg-background/50"
                  value={addressFormik.values.apartment}
                  onChange={addressFormik.handleChange}
                  disabled={addressFormik.isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="New York"
                    className="rounded-xl bg-background/50"
                    value={addressFormik.values.city}
                    onChange={addressFormik.handleChange}
                    disabled={addressFormik.isSubmitting}
                  />
                  {addressFormik.errors.city && addressFormik.touched.city && (
                    <span className="text-xs text-red-500 font-medium">
                      {addressFormik.errors.city}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">
                    State / Region <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="region"
                    name="region"
                    placeholder="NY"
                    className="rounded-xl bg-background/50"
                    value={addressFormik.values.region}
                    onChange={addressFormik.handleChange}
                    disabled={addressFormik.isSubmitting}
                  />
                  {addressFormik.errors.region &&
                    addressFormik.touched.region && (
                      <span className="text-xs text-red-500 font-medium">
                        {addressFormik.errors.region}
                      </span>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">
                    ZIP Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="zip"
                    name="zip"
                    placeholder="10001"
                    className="rounded-xl bg-background/50"
                    value={addressFormik.values.zip}
                    onChange={addressFormik.handleChange}
                    disabled={addressFormik.isSubmitting}
                  />
                  {addressFormik.errors.zip && addressFormik.touched.zip && (
                    <span className="text-xs text-red-500 font-medium">
                      {addressFormik.errors.zip}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="United States"
                  className="rounded-xl bg-background/50"
                  value={addressFormik.values.country}
                  onChange={addressFormik.handleChange}
                  disabled={addressFormik.isSubmitting}
                />
                {addressFormik.errors.country &&
                  addressFormik.touched.country && (
                    <span className="text-xs text-red-500 font-medium">
                      {addressFormik.errors.country}
                    </span>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (optional)</Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="e.g. Leave at the front door"
                  className="rounded-xl bg-background/50"
                  value={addressFormik.values.notes}
                  onChange={addressFormik.handleChange}
                  disabled={addressFormik.isSubmitting}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button
                  type="submit"
                  variant="secondary"
                  className="rounded-full px-8"
                  disabled={addressFormik.isSubmitting || !addressFormik.dirty}
                >
                  {addressFormik.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Save Address"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* 3. SECURITY CARD */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Security & Password</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure your account is using a secure password.
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
                  className="rounded-xl bg-background/50"
                  placeholder="••••••••"
                  value={passwordFormik.values.currentPassword}
                  onChange={passwordFormik.handleChange}
                  disabled={passwordFormik.isSubmitting}
                />
                {passwordFormik.errors.currentPassword &&
                  passwordFormik.touched.currentPassword && (
                    <span className="text-xs text-red-500 font-medium">
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
                  className="rounded-xl bg-background/50"
                  placeholder="••••••••"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  disabled={passwordFormik.isSubmitting}
                />
                {passwordFormik.errors.newPassword &&
                  passwordFormik.touched.newPassword && (
                    <span className="text-xs text-red-500 font-medium">
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
                  className="rounded-xl bg-background/50"
                  placeholder="••••••••"
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  disabled={passwordFormik.isSubmitting}
                />
                {passwordFormik.errors.confirmPassword &&
                  passwordFormik.touched.confirmPassword && (
                    <span className="text-xs text-red-500 font-medium">
                      {passwordFormik.errors.confirmPassword}
                    </span>
                  )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-full w-full sm:w-auto"
                  disabled={
                    passwordFormik.isSubmitting || !passwordFormik.dirty
                  }
                >
                  {passwordFormik.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}{" "}
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: INFO WIDGETS */}
        <div className="space-y-6 hidden lg:block">
          {/* DIGITAL WALLET CARD (Theme-Accurate Minimalist) */}
          <div className="relative overflow-hidden rounded-[12px] bg-[#121212] p-6 shadow-md border border-[#333]">
            {/* Subtle light hit in the top right for depth */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

            <div className="relative z-10 flex flex-col h-full gap-8 text-[#FAFAF2]">
              {/* Top row */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-geist text-[12px] font-medium tracking-widest text-[#A8A8A8] uppercase mb-1">
                    Store Balance
                  </span>
                  <span className="font-display flex justify-center items-center text-4xl font-semibold tracking-tight text-white">
                    <PoundSterling /> {user?.wallet?.balance || 0}
                  </span>
                </div>
                <div className="h-10 w-10 flex-row rounded-full bg-[#333]/50 flex items-center justify-center border border-[#444]">
                  <Wallet className="h-5 w-5 text-[#FAFAF2]" />
                </div>
              </div>

              {/* Bottom row (Cardholder & Master/Visa mock icon) */}
              <div className="pt-4 border-t border-[#333]/60 flex justify-between items-end">
                <div>
                  <span className="font-geist text-[10px] font-medium tracking-widest text-[#A8A8A8] uppercase">
                    Cardholder Name
                  </span>
                  <p className="font-geist text-[16px] font-medium text-[#FAFAF2] mt-1 truncate max-w-[200px]">
                    {profileFormik.values.name || "GUEST MEMBER"}
                  </p>
                </div>

                {/* Minimalist Interlocking Circles (like Mastercard) */}
                <div className="flex pb-1">
                  <div className="h-6 w-6 rounded-full bg-[#FAFAF2]/20"></div>
                  <div className="h-6 w-6 rounded-full bg-[#FAFAF2]/50 -ml-3 backdrop-blur-sm"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Account Status
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your account is fully active and verified. You have full access to
              manage your data, track orders, and secure your profile.
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
