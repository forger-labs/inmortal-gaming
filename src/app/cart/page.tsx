import { Cart } from "@/components/cart/Cart";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="pt-8">
        <Cart />
      </main>
      <Footer />
    </>
  );
}
