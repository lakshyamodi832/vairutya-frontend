// Types mirroring the actual Strapi content model (confirmed against
// src/api/*/content-types/*/schema.json in vairutya-cms).

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

// --- Strapi "blocks" rich text (used for Product.description, BlogPost.content) ---

interface BlocksTextNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

interface BlocksLinkNode {
  type: "link";
  url: string;
  children: BlocksTextNode[];
}

export type BlocksInlineNode = BlocksTextNode | BlocksLinkNode;

interface BlocksListItemNode {
  type: "list-item";
  children: BlocksInlineNode[];
}

export type BlocksContent = (
  | { type: "paragraph"; children: BlocksInlineNode[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: BlocksInlineNode[] }
  | { type: "quote"; children: BlocksInlineNode[] }
  | { type: "code"; children: BlocksInlineNode[] }
  | { type: "list"; format: "ordered" | "unordered"; children: BlocksListItemNode[] }
  | { type: "image"; image: StrapiMedia }
)[];

// --- Content types ---

export interface HealthCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: BlocksContent;
  price: number;
  stockQuantity: number;
  sku: string;
  images?: StrapiMedia[];
  health_categories?: HealthCategory[];
}

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: BlocksContent;
  coverImage?: StrapiMedia;
  health_categories?: HealthCategory[];
  publishedDate?: string;
  publishedAt: string; // Strapi's own draft/publish timestamp
}

export interface QuizOption {
  id: number;
  optionText: string;
  categoryScores: { id: number; health_category: HealthCategory; weight: number }[];
}

export interface QuizQuestion {
  id: number;
  documentId: string;
  questionText: string;
  order: number;
  options: QuizOption[];
}

export interface HealthProfile {
  id: number;
  documentId: string;
  categoryScores: { id: number; health_category: HealthCategory; weight: number }[];
  health_category?: HealthCategory; // dominant category
  takenAt: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: number;
  documentId: string;
  orderStatus: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentReference?: string;
}

export interface Availability {
  id: number;
  documentId: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface Booking {
  id: number;
  documentId: string;
  bookingDateTime: string;
  bookingStatus: "confirmed" | "cancelled" | "completed";
  notes?: string;
}

// Generic Strapi v5 response wrappers (flat attributes, no v4-style nesting)
export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}
