// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   // const { user } = useAuth();
//   const { user = {} } = useSelector((state) => state.auth) || {};
//   const location = useLocation();
//   if (!user)
//     return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//   if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
//   return children;
// };

// export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react"; // Optional: for a nice loading spinner

const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Get the user from Redux
  const { user } = useSelector((state) => state.auth) || {};
  const location = useLocation();

  // Check if we have a token in browser storage (Adjust "token" if you named it something else)
  const hasToken = localStorage.getItem("token");

  // ========================================
  // 1. THE HYDRATION PAUSE
  // ========================================
  // If there's a token but Redux hasn't loaded the user yet, just wait!
  const isUserEmpty = !user || Object.keys(user).length === 0;

  if (hasToken && isUserEmpty) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ========================================
  // 2. NOT LOGGED IN
  // ========================================
  if (isUserEmpty) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ========================================
  // 3. NOT AN ADMIN
  // ========================================
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ========================================
  // 4. ALL CLEAR - RENDER THE PAGE
  // ========================================
  return children;
};

export default ProtectedRoute;
