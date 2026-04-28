import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back");
      navigate(location.state?.from || "/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-20 max-w-md">
      <h1 className="font-display text-4xl md:text-5xl mb-2">Sign in</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Tip: use any email containing <code className="px-1 bg-secondary rounded">admin</code> for admin access.
      </p>
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
          <Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-11 rounded-xl" />
        </div>
        <Button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-gradient-warm text-primary-foreground shadow-glow">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
