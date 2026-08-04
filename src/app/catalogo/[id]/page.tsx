import { ProductActions } from "@/components/aboutProduct/ProductActions";
import { ProductImage } from "@/components/aboutProduct/ProductImage";
import { ProductInfo } from "@/components/aboutProduct/ProductInfo";
import { ProductSpecs } from "@/components/aboutProduct/ProductSpecs";
import { ReturnToCatalog } from "@/components/aboutProduct/ReturnToCatalog";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";

export default function ProductDetailsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-25 pb-2xl px-10 w-full max-w-7xl mx-auto relative z-10 mb-10">
        <ReturnToCatalog />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Left: Product image */}
          <div className="md:col-span-6 lg:col-span-7">
            <ProductImage />
          </div>

          {/* Right: Product info */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col">
            <ProductInfo />
            <ProductSpecs />
            <ProductActions />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
