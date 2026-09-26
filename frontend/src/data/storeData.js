const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=75`;

export const categories = [
  { name: 'Shirts', icon: 'SH' },
  { name: 'Pants', icon: 'PT' },
  { name: 'Shorts', icon: 'ST' },
  { name: 'T-Shirts', icon: 'TS' },
  { name: 'Hoodies', icon: 'HD' },
  { name: 'Jackets', icon: 'JK' }
];

export const products = [
  {
    id: 1,
    name: 'Crimson Oversized Tee',
    category: 'T-Shirts',
    brand: 'Brocode Core',
    price: 1299,
    discount: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red', 'White'],
    stock: 8,
    rating: 5,
    featured: true,
    newArrival: true,
    bestSeller: true,
    bg: 'linear-gradient(135deg,#111,#b80011)',
    description: 'Heavy cotton oversized t-shirt with a clean streetwear drape, ribbed neck, and fade-safe print.',
    images: [img('1521572163474-6864f9cf17ab'), img('1503342217505-b0a15ec3261c')]
  },
  {
    id: 2,
    name: 'Black Utility Jacket',
    category: 'Jackets',
    brand: 'Brocode Black',
    price: 3499,
    discount: 18,
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    stock: 12,
    rating: 5,
    featured: true,
    newArrival: true,
    bestSeller: false,
    bg: 'linear-gradient(135deg,#0d0d10,#3d3d45)',
    description: 'Layer-ready utility jacket with matte hardware, structured pockets, and a wind-resistant shell.',
    images: [img('1520975954732-35dd22299614'), img('1515886657613-9f3515b0c78f')]
  },
  {
    id: 3,
    name: 'White Resort Shirt',
    category: 'Shirts',
    brand: 'Brocode Studio',
    price: 1899,
    discount: 15,
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Blue'],
    stock: 20,
    rating: 4,
    featured: true,
    newArrival: false,
    bestSeller: true,
    bg: 'linear-gradient(135deg,#fff,#d7dce2)',
    description: 'Breathable resort shirt with a relaxed collar and soft-touch finish for warm weather styling.',
    images: [img('1489987707025-afc232f7ea0f'), img('1529139574466-a303027c1d8b')]
  },
  {
    id: 4,
    name: 'Tapered Cargo Pants',
    category: 'Pants',
    brand: 'Brocode Core',
    price: 2499,
    discount: 20,
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Olive'],
    stock: 6,
    rating: 5,
    featured: false,
    newArrival: true,
    bestSeller: true,
    bg: 'linear-gradient(135deg,#1f2a24,#101010)',
    description: 'Tapered cargo pants with stretch comfort, reinforced seams, and clean low-profile pockets.',
    images: [img('1473966968600-fa801b869a1a'), img('1516257984-b1b4d707412e')]
  },
  {
    id: 5,
    name: 'Monochrome Hoodie',
    category: 'Hoodies',
    brand: 'Brocode Black',
    price: 2299,
    discount: 22,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    stock: 18,
    rating: 5,
    featured: true,
    newArrival: false,
    bestSeller: true,
    bg: 'linear-gradient(135deg,#171719,#e7e7e7)',
    description: 'Brushed fleece hoodie with dropped shoulders, kangaroo pocket, and subtle Brocode badge.',
    images: [img('1556821840-3a63f95609a7'), img('1515886657613-9f3515b0c78f')]
  },
  {
    id: 6,
    name: 'Weekend Shorts',
    category: 'Shorts',
    brand: 'Brocode Active',
    price: 999,
    discount: 10,
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Black', 'Blue'],
    stock: 24,
    rating: 4,
    featured: false,
    newArrival: true,
    bestSeller: false,
    bg: 'linear-gradient(135deg,#c40015,#111)',
    description: 'Quick-dry shorts with a smooth waistband, zipped pockets, and weekend-ready comfort.',
    images: [img('1506629905607-d0d9518d6cb1'), img('1515886657613-9f3515b0c78f')]
  }
];

export const reviews = [
  { name: 'Aarav M.', rating: 5, text: 'The oversized tee feels premium and the red branding looks bold without being loud.' },
  { name: 'Riya S.', rating: 5, text: 'Fast delivery, clean packaging, and the hoodie fit exactly like the photos.' },
  { name: 'Kabir P.', rating: 4, text: 'The cargo pants are comfortable enough for daily wear and still look sharp.' }
];

export const blogs = [
  { title: '5 Streetwear Fits That Always Work', tag: 'Style Guide', excerpt: 'Build clean outfits with tees, cargos, jackets, and smart contrast.', image: img('1496747611176-843222e1e57c') },
  { title: 'How to Layer Hoodies and Jackets', tag: 'Fashion Tips', excerpt: 'Seasonal layering ideas that keep your silhouette balanced.', image: img('1515886657613-9f3515b0c78f') },
  { title: 'Red, White and Black: Brand Palette Styling', tag: 'Latest Trends', excerpt: 'Use the Brocode palette without making your outfit feel overbuilt.', image: img('1529139574466-a303027c1d8b') }
];

export const orders = [
  { id: 'BRO-1009', customer: 'Aarav Mehta', total: 4898, status: 'Processing' },
  { id: 'BRO-1010', customer: 'Riya Sharma', total: 2299, status: 'Shipped' },
  { id: 'BRO-1011', customer: 'Kabir Patel', total: 3499, status: 'Pending' }
];

export const customers = [
  { name: 'Aarav Mehta', email: 'aarav@example.com', orders: 4, spent: 12940 },
  { name: 'Riya Sharma', email: 'riya@example.com', orders: 2, spent: 5298 },
  { name: 'Kabir Patel', email: 'kabir@example.com', orders: 6, spent: 18420 }
];
