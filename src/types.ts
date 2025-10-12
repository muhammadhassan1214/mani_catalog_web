export type Category =
  | 'BEAUTY CARE INSTRUMENTS'
  | 'EYELASH PRODUCTS';

export interface MediaImage {
  url: string;
  alt: string;
}

export interface VariantOption {
  sku: string;
  label: string;
  image?: MediaImage;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  price?: number; // optional if pricing is used later
  shortDescription?: string;
  description?: string;
  images: MediaImage[]; // main gallery
  colors?: VariantOption[]; // available colors (image + SKU)
  packaging?: VariantOption[]; // Packaging (image + SKU)
  pouches?: VariantOption[]; // Empty Pouches (image + SKU)
  createdAt: string; // ISO date
  updatedAt?: string; // ISO date
  specs?: Record<string, string | number | boolean>;
}
