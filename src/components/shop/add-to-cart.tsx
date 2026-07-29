"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCart({
  productId,
  name,
  price,
  stockQuantity,
}: {
  productId: number;
  name: string;
  price: number;
  stockQuantity: number;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = stockQuantity <= 0;

  function handleAdd() {
    addItem({ productId, name, price, quantity });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  if (outOfStock) {
    return (
      <button
        disabled
        className="w-full rounded-md bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-400"
      >
        Out of stock
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="rounded-md border border-neutral-300 px-2 py-3 text-sm"
        aria-label="Quantity"
      >
        {Array.from({ length: Math.min(stockQuantity, 10) }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        onClick={handleAdd}
        className="flex-1 rounded-md bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
      >
        {justAdded ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  );
}
