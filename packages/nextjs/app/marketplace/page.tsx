"use client";

import React, { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from "~~/components/home/Header";
import Footer from "~~/components/home/Footer";
import ProductCard from "~~/components/common/ProductCard";
import { dummyProducts, productCategories, dummyMerchants } from "~~/data/dummyData";

const Marketplace: React.FC = () => {
    const { isConnected } = useAccount();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedMerchant, setSelectedMerchant] = useState("All");
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const filteredProducts = useMemo(() => {
        let filtered = dummyProducts;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== "All") {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Merchant filter
        if (selectedMerchant !== "All") {
            filtered = filtered.filter(product => product.merchant === selectedMerchant);
        }

        // Price range filter
        filtered = filtered.filter(product =>
            product.price >= priceRange.min && product.price <= priceRange.max
        );

        // Sort
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case "name":
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case "price":
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case "rating":
                    aValue = a.rating || 0;
                    bValue = b.rating || 0;
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [searchQuery, selectedCategory, selectedMerchant, priceRange, sortBy, sortOrder]);

    const handleBuy = (id: number) => {
        if (!isConnected) {
            alert("Please connect your wallet to purchase items");
            return;
        }
        console.log("Buying product:", id);
        // TODO: Implement purchase flow
    };

    const handleViewDetails = (id: number) => {
        console.log("View details for product:", id);
        // TODO: Implement product details modal
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="relative">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            <span className="brand-gradient-multi bg-clip-text text-transparent">
                                Marketplace
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600">Discover and purchase electronics with NFT receipts</p>
                        <div className="absolute -top-2 -right-2 w-16 h-16 bg-brand-primary/10 rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-brand-primary border border-brand-primary/20 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Products
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                            >
                                {productCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Merchant Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Merchant
                            </label>
                            <select
                                value={selectedMerchant}
                                onChange={(e) => setSelectedMerchant(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                            >
                                <option value="All">All Merchants</option>
                                {dummyMerchants.map(merchant => (
                                    <option key={merchant} value={merchant}>{merchant}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="name">Name</option>
                                    <option value="price">Price</option>
                                    <option value="rating">Rating</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                    className="px-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                                >
                                    {sortOrder === "asc" ? "↑" : "↓"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Price: ${priceRange.min}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                step="100"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Price: ${priceRange.max}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                step="100"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        Showing {filteredProducts.length} of {dummyProducts.length} products
                    </p>
                    {!isConnected && (
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Connect wallet to purchase
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onBuy={handleBuy}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("All");
                                setSelectedMerchant("All");
                                setPriceRange({ min: 0, max: 5000 });
                            }}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Wallet Connection Prompt */}
                {!isConnected && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium text-blue-900 mb-2">Ready to Start Shopping?</h3>
                        <p className="text-blue-700 mb-4">Connect your wallet to purchase products and receive NFT receipts</p>
                        <ConnectButton />
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Marketplace;
