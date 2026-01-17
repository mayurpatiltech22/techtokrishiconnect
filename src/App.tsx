import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Labor from "./pages/Labor";
import CreateLaborGroup from "./pages/CreateLaborGroup";
import Equipment from "./pages/Equipment";
import MyBookings from "./pages/MyBookings";
import Schemes from "./pages/Schemes";
import Weather from "./pages/Weather";
import MarketPricesPage from "./pages/MarketPricesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/labor" element={<Labor />} />
              <Route path="/labor/create" element={<CreateLaborGroup />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/market-prices" element={<MarketPricesPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
