"use client";

import { useState } from "react";
import Image from "next/image";
import { mediaUrl } from "@/lib/api";
import type { StrapiMedia } from "@/lib/types";

export function ProductGallery({ images, alt }: { images: StrapiMedia[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-neutral-100 text-sm text-neutral-400">
        No image
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={mediaUrl(active.url)}
          alt={active.alternativeText || alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, i) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-md border-2 ${
                i === activeIndex ? "border-neutral-900" : "border-transparent"
              }`}
            >
              <Image
                src={mediaUrl(image.url)}
                alt={image.alternativeText || alt}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
