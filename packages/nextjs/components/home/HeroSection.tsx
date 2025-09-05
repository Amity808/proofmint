import Link from "next/link";
import proofmint from "~~/components/assets/proofmint.png";
import { motion } from "framer-motion";
import { ArrowRight, Recycle, Shield, Zap } from "lucide-react";
import { useAccount } from "wagmi";

const HeroSection = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 8px 25px rgba(34, 197, 94, 0.25)" },
    tap: { scale: 0.95 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const { isConnected } = useAccount();

  return (
    <section className="relative pt-20 lg:pt-32 bg-gradient-to-br from-slate-50 via-green-50/50 to-blue-50/50 min-h-screen flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
        <div className="w-96 h-96 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12">
        <div className="w-96 h-96 bg-gradient-to-tr from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mb-6"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <Zap className="w-4 h-4" />
              Powered by Blockchain Technology
            </motion.div>

            <motion.h1
              className="font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              The Future of{" "}
              <span className="brand-gradient-multi bg-clip-text text-transparent">
                Digital Receipts
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              Buy electronics with blockchain-verified NFT receipts. Track authenticity, enable recycling, and earn
              rewards through ProofMint's sustainable ecosystem.
            </motion.p>

            {/* Features */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-100">
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <Shield className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Verified</p>
                  <p className="text-xs text-gray-600">Authentic products</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-100">
                <div className="p-2 bg-brand-secondary/10 rounded-lg">
                  <Recycle className="w-5 h-5 text-brand-secondary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Sustainable</p>
                  <p className="text-xs text-gray-600">Earn from recycling</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-100">
                <div className="p-2 bg-brand-accent/10 rounded-lg">
                  <Zap className="w-5 h-5 text-brand-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Fast</p>
                  <p className="text-xs text-gray-600">Lightning speed</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <Link href={isConnected ? "/dashboard" : "/marketplace"}>
                <motion.button
                  className="group inline-flex items-center gap-2 px-8 py-4 brand-gradient-primary text-white rounded-xl font-semibold hover-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all shadow-brand-primary"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isConnected ? "Go to Dashboard" : "Start Shopping"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href="/how-it-works">
                <motion.button
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-semibold border border-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            {isConnected && (
              <motion.div
                className="mt-8 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-gray-600 mb-2">Connected to Blockchain Network</p>
                <p className="text-xs text-gray-500 font-mono">Contract: 0x045962...5c55c</p>
              </motion.div>
            )}
          </div>

          {/* Right Column - Image */}
          <motion.div
            className="flex justify-center lg:justify-end"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl blur-xl"></div>
              <img
                src={proofmint.src}
                alt="ProofMint dashboard displaying blockchain-powered NFT receipts and gadget lifecycle tracking"
                className="relative w-full max-w-lg h-auto rounded-xl shadow-2xl shadow-black/10 border border-white/20"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
