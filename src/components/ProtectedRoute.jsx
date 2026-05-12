import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  // const { user } = useAuth();
  const { user = {} } = useSelector((state) => state.auth) || {};
  const location = useLocation();
  if (!user)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
