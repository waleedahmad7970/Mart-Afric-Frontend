import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import authApis from "../api/auth/auth-apis";
import { handleFormikErrors } from "../helpers/helpers";

const Signup = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, actions) => {
    actions.setStatus(null);

    // Call your signup API (Ensure authApis has a signup method)
    const [res, error] = await authApis.signup(values);

    if (error) {
      handleFormikErrors(error, actions);
      actions.setSubmitting(false);
      return;
    }

    // Success logic: interceptor handles the "Welcome" toast
    localStorage.setItem("token", res.token);
    navigate("/");
  };

  return (
    <div className="container py-20 max-w-md">
      <h1 className="font-display text-4xl md:text-5xl mb-2">Create account</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Save your favorites, track orders, and join 12,000+ home cooks.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-5">
            {/* Show general status messages (e.g., "Email already in use") */}
            {status && (
              <div className="p-3 text-xs text-red-500 bg-red-50 rounded-lg border border-red-100">
                {status}
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Full name
              </Label>
              <Field
                as={Input}
                name="name"
                placeholder="John Doe"
                className="h-11 rounded-xl"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <Field
                as={Input}
                type="email"
                name="email"
                placeholder="john@example.com"
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
                placeholder="••••••••"
                className="h-11 rounded-xl"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-gradient-warm text-primary-foreground shadow-glow"
            >
              {isSubmitting ? "Creating…" : "Create account"}
            </Button>
          </Form>
        )}
      </Formik>

      <p className="mt-6 text-sm text-muted-foreground">
        Have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
