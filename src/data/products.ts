import type { Category, Product } from '../types'

export const CATEGORIES: Category[] = [
  'ORTHODONTIC INSTRUMENTS',
  'DENTAL INSTRUMENTS',
  'BEAUTY CARE INSTRUMENTS',
  'EYELASH PRODUCTS',
  'JEWELLERY TOOLS',
  'GENERAL SURGICAL',
]

function img(w: number, h: number, text: string) {
  return {
    url: `https://placehold.co/${w}x${h}.png?text=${encodeURIComponent(text)}`,
    alt: text,
  }
}

export const PRODUCTS: Product[] = [
  {
    id: 'ortho-pliers-001',
    name: 'Orthodontic Pliers - Premium',
    sku: 'OP-001',
    category: 'ORTHODONTIC INSTRUMENTS',
    status: 'In Stock',
    price: 49.99,
    shortDescription: 'High-precision orthodontic pliers for professional use.',
    description:
      'Crafted from surgical-grade stainless steel with ergonomic grip for precise control and durability in orthodontic procedures.',
    images: [img(1200, 800, 'Orthodontic Pliers'), img(1200, 800, 'Side View'), img(1200, 800, 'Detail')],
    colors: [
      { sku: 'OP-001-SLVR', label: 'Silver', image: img(300, 300, 'Silver') },
      { sku: 'OP-001-BLK', label: 'Black', image: img(300, 300, 'Black') },
    ],
    packaging: [
      { sku: 'OP-001-BOX', label: 'Box', image: img(300, 200, 'Box') },
      { sku: 'OP-001-BAG', label: 'Bag', image: img(300, 200, 'Bag') },
    ],
    pouches: [
      { sku: 'OP-001-PCH', label: 'Leather Pouch', image: img(300, 200, 'Pouch') },
    ],
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-09-01T10:00:00.000Z',
    specs: {
      Material: 'Stainless Steel',
      Weight: '120g',
      Length: '14cm',
      Warranty: '2 years',
    },
  },
  {
    id: 'dental-scaler-100',
    name: 'Dental Scaler Set',
    sku: 'DS-100',
    category: 'DENTAL INSTRUMENTS',
    status: 'New',
    price: 69.0,
    shortDescription: 'Complete dental scaler kit with multiple tips.',
    description: 'Ergonomic handles with anti-slip design for precision.',
    images: [img(1200, 800, 'Dental Scaler Set'), img(1200, 800, 'Tips')],
    packaging: [{ sku: 'DS-100-BOX', label: 'Hard Case', image: img(300, 200, 'Hard Case') }],
    pouches: [{ sku: 'DS-100-PCH', label: 'Nylon Pouch', image: img(300, 200, 'Nylon Pouch') }],
    createdAt: '2025-05-01T10:00:00.000Z',
    specs: { Material: 'Stainless Steel', Pieces: 6 },
  },
  {
    id: 'beauty-scissors-010',
    name: 'Beauty Care Scissors',
    sku: 'BCS-010',
    category: 'BEAUTY CARE INSTRUMENTS',
    status: 'Updated',
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
    status: 'In Stock',
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
  {
    id: 'jewel-hammer-050',
    name: 'Jewellery Hammer - Mini',
    sku: 'JH-050',
    category: 'JEWELLERY TOOLS',
    status: 'In Stock',
    price: 24.75,
    shortDescription: 'Mini hammer for delicate jewellery work.',
    description: 'Hardened head, wooden handle for comfort.',
    images: [img(1200, 800, 'Jewellery Hammer')],
    createdAt: '2024-12-10T10:00:00.000Z',
    specs: { Head: 'Hardened steel', Handle: 'Wood' },
  },
  {
    id: 'surgical-scissor-300',
    name: 'General Surgical Scissors',
    sku: 'GSS-300',
    category: 'GENERAL SURGICAL',
    status: 'Discontinued',
    price: 15.0,
    shortDescription: 'Straight surgical scissors for general use.',
    description: 'Classic design, stainless steel.',
    images: [img(1200, 800, 'Surgical Scissors')],
    createdAt: '2023-06-20T10:00:00.000Z',
    specs: { Length: '12cm' },
  },
]

