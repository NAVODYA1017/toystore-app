import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import CartPage     from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirm from "./pages/OrderConfirm";

function App() {
  return (
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/cart"          element={<CartPage />} />
            <Route path="/checkout"      element={<CheckoutPage />} />
            <Route path="/order-confirm" element={<OrderConfirm />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
  );
}

export default App;