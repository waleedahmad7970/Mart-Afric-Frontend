import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Truck,
  ShieldCheck,
  ChevronRight,
  Check,
  CreditCard,
  Wallet,
  Building2,
  MapPin,
  Mail,
  User,
  Package,
  Clock,
  Sparkles,
  Info,
  ArrowLeft,
  PoundSterling,
  WalletIcon,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import cartApis from "../api/cart/cart-apis";
import ordersApis from "../api/checkout/checkout-apis";
import checkoutApis from "../api/checkout/checkout-apis";
const Field = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-1.5">
    <Label
      className={cn(
        "text-xs uppercase tracking-wider flex items-center gap-1.5",
        error ? "text-red-500" : "text-muted-foreground",
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </Label>
    <Input
      {...props}
      className={cn(
        "h-12 rounded-xl",
        error && "border-red-500 focus-visible:ring-red-500",
      )}
    />
    {error && <p className="text-[10px] text-red-500">{error}</p>}
  </div>
);

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard delivery",
    desc: "3–5 business days",
    price: 0,
    badge: "Free over $60",
  },
  {
    id: "express",
    label: "Express delivery",
    desc: "1–2 business days",
    price: 9.99,
    badge: "Most popular",
  },
  {
    id: "sameday",
    label: "Same-day delivery",
    desc: "Order before 11am",
    price: 14.99,
    badge: "Limited slots",
  },
];

const PAYMENT_METHODS = [
  {
    disabled: false,
    id: "card",
    label: "Credit / Debit card",
    icon: CreditCard,
    desc: "Visa, Mastercard, Amex",
  },
  {
    disabled: false, // Set to false so the user can select it
    id: "wallet",
    label: "Wallet Balance",
    icon: Wallet,
    desc: "Pay using your available wallet funds",
  },
  {
    disabled: true,
    id: "mobile_money",
    label: "Mobile money",
    icon: WalletIcon,
    desc: "MTN, Vodafone, AirtelTigo",
  },
];

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const {
    items: cartItems,
    total: cartTotal,
    cart,
  } = useSelector((state) => state.cart);

  const { appliedPromo = {} } = cart || {};
  const { loaders = {} } = useSelector((state) => state.loader) || {};
  const { checkoutLoader } = loaders || {};

  // const { user } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [payment, setPayment] = useState("card");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [saveInfo, setSaveInfo] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const shippingCost =
    shippingMethod === "standard"
      ? subtotal > 60
        ? 0
        : 6.5
      : SHIPPING_OPTIONS.find((s) => s.id === shippingMethod)?.price || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shippingCost + tax;

  const schema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    firstName: Yup.string().required("First name is Required"),
    lastName: Yup.string().required("Last name is Required"),
    address: Yup.string().required("address is Required"),
    city: Yup.string().required("City is Required"),

    // Conditional validation for Card fields
    card: Yup.string().when("payment", {
      is: "card",
      then: (schema) =>
        schema.min(16, "Must be 16 digits").required("Required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    cardName: Yup.string().when("payment", {
      is: "card",
      then: (schema) => schema.required("Required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    exp: Yup.string().when("payment", {
      is: "card",
      then: (schema) =>
        schema
          .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid format (MM/YY)")
          .required("Required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    cvc: Yup.string().when("payment", {
      is: "card",
      then: (schema) => schema.length(3, "Invalid CVC").required("Required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: user?.shipping?.email || user?.email || "",
      firstName: user?.shipping?.firstName || user?.name?.split(" ")[0] || "",
      lastName: user?.shipping?.lastName || user?.name?.split(" ")[1] || "",
      phone: user?.shipping?.phone || "",
      address: user?.shipping?.address || "",
      apartment: user?.shipping?.apartment || "",
      city: user?.shipping?.city || "",
      region: user?.shipping?.region || "",
      zip: user?.shipping?.zip || "",
      country: user?.shipping?.country || "",
      notes: user?.shipping?.notes || "",

      // Payment state remains empty by default
      card: "",
      cardName: "",
      exp: "",
      cvc: "",
      momoNumber: "",
      payment: "card",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const body = {
        shipping: {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          address: values.address,
          apartment: values.apartment,
          city: values.city,
          region: values.region,
          zip: values.zip,
          country: values.country,
          notes: values.notes,
        },
        payment: {
          method: values.payment,
          momoNumber: values.momoNumber,
          cardLast4: values.card?.slice(-4),
        },
        saveAddress: saveInfo,
        shippingCost: shippingCost,
        paymentMethod: payment,
      };

      const [res, error] = await checkoutApis.checkout(body, navigate);

      if (error) return;
    },
  });

  useEffect(() => {
    const loadCart = async () => {
      const [res, error] = await cartApis.getCart();
    };

    loadCart();
  }, []);

  if (cartItems?.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground mb-6">Your cart is empty.</p>
        <Button onClick={() => navigate("/shop")} className="rounded-full">
          Browse the mart
        </Button>
      </div>
    );
  }

  console.log("formik values and error", formik.values, formik.errors);
  return (
    <div className="container py-12 lg:py-16">
      {/* Breadcrumb + back */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/cart" className="hover:text-primary">
            Cart
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Checkout</span>
        </nav>
        <Link
          to="/cart"
          className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to cart
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Secure checkout
        </p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl">
          Checkout
        </h1>
      </header>

      {/* Step indicator */}
      <div className="mb-12 flex items-center gap-3 text-sm overflow-x-auto pb-2">
        {[
          { n: 1, label: "Contact" },
          { n: 2, label: "Shipping" },
          { n: 3, label: "Payment" },
        ].map((s, i, arr) => (
          <div key={s.n} className="flex items-center gap-3 shrink-0">
            <div
              className={cn(
                "h-9 w-9 rounded-full flex items-center justify-center text-xs font-medium transition-smooth",
                step >= s.n
                  ? "bg-gradient-warm text-primary-foreground shadow-glow"
                  : "bg-secondary text-muted-foreground",
              )}
            >
              {step > s.n ? <Check className="h-4 w-4" /> : s.n}
            </div>
            <span
              className={cn(
                "font-medium",
                step >= s.n ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {s.label}
            </span>
            {i < arr.length - 1 && <div className="w-12 h-px bg-border" />}
          </div>
        ))}
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="grid lg:grid-cols-3 gap-10 lg:gap-14"
      >
        {" "}
        {/* LEFT — sections */}
        <div className="lg:col-span-2 space-y-12">
          {/* CONTACT */}
          <section className="rounded-3xl border border-border p-6 md:p-8 bg-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl">Contact information</h2>
                  <p className="text-xs text-muted-foreground">
                    We'll send your receipt and tracking here
                  </p>
                </div>
              </div>
              {!user && (
                <Link
                  to="/login"
                  className="text-xs text-primary hover:underline"
                >
                  Have an account? Sign in
                </Link>
              )}
            </div>

            <div className="grid gap-4">
              <Field
                label="Email address"
                icon={Mail}
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500">{formik.errors.email}</p>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="First name"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-xs text-red-500">
                    {formik.errors.firstName}
                  </p>
                )}

                <Field
                  label="Last name"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
              </div>

              <Field
                label="Phone number"
                type="tel"
                placeholder="+233 …"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <div className="flex items-start gap-2 mt-2">
                <Checkbox
                  checked={marketing}
                  onCheckedChange={(v) => setMarketing(!!v)}
                  id="marketing"
                  className="mt-0.5"
                />
                <Label
                  htmlFor="marketing"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Email me with mart-exclusive offers and AI-curated picks
                </Label>
              </div>
            </div>
          </section>

          {/* SHIPPING ADDRESS */}
          <section className="rounded-3xl border border-border p-6 md:p-8 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl">Shipping address</h2>
                <p className="text-xs text-muted-foreground">
                  Where should we deliver?
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <Field
                label="Street address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-xs text-red-500">{formik.errors.address}</p>
              )}

              <Field
                label="Apartment, suite, etc. (optional)"
                name="apartment"
                value={formik.values.apartment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="City"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-xs text-red-500">{formik.errors.city}</p>
                )}

                <Field
                  label="Region / State"
                  name="region"
                  value={formik.values.region}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Postal code"
                  name="zip"
                  value={formik.values.zip}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <Field
                  label="Country"
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="space-y-1.5 mt-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Delivery notes (optional)
                </Label>

                <Textarea
                  name="notes"
                  placeholder="Gate code, landmark or instructions for the courier…"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* SHIPPING METHOD */}
          <section className="rounded-3xl border border-border p-6 md:p-8 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl">Shipping method</h2>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred speed
                </p>
              </div>
            </div>

            <RadioGroup
              value={shippingMethod}
              onValueChange={setShippingMethod}
              className="space-y-3"
            >
              {SHIPPING_OPTIONS.map((opt) => {
                const active = shippingMethod === opt.id;
                const price =
                  opt.id === "standard" && subtotal > 60 ? 0 : opt.price;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-smooth",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <RadioGroupItem value={opt.id} id={opt.id} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{opt.label}</p>
                        {opt.badge && (
                          <Badge
                            variant="secondary"
                            className="rounded-full text-[10px]"
                          >
                            {opt.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {opt.desc}
                      </p>
                    </div>
                    <p className="font-display text-lg tabular-nums">
                      {price === 0 ? "Free" : `$${price.toFixed(2)}`}
                    </p>
                  </label>
                );
              })}
            </RadioGroup>
          </section>

          {/* PAYMENT */}
          <section className="rounded-3xl border border-border p-6 md:p-8 bg-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl">Payment</h2>
                  <p className="text-xs text-muted-foreground">
                    Encrypted & PCI-compliant
                  </p>
                </div>
              </div>
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <RadioGroup
              value={payment}
              onValueChange={(value) => {
                setPayment(value);

                formik.setFieldValue("payment", value);

                formik.setErrors({});
                formik.setTouched({});

                setTimeout(() => {
                  formik.validateForm();
                }, 0);
              }}
              className="grid sm:grid-cols-3 gap-3 mb-6"
            >
              {PAYMENT_METHODS.map((m) => {
                const active = payment === m.id;
                const isDisabled = m.disabled === true;

                // 1. DIGITAL WALLET CARD (With correct selection border)
                if (m.id === "wallet") {
                  return (
                    <label
                      key={m.id}
                      className={`relative cursor-pointer transition-all duration-300 rounded-2xl border-4 overflow-hidden ${
                        active
                          ? "border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                          : "border-transparent hover:border-primary/20"
                      }`}
                    >
                      <RadioGroupItem
                        value={m.id}
                        id={m.id}
                        className="sr-only"
                      />

                      {/* Dark Wallet Card Design */}
                      <div className="relative p-6 bg-[#121212] w-full min-h-[160px] flex flex-col justify-between">
                        {/* Subtle light hit */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                        <div className="relative z-10 flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-medium tracking-widest text-[#A8A8A8] uppercase mb-1">
                              Store Balance
                            </span>
                            <span className="flex items-center text-3xl font-semibold text-white">
                              £{user?.wallet?.balance || "0.00"}
                            </span>
                          </div>
                          <Wallet
                            className={`h-6 w-6 transition-colors ${active ? "text-primary" : "text-[#FAFAF2] opacity-80"}`}
                          />
                        </div>

                        <div className="relative z-10 pt-4 mt-4 border-t border-[#333]/60">
                          <p className="text-[10px] text-[#A8A8A8] uppercase tracking-wider">
                            {active ? "Currently Selected" : "Wallet Active"}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                }

                // 2. STANDARD CARD (For Cards, Banks, etc.)
                return (
                  <label
                    key={m.id}
                    className={`flex flex-col items-start gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-smooth ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <m.icon className="h-5 w-5 text-primary" />
                      <RadioGroupItem value={m.id} id={m.id} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
            {payment === "card" && (
              <div className="grid gap-4">
                <Field
                  label="Card number"
                  name="card"
                  placeholder="•••• •••• •••• ••••"
                  value={formik.values.card}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // Fix: Add error prop
                  error={formik.touched.card && formik.errors.card}
                />

                <Field
                  label="Name on card"
                  name="cardName"
                  value={formik.values.cardName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.cardName && formik.errors.cardName}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Expiry (MM/YY)"
                    name="exp"
                    placeholder="MM / YY"
                    value={formik.values.exp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.exp && formik.errors.exp}
                  />

                  <Field
                    type="number"
                    label="CVC"
                    name="cvc"
                    placeholder="•••"
                    value={formik.values.cvc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cvc && formik.errors.cvc}
                  />
                </div>
              </div>
            )}

            {payment === "transfer" && (
              <div className="grid gap-4">
                <Field
                  label="Mobile money number"
                  name="momoNumber"
                  placeholder="+233 …"
                  value={formik.values.momoNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  You'll receive a prompt on your phone to confirm payment.
                </p>
              </div>
            )}

            {payment === "bank" && (
              <div className="rounded-2xl bg-secondary/40 p-5 text-sm space-y-1">
                <p className="font-medium">Pay to: Mart Afric Ltd</p>
                <p className="text-muted-foreground">
                  Account: 1234 5678 90 · Bank: GCB
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Your order ships once we confirm the transfer (typically
                  within 1 business day).
                </p>
              </div>
            )}

            <div className="flex items-start gap-2 mt-6">
              <Checkbox
                checked={sameAsBilling}
                onCheckedChange={(v) => setSameAsBilling(!!v)}
                id="same"
                className="mt-0.5"
              />
              <Label
                htmlFor="same"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Billing address is the same as shipping
              </Label>
            </div>
            <div className="flex items-start gap-2 mt-2">
              <Checkbox
                checked={saveInfo}
                onCheckedChange={(v) => setSaveInfo(!!v)}
                id="save"
                className="mt-0.5"
              />
              <Label
                htmlFor="save"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Save this information for next time
              </Label>
            </div>
          </section>
        </div>
        {/* RIGHT — sticky summary */}
        {/* RIGHT — sticky summary */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-5">
          <div className="rounded-3xl bg-card border border-border p-6 md:p-7 shadow-elevated">
            <div className="flex items-center gap-3 mb-5">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl">Order summary</h2>
            </div>

            {/* Items list (smaller) */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-5">
              {cartItems.map((i) => (
                <div key={i.product?._id} className="flex gap-3 text-sm">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-secondary shrink-0">
                    <img
                      src={i.product?.image}
                      alt={i.product?.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
                      {i.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium leading-tight line-clamp-1">
                      {i.product?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${i.product?.price.toFixed(2)} each
                    </p>
                  </div>
                  <p className="tabular-nums font-medium">
                    ${(i.product?.price * i.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Calculations (Matching your Cart logic) */}
            <div className="border-t border-border pt-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums flex items-center">
                  <PoundSterling className="h-3.5 w-3.5" />
                  {cartTotal?.toFixed(2) || "0.00"}
                </span>
              </div>

              {/* Applied Discount Logic */}
              {appliedPromo && (
                <div className="flex justify-between text-primary">
                  <span>Discount ({appliedPromo.code})</span>
                  <span className="tabular-nums flex items-center">
                    -<PoundSterling className="h-3.5 w-3.5" />
                    {(appliedPromo.type === "fixed"
                      ? Math.min(appliedPromo.value, cartTotal)
                      : cartTotal * (appliedPromo.value / 100)
                    ).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="tabular-nums flex items-center">
                  {shippingCost === 0 ? (
                    "Free"
                  ) : (
                    <>
                      <PoundSterling className="h-3.5 w-3.5" />
                      {shippingCost?.toFixed(2)}
                    </>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Estimated tax (5%)
                </span>
                <span className="tabular-nums flex items-center">
                  <PoundSterling className="h-3.5 w-3.5" />
                  {(
                    (cartTotal -
                      (appliedPromo
                        ? appliedPromo.type === "fixed"
                          ? Math.min(appliedPromo.value, cartTotal)
                          : cartTotal * (appliedPromo.value / 100)
                        : 0)) *
                    0.05
                  ).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-border pt-4 mt-4 flex justify-between font-display text-2xl">
                <span>Total</span>
                <span className="tabular-nums flex items-center">
                  <PoundSterling className="h-6 w-6" />
                  {/* This matches the exact final total from your cart page */}
                  {(
                    cartTotal -
                    (appliedPromo
                      ? appliedPromo.type === "fixed"
                        ? Math.min(appliedPromo.value, cartTotal)
                        : cartTotal * (appliedPromo.value / 100)
                      : 0) +
                    shippingCost +
                    (cartTotal -
                      (appliedPromo
                        ? appliedPromo.type === "fixed"
                          ? Math.min(appliedPromo.value, cartTotal)
                          : cartTotal * (appliedPromo.value / 100)
                        : 0)) *
                      0.05
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="w-full mt-6 rounded-full h-13 py-6 bg-gradient-warm text-primary-foreground shadow-glow text-base"
            >
              {formik.isSubmitting ? "Processing…" : "Place Order"}
            </Button>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
