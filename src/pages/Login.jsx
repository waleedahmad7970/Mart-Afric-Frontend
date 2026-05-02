import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import authApis from "../api/auth/auth-apis";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const [res, error] = await authApis.login({ body: values });

    if (error) {
      toast.error(error.message || "Failed to login");
      setSubmitting(false);
      return;
    }

    localStorage.setItem("token", res.token);
    toast.success("Welcome back!");
    navigate(location.state?.from || "/");
  };

  return (
    <div className="container py-20 max-w-md">
      <h1 className="font-display text-4xl md:text-5xl mb-2">Sign in</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Tip: use any email containing{" "}
        <code className="px-1 bg-secondary rounded">admin</code> for admin
        access.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <Field
                as={Input}
                type="email"
                name="email"
                className="h-11 rounded-xl"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <Field
                as={Input}
                type="password"
                name="password"
                className="h-11 rounded-xl"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-gradient-warm text-primary-foreground shadow-glow"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </Form>
        )}
      </Formik>

      <p className="mt-6 text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
