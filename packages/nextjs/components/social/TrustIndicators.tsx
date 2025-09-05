"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Shield,
    CheckCircle,
    AlertCircle,
    Star,
    Users,
    Award,
    TrendingUp,
    Clock,
    Zap,
    Heart
} from "lucide-react";

interface TrustScore {
    overall: number;
    verification: number;
    reputation: number;
    activity: number;
    community: number;
}

interface TrustIndicatorsProps {
    trustScore: TrustScore;
    verified: boolean;
    badges: Array<{
        id: string;
        name: string;
        description: string;
        type: "verification" | "achievement" | "reputation" | "community";
        level: "bronze" | "silver" | "gold" | "platinum";
        icon: string;
    }>;
    rating: number;
    reviewCount: number;
    joinDate: string;
    lastActive: string;
    showDetails?: boolean;
    variant?: "compact" | "full" | "minimal";
}

const TrustIndicators: React.FC<TrustIndicatorsProps> = ({
    trustScore,
    verified,
    badges,
    rating,
    reviewCount,
    joinDate,
    lastActive,
    showDetails = true,
    variant = "full"
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-600";
        if (score >= 70) return "text-blue-600";
        if (score >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 90) return "bg-green-100";
        if (score >= 70) return "bg-blue-100";
        if (score >= 50) return "bg-yellow-100";
        return "bg-red-100";
    };

    const getScoreLevel = (score: number) => {
        if (score >= 90) return "Excellent";
        if (score >= 70) return "Good";
        if (score >= 50) return "Fair";
        return "Poor";
    };

    const getBadgeColor = (level: string) => {
        switch (level) {
            case "platinum":
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300";
            case "gold":
                return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
            case "silver":
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300";
            case "bronze":
                return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const getBadgeIcon = (type: string) => {
        switch (type) {
            case "verification":
                return <Shield className="w-4 h-4" />;
            case "achievement":
                return <Award className="w-4 h-4" />;
            case "reputation":
                return <Star className="w-4 h-4" />;
            case "community":
                return <Users className="w-4 h-4" />;
            default:
                return <Award className="w-4 h-4" />;
        }
    };

    if (variant === "minimal") {
        return (
            <div className="flex items-center gap-2">
                {verified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        Verified
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{rating}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(trustScore.overall)} ${getScoreColor(trustScore.overall)}`}>
                    {trustScore.overall}% Trust
                </div>
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {verified && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium">
                                <Shield className="w-3 h-3" />
                                Verified
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-gray-900">{rating}</span>
                            <span className="text-xs text-gray-500">({reviewCount})</span>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(trustScore.overall)} ${getScoreColor(trustScore.overall)}`}>
                        {trustScore.overall}% Trust
                    </div>
                </div>

                <div className="flex flex-wrap gap-1">
                    {badges.slice(0, 3).map((badge) => (
                        <div
                            key={badge.id}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(badge.level)}`}
                        >
                            {getBadgeIcon(badge.type)}
                            {badge.name}
                        </div>
                    ))}
                    {badges.length > 3 && (
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{badges.length - 3} more
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overall Trust Score */}
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-brand-primary/20">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Trust Score</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(trustScore.overall)} ${getScoreColor(trustScore.overall)}`}>
                        {getScoreLevel(trustScore.overall)}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Overall Score</span>
                            <span className="font-medium">{trustScore.overall}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div
                                className={`h-3 rounded-full ${getScoreBgColor(trustScore.overall)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${trustScore.overall}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                            />
                        </div>
                    </div>

                    {showDetails && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Verification</span>
                                    <span className="font-medium">{trustScore.verification}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${getScoreBgColor(trustScore.verification)}`} style={{ width: `${trustScore.verification}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Reputation</span>
                                    <span className="font-medium">{trustScore.reputation}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${getScoreBgColor(trustScore.reputation)}`} style={{ width: `${trustScore.reputation}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Activity</span>
                                    <span className="font-medium">{trustScore.activity}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${getScoreBgColor(trustScore.activity)}`} style={{ width: `${trustScore.activity}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Community</span>
                                    <span className="font-medium">{trustScore.community}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${getScoreBgColor(trustScore.community)}`} style={{ width: `${trustScore.community}%` }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Rating and Reviews */}
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-brand-primary/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating & Reviews</h3>
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{rating}</div>
                        <div className="flex items-center justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.floor(rating)
                                            ? "text-yellow-500 fill-current"
                                            : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{reviewCount} reviews</div>
                    </div>
                    <div className="flex-1">
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = Math.floor(Math.random() * 20); // Mock data
                                const percentage = (count / reviewCount) * 100;
                                return (
                                    <div key={star} className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 w-8">{star}</span>
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-8">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-brand-primary/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border ${getBadgeColor(badge.level)}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/50 rounded-lg">
                                    {getBadgeIcon(badge.type)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{badge.name}</h4>
                                    <p className="text-sm text-gray-600">{badge.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Activity Info */}
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-brand-primary/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                            <div className="text-sm text-gray-600">Joined</div>
                            <div className="font-medium text-gray-900">{joinDate}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-gray-500" />
                        <div>
                            <div className="text-sm text-gray-600">Last Active</div>
                            <div className="font-medium text-gray-900">{lastActive}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustIndicators;
