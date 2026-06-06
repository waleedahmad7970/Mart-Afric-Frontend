import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Plus, Package, Percent, Receipt, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import cartApis from "../../api/cart/cart-apis";
import couponApis from "../../api/coupon/coupon-apis";
import { useSelector } from "react-redux";

const AdminCoupons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { coupon } = useSelector((state) => state.admin);
  const { coupons = [] } = coupon || {};

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const [res] = await couponApis.getCoupons();
  };

  const formik = useFormik({
    initialValues: {
      code: "",
      type: "fixed",
      value: "",
      minSpend: "",
      usageLimit: 500,
      isActive: true,
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Required").min(3),
      type: Yup.string().required("Required"),
      value: Yup.number().required("Required").positive(),
      minSpend: Yup.number().required("Required").min(0),
      usageLimit: Yup.number().required("Required").integer().min(1),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await couponApis.createCoupon(values);
        setIsModalOpen(false);
        resetForm();
        fetchCoupons();
      } catch (err) {
        toast.error("Failed to create coupon");
      }
    },
  });

  const ErrorText = ({ children }) => (
    <p className="text-[10px] text-red-500 mt-1">{children}</p>
  );
  return (
    <div className=" py-10 space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-4xl font-semibold">Coupons</h1>
          <p className="text-muted-foreground text-sm">
            Manage all store discount codes.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full h-12 px-6"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Coupons"
          val={coupons.length}
          icon={Package}
          color="text-blue-500"
        />
        <StatCard
          title="Active"
          val={coupons.filter((c) => c.isActive).length}
          icon={Percent}
          color="text-green-500"
        />
        <StatCard
          title="Total Usage"
          val={coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0)}
          icon={Receipt}
          color="text-amber-500"
        />
      </div>

      {/* Table */}
      <Card className="rounded-3xl shadow-elevated border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-6">Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Spend</TableHead>
                <TableHead>Limit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c) => (
                <TableRow key={c._id}>
                  <TableCell className="px-6 font-bold">{c.code}</TableCell>
                  <TableCell className="capitalize">{c.type}</TableCell>
                  <TableCell>
                    {c.value}
                    {c.type === "percentage" ? "%" : "£"}
                  </TableCell>
                  <TableCell>£{c.minSpend}</TableCell>
                  <TableCell>{c.usageLimit}</TableCell>
                  <TableCell>
                    <Badge variant={c.isActive ? "default" : "secondary"}>
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Full Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <form
            onSubmit={formik.handleSubmit}
            className="bg-card border rounded-3xl p-8 w-full max-w-lg shadow-2xl space-y-4"
          >
            <h3 className="text-2xl font-display mb-4">Create New Coupon</h3>

            {/* Code Field */}
            <div>
              <Input
                name="code"
                placeholder="Code (e.g. SAVE20)"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 rounded-xl ${
                  formik.touched.code && formik.errors.code
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.code && formik.errors.code && (
                <ErrorText>{formik.errors.code}</ErrorText>
              )}
            </div>

            {/* Type & Value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  onValueChange={(val) => formik.setFieldValue("type", val)}
                  defaultValue="fixed"
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed (£)</SelectItem>
                    <SelectItem value="percentage">Percent (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  name="value"
                  type="number"
                  placeholder="Value"
                  value={formik.values.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-12 rounded-xl ${
                    formik.touched.value && formik.errors.value
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.value && formik.errors.value && (
                  <ErrorText>{formik.errors.value}</ErrorText>
                )}
              </div>
            </div>

            {/* Min Spend & Limit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  name="minSpend"
                  type="number"
                  placeholder="Min Spend"
                  value={formik.values.minSpend}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-12 rounded-xl ${
                    formik.touched.minSpend && formik.errors.minSpend
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.minSpend && formik.errors.minSpend && (
                  <ErrorText>{formik.errors.minSpend}</ErrorText>
                )}
              </div>
              <div>
                <Input
                  name="usageLimit"
                  type="number"
                  placeholder="Usage Limit"
                  value={formik.values.usageLimit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-12 rounded-xl ${
                    formik.touched.usageLimit && formik.errors.usageLimit
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.usageLimit && formik.errors.usageLimit && (
                  <ErrorText>{formik.errors.usageLimit}</ErrorText>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formik.isSubmitting}>
                Save Coupon
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, val, icon: Icon, color }) => (
  <div className="bg-card border rounded-3xl p-6 flex items-center justify-between shadow-sm">
    <div>
      <p className="text-xs uppercase text-muted-foreground">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{val}</h3>
    </div>
    <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center">
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
  </div>
);

export default AdminCoupons;
