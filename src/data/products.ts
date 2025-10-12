import type { Category, Product } from '../types'

export const CATEGORIES: Category[] = [
  'BEAUTY CARE INSTRUMENTS',
  'EYELASH PRODUCTS',
]

function img(w: number, h: number, text: string) {
  return {
    url: `https://placehold.co/${w}x${h}.png?text=${encodeURIComponent(text)}`,
    alt: text,
  }
}

export const PRODUCTS: Product[] = [
  {
    id: 'beauty-scissors-010',
    name: 'Beauty Care Scissors',
    sku: 'BCS-010',
    category: 'BEAUTY CARE INSTRUMENTS',
    price: 18.5,
    shortDescription: 'Sharp, precise scissors for beauty care routines.',
    description: 'Matte finish, comfortable grip, precision tip.',
    images: [img(1200, 800, 'Beauty Scissors')],
    colors: [
      { sku: 'BCS-010-GLD', label: 'Gold', image: img(300, 300, 'Gold') },
      { sku: 'BCS-010-RSE', label: 'Rose Gold', image: img(300, 300, 'Rose Gold') },
    ],
    createdAt: '2024-08-21T10:00:00.000Z',
    specs: { Finish: 'Matte', Length: '10cm' },
  },
  {
    id: 'lash-tweezer-200',
    name: 'Eyelash Tweezer - Curved',
    sku: 'ELT-200',
    category: 'EYELASH PRODUCTS',
    price: 12.0,
    shortDescription: 'Curved tip tweezer for eyelash extensions.',
    description: 'Lightweight, anti-static, precision alignment.',
    images: [img(1200, 800, 'Eyelash Tweezer Curved')],
    colors: [
      { sku: 'ELT-200-PRP', label: 'Purple', image: img(300, 300, 'Purple') },
      { sku: 'ELT-200-BLU', label: 'Blue', image: img(300, 300, 'Blue') },
    ],
    pouches: [{ sku: 'ELT-200-PCH', label: 'PVC Sleeve', image: img(300, 200, 'PVC Sleeve') }],
    createdAt: '2025-03-15T10:00:00.000Z',
    specs: { Material: 'Stainless Steel', Tip: 'Curved' },
  },
]
