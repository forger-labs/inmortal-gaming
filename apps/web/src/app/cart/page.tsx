import { Cart } from "@/components/cart/Cart";

export default function CartPage() {
  return (
    <main className="pt-16">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <header className="rise-in mb-10 max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Tu carrito
          </h1>
          <p className="mt-3 font-body text-lg leading-relaxed text-text-secondary">
            Revisa los productos antes de enviar tu pedido por WhatsApp.
          </p>
        </header>

        <Cart />
      </div>
    </main>
  );
}
