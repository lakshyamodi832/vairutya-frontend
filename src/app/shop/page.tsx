import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/shop/product-card";

export const metadata = {
  title: "Shop — Vairutya",
};

export default async function ShopPage() {
  let products;
  try {
    const res = await getProducts();
    products = res.data;
  } catch {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <p className="text-sm text-neutral-600">
          We couldn&apos;t load products right now. Please try again shortly.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-neutral-900">Shop</h1>

      {products.length === 0 ? (
        <p className="text-sm text-neutral-600">No products yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
