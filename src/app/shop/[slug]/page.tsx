import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, formatPrice } from "@/lib/api";
import { BlocksRenderer } from "@/components/blocks-renderer";
import { ProductGallery } from "@/components/shop/product-gallery";
import { AddToCart } from "@/components/shop/add-to-cart";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await getProductBySlug(slug);
  const product = res.data[0];

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <Link href="/shop" className="mb-8 inline-block text-sm text-neutral-600 hover:underline">
        ← Back to shop
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images ?? []} alt={product.name} />

        <div className="flex flex-col">
          {product.health_categories && product.health_categories.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {product.health_categories.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {product.name}
          </h1>
          <p className="mt-2 text-xl text-neutral-900">{formatPrice(product.price)}</p>

          <div className="mt-6">
            <AddToCart
              productId={product.id}
              name={product.name}
              price={product.price}
              stockQuantity={product.stockQuantity}
            />
          </div>

          {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
            <p className="mt-2 text-xs text-amber-600">
              Only {product.stockQuantity} left in stock.
            </p>
          )}

          <div className="mt-8 border-t border-neutral-200 pt-8">
            <BlocksRenderer content={product.description} />
          </div>
        </div>
      </div>
    </main>
  );
}
