"use client";

import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { Filter, MapPin, Search, Shield, Star, TrendingUp, Users } from "lucide-react";
import { useAccount } from "wagmi";
import FollowSuggestions from "~~/components/common/FollowSuggestions";
import Footer from "~~/components/home/Footer";
import Header from "~~/components/home/Header";

const Discover: React.FC = () => {
  const { isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "merchant" | "recycler" | "user">("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const locations = ["all", "San Francisco, CA", "Austin, TX", "New York, NY", "Seattle, WA", "Portland, OR"];

  const handleFollow = (id: string) => {
    console.log("Following user:", id);
    // TODO: Implement follow functionality
  };

  const handleDismiss = (id: string) => {
    console.log("Dismissing suggestion:", id);
    // TODO: Implement dismiss functionality
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Discover Community</h1>
            <p className="text-gray-600 mb-6">Connect your wallet to discover merchants, recyclers, and users</p>
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
              <span className="brand-gradient-multi bg-clip-text text-transparent">Discover Community</span>
            </h1>
            <p className="text-lg text-gray-600">Connect with merchants, recyclers, and sustainable tech enthusiasts</p>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-brand-primary/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-brand-primary border border-brand-primary/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search People & Organizations</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name, description, or location..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="merchant">Merchants</option>
                <option value="recycler">Recyclers</option>
                <option value="user">Users</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </option>
                ))}
              </select>
            </div>
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
                <p className="text-sm text-gray-600">Verified Merchants</p>
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
                <TrendingUp className="w-6 h-6 text-brand-accent" />
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

        {/* Follow Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-brand-primary border border-brand-primary/20 p-6"
        >
          <FollowSuggestions onFollow={handleFollow} onDismiss={handleDismiss} maxSuggestions={10} />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Discover;
