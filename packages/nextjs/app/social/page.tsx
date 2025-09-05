"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from "~~/components/home/Header";
import Footer from "~~/components/home/Footer";
import FollowSystem from "~~/components/social/FollowSystem";
import TrustIndicators from "~~/components/social/TrustIndicators";
import MutualConnections from "~~/components/social/MutualConnections";
import { motion } from "framer-motion";
import {
    Users,
    Search,
    Filter,
    TrendingUp,
    Shield,
    Star,
    Heart,
    MessageCircle
} from "lucide-react";

const Social: React.FC = () => {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<"discover" | "following" | "followers" | "mutual">("discover");

    // Mock data for demonstration
    const mockUsers = [
        {
            id: "1",
            address: "0x1234...5678",
            ensName: "apple.store",
            avatar: "/avatars/apple.jpg",
            name: "Apple Store Official",
            type: "merchant" as const,
            verified: true,
            rating: 4.9,
            followers: 1250,
            following: 89,
            location: "San Francisco, CA",
            bio: "Official Apple products with NFT receipts and warranty",
            specialties: ["iPhone", "MacBook", "iPad"],
            mutualConnections: 12,
            isFollowing: false,
            isFollowedBy: true,
            trustScore: 95,
            badges: [
                { id: "1", name: "Verified Merchant", type: "verification" as const, color: "bg-green-100 text-green-800" },
                { id: "2", name: "Top Rated", type: "reputation" as const, color: "bg-yellow-100 text-yellow-800" }
            ]
        },
        {
            id: "2",
            address: "0x2345...6789",
            ensName: "ecorecycler.eth",
            avatar: "/avatars/eco.jpg",
            name: "EcoRecycle Hub",
            type: "recycler" as const,
            verified: true,
            rating: 4.8,
            followers: 890,
            following: 156,
            location: "Austin, TX",
            bio: "Sustainable electronics recycling with environmental impact tracking",
            specialties: ["Laptops", "Phones", "Tablets"],
            mutualConnections: 8,
            isFollowing: true,
            isFollowedBy: false,
            trustScore: 92,
            badges: [
                { id: "3", name: "Green Certified", type: "achievement" as const, color: "bg-green-100 text-green-800" },
                { id: "4", name: "Community Leader", type: "community" as const, color: "bg-purple-100 text-purple-800" }
            ]
        },
        {
            id: "3",
            address: "0x3456...7890",
            ensName: "techgadgets.pro",
            avatar: "/avatars/tech.jpg",
            name: "TechGadgets Pro",
            type: "merchant" as const,
            verified: false,
            rating: 4.6,
            followers: 567,
            following: 234,
            location: "New York, NY",
            bio: "Premium electronics with blockchain verification and extended warranty",
            specialties: ["Gaming", "Audio", "Cameras"],
            mutualConnections: 5,
            isFollowing: false,
            isFollowedBy: false,
            trustScore: 78,
            badges: [
                { id: "5", name: "Rising Star", type: "reputation" as const, color: "bg-blue-100 text-blue-800" }
            ]
        }
    ];

    const mockTrustScore = {
        overall: 87,
        verification: 95,
        reputation: 82,
        activity: 78,
        community: 91
    };

    const mockBadges = [
        {
            id: "1",
            name: "Verified User",
            description: "Identity verified through ENS",
            type: "verification" as const,
            level: "gold" as const,
            icon: "🛡️"
        },
        {
            id: "2",
            name: "Green Warrior",
            description: "Recycled 10+ items",
            type: "achievement" as const,
            level: "platinum" as const,
            icon: "🌱"
        },
        {
            id: "3",
            name: "Community Builder",
            description: "100+ followers",
            type: "community" as const,
            level: "gold" as const,
            icon: "👥"
        }
    ];

    const mockMutualConnections = [
        {
            id: "1",
            address: "0x1111...2222",
            ensName: "sustainable.eth",
            name: "Sustainable Living",
            type: "user" as const,
            verified: true,
            rating: 4.7,
            followers: 234,
            location: "Portland, OR",
            connectionStrength: "strong" as const,
            mutualCount: 15,
            lastInteraction: "2 days ago",
            commonInterests: ["Recycling", "Sustainability", "Tech"],
            isFollowing: true
        },
        {
            id: "2",
            address: "0x3333...4444",
            ensName: "green.tech",
            name: "Green Tech Solutions",
            type: "recycler" as const,
            verified: true,
            rating: 4.9,
            followers: 567,
            location: "Seattle, WA",
            connectionStrength: "medium" as const,
            mutualCount: 8,
            lastInteraction: "1 week ago",
            commonInterests: ["Electronics", "Recycling"],
            isFollowing: false
        }
    ];

    const handleFollow = (userId: string) => {
        console.log("Following user:", userId);
        // TODO: Implement follow functionality
    };

    const handleUnfollow = (userId: string) => {
        console.log("Unfollowing user:", userId);
        // TODO: Implement unfollow functionality
    };

    const handleViewProfile = (userId: string) => {
        console.log("Viewing profile:", userId);
        // TODO: Navigate to profile page
    };

    const handleMessage = (userId: string) => {
        console.log("Messaging user:", userId);
        // TODO: Open messaging interface
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Social Network</h1>
                        <p className="text-gray-600 mb-6">Connect your wallet to access social features</p>
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
                                Social Network
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600">Connect with merchants, recyclers, and sustainable tech enthusiasts</p>
                        <div className="absolute -top-2 -right-2 w-16 h-16 bg-brand-primary/10 rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-brand-primary border border-brand-primary/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-primary/10 rounded-lg">
                                <Users className="w-6 h-6 text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">1,247</p>
                                <p className="text-sm text-gray-600">Total Users</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-brand-secondary border border-brand-secondary/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-secondary/10 rounded-lg">
                                <Shield className="w-6 h-6 text-brand-secondary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">89</p>
                                <p className="text-sm text-gray-600">Verified Accounts</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-brand-accent border border-brand-accent/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-accent/10 rounded-lg">
                                <Heart className="w-6 h-6 text-brand-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">156</p>
                                <p className="text-sm text-gray-600">Active Recyclers</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-brand-primary border border-brand-primary/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Star className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">4.8</p>
                                <p className="text-sm text-gray-600">Avg Rating</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: "discover", label: "Discover", icon: Search },
                                { id: "following", label: "Following", icon: Users },
                                { id: "followers", label: "Followers", icon: Heart },
                                { id: "mutual", label: "Mutual", icon: TrendingUp }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === tab.id
                                            ? "border-brand-primary text-brand-primary"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                    {activeTab === "discover" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FollowSystem
                                users={mockUsers}
                                currentUser={address || ""}
                                onFollow={handleFollow}
                                onUnfollow={handleUnfollow}
                                onViewProfile={handleViewProfile}
                                showMutualConnections={true}
                                showTrustIndicators={true}
                            />
                        </motion.div>
                    )}

                    {activeTab === "following" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FollowSystem
                                users={mockUsers.filter(user => user.isFollowing)}
                                currentUser={address || ""}
                                onFollow={handleFollow}
                                onUnfollow={handleUnfollow}
                                onViewProfile={handleViewProfile}
                                showMutualConnections={true}
                                showTrustIndicators={true}
                            />
                        </motion.div>
                    )}

                    {activeTab === "followers" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FollowSystem
                                users={mockUsers.filter(user => user.isFollowedBy)}
                                currentUser={address || ""}
                                onFollow={handleFollow}
                                onUnfollow={handleUnfollow}
                                onViewProfile={handleViewProfile}
                                showMutualConnections={true}
                                showTrustIndicators={true}
                            />
                        </motion.div>
                    )}

                    {activeTab === "mutual" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            <MutualConnections
                                connections={mockMutualConnections}
                                currentUser={address || ""}
                                onViewProfile={handleViewProfile}
                                onFollow={handleFollow}
                                onUnfollow={handleUnfollow}
                                onMessage={handleMessage}
                                maxDisplay={6}
                                showConnectionStrength={true}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Trust Indicators Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Trust Profile</h2>
                    <TrustIndicators
                        trustScore={mockTrustScore}
                        verified={true}
                        badges={mockBadges}
                        rating={4.8}
                        reviewCount={156}
                        joinDate="March 2024"
                        lastActive="2 hours ago"
                        showDetails={true}
                        variant="full"
                    />
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Social;
