// Mock Database and API Services

const initialProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 8999,
    category: "Audio",
    rating: 4.8,
    reviewCount: 142,
    stock: 25,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    description: "Premium over-ear wireless headphones with active noise cancellation, deep bass, and up to 30 hours of battery life. Designed for maximum comfort during long listening sessions.",
    specs: {
      "Driver Size": "40mm",
      "Battery Life": "Up to 30 Hours (ANC On)",
      "Bluetooth Version": "5.2",
      "Charging Port": "USB-C",
      "Weight": "250g"
    },
    reviews: [
      { id: 1, user: "Sarah K.", rating: 5, comment: "Absolutely love these! The ANC is amazing and they are so comfortable.", date: "2026-07-01" },
      { id: 2, user: "John D.", rating: 4, comment: "Great sound quality, but a bit tight on my head. Battery lasts forever though.", date: "2026-07-05" }
    ]
  },
  {
    id: 2,
    name: "Smartphone Case",
    price: 1499,
    category: "Accessories",
    rating: 4.5,
    reviewCount: 89,
    stock: 120,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60",
    description: "Sleek, shockproof, and dual-layer protective case with raised edges to shield your camera and screen. Supports magnetic wireless charging.",
    specs: {
      "Material": "TPU & Polycarbonate",
      "Drop Protection": "Up to 10 feet",
      "Wireless Charging": "Compatible (MagSafe Support)",
      "Weight": "35g",
      "Thickness": "1.5mm"
    },
    reviews: [
      { id: 1, user: "Alex M.", rating: 5, comment: "Very sturdy case. Already dropped my phone twice and not a scratch!", date: "2026-06-20" },
      { id: 2, user: "Emma W.", rating: 4, comment: "Looks sleek and does the job. A bit slippery to hold.", date: "2026-06-28" }
    ]
  },
  {
    id: 3,
    name: "USB-C Cable",
    price: 999,
    category: "Accessories",
    rating: 4.7,
    reviewCount: 231,
    stock: 200,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60",
    description: "Ultra-durable double-braided nylon charging cable. Supports Power Delivery up to 100W for high-speed charging of laptops, tablets, and phones.",
    specs: {
      "Length": "6.6 feet (2 meters)",
      "Max Power": "100W (20V/5A)",
      "Transfer Speed": "480 Mbps",
      "Material": "Double-Braided Nylon",
      "Bend Lifespan": "30,000+ bends"
    },
    reviews: [
      { id: 1, user: "David L.", rating: 5, comment: "Super high quality. Charges my MacBook Pro at full speed.", date: "2026-07-02" },
      { id: 2, user: "Sophia R.", rating: 4, comment: "Thicker than expected, but feels like it will last a lifetime.", date: "2026-07-10" }
    ]
  },
  {
    id: 4,
    name: "Smart Watch Pro",
    price: 16999,
    category: "Wearables",
    rating: 4.6,
    reviewCount: 95,
    stock: 15,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60",
    description: "Advanced fitness tracker and smartwatch with AMOLED display, optical heart rate monitor, sleep tracking, and built-in GPS. Up to 7 days of battery life.",
    specs: {
      "Display": "1.43-inch AMOLED",
      "Water Resistance": "5 ATM (50m)",
      "Sensors": "Heart Rate, SpO2, Accelerometer, GPS",
      "Battery Life": "Up to 7 Days",
      "Compatibility": "iOS & Android"
    },
    reviews: [
      { id: 1, user: "Marcus T.", rating: 5, comment: "Heart rate monitor is super accurate. GPS connects in seconds.", date: "2026-06-15" },
      { id: 2, user: "Chloe P.", rating: 4, comment: "Love the display. I wish there were more custom watch faces.", date: "2026-07-04" }
    ]
  },
  {
    id: 5,
    name: "Noise Cancelling Earbuds",
    price: 12499,
    category: "Audio",
    rating: 4.4,
    reviewCount: 78,
    stock: 45,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
    description: "True wireless earbuds with hybrid active noise cancellation, ambient sound pass-through, IPX7 sweat resistance, and compact wireless charging case.",
    specs: {
      "Battery Life": "8 hours (24 hours with case)",
      "Waterproofing": "IPX7 Rating",
      "Audio Codec": "AAC, SBC, aptX Adaptive",
      "Driver": "10mm Dynamic",
      "Mic Count": "6 Beamforming Mics"
    },
    reviews: [
      { id: 1, user: "Tyler J.", rating: 5, comment: "Compact, sounds punchy, and ANC is top-notch. Highly recommend.", date: "2026-07-08" },
      { id: 2, user: "Mia K.", rating: 3, comment: "Sound is great, but the left earbud slips out during workouts.", date: "2026-07-12" }
    ]
  },
  {
    id: 6,
    name: "Mechanical Keyboard",
    price: 10999,
    category: "Accessories",
    rating: 4.9,
    reviewCount: 64,
    stock: 8,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60",
    description: "Hot-swappable tactile mechanical keyboard with mechanical switches, dynamic RGB backlighting, dual-mode wireless connection, and aluminum base.",
    specs: {
      "Layout": "75% Compact (84 Keys)",
      "Switch Type": "Gateron Brown (Tactile)",
      "Connectivity": "2.4GHz Wireless, Bluetooth 5.1, Wired USB-C",
      "Battery Capacity": "4000mAh",
      "Keycaps": "Double-shot PBT"
    },
    reviews: [
      { id: 1, user: "Ethan B.", rating: 5, comment: "Best typing experience I've had. The switches sound amazing.", date: "2026-07-03" },
      { id: 2, user: "Ryan F.", rating: 5, comment: "Solid build, great battery life with RGB turned off.", date: "2026-07-09" }
    ]
  }
];

// Initialize database in localStorage if not already present
const getStoredProducts = () => {
  const stored = localStorage.getItem("eda_products_v2");
  if (!stored) {
    localStorage.setItem("eda_products_v2", JSON.stringify(initialProducts));
    return initialProducts;
  }
  return JSON.parse(stored);
};

const saveProductsToStore = (products) => {
  localStorage.setItem("eda_products_v2", JSON.stringify(products));
};

// Simulate Network Latency
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Get all products with filters, sorting and search
  getProducts: async ({ category, minPrice, maxPrice, rating, search, sortBy } = {}) => {
    await delay(300);
    let products = getStoredProducts();

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (category && category !== "All") {
      products = products.filter(p => p.category === category);
    }

    if (minPrice !== undefined) {
      products = products.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      products = products.filter(p => p.price <= maxPrice);
    }

    if (rating !== undefined && rating > 0) {
      products = products.filter(p => p.rating >= rating);
    }

    if (sortBy) {
      switch (sortBy) {
        case "price-asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "rating-desc":
          products.sort((a, b) => b.rating - a.rating);
          break;
        case "name-asc":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    return products;
  },

  // Get single product details
  getProductById: async (id) => {
    await delay(200);
    const products = getStoredProducts();
    const product = products.find(p => p.id === parseInt(id));
    if (!product) throw new Error("Product not found");
    return product;
  },

  // Add review to product
  addReview: async (productId, { user, rating, comment }) => {
    await delay(400);
    const products = getStoredProducts();
    const productIdx = products.findIndex(p => p.id === parseInt(productId));
    
    if (productIdx === -1) throw new Error("Product not found");
    
    const product = products[productIdx];
    const newReview = {
      id: product.reviews.length + 1,
      user,
      rating: parseInt(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    product.reviews.push(newReview);
    
    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
    product.reviewCount = product.reviews.length;
    
    products[productIdx] = product;
    saveProductsToStore(products);
    
    return product;
  },

  // User Auth - Login
  login: async (email, password) => {
    await delay(600);
    if (!email.includes("@") || password.length < 4) {
      throw new Error("Invalid email or password");
    }
    
    const user = {
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      email: email,
      token: "mock-jwt-token-xyz-12345"
    };
    
    localStorage.setItem("eda_user", JSON.stringify(user));
    return user;
  },

  // User Auth - Register
  register: async (name, email, password) => {
    await delay(600);
    if (name.length < 2 || !email.includes("@") || password.length < 4) {
      throw new Error("Validation failed. Check inputs.");
    }
    
    const user = {
      name,
      email,
      token: "mock-jwt-token-xyz-12345"
    };
    
    localStorage.setItem("eda_user", JSON.stringify(user));
    return user;
  },

  // Get categories
  getCategories: async () => {
    await delay(100);
    const products = getStoredProducts();
    const categories = ["All", ...new Set(products.map(p => p.category))];
    return categories;
  }
};
