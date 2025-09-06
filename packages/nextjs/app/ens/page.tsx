"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import ENSAvatar from "~~/components/ens/ENSAvatar";
import ENSPaymentRouter from "~~/components/ens/ENSPaymentRouter";
import ENSProfileCard from "~~/components/ens/ENSProfileCard";
import ENSSubnameManager from "~~/components/ens/ENSSubnameManager";
import ENSVerificationBadge from "~~/components/ens/ENSVerificationBadge";
import Footer from "~~/components/home/Footer";
import Header from "~~/components/home/Header";
import { useENSValidation } from "~~/hooks/useENSProfile";

const ENSPage: React.FC = () => {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"overview" | "merchants" | "recyclers" | "payments">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const { isValid, error, validateName } = useENSValidation();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    validateName(value);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">ENS Integration</h1>
            <p className="text-gray-600 mb-6">Connect your wallet to access ENS features</p>
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
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ENS Integration
              </span>
            </h1>
            <p className="text-lg text-gray-600">Enhanced identity and verification for ProofMint ecosystem</p>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview" },
                { id: "merchants", label: "Merchants" },
                { id: "recyclers", label: "Recyclers" },
                { id: "payments", label: "Payments" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* ENS Search */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search ENS Profile</h3>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => handleSearchChange(e.target.value)}
                    placeholder="Enter ENS name (e.g., merchant.proofmint.eth)"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      searchQuery && !isValid ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                  {isValid && searchQuery && <p className="mt-2 text-sm text-green-600">✓ Valid ENS name format</p>}
                </div>
                <button
                  disabled={!isValid || !searchQuery}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Search
                </button>
              </div>
            </div>

            {/* ENS Profile Display */}
            {searchQuery && isValid && <ENSProfileCard name={searchQuery} type="general" showTextRecords={true} />}

            {/* Your ENS Profile */}
            {isConnected && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your ENS Profile</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <ENSAvatar size="lg" showName={true} />
                    <div>
                      <p className="text-sm text-gray-500">
                        {address ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
                      </p>
                      <Link href="/profile" className="text-blue-600 hover:text-blue-800 font-medium">
                        Go to Profile →
                      </Link>
                    </div>
                  </div>
                  <ENSVerificationBadge type="general" showDetails={true} />
                </div>
              </div>
            )}

            {/* Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification</h3>
                <p className="text-gray-600">
                  Verify merchants and recyclers through ENS text records for enhanced trust and security.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Subnames</h3>
                <p className="text-gray-600">
                  Create professional subnames like merchant.proofmint.eth for better brand identity.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payments</h3>
                <p className="text-gray-600">
                  Send payments using human-readable ENS names instead of complex wallet addresses.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Merchants Tab */}
        {activeTab === "merchants" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Merchant ENS Management</h3>
              <p className="text-gray-600 mb-6">
                Create and manage ENS profiles for merchants to enhance trust and verification.
              </p>
              <ENSSubnameManager type="merchant" />
            </div>
          </div>
        )}

        {/* Recyclers Tab */}
        {activeTab === "recyclers" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recycler ENS Management</h3>
              <p className="text-gray-600 mb-6">
                Create and manage ENS profiles for recyclers to showcase certifications and services.
              </p>
              <ENSSubnameManager type="recycler" />
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ENS Payment Router</h3>
              <p className="text-gray-600 mb-6">
                Send payments using ENS names for better user experience and cross-border coordination.
              </p>
              <ENSPaymentRouter />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ENSPage;
