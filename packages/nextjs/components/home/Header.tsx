import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import ProfileDropdown from "~~/components/common/ProfileDropdown";
import NotificationBell from "~~/components/common/NotificationBell";
import { useAccount } from "wagmi";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address, isConnected } = useAccount();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-50 to-gray-100 backdrop-blur-lg shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="ProofMint Home">
            {/* <motion.span
              className="material-symbols-outlined text-green-600 text-2xl"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              receipt_long
            </motion.span> */}
            <h1 className="text-xl font-bold text-gray-900">ProofMint</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { to: "/marketplace", label: "Marketplace" },
              { to: "/discover", label: "Discover" },
              { to: "/social", label: "Social" },
              { to: "/nft-receipts", label: "NFT Receipts" },
              { to: "/recycling", label: "Recycling" },
              { to: "/track", label: "Track Items" },
              { to: "/dashboard", label: "Dashboard" }, // Role-based dashboard link
            ].map(item => (
              <motion.div key={item.to} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href={item.to} className="text-gray-700 hover:text-brand-primary font-medium transition-colors">
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA and Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {/* User Actions - Only show when connected */}
            {isConnected ? (
              <>
                <NotificationBell />
                <ProfileDropdown
                  userAddress={address}
                  stats={{
                    receipts: 12,
                    recycled: 5,
                    followers: 23,
                    following: 18
                  }}
                />
              </>
            ) : (
              <Link href="/dashboard">
                <motion.button
                  className="px-6 py-2 brand-gradient-primary text-white rounded-full text-base font-semibold hover-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors shadow-brand-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Get started with ProofMint"
                >
                  Get Started
                </motion.button>
              </Link>
            )}

            <button
              className="md:hidden text-gray-700"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden flex flex-col items-center space-y-4 mt-4 pb-4 bg-gray-50 rounded-lg"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {[
                { to: "/marketplace", label: "Marketplace" },
                { to: "/discover", label: "Discover" },
                { to: "/social", label: "Social" },
                { to: "/nft-receipts", label: "NFT Receipts" },
                { to: "/recycling", label: "Recycling" },
                { to: "/track", label: "Track Items" },
                { to: "/dashboard", label: "Dashboard" }, // Added dashboard link for mobile
              ].map(item => (
                <Link
                  key={item.to}
                  href={item.to}
                  className="text-gray-700 hover:text-brand-primary font-medium"
                  onClick={toggleMobileMenu} // Close menu on link click
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
