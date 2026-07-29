import type {
  BlogPost,
  Product,
  QuizQuestion,
  StrapiListResponse,
  StrapiSingleResponse,
} from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

if (!STRAPI_URL) {
  // Fails loudly in dev rather than silently hitting undefined/undefined
  console.warn(
    "NEXT_PUBLIC_STRAPI_URL is not set. Add it to .env.local — see .env.local.example."
  );
}

interface FetchOptions extends RequestInit {
  /** Strapi query string params, e.g. populate, filters, sort */
  params?: Record<string, string>;
}

async function strapiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  const res = await fetch(`${STRAPI_URL}/api${path}${query}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(process.env.STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
        : {}),
      ...init.headers,
    },
    // Revalidate content periodically; adjust per-route once designs/caching needs are clearer
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status} ${res.statusText} (${path})`);
  }

  return res.json();
}

export async function getProducts(params?: Record<string, string>) {
  return strapiFetch<StrapiListResponse<Product>>("/products", {
    params: { populate: "*", ...params },
  });
}

export async function getProductBySlug(slug: string) {
  return strapiFetch<StrapiListResponse<Product>>("/products", {
    params: { "filters[slug][$eq]": slug, populate: "*" },
  });
}

export async function getBlogPosts(params?: Record<string, string>) {
  return strapiFetch<StrapiListResponse<BlogPost>>("/blog-posts", {
    params: { populate: "*", sort: "publishedAt:desc", ...params },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return strapiFetch<StrapiListResponse<BlogPost>>("/blog-posts", {
    params: { "filters[slug][$eq]": slug, populate: "*" },
  });
}

export async function getQuizQuestions() {
  return strapiFetch<StrapiListResponse<QuizQuestion>>("/quiz-questions", {
    params: { populate: "deep", sort: "order:asc" },
  });
}

/** Helper to resolve a Strapi media URL (handles relative vs absolute) */
export function mediaUrl(url?: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

export { strapiFetch };
export type { StrapiSingleResponse };
/** Formats a product price. Assumes INR (Razorpay); revisit if multi-currency is ever needed. */
export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}
