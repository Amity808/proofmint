import { Receipt, Product, GadgetStatus, DashboardStats, MerchantStats, RecyclerStats, AdminStats } from "~~/types";

// Dummy Receipts Data
export const dummyReceipts: Receipt[] = [
    {
        id: 1,
        productName: "iPhone 15 Pro",
        productId: "IPH15PRO-001",
        purchaseDate: "2024-01-15",
        price: "999.99",
        currency: "USD",
        merchant: "Apple Store",
        transactionHash: "0x1234...5678",
        status: GadgetStatus.Active,
        ipfsHash: "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
        image: "/api/placeholder/300/200",
        description: "Latest iPhone with Pro camera system",
        specs: ["6.1-inch display", "A17 Pro chip", "48MP camera", "Titanium design"]
    },
    {
        id: 2,
        productName: "MacBook Air M3",
        productId: "MBA-M3-256",
        purchaseDate: "2024-01-10",
        price: "1199.99",
        currency: "USD",
        merchant: "Apple Store",
        transactionHash: "0xabcd...efgh",
        status: GadgetStatus.Active,
        ipfsHash: "QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy",
        image: "/api/placeholder/300/200",
        description: "Ultra-thin laptop with M3 chip",
        specs: ["13.6-inch display", "M3 chip", "8GB RAM", "256GB SSD"]
    },
    {
        id: 3,
        productName: "Samsung Galaxy S24",
        productId: "SGS24-128",
        purchaseDate: "2024-01-05",
        price: "799.99",
        currency: "USD",
        merchant: "Samsung Store",
        transactionHash: "0x9876...5432",
        status: GadgetStatus.Stolen,
        ipfsHash: "QmZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz",
        image: "/api/placeholder/300/200",
        description: "Android flagship with AI features",
        specs: ["6.2-inch display", "Snapdragon 8 Gen 3", "50MP camera", "128GB storage"]
    },
    {
        id: 4,
        productName: "Dell XPS 13",
        productId: "DXP13-512",
        purchaseDate: "2023-12-20",
        price: "1299.99",
        currency: "USD",
        merchant: "Dell Store",
        transactionHash: "0x1111...2222",
        status: GadgetStatus.Misplaced,
        ipfsHash: "QmAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAa",
        image: "/api/placeholder/300/200",
        description: "Premium Windows laptop",
        specs: ["13.4-inch display", "Intel i7", "16GB RAM", "512GB SSD"]
    },
    {
        id: 5,
        productName: "iPad Pro 12.9",
        productId: "IPP12-256",
        purchaseDate: "2023-11-15",
        price: "1099.99",
        currency: "USD",
        merchant: "Apple Store",
        transactionHash: "0x3333...4444",
        status: GadgetStatus.Recycled,
        ipfsHash: "QmBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBb",
        image: "/api/placeholder/300/200",
        description: "Professional tablet with M2 chip",
        specs: ["12.9-inch display", "M2 chip", "8GB RAM", "256GB storage"]
    }
];

// Dummy Products Data
export const dummyProducts: Product[] = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        description: "Latest iPhone with Pro camera system and titanium design",
        price: 999.99,
        currency: "USD",
        merchant: "Apple Store",
        category: "Smartphones",
        image: "/api/placeholder/300/200",
        inStock: true,
        specs: ["6.1-inch display", "A17 Pro chip", "48MP camera", "Titanium design"],
        rating: 4.8,
        reviews: 1247
    },
    {
        id: 2,
        name: "MacBook Air M3",
        description: "Ultra-thin laptop with M3 chip for ultimate performance",
        price: 1199.99,
        currency: "USD",
        merchant: "Apple Store",
        category: "Laptops",
        image: "/api/placeholder/300/200",
        inStock: true,
        specs: ["13.6-inch display", "M3 chip", "8GB RAM", "256GB SSD"],
        rating: 4.9,
        reviews: 892
    },
    {
        id: 3,
        name: "Samsung Galaxy S24",
        description: "Android flagship with AI features and advanced camera",
        price: 799.99,
        currency: "USD",
        merchant: "Samsung Store",
        category: "Smartphones",
        image: "/api/placeholder/300/200",
        inStock: true,
        specs: ["6.2-inch display", "Snapdragon 8 Gen 3", "50MP camera", "128GB storage"],
        rating: 4.6,
        reviews: 2156
    },
    {
        id: 4,
        name: "Dell XPS 13",
        description: "Premium Windows laptop with stunning display",
        price: 1299.99,
        currency: "USD",
        merchant: "Dell Store",
        category: "Laptops",
        image: "/api/placeholder/300/200",
        inStock: false,
        specs: ["13.4-inch display", "Intel i7", "16GB RAM", "512GB SSD"],
        rating: 4.7,
        reviews: 634
    },
    {
        id: 5,
        name: "iPad Pro 12.9",
        description: "Professional tablet with M2 chip for creative work",
        price: 1099.99,
        currency: "USD",
        merchant: "Apple Store",
        category: "Tablets",
        image: "/api/placeholder/300/200",
        inStock: true,
        specs: ["12.9-inch display", "M2 chip", "8GB RAM", "256GB storage"],
        rating: 4.8,
        reviews: 1456
    },
    {
        id: 6,
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise canceling headphones",
        price: 399.99,
        currency: "USD",
        merchant: "Sony Store",
        category: "Audio",
        image: "/api/placeholder/300/200",
        inStock: true,
        specs: ["30-hour battery", "Quick Charge", "Hi-Res Audio", "Touch controls"],
        rating: 4.9,
        reviews: 3421
    },
    {
        id: 7,
        name: "Nintendo Switch OLED",
        description: "Gaming console with vibrant OLED display",
        price: 349.99,
        currency: "USD",
        merchant: "Nintendo Store",
        category: "Gaming",
        image: "/api/placeholder/300/200",
        inStock: true,
        specs: ["7-inch OLED display", "64GB storage", "Joy-Con controllers", "Dock included"],
        rating: 4.7,
        reviews: 2876
    },
    {
        id: 8,
        name: "Apple Watch Series 9",
        description: "Advanced smartwatch with health monitoring",
        price: 399.99,
        currency: "USD",
        merchant: "Apple Store",
        category: "Wearables",
        image: "/api/placeholder/300/200",
        inStock: true,
        specs: ["45mm case", "Always-on display", "ECG app", "Water resistant"],
        rating: 4.8,
        reviews: 1923
    },
    {
        id: 9,
        name: "ASUS ROG Strix G15",
        description: "Gaming laptop with RTX 4060 graphics",
        price: 1299.99,
        currency: "USD",
        merchant: "ASUS Store",
        category: "Gaming Laptops",
        image: "/api/placeholder/300/200",
        inStock: true,
        specs: ["15.6-inch display", "RTX 4060", "16GB RAM", "512GB SSD"],
        rating: 4.5,
        reviews: 567
    },
    {
        id: 10,
        name: "Google Pixel 8 Pro",
        description: "AI-powered smartphone with advanced photography",
        price: 999.99,
        currency: "USD",
        merchant: "Google Store",
        category: "Smartphones",
        image: "/api/placeholder/300/200",
        inStock: true,
        specs: ["6.7-inch display", "Tensor G3", "50MP camera", "128GB storage"],
        rating: 4.6,
        reviews: 1834
    }
];

// Dashboard Stats
export const dummyDashboardStats: DashboardStats = {
    totalReceipts: 5,
    totalSpent: 5399.95,
    verifiedCount: 4,
    activeCount: 2,
    stolenCount: 1,
    misplacedCount: 1,
    recycledCount: 1
};

export const dummyMerchantStats: MerchantStats = {
    totalReceiptsIssued: 127,
    totalRevenue: 156789.50,
    activeProducts: 23,
    recentReceipts: 8
};

export const dummyRecyclerStats: RecyclerStats = {
    totalRecycled: 45,
    environmentalImpact: 2340, // kg CO2 saved
    availableForRecycling: 12,
    pendingRecycling: 3
};

export const dummyAdminStats: AdminStats = {
    totalUsers: 1247,
    totalMerchants: 23,
    totalRecyclers: 8,
    totalReceipts: 3456,
    systemHealth: "good"
};

// Categories for filtering
export const productCategories = [
    "All",
    "Smartphones",
    "Laptops",
    "Tablets",
    "Audio",
    "Gaming",
    "Wearables",
    "Gaming Laptops"
];

// Merchants
export const dummyMerchants = [
    "Apple Store",
    "Samsung Store",
    "Dell Store",
    "Sony Store",
    "Nintendo Store",
    "ASUS Store",
    "Google Store"
];
