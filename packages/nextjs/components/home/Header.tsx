import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaReceipt,
  FaRecycle,
  FaStore,
  FaUsers,
  FaCompass,
  FaChartLine,
  FaWallet
} from "react-icons/fa";
import { useAccount, useEnsName, useEnsAvatar } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ProfileDropdown from "~~/components/common/ProfileDropdown";
import NotificationBell from "~~/components/common/NotificationBell";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { address, isConnected } = useAccount();

  // ENS integration
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined });

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    },
  };

  const searchVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: { duration: 0.15 }
    }
  };

  const navigationItems = [
    {
      to: "/marketplace",
      label: "Marketplace",
      icon: FaStore,
      description: "Browse & buy electronics"
    },
    {
      to: "/discover",
      label: "Discover",
      icon: FaCompass,
      description: "Find new products"
    },
    {
      to: "/social",
      label: "Social",
      icon: FaUsers,
      description: "Connect with community"
    },
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: FaChartLine,
      description: "Your receipts & stats"
    },
    {
      to: "/recycling",
      label: "Recycling",
      icon: FaRecycle,
      description: "Sustainable disposal"
    }
  ];

  const userStats = {
    receipts: 12,
    recycled: 5,
    followers: 23,
    following: 18,
    reputation: 850
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group" aria-label="ProofMint Home">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <div className="text-white text-lg">
                  <FaReceipt />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent rounded-full animate-pulse"></div>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ProofMint
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Blockchain Receipts</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <motion.div
                key={item.to}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={item.to}
                  className="group relative px-4 py-2 rounded-lg text-gray-700 hover:text-brand-primary hover:bg-brand-primary/5 transition-all duration-200 flex items-center space-x-2"
                >
                  <div className="w-4 h-4">
                    <item.icon />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-200"></div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <motion.button
              onClick={toggleSearch}
              className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Search"
            >
              <div className="w-5 h-5">
                <FaSearch />
              </div>
            </motion.button>

            {/* User Actions */}
            {isConnected ? (
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <NotificationBell />

                {/* Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {ensAvatar ? (
                      <img
                        src={ensAvatar}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-brand-primary/20"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center">
                        <div className="text-white text-sm">
                          <FaUser />
                        </div>
                      </div>
                    )}
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userStats.reputation} reputation
                      </p>
                    </div>
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {ensName || "Anonymous User"}
                          </p>
                          <p className="text-xs text-gray-500">{address}</p>
                        </div>

                        <div className="py-2">
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={toggleProfile}
                          >
                            <div className="w-4 h-4 mr-3">
                              <FaUser />
                            </div>
                            Profile Settings
                          </Link>
                          <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={toggleProfile}
                          >
                            <div className="w-4 h-4 mr-3">
                              <FaChartLine />
                            </div>
                            Dashboard
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={toggleProfile}
                          >
                            <div className="w-4 h-4 mr-3">
                              <FaCog />
                            </div>
                            Settings
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 py-2">
                          <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <div className="w-4 h-4 mr-3">
                              <FaSignOutAlt />
                            </div>
                            Disconnect Wallet
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal, mounted }) => {
                  return (
                    <motion.button
                      onClick={openConnectModal}
                      className="px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-4 h-4">
                        <FaWallet />
                      </div>
                      <span>Connect Wallet</span>
                    </motion.button>
                  );
                }}
              </ConnectButton.Custom>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40"
              variants={searchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
                    <FaSearch />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products, merchants, or receipts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-4 py-6 space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    href={item.to}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    onClick={toggleMobileMenu}
                  >
                    <div className="w-5 h-5 text-gray-500 group-hover:text-brand-primary">
                      <item.icon />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </Link>
                ))}

                {!isConnected && (
                  <div className="pt-4 border-t border-gray-200">
                    <ConnectButton.Custom>
                      {({ openConnectModal }) => (
                        <button
                          onClick={openConnectModal}
                          className="w-full px-4 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <div className="w-4 h-4">
                            <FaWallet />
                          </div>
                          <span>Connect Wallet</span>
                        </button>
                      )}
                    </ConnectButton.Custom>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
