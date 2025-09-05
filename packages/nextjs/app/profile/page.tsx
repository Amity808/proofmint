"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from "~~/components/home/Header";
import Footer from "~~/components/home/Footer";
import ProfileCard from "~~/components/profile/ProfileCard";
import { motion } from "framer-motion";
import {
    Edit3,
    Settings,
    Share2,
    Download,
    QrCode,
    ExternalLink
} from "lucide-react";

const Profile: React.FC = () => {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<"overview" | "activity" | "badges" | "settings">("overview");

    // Mock profile data
    const profileData = {
        address: address || "0x0000000000000000000000000000000000000000",
        ensName: "sustainable.eth",
        avatar: "/avatars/profile.jpg",
        bio: "Passionate about sustainable technology and blockchain innovation. Building a greener future through responsible electronics consumption and recycling.",
        location: "San Francisco, CA",
        joinDate: "March 2024",
        verified: true,
        stats: {
            receipts: 24,
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
                type: "receipt",
                title: "New Receipt Generated",
                description: "iPhone 15 Pro receipt #1234 has been minted",
                timestamp: "2 hours ago"
            },
            {
                id: "2",
                type: "recycling",
                title: "Recycling Reward Earned",
                description: "Earned 50 PMT tokens for recycling MacBook Pro",
                timestamp: "1 day ago"
            },
            {
                id: "3",
                type: "achievement",
                title: "Badge Unlocked",
                description: "Green Warrior badge earned!",
                timestamp: "3 days ago"
            },
            {
                id: "4",
                type: "follow",
                title: "New Follower",
                description: "EcoRecycler started following you",
                timestamp: "1 week ago"
            },
            {
                id: "5",
                type: "receipt",
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
                            <span className="brand-gradient-multi bg-clip-text text-transparent">
                                Profile
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600">Manage your ProofMint profile and activity</p>
                        <div className="absolute -top-2 -right-2 w-16 h-16 bg-brand-primary/10 rounded-full blur-xl"></div>
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
                            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors"
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
                                { id: "settings", label: "Settings" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
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

                {/* Tab Content */}
                <div className="space-y-8">
                    {activeTab === "overview" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProfileCard
                                profileData={profileData}
                                isOwnProfile={true}
                                onEdit={handleEdit}
                                variant="full"
                            />
                        </motion.div>
                    )}

                    {activeTab === "activity" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-brand-primary border border-brand-primary/20 p-6"
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
                                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-brand-primary font-bold">
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
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-brand-primary border border-brand-primary/20 p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Achievement Badges</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profileData.badges.map((badge, index) => (
                                    <motion.div
                                        key={badge.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-6 bg-white rounded-xl border border-gray-200 hover:border-brand-primary/30 transition-colors"
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

                    {activeTab === "settings" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-brand-primary border border-brand-primary/20 p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                        defaultValue={profileData.location}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Privacy Settings
                                    </label>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" defaultChecked />
                                            <span className="ml-2 text-sm text-gray-700">Make profile public</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" defaultChecked />
                                            <span className="ml-2 text-sm text-gray-700">Show activity to followers</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                                            <span className="ml-2 text-sm text-gray-700">Allow direct messages</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
