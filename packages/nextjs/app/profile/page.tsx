"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from "~~/components/home/Header";
import Footer from "~~/components/home/Footer";
import ProfileCard from "~~/components/profile/ProfileCard";
import ENSAvatar from "~~/components/ens/ENSAvatar";
import ENSVerificationBadge from "~~/components/ens/ENSVerificationBadge";
import { useENSProfile } from "~~/hooks/useENSProfile";
import ClientOnly from "~~/components/ClientOnly";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { motion } from "framer-motion";
import {
    Edit3,
    Settings,
    Share2,
    Download,
    QrCode,
    ExternalLink,
    Store,
    Receipt,
    TrendingUp,
    Users,
    Package,
    CreditCard,
    Globe,
    Plus
} from "lucide-react";
import { useEnsName } from 'wagmi'


const Profile: React.FC = () => {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<"overview" | "activity" | "badges" | "merchant" | "settings">("overview");
    const [isMounted, setIsMounted] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [merchantLabel, setMerchantLabel] = useState("");
    const { data: ensName1 } = useEnsName({ address });

    console.log('ensName', ensName1);

    // Get ENS profile data
    const {
        name: ensName,
        avatar: ensAvatar,
        isVerified: ensVerified,
        textRecords,
        reputationScore,
        isLoading: ensLoading
    } = useENSProfile({ address, type: 'general' });

    // Merchant contract data
    const { data: isMerchant } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "isVerifiedMerchant",
        args: [address],
    });



    const { data: merchantReceipts } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "getMerchantReceipts",
        args: [address],
    });

    const { data: subscription } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "getSubscription",
        args: [address],
    });

    const { data: canIssueReceipts } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "canIssueReceipts",
        args: [address],
    });

    const { writeContractAsync: writeProofMintAsync } = useScaffoldWriteContract({ contractName: "ProofMint" });

    // Handle hydration
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Profile data using connected address and ENS data
    const profileData = {
        address: address || "0x0000000000000000000000000000000000000000",
        ensName: ensName || "Not set",
        avatar: ensAvatar || undefined,
        bio: "Passionate about sustainable technology and blockchain innovation. Building a greener future through responsible electronics consumption and recycling.",
        location: "San Francisco, CA",
        joinDate: "March 2024",
        verified: isMerchant || false,
        stats: {
            receipts: merchantReceipts?.length || 0,
            recycled: 8,
            followers: 156,
            following: 89,
            rating: 4.8,
            totalSpent: 12450,
            carbonSaved: 12.5
        },
        badges: [
            {
                id: "1",
                name: "Green Warrior",
                description: "Recycled 5+ items",
                icon: "🌱",
                color: "bg-green-100 text-green-800"
            },
            {
                id: "2",
                name: "Early Adopter",
                description: "Joined in first month",
                icon: "🚀",
                color: "bg-blue-100 text-blue-800"
            },
            {
                id: "3",
                name: "Community Builder",
                description: "50+ followers",
                icon: "👥",
                color: "bg-purple-100 text-purple-800"
            },
            {
                id: "4",
                name: "Tech Enthusiast",
                description: "20+ receipts",
                icon: "💻",
                color: "bg-yellow-100 text-yellow-800"
            }
        ],
        recentActivity: [
            {
                id: "1",
                type: "receipt" as const,
                title: "New Receipt Generated",
                description: "iPhone 15 Pro receipt #1234 has been minted",
                timestamp: "2 hours ago"
            },
            {
                id: "2",
                type: "recycling" as const,
                title: "Recycling Reward Earned",
                description: "Earned 50 PMT tokens for recycling MacBook Pro",
                timestamp: "1 day ago"
            },
            {
                id: "3",
                type: "achievement" as const,
                title: "Badge Unlocked",
                description: "Green Warrior badge earned!",
                timestamp: "3 days ago"
            },
            {
                id: "4",
                type: "follow" as const,
                title: "New Follower",
                description: "EcoRecycler started following you",
                timestamp: "1 week ago"
            },
            {
                id: "5",
                type: "receipt" as const,
                title: "Receipt Shared",
                description: "Shared MacBook Air receipt with community",
                timestamp: "2 weeks ago"
            }
        ]
    };

    const handleEdit = () => {
        console.log("Edit profile");
        // TODO: Open edit modal
    };

    const handleFollow = () => {
        console.log("Follow user");
        // TODO: Implement follow functionality
    };

    const handleUnfollow = () => {
        console.log("Unfollow user");
        // TODO: Implement unfollow functionality
    };

    const handleShare = () => {
        console.log("Share profile");
        // TODO: Implement share functionality
    };

    const handleDownloadQR = () => {
        console.log("Download QR code");
        // TODO: Generate and download QR code
    };

    const handleRegisterMerchant = async () => {
        if (!merchantLabel.trim()) return;

        try {
            await writeProofMintAsync({
                functionName: "registerMerchant",
                args: [merchantLabel.trim(), address],
            });
            setShowRegisterModal(false);
            setMerchantLabel("");
            // TODO: Show success toast
        } catch (error) {
            console.error("Error registering merchant:", error);
        }
    };

    // Show loading state during hydration
    if (!isMounted) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading profile...</p>
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
                        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
                        <p className="text-gray-600 mb-6">Connect your wallet to view and manage your profile</p>
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
                            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                Profile
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600">Manage your ProofMint profile and activity</p>
                        <div className="absolute -top-2 -right-2 w-16 h-16 bg-green-100 rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Profile Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Share Profile
                        </button>
                        <button
                            onClick={handleDownloadQR}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <QrCode className="w-4 h-4" />
                            Download QR
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
                        </button>
                        <button
                            onClick={() => console.log("Settings")}
                            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: "overview", label: "Overview" },
                                { id: "activity", label: "Activity" },
                                { id: "badges", label: "Badges" },
                                ...(isMerchant ? [{ id: "merchant", label: "Merchant" }] : []),
                                { id: "settings", label: "Settings" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? "border-green-600 text-green-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                    {activeTab === "overview" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ClientOnly fallback={<div className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>}>
                                <ProfileCard
                                    profileData={profileData}
                                    isOwnProfile={true}
                                    onEdit={handleEdit}
                                    variant="full"
                                />
                            </ClientOnly>
                        </motion.div>
                    )}

                    {activeTab === "activity" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Timeline</h3>
                            <div className="space-y-4">
                                {profileData.recentActivity.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-green-600 font-bold">
                                                {activity.type.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                            <p className="text-xs text-gray-400 mt-2">{activity.timestamp}</p>
                                        </div>
                                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                            <ExternalLink className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "badges" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Achievement Badges</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profileData.badges.map((badge, index) => (
                                    <motion.div
                                        key={badge.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-6 bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-colors"
                                    >
                                        <div className="text-center">
                                            <div className="text-4xl mb-3">{badge.icon}</div>
                                            <h4 className="font-semibold text-gray-900 mb-2">{badge.name}</h4>
                                            <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                                                Earned
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "merchant" && isMerchant && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Merchant Status */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Store className="w-6 h-6 text-green-600" />
                                        Merchant Dashboard
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${canIssueReceipts
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {canIssueReceipts ? 'Active' : 'Inactive'}
                                        </div>
                                        <button
                                            onClick={() => setShowRegisterModal(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Register Domain
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <Receipt className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">
                                            {merchantReceipts?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Receipts</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">
                                            {subscription?.[2]?.toString() || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">This Month</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">
                                            {subscription?.[3]?.toString() || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Remaining</div>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription Details */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-green-600" />
                                    Subscription Details
                                </h3>

                                {subscription ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-700">Tier</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${subscription[0] === 0 ? 'bg-blue-100 text-blue-800' :
                                                subscription[0] === 1 ? 'bg-purple-100 text-purple-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {subscription[0] === 0 ? 'Basic' :
                                                    subscription[0] === 1 ? 'Premium' : 'Enterprise'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-700">Status</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${subscription[4] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {subscription[4] ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-700">Expires</span>
                                            <span className="text-gray-900">
                                                {subscription[1] ? new Date(Number(subscription[1]) * 1000).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-700">Receipts Issued</span>
                                            <span className="text-gray-900">{subscription[2]?.toString() || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-700">Receipts Remaining</span>
                                            <span className="text-gray-900">{subscription[3]?.toString() || 0}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No subscription data available
                                    </div>
                                )}
                            </div>

                            {/* Recent Receipts */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Receipt className="w-6 h-6 text-green-600" />
                                    Recent Receipts
                                </h3>

                                {merchantReceipts && merchantReceipts.length > 0 ? (
                                    <div className="space-y-3">
                                        {merchantReceipts.slice(0, 5).map((receiptId: bigint) => (
                                            <div key={receiptId.toString()} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        <Receipt className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">Receipt #{receiptId.toString()}</div>
                                                        <div className="text-sm text-gray-500">ID: {receiptId.toString()}</div>
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No receipts issued yet
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "settings" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        rows={3}
                                        defaultValue={profileData.bio}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        defaultValue={profileData.location}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Privacy Settings
                                    </label>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" defaultChecked />
                                            <span className="ml-2 text-sm text-gray-700">Make profile public</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" defaultChecked />
                                            <span className="ml-2 text-sm text-gray-700">Show activity to followers</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                            <span className="ml-2 text-sm text-gray-700">Allow direct messages</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />

            {/* Register Merchant Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Globe className="w-6 h-6 text-green-600" />
                                Register Merchant Domain
                            </h3>
                            <button
                                onClick={() => setShowRegisterModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Domain Label
                                </label>
                                <input
                                    type="text"
                                    value={merchantLabel}
                                    onChange={(e) => setMerchantLabel(e.target.value)}
                                    placeholder="Enter your domain label (e.g., 'mystore')"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    This will create: {merchantLabel || 'yourlabel'}.proofmint.eth
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
};

export default Profile;
