"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Bell, ChevronDown, Heart, LogOut, Recycle, Settings, Shield, User, Users } from "lucide-react";
import { useAccount } from "wagmi";

interface ProfileDropdownProps {
  userAddress?: string;
  ensName?: string;
  avatar?: string;
  stats?: {
    receipts: number;
    recycled: number;
    followers: number;
    following: number;
  };
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  userAddress,
  ensName,
  avatar,
  stats = { receipts: 0, recycled: 0, followers: 0, following: 0 },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "suggestions">("profile");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}` || "Anonymous";

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
    { id: "suggestions", label: "Discover", icon: Users },
  ];

  const profileActions = [
    { label: "View Profile", icon: User, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Sign Out", icon: LogOut, action: "logout" },
  ];

  const notifications = [
    {
      id: 1,
      type: "receipt",
      title: "New Receipt Generated",
      message: "iPhone 15 Pro receipt #1234 has been minted",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "recycling",
      title: "Recycling Reward",
      message: "You earned 50 tokens for recycling your old laptop",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "follow",
      title: "New Follower",
      message: "TechRecycler started following you",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const suggestions = [
    {
      id: 1,
      name: "Apple Store",
      type: "merchant",
      followers: 1250,
      verified: true,
      description: "Official Apple products with NFT receipts",
    },
    {
      id: 2,
      name: "EcoRecycle Hub",
      type: "recycler",
      followers: 890,
      verified: true,
      description: "Sustainable electronics recycling",
    },
    {
      id: 3,
      name: "TechGadgets Pro",
      type: "merchant",
      followers: 567,
      verified: false,
      description: "Premium electronics with blockchain verification",
    },
  ];

  const handleAction = (action: string) => {
    if (action === "logout") {
      // Handle logout logic
      console.log("Logging out...");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-brand-primary/20 hover:bg-white hover:shadow-brand-primary transition-all duration-200"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-brand-gradient-primary flex items-center justify-center text-white font-semibold">
          {avatar ? (
            <img src={avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>

        {/* User Info */}
        <div className="text-left">
          <p className="font-semibold text-gray-900 text-sm">{displayName}</p>
          <p className="text-xs text-gray-500">ProofMint User</p>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-brand-primary border border-brand-primary/20 overflow-hidden z-50"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-100">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === item.id
                      ? "text-brand-primary bg-brand-primary/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-error text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-h-96 overflow-y-auto">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="p-4 space-y-4">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-brand-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                      {avatar ? (
                        <img src={avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{displayName}</h3>
                      <p className="text-sm text-gray-600">Sustainable Electronics Enthusiast</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Shield className="w-4 h-4 text-brand-primary" />
                        <span className="text-xs text-brand-primary font-medium">Verified User</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-primary">{stats.receipts}</div>
                      <div className="text-xs text-gray-600">NFT Receipts</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-secondary">{stats.recycled}</div>
                      <div className="text-xs text-gray-600">Items Recycled</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-brand-accent">{stats.followers}</div>
                      <div className="text-xs text-gray-600">Followers</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{stats.following}</div>
                      <div className="text-xs text-gray-600">Following</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    {profileActions.map(action => (
                      <button
                        key={action.label}
                        onClick={() => (action.action ? handleAction(action.action) : null)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <action.icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <button className="text-sm text-brand-primary hover:text-brand-primary-dark">
                      Mark all as read
                    </button>
                  </div>

                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        notification.unread
                          ? "bg-brand-primary/5 border-brand-primary/20"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? "bg-brand-primary" : "bg-gray-300"
                          }`}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions Tab */}
              {activeTab === "suggestions" && (
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-gray-900 mb-4">Discover New Connections</h3>

                  {suggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-brand-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold">
                          {suggestion.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{suggestion.name}</h4>
                            {suggestion.verified && <Shield className="w-4 h-4 text-brand-primary" />}
                          </div>
                          <p className="text-xs text-gray-600">{suggestion.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">
                              <Users className="w-3 h-3 inline mr-1" />
                              {suggestion.followers} followers
                            </span>
                            <span className="text-xs text-gray-500 capitalize">{suggestion.type}</span>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-brand-primary text-white text-xs rounded-full hover:bg-brand-primary-dark transition-colors">
                          Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
