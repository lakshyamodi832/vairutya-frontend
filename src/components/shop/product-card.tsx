import Image from "next/image";
import Link from "next/link";
import { mediaUrl, formatPrice } from "@/lib/api";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const outOfStock = product.stockQuantity <= 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 transition-shadow hover:shadow-sm"
    >
      <div className="relative aspect-square w-full bg-neutral-100">
        {image ? (
          <Image
            src={mediaUrl(image.url)}
            alt={image.alternativeText || product.name}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            No image
          </div>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.health_categories?.[0] && (
          <span className="text-xs uppercase tracking-wide text-neutral-500">
            {product.health_categories[0].name}
          </span>
        )}
        <h3 className="text-sm font-medium text-neutral-900">{product.name}</h3>
        <p className="mt-auto text-sm text-neutral-700">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
