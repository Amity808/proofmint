"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Heart, MapPin, MessageCircle, Star, User, Users } from "lucide-react";

interface MutualConnection {
  id: string;
  address: string;
  ensName?: string;
  avatar?: string;
  name: string;
  type: "merchant" | "recycler" | "user";
  verified: boolean;
  rating: number;
  followers: number;
  location?: string;
  connectionStrength: "strong" | "medium" | "weak";
  mutualCount: number;
  lastInteraction: string;
  commonInterests: string[];
  isFollowing: boolean;
}

interface MutualConnectionsProps {
  connections: MutualConnection[];
  currentUser: string;
  onViewProfile: (userId: string) => void;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onMessage: (userId: string) => void;
  maxDisplay?: number;
  showConnectionStrength?: boolean;
}

const MutualConnections: React.FC<MutualConnectionsProps> = ({
  connections,
  currentUser,
  onViewProfile,
  onFollow,
  onUnfollow,
  onMessage,
  maxDisplay = 6,
  showConnectionStrength = true,
}) => {
  const [showAll, setShowAll] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "merchant":
        return <User className="w-4 h-4 text-brand-primary" />;
      case "recycler":
        return <Heart className="w-4 h-4 text-brand-secondary" />;
      case "user":
        return <Users className="w-4 h-4 text-brand-accent" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
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

  const getConnectionStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "weak":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConnectionStrengthIcon = (strength: string) => {
    switch (strength) {
      case "strong":
        return <Star className="w-3 h-3 fill-current" />;
      case "medium":
        return <Star className="w-3 h-3" />;
      case "weak":
        return <User className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const displayConnections = showAll ? connections : connections.slice(0, maxDisplay);

  if (connections.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Mutual Connections</h3>
        <p className="text-gray-500">You don't have any mutual connections yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Mutual Connections ({connections.length})</h3>
        </div>
        {connections.length > maxDisplay && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-brand-primary hover:text-brand-primary-dark font-medium"
          >
            {showAll ? "Show Less" : `Show All (${connections.length})`}
          </button>
        )}
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayConnections.map((connection, index) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-brand-primary/20 hover:border-brand-primary/30 transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-brand-gradient-primary flex items-center justify-center text-white font-bold">
                  {connection.avatar ? (
                    <img
                      src={connection.avatar}
                      alt={connection.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    connection.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Type Badge */}
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${getTypeColor(connection.type)}`}
                >
                  {getTypeIcon(connection.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{connection.name}</h4>
                      {connection.verified && (
                        <div className="w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{connection.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{connection.followers}</span>
                      </div>
                    </div>

                    {/* Connection Strength */}
                    {showConnectionStrength && (
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConnectionStrengthColor(connection.connectionStrength)}`}
                        >
                          {getConnectionStrengthIcon(connection.connectionStrength)}
                          {connection.connectionStrength}
                        </div>
                        <span className="text-xs text-gray-500">{connection.mutualCount} mutual</span>
                      </div>
                    )}

                    {/* Common Interests */}
                    {connection.commonInterests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {connection.commonInterests.slice(0, 2).map(interest => (
                          <span key={interest} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {interest}
                          </span>
                        ))}
                        {connection.commonInterests.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{connection.commonInterests.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Last Interaction */}
                    <p className="text-xs text-gray-400">Last interaction: {connection.lastInteraction}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => onViewProfile(connection.id)}
                    className="flex-1 px-3 py-1 text-sm text-brand-primary hover:text-brand-primary-dark font-medium"
                  >
                    View Profile
                  </button>

                  {connection.isFollowing ? (
                    <button
                      onClick={() => onUnfollow(connection.id)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      onClick={() => onFollow(connection.id)}
                      className="px-3 py-1 bg-brand-primary text-white text-sm rounded-lg hover:bg-brand-primary-dark transition-colors"
                    >
                      Follow
                    </button>
                  )}

                  <button
                    onClick={() => onMessage(connection.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Send Message"
                  >
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show More Button */}
      {!showAll && connections.length > maxDisplay && (
        <div className="text-center pt-4">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors font-medium"
          >
            View All {connections.length} Mutual Connections
          </button>
        </div>
      )}
    </div>
  );
};

export default MutualConnections;
