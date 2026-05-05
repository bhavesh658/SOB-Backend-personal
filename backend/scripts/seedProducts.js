// backend/scripts/seedProducts.js
// Run with: node backend/scripts/seedProducts.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourdb";

const dummyProducts = [
  {
    name: "Premium Wireless Headphones",
    price: 2999,
    description:
      "Experience crystal-clear audio with deep bass and active noise cancellation. Designed for all-day comfort with plush ear cushions and a lightweight frame. 30-hour battery life keeps you immersed in music all day.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80",
    ],
    stock: 25,
    rating: [],
  },
  {
    name: "Minimalist Leather Watch",
    price: 4499,
    description:
      "A timeless piece crafted with genuine Italian leather strap and sapphire crystal glass. Water resistant up to 50 meters. Slim 8mm profile fits perfectly under any cuff. Automatic movement with 42-hour power reserve.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80",
    ],
    stock: 10,
    rating: [],
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 3499,
    description:
      "Full RGB backlit mechanical keyboard with Cherry MX Red switches for ultra-fast actuation. Anti-ghosting with N-key rollover. Durable aluminum top plate. Detachable USB-C cable with braided sleeve.",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80",
    ],
    stock: 0, // OUT OF STOCK - tests edge case
    rating: [],
  },
  {
    name: "Running Sneakers Pro",
    price: 5999,
    description:
      "Engineered for performance with responsive foam midsole and breathable mesh upper. Reflective details for low-light visibility. Rubber outsole with multi-directional grip. Suitable for road and light trail running.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
    ],
    stock: 50,
    rating: [],
  },
  {
    name: "Portable Bluetooth Speaker",
    price: 1799,
    description:
      "360° surround sound in a compact waterproof design (IPX7 rated). 12-hour playtime with quick-charge 2.0. Pair two speakers for true stereo. Built-in mic for hands-free calls.",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80",
      "https://images.unsplash.com/photo-1593169158019-c32b8f4dbce9?w=800&q=80",
    ],
    stock: 30,
    rating: [],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Optional: clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    const inserted = await Product.insertMany(dummyProducts);
    console.log(`✅ Seeded ${inserted.length} products:`);
    inserted.forEach((p) => console.log(`   - ${p.name} (ID: ${p._id})`));

    await mongoose.disconnect();
    console.log("✅ Done! Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seed();