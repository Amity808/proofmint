"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
    CreditCard,
    Clock,
    Check,
    Star,
    Crown,
    Building,
    AlertTriangle,
    Calendar,
    DollarSign
} from "lucide-react";

interface SubscriptionManagerProps {
    onSubscriptionUpdate?: () => void;
}

enum SubscriptionTier {
    Basic = 0,
    Premium = 1,
    Enterprise = 2
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ onSubscriptionUpdate }) => {
    const { address } = useAccount();
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SubscriptionTier.Basic);
    const [selectedDuration, setSelectedDuration] = useState<number>(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRenewal, setShowRenewal] = useState(false);

    // Smart contract hooks
    const { writeContractAsync: writeProofMintAsync } = useScaffoldWriteContract({
        contractName: "ProofMint"
    });

    // Read current subscription
    const { data: subscription, refetch: refetchSubscription } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "getSubscription",
        args: [address],
    });

    // Read subscription pricing (in USDC)
    const { data: subscriptionPricing } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "getSubscriptionPricing",
    });

    // Check if user is a verified merchant
    const { data: isMerchant } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "isVerifiedMerchant",
        args: [address],
    });

    // Check if user can issue receipts
    const { data: canIssueReceipts } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "canIssueReceipts",
        args: [address],
    });

    // ETH prices for subscription tiers (in ETH)
    const ETH_PRICES = {
        [SubscriptionTier.Basic]: "0.01", // Example prices
        [SubscriptionTier.Premium]: "0.025",
        [SubscriptionTier.Enterprise]: "0.05"
    };

    // Get tier details
    const getTierDetails = (tier: SubscriptionTier) => {
        const details = {
            [SubscriptionTier.Basic]: {
                name: "Basic",
                icon: <CreditCard className="w-6 h-6" />,
                color: "blue",
                features: ["Up to 50 receipts/month", "Basic analytics", "Email support"],
                receiptsLimit: 50
            },
            [SubscriptionTier.Premium]: {
                name: "Premium", 
                icon: <Star className="w-6 h-6" />,
                color: "purple",
                features: ["Up to 200 receipts/month", "Advanced analytics", "Priority support", "Custom branding"],
                receiptsLimit: 200
            },
            [SubscriptionTier.Enterprise]: {
                name: "Enterprise",
                icon: <Crown className="w-6 h-6" />,
                color: "gold",
                features: ["Unlimited receipts", "Full analytics suite", "24/7 support", "API access", "White labeling"],
                receiptsLimit: "Unlimited"
            }
        };
        return details[tier];
    };

    // Calculate total price
    const calculatePrice = (tier: SubscriptionTier, duration: number) => {
        const monthlyPrice = parseEther(ETH_PRICES[tier]);
        const totalPrice = monthlyPrice * BigInt(duration);
        
        // Apply 10% discount for yearly subscriptions
        if (duration === 12) {
            return (totalPrice * BigInt(90)) / BigInt(100);
        }
        return totalPrice;
    };

    // Check if subscription is expired
    const isSubscriptionExpired = () => {
        if (!subscription || !subscription[1]) return true;
        const expirationTime = Number(subscription[1]) * 1000;
        return Date.now() > expirationTime;
    };

    // Check if subscription expires soon (within 7 days)
    const isSubscriptionExpiringSoon = () => {
        if (!subscription || !subscription[1]) return false;
        const expirationTime = Number(subscription[1]) * 1000;
        const sevenDaysFromNow = Date.now() + (7 * 24 * 60 * 60 * 1000);
        return expirationTime < sevenDaysFromNow && expirationTime > Date.now();
    };

    // Handle subscription purchase
    const handlePurchaseSubscription = async () => {
        if (!isMerchant) {
            toast.error("You must be a verified merchant to purchase a subscription");
            return;
        }

        if (!writeProofMintAsync) {
            toast.error("Contract not available");
            return;
        }

        setIsProcessing(true);
        try {
            const totalPrice = calculatePrice(selectedTier, selectedDuration);
            
            toast.loading("Processing subscription purchase...", { id: "subscription" });

            const result = await writeProofMintAsync({
                functionName: "purchaseSubscription",
                args: [selectedTier, selectedDuration],
                value: totalPrice
            });

            console.log("Subscription purchased successfully:", result);
            toast.success(`Subscription purchased successfully! Transaction: ${result}`, { id: "subscription" });
            
            // Refresh subscription data
            await refetchSubscription();
            onSubscriptionUpdate?.();
            
        } catch (error) {
            console.error("Error purchasing subscription:", error);
            toast.error("Failed to purchase subscription. Please try again.", { id: "subscription" });
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle subscription renewal
    const handleRenewSubscription = async () => {
        if (!isMerchant) {
            toast.error("You must be a verified merchant to renew subscription");
            return;
        }

        if (!writeProofMintAsync || !subscription) {
            toast.error("Contract not available or no existing subscription");
            return;
        }

        setIsProcessing(true);
        try {
            const currentTier = subscription[0] as SubscriptionTier;
            const totalPrice = calculatePrice(currentTier, selectedDuration);
            
            toast.loading("Processing subscription renewal...", { id: "renewal" });

            const result = await writeProofMintAsync({
                functionName: "renewSubscription",
                args: [selectedDuration],
                value: totalPrice
            });

            console.log("Subscription renewed successfully:", result);
            toast.success(`Subscription renewed successfully! Transaction: ${result}`, { id: "renewal" });
            
            // Refresh subscription data
            await refetchSubscription();
            onSubscriptionUpdate?.();
            setShowRenewal(false);
            
        } catch (error) {
            console.error("Error renewing subscription:", error);
            toast.error("Failed to renew subscription. Please try again.", { id: "renewal" });
        } finally {
            setIsProcessing(false);
        }
    };

    // Show renewal modal if subscription is expired or expiring soon
    useEffect(() => {
        if (subscription && (isSubscriptionExpired() || isSubscriptionExpiringSoon())) {
            setShowRenewal(true);
        }
    }, [subscription]);

    if (!isMerchant) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Merchant Verification Required
                </h3>
                <p className="text-gray-600">
                    You need to be a verified merchant to manage subscriptions.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Subscription Status Alert */}
            {subscription && (isSubscriptionExpired() || isSubscriptionExpiringSoon()) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border-l-4 ${
                        isSubscriptionExpired() 
                            ? 'bg-red-50 border-red-400 text-red-700' 
                            : 'bg-yellow-50 border-yellow-400 text-yellow-700'
                    }`}
                >
                    <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <div>
                            <p className="font-medium">
                                {isSubscriptionExpired() 
                                    ? 'Subscription Expired' 
                                    : 'Subscription Expiring Soon'}
                            </p>
                            <p className="text-sm">
                                {isSubscriptionExpired() 
                                    ? 'Your subscription has expired. Renew now to continue issuing receipts.'
                                    : `Your subscription expires on ${new Date(Number(subscription[1]) * 1000).toLocaleDateString()}.`}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Current Subscription Status */}
            {subscription && subscription[4] && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        Current Subscription
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="font-semibold text-gray-900">
                                {getTierDetails(subscription[0] as SubscriptionTier).name}
                            </div>
                            <div className="text-sm text-gray-600">Current Tier</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="font-semibold text-gray-900">
                                {new Date(Number(subscription[1]) * 1000).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">Expires</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="font-semibold text-gray-900">
                                {subscription[2]?.toString() || 0}
                            </div>
                            <div className="text-sm text-gray-600">Receipts Used</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subscription Plans */}
            {(!subscription || !subscription[4] || isSubscriptionExpired()) && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Your Plan</h3>
                    
                    {/* Tier Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {Object.values(SubscriptionTier).filter(value => typeof value === 'number').map((tier) => {
                            const tierInfo = getTierDetails(tier as SubscriptionTier);
                            const isSelected = selectedTier === tier;
                            
                            return (
                                <div
                                    key={tier}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        isSelected 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSelectedTier(tier as SubscriptionTier)}
                                >
                                    <div className="text-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                            isSelected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {tierInfo.icon}
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">{tierInfo.name}</h4>
                                        <p className="text-lg font-bold text-gray-900 mb-3">
                                            {formatEther(parseEther(ETH_PRICES[tier as SubscriptionTier]))} ETH
                                            <span className="text-sm text-gray-600 font-normal">/month</span>
                                        </p>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {tierInfo.features.map((feature, index) => (
                                                <li key={index} className="flex items-center justify-center gap-1">
                                                    <Check className="w-3 h-3 text-green-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Duration Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Subscription Duration
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[1, 3, 6, 12].map((duration) => (
                                <button
                                    key={duration}
                                    onClick={() => setSelectedDuration(duration)}
                                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                                        selectedDuration === duration
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="font-semibold">
                                        {duration} month{duration > 1 ? 's' : ''}
                                    </div>
                                    {duration === 12 && (
                                        <div className="text-xs text-green-600 font-medium">10% OFF</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">
                                {getTierDetails(selectedTier).name} × {selectedDuration} month{selectedDuration > 1 ? 's' : ''}
                            </span>
                            <span className="font-semibold text-gray-900">
                                {formatEther(calculatePrice(selectedTier, selectedDuration))} ETH
                            </span>
                        </div>
                        {selectedDuration === 12 && (
                            <div className="text-sm text-green-600 mt-1">
                                Yearly discount applied (10% off)
                            </div>
                        )}
                    </div>

                    {/* Purchase Button */}
                    <button
                        onClick={handlePurchaseSubscription}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" />
                                Purchase Subscription
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Renewal Modal */}
            {showRenewal && subscription && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-green-600" />
                                Renew Subscription
                            </h3>
                            <button
                                onClick={() => setShowRenewal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">Current Plan</div>
                                <div className="font-semibold text-gray-900">
                                    {getTierDetails(subscription[0] as SubscriptionTier).name}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Renewal Duration
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[1, 3, 6, 12].map((duration) => (
                                        <button
                                            key={duration}
                                            onClick={() => setSelectedDuration(duration)}
                                            className={`p-2 rounded-lg border text-center ${
                                                selectedDuration === duration
                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {duration} month{duration > 1 ? 's' : ''}
                                            {duration === 12 && <div className="text-xs text-green-600">10% OFF</div>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Total Cost</span>
                                    <span className="font-semibold text-gray-900">
                                        {formatEther(calculatePrice(subscription[0] as SubscriptionTier, selectedDuration))} ETH
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleRenewSubscription}
                                    disabled={isProcessing}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Renewing...
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="w-4 h-4" />
                                            Renew Now
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowRenewal(false)}
                                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionManager;