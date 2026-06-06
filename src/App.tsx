import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "@/context/ThemeContext";


import SiteLayout from "@/components/layout/SiteLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import WishlistPage from "./pages/wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Journal from "./pages/Journal";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminCreateCoupon from "./pages/admin/AdminCoupon";

import UserProfile from "./pages/userProfile";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminReports from "./pages/admin/AdminReports";
import AdminReviews from "./pages/admin/AdminReviews";

import OrderDetails from "./pages/OrderDetails";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import CustomSectionsManager from "./pages/admin/sections/CustomSectionsManager";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDeliveroo from "./pages/admin/AdminDeliverooOrders";
import AdminUberEats from "./pages/admin/AdminUberEatsOrders";
import AdminRecommendations from "./pages/admin/AdminRecommendations";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { authActions } from "@/store/slices/auth/slice"; 
const queryClient = new QueryClient();

const App = () => {
 const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.hydrateUser());
  }, []);
  
  return (<QueryClientProvider client={queryClient}>
    <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<SiteLayout />}>
                  <Route path="/" element={<Home />} />
                     <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/me" element={<UserProfile />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                
                </Route>

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders-details/:id" element={<AdminOrderDetails />} />
                  <Route path="customers" element={<AdminUsers />} />
                   <Route path="deliveroo" element={< AdminDeliveroo/>} />
                  <Route path="uber-eats" element={<AdminUberEats />} />
                  <Route path="recommendations" element={<AdminRecommendations />} />
                  <Route path="custom-product-section" element={<CustomSectionsManager />} />
                  <Route path="reports" element={<AdminReports/>} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="blogs" element={<AdminBlogs />} />
                  <Route path="coupons" element={<AdminCreateCoupon />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>)
  }

export default App;
