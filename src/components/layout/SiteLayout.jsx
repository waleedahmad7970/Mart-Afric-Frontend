import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import TasteOnboarding from "@/components/TasteOnboarding";

const SiteLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <TasteOnboarding />
  </div>
);

export default SiteLayout;
