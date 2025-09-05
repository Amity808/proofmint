"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from "~~/components/home/Header";
import Footer from "~~/components/home/Footer";
import StatsCard from "~~/components/common/StatsCard";
import ReceiptCard from "~~/components/common/ReceiptCard";
import { dummyReceipts, dummyMerchantStats } from "~~/data/dummyData";
import { GadgetStatus } from "~~/types";

const MerchantDashboard: React.FC = () => {
    const { isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<"overview" | "receipts" | "products">("overview");
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        specs: ""
    });

    const merchantReceipts = dummyReceipts.filter(receipt =>
        receipt.merchant === "Apple Store" // Assuming current merchant
    );

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Adding product:", newProduct);
        // TODO: Implement product addition
        setNewProduct({ name: "", description: "", price: "", category: "", specs: "" });
    };

    const handleIssueReceipt = (buyerAddress: string, productId: string) => {
        console.log("Issuing receipt for:", buyerAddress, productId);
        // TODO: Implement receipt issuance
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Merchant Dashboard</h1>
                        <p className="text-gray-600 mb-6">Connect your wallet to manage your store</p>
                        <ConnectButton />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="relative">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            <span className="brand-gradient-multi bg-clip-text text-transparent">
                                Merchant Dashboard
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600">Manage your products and track receipts</p>
                        <div className="absolute -top-2 -right-2 w-16 h-16 bg-brand-secondary/10 rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: "overview", label: "Overview" },
                                { id: "receipts", label: "Receipts" },
                                { id: "products", label: "Products" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? "border-brand-primary text-brand-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Receipts Issued"
                                value={dummyMerchantStats.totalReceiptsIssued}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                }
                                color="green"
                            />
                            <StatsCard
                                title="Total Revenue"
                                value={`$${dummyMerchantStats.totalRevenue.toLocaleString()}`}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                }
                                color="blue"
                            />
                            <StatsCard
                                title="Active Products"
                                value={dummyMerchantStats.activeProducts}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                }
                                color="purple"
                            />
                            <StatsCard
                                title="Recent Receipts"
                                value={dummyMerchantStats.recentReceipts}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                }
                                color="yellow"
                            />
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {merchantReceipts.slice(0, 5).map((receipt) => (
                                    <div key={receipt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{receipt.productName}</p>
                                                <p className="text-sm text-gray-600">Receipt #{receipt.id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">${receipt.price}</p>
                                            <p className="text-sm text-gray-600">{receipt.purchaseDate}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Receipts Tab */}
                {activeTab === "receipts" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">All Receipts</h3>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Search receipts..."
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    Export
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {merchantReceipts.map((receipt) => (
                                <ReceiptCard
                                    key={receipt.id}
                                    receipt={receipt}
                                    onViewDetails={(id) => console.log("View receipt:", id)}
                                    onGenerateQR={(id) => console.log("Generate QR:", id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === "products" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Product Management</h3>
                            <button
                                onClick={() => setActiveTab("products")}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Add Product
                            </button>
                        </div>

                        {/* Add Product Form */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h4 className="text-lg font-medium mb-4">Add New Product</h4>
                            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Smartphones">Smartphones</option>
                                        <option value="Laptops">Laptops</option>
                                        <option value="Tablets">Tablets</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Gaming">Gaming</option>
                                        <option value="Wearables">Wearables</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Specifications (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={newProduct.specs}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, specs: e.target.value }))}
                                        placeholder="e.g., 6.1-inch display, A17 Pro chip"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        Add Product
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Existing Products */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h4 className="text-lg font-medium mb-4">Your Products</h4>
                            <div className="text-center py-8 text-gray-500">
                                <p>No products added yet. Add your first product above.</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MerchantDashboard;
