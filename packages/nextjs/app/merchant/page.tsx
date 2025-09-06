"use client";

import React, { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Globe, Plus, Receipt, Store } from "lucide-react";
import toast from "react-hot-toast";
import { FaTimes, FaUpload } from "react-icons/fa";
import { useAccount } from "wagmi";
import Allrecipt from "~~/components/AllCards/Allreciept";
import StatsCard from "~~/components/common/StatsCard";
import ENSVerificationBadge from "~~/components/ens/ENSVerificationBadge";
import Footer from "~~/components/home/Footer";
import Header from "~~/components/home/Header";
import { dummyMerchantStats, dummyReceipts } from "~~/data/dummyData";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { makeContractMetadata } from "~~/utils/UploadPinta";

const MerchantDashboard: React.FC = () => {
    const { isConnected, address } = useAccount();
    const [activeTab, setActiveTab] = useState<"overview" | "receipts" | "products">("overview");
    const [isMounted, setIsMounted] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [merchantLabel, setMerchantLabel] = useState("");

    // Smart contract hooks
    const { writeContractAsync: writeProofMintAsync } = useScaffoldWriteContract({
        contractName: "ProofMint",
    });

    // Check if user has a registered domain
    const { data: merchantName } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "merchantName",
        args: [address],
    });


    // Check if user has a registered domain
    const hasDomain = merchantName && merchantName.trim() !== "";
    const isCheckingDomain = merchantName === undefined;
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        specs: "",
        image: null as File | null,
        serial_number: "",
        ens: "",
        buyerAddress: "",
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Handle hydration
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const merchantReceipts = dummyReceipts.filter(
        receipt => receipt.merchant === "Apple Store", // Assuming current merchant
    );

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }

            setNewProduct(prev => ({ ...prev, image: file }));

            // Create preview
            const reader = new FileReader();
            reader.onload = e => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setNewProduct(prev => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleReceipt = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsUploading(true);

        try {
            if (!newProduct.image) {
                toast.error("Please upload a product image");
                return;
            }

            console.log("Starting product addition and receipt issuance process...");
            toast.loading("Uploading metadata to IPFS...", { id: "receipt" });

            // Upload product metadata to IPFS and get the hash
            const ipfsResponse = await makeContractMetadata({
                imageFile: newProduct.image,
                recipt: newProduct.name,
                description: newProduct.description,
                serial_number: newProduct.serial_number,
                ens: newProduct.ens,
            });

            console.log("Product metadata uploaded:", ipfsResponse);

            // Issue receipt on blockchain if buyer address is provided
            toast.loading("Issuing receipt on blockchain...", { id: "receipt" });

            // Wait a moment for IPFS to propagate
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Call the smart contract to issue receipt
            await writeProofMintAsync({
                functionName: "issueReceipt",
                args: [newProduct.buyerAddress, ipfsResponse],
            });
        } catch (error) {
            console.error("Error processing receipt:", error);
            toast.error("Failed to process receipt. Please try again.", { id: "receipt" });
        } finally {
            setIsUploading(false);
            setNewProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                specs: "",
                image: null,
                serial_number: "",
                ens: "",
                buyerAddress: "",
            });
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRegisterMerchant = async () => {
        if (!merchantLabel.trim()) return;

        try {
            console.log("Registering merchant with:", {
                label: merchantLabel.trim(),
                address: address,
            });

            const tx = await writeProofMintAsync({
                functionName: "registerMerchant",
                args: [merchantLabel.trim(), address],
            });

            console.log("Transaction successful:", tx);
            setShowRegisterModal(false);
            setMerchantLabel("");
            // Success - the page will automatically refresh and show the merchant dashboard
            // since hasDomain will now be true
        } catch (error) {
            console.error("Error registering merchant:", error);
            // alert(`Registration failed: ${error.message || error}`);
        }
    };

    // Show loading state during hydration or domain check
    if (!isMounted || isCheckingDomain) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            {!isMounted ? "Loading merchant dashboard..." : "Checking domain status..."}
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

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

    // Check if user has a registered domain
    if (!hasDomain) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Store className="w-10 h-10 text-gray-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Merchant Domain Required</h1>
                        <p className="text-gray-600 mb-6">
                            You need to register a merchant domain to access the merchant dashboard. This creates your unique merchant
                            identity on the ProofMint network.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Globe className="w-4 h-4" />
                                <span>Get your own .proofmint.eth domain</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Receipt className="w-4 h-4" />
                                <span>Issue digital receipts for products</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Store className="w-4 h-4" />
                                <span>Access merchant features</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowRegisterModal(true)}
                            className="mt-8 flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
                        >
                            <Plus className="w-5 h-5" />
                            Register Merchant Domain
                        </button>
                    </div>
                </div>
                <Footer />

                {/* Register Merchant Modal */}
                {showRegisterModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Store className="w-6 h-6 text-green-600" />
                                    Register Merchant Domain
                                </h3>
                                <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Domain Label</label>
                                    <input
                                        type="text"
                                        value={merchantLabel}
                                        onChange={e => setMerchantLabel(e.target.value)}
                                        placeholder="Enter your domain label (e.g., 'mystore')"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        This will create:{" "}
                                        <span className="font-mono text-green-600">{merchantLabel || "yourlabel"}.proofmint.eth</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        onClick={handleRegisterMerchant}
                                        disabled={!merchantLabel.trim()}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Register Domain
                                    </button>
                                    <button
                                        onClick={() => setShowRegisterModal(false)}
                                        className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    <span className="brand-gradient-multi bg-clip-text text-transparent">Merchant Dashboard</span>
                                </h1>
                                <p className="text-lg text-gray-600">Manage your products and track receipts</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <ENSVerificationBadge address={address} type="merchant" showDetails={true} />
                                {address && (
                                    <div className="text-sm text-gray-500">
                                        {address.slice(0, 6)}...{address.slice(-4)}
                                    </div>
                                )}
                            </div>
                        </div>
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
                                { id: "products", label: "Products" },
                            ].map(tab => (
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
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                }
                                color="green"
                            />
                            <StatsCard
                                title="Total Revenue"
                                value={`$${dummyMerchantStats.totalRevenue.toLocaleString()}`}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        />
                                    </svg>
                                }
                                color="blue"
                            />
                            <StatsCard
                                title="Active Products"
                                value={dummyMerchantStats.activeProducts}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
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
                                {merchantReceipts.slice(0, 5).map(receipt => (
                                    <div key={receipt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
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

                        {/* Issue New Receipt Form */}

                        {/* all receipt display */}
                        <Allrecipt />
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
                            <form onSubmit={e => handleReceipt(e)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={newProduct.category}
                                        onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                                    <input
                                        type="text"
                                        value={newProduct.serial_number}
                                        onChange={e => setNewProduct(prev => ({ ...prev, serial_number: e.target.value }))}
                                        placeholder="e.g., ABC123456789"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Address</label>
                                    <input
                                        type="text"
                                        value={newProduct.buyerAddress}
                                        onChange={e => setNewProduct(prev => ({ ...prev, buyerAddress: e.target.value }))}
                                        placeholder="0x..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Specifications (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={newProduct.specs}
                                        onChange={e => setNewProduct(prev => ({ ...prev, specs: e.target.value }))}
                                        placeholder="e.g., 6.1-inch display, A17 Pro chip"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ens Name</label>
                                    <input
                                        type="text"
                                        value={newProduct.ens}
                                        onChange={e => setNewProduct(prev => ({ ...prev, ens: e.target.value }))}
                                        placeholder="e.g., Ajtech.eth"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={newProduct.description}
                                        onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>

                                    {!imagePreview ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                                                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                                    <div className="text-brand-primary text-xl">
                                                        <FaUpload />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Upload Product Image</p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                                </div>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={imagePreview} alt="Product preview" className="w-full h-full object-cover" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                <div className="text-sm">
                                                    <FaTimes />
                                                </div>
                                            </button>
                                            <div className="mt-2 text-xs text-gray-500">
                                                {newProduct.image?.name} ({((newProduct.image?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <span>Add Product</span>
                                        )}
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

