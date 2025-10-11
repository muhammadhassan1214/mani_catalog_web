export type Category =
  | 'ORTHODONTIC INSTRUMENTS'
  | 'DENTAL INSTRUMENTS'
  | 'BEAUTY CARE INSTRUMENTS'
  | 'EYELASH PRODUCTS'
  | 'JEWELLERY TOOLS'
  | 'GENERAL SURGICAL';

export type Status = 'In Stock' | 'New' | 'Updated' | 'Discontinued';

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
  status: Status;
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

export interface SearchQuery {
  q: string;
  category?: Category | 'ALL';
  status?: Status | 'ALL';
  sort?: 'ALPHA_ASC' | 'ALPHA_DESC' | 'DATE_NEW' | 'DATE_OLD' | 'PRICE_ASC' | 'PRICE_DESC';
  view?: 'grid' | 'list';
  page?: number;
  perPage?: number;
}

