import { Catalog } from "@/components/catalog/Catalog";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";

export default function CatalogoPage() {
  return (
    <>
      <Navbar />
      <main className="px-10 pt-25">
        <Catalog />
      </main>
      <Footer />
    </>
  );
}
