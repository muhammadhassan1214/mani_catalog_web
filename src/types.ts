export type Category =
  | 'BEAUTY CARE INSTRUMENTS'
  | 'EYELASH PRODUCTS';

export interface DescriptionFields {
  size?: string;
  category?: string; // subcategory under base category
  finish?: string;
  details?: string;
}

export interface MediaImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string; // SKU
  sku: string; // same as id
  name: string;
  baseCategory: Category;
  description?: DescriptionFields;
  image?: string; // single image URL
  createdAt: string; // ISO date
  updatedAt?: string; // ISO date
}
