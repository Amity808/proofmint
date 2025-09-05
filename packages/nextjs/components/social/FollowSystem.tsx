"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    UserPlus,
    UserMinus,
    Shield,
    Star,
    MapPin,
    CheckCircle,
    AlertCircle,
    Heart,
    TrendingUp
} from "lucide-react";

interface User {
    id: string;
    address: string;
    ensName?: string;
    avatar?: string;
    name: string;
    type: "merchant" | "recycler" | "user";
    verified: boolean;
    rating: number;
    followers: number;
    following: number;
    location?: string;
    bio?: string;
    specialties?: string[];
    mutualConnections?: number;
    isFollowing: boolean;
    isFollowedBy: boolean;
    trustScore: number;
    badges: Array<{
        id: string;
        name: string;
        type: "verification" | "achievement" | "reputation";
        color: string;
    }>;
}

interface FollowSystemProps {
    users: User[];
    currentUser: string;
    onFollow: (userId: string) => void;
    onUnfollow: (userId: string) => void;
    onViewProfile: (userId: string) => void;
    showMutualConnections?: boolean;
    showTrustIndicators?: boolean;
}

const FollowSystem: React.FC<FollowSystemProps> = ({
    users,
    currentUser,
    onFollow,
    onUnfollow,
    onViewProfile,
    showMutualConnections = true,
    showTrustIndicators = true
}) => {
    const [filter, setFilter] = useState<"all" | "following" | "followers" | "suggestions">("all");
    const [sortBy, setSortBy] = useState<"name" | "rating" | "followers" | "trust">("name");

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "merchant":
                return <Users className="w-4 h-4 text-brand-primary" />;
            case "recycler":
                return <Heart className="w-4 h-4 text-brand-secondary" />;
            case "user":
                return <UserPlus className="w-4 h-4 text-brand-accent" />;
            default:
                return <Users className="w-4 h-4 text-gray-500" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "merchant":
                return "bg-brand-primary/10 text-brand-primary border-brand-primary/20";
            case "recycler":
                return "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20";
            case "user":
                return "bg-brand-accent/10 text-brand-accent border-brand-accent/20";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const getTrustLevel = (score: number) => {
        if (score >= 90) return { level: "Excellent", color: "text-green-600", icon: CheckCircle };
        if (score >= 70) return { level: "Good", color: "text-blue-600", icon: CheckCircle };
        if (score >= 50) return { level: "Fair", color: "text-yellow-600", icon: AlertCircle };
        return { level: "Poor", color: "text-red-600", icon: AlertCircle };
    };

    const filteredUsers = users.filter(user => {
        switch (filter) {
            case "following":
                return user.isFollowing;
            case "followers":
                return user.isFollowedBy;
            case "suggestions":
                return !user.isFollowing && !user.isFollowedBy;
            default:
                return true;
        }
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        switch (sortBy) {
            case "rating":
                return b.rating - a.rating;
            case "followers":
                return b.followers - a.followers;
            case "trust":
                return b.trustScore - a.trustScore;
            default:
                return a.name.localeCompare(b.name);
        }
    });

    return (
        <div className="space-y-6">
            {/* Filters and Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: "all", label: "All" },
                        { id: "following", label: "Following" },
                        { id: "followers", label: "Followers" },
                        { id: "suggestions", label: "Suggestions" }
                    ].map((filterOption) => (
                        <button
                            key={filterOption.id}
                            onClick={() => setFilter(filterOption.id as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === filterOption.id
                                    ? "bg-brand-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {filterOption.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    >
                        <option value="name">Name</option>
                        <option value="rating">Rating</option>
                        <option value="followers">Followers</option>
                        <option value="trust">Trust Score</option>
                    </select>
                </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
                {sortedUsers.map((user, index) => {
                    const trustLevel = getTrustLevel(user.trustScore);
                    const TrustIcon = trustLevel.icon;

                    return (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-brand-primary/20 hover:border-brand-primary/30 transition-all duration-200"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-brand-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    {/* Type Badge */}
                                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${getTypeColor(user.type)}`}>
                                        {getTypeIcon(user.type)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                                                {user.verified && (
                                                    <Shield className="w-4 h-4 text-brand-primary flex-shrink-0" />
                                                )}
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(user.type)}`}>
                                                    {user.type}
                                                </span>
                                            </div>

                                            {user.bio && (
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{user.bio}</p>
                                            )}

                                            {/* Meta Information */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {user.followers.toLocaleString()} followers
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                    {user.rating}
                                                </div>
                                                {user.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {user.location}
                                                    </div>
                                                )}
                                                {showMutualConnections && user.mutualConnections && user.mutualConnections > 0 && (
                                                    <div className="flex items-center gap-1 text-brand-primary">
                                                        <Users className="w-4 h-4" />
                                                        {user.mutualConnections} mutual
                                                    </div>
                                                )}
                                            </div>

                                            {/* Trust Indicators */}
                                            {showTrustIndicators && (
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <TrustIcon className={`w-4 h-4 ${trustLevel.color}`} />
                                                        <span className={`text-sm font-medium ${trustLevel.color}`}>
                                                            {trustLevel.level} ({user.trustScore}%)
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-500">Trust Score</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Badges */}
                                            {user.badges.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {user.badges.slice(0, 3).map((badge) => (
                                                        <span
                                                            key={badge.id}
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                                                        >
                                                            {badge.name}
                                                        </span>
                                                    ))}
                                                    {user.badges.length > 3 && (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            +{user.badges.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Specialties */}
                                            {user.specialties && user.specialties.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {user.specialties.slice(0, 3).map((specialty) => (
                                                        <span
                                                            key={specialty}
                                                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                                        >
                                                            {specialty}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => onViewProfile(user.id)}
                                                className="px-3 py-1 text-sm text-brand-primary hover:text-brand-primary-dark font-medium"
                                            >
                                                View Profile
                                            </button>

                                            {user.isFollowing ? (
                                                <button
                                                    onClick={() => onUnfollow(user.id)}
                                                    className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                                >
                                                    <UserMinus className="w-4 h-4" />
                                                    Following
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onFollow(user.id)}
                                                    className="flex items-center gap-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors text-sm font-medium"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                    Follow
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State */}
            {sortedUsers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                </div>
            )}
        </div>
    );
};

export default FollowSystem;
