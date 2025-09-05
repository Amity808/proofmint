"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Shield,
    Star,
    MapPin,
    Recycle,
    ShoppingBag,
    CheckCircle,
    X
} from "lucide-react";

interface Suggestion {
    id: string;
    name: string;
    type: "merchant" | "recycler" | "user";
    address: string;
    followers: number;
    verified: boolean;
    description: string;
    location?: string;
    rating?: number;
    specialties?: string[];
    mutualConnections?: number;
    avatar?: string;
}

interface FollowSuggestionsProps {
    suggestions?: Suggestion[];
    onFollow?: (id: string) => void;
    onDismiss?: (id: string) => void;
    maxSuggestions?: number;
}

const FollowSuggestions: React.FC<FollowSuggestionsProps> = ({
    suggestions = [],
    onFollow,
    onDismiss,
    maxSuggestions = 5
}) => {
    const [followed, setFollowed] = useState<Set<string>>(new Set());
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    // Mock suggestions for demo
    const mockSuggestions: Suggestion[] = [
        {
            id: "1",
            name: "Apple Store Official",
            type: "merchant",
            address: "0x1234...5678",
            followers: 1250,
            verified: true,
            description: "Official Apple products with NFT receipts and warranty",
            location: "San Francisco, CA",
            rating: 4.9,
            specialties: ["iPhone", "MacBook", "iPad"],
            mutualConnections: 12,
            avatar: "/avatars/apple.jpg"
        },
        {
            id: "2",
            name: "EcoRecycle Hub",
            type: "recycler",
            address: "0x2345...6789",
            followers: 890,
            verified: true,
            description: "Sustainable electronics recycling with environmental impact tracking",
            location: "Austin, TX",
            rating: 4.8,
            specialties: ["Laptops", "Phones", "Tablets"],
            mutualConnections: 8,
            avatar: "/avatars/eco.jpg"
        },
        {
            id: "3",
            name: "TechGadgets Pro",
            type: "merchant",
            address: "0x3456...7890",
            followers: 567,
            verified: false,
            description: "Premium electronics with blockchain verification and extended warranty",
            location: "New York, NY",
            rating: 4.6,
            specialties: ["Gaming", "Audio", "Cameras"],
            mutualConnections: 5,
            avatar: "/avatars/tech.jpg"
        },
        {
            id: "4",
            name: "GreenTech Solutions",
            type: "recycler",
            address: "0x4567...8901",
            followers: 432,
            verified: true,
            description: "Certified e-waste recycling with carbon footprint tracking",
            location: "Seattle, WA",
            rating: 4.7,
            specialties: ["Servers", "Monitors", "Accessories"],
            mutualConnections: 3,
            avatar: "/avatars/green.jpg"
        },
        {
            id: "5",
            name: "Sustainable Living",
            type: "user",
            address: "0x5678...9012",
            followers: 234,
            verified: false,
            description: "Environmental advocate sharing sustainable tech practices",
            location: "Portland, OR",
            rating: 4.5,
            specialties: ["Education", "Community", "Tips"],
            mutualConnections: 15,
            avatar: "/avatars/sustainable.jpg"
        }
    ];

    const displaySuggestions = suggestions.length > 0 ? suggestions : mockSuggestions;
    const filteredSuggestions = displaySuggestions
        .filter(s => !dismissed.has(s.id))
        .slice(0, maxSuggestions);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "merchant":
                return <ShoppingBag className="w-4 h-4 text-brand-primary" />;
            case "recycler":
                return <Recycle className="w-4 h-4 text-brand-secondary" />;
            case "user":
                return <Users className="w-4 h-4 text-brand-accent" />;
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

    const handleFollow = (id: string) => {
        setFollowed(prev => new Set([...prev, id]));
        onFollow?.(id);
    };

    const handleDismiss = (id: string) => {
        setDismissed(prev => new Set([...prev, id]));
        onDismiss?.(id);
    };

    if (filteredSuggestions.length === 0) {
        return (
            <div className="p-6 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No suggestions available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-primary" />
                    Discover New Connections
                </h3>
                <span className="text-sm text-gray-500">
                    {filteredSuggestions.length} suggestions
                </span>
            </div>

            {/* Suggestions List */}
            <div className="space-y-3">
                {filteredSuggestions.map((suggestion, index) => (
                    <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-200 rounded-xl hover:border-brand-primary/30 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-lg">
                                    {suggestion.avatar ? (
                                        <img
                                            src={suggestion.avatar}
                                            alt={suggestion.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        suggestion.name.charAt(0).toUpperCase()
                                    )}
                                </div>

                                {/* Type Badge */}
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${getTypeColor(suggestion.type)}`}>
                                    {getTypeIcon(suggestion.type)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                                {suggestion.name}
                                            </h4>
                                            {suggestion.verified && (
                                                <Shield className="w-4 h-4 text-brand-primary flex-shrink-0" />
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                            {suggestion.description}
                                        </p>

                                        {/* Meta Information */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {suggestion.followers.toLocaleString()} followers
                                            </div>
                                            {suggestion.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {suggestion.location}
                                                </div>
                                            )}
                                            {suggestion.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                    {suggestion.rating}
                                                </div>
                                            )}
                                        </div>

                                        {/* Specialties */}
                                        {suggestion.specialties && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {suggestion.specialties.slice(0, 3).map((specialty) => (
                                                    <span
                                                        key={specialty}
                                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                                    >
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Mutual Connections */}
                                        {suggestion.mutualConnections && suggestion.mutualConnections > 0 && (
                                            <p className="text-xs text-brand-primary font-medium">
                                                {suggestion.mutualConnections} mutual connections
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 ml-4">
                                        {followed.has(suggestion.id) ? (
                                            <div className="flex items-center gap-1 px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm rounded-full">
                                                <CheckCircle className="w-4 h-4" />
                                                Following
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleFollow(suggestion.id)}
                                                className="px-4 py-2 bg-brand-primary text-white text-sm rounded-full hover:bg-brand-primary-dark transition-colors font-medium"
                                            >
                                                Follow
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDismiss(suggestion.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Dismiss"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100">
                <button className="w-full text-center text-sm text-brand-primary hover:text-brand-primary-dark font-medium">
                    View more suggestions
                </button>
            </div>
        </div>
    );
};

export default FollowSuggestions;
