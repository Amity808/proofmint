"use client";

import React, { useState, useEffect, useCallback } from "react";
import StatusBadge from "./StatusBadge";
import { fetchIPFSData } from "~~/utils/fetchIpfs";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import toast from "react-hot-toast";

interface ReceiptCardProps {
    id: string;
    onViewDetails?: (id: string) => void;
    onGenerateQR?: (id: string) => void;
    onUpdateStatus?: (id: string, status: number) => void;
}

interface ContractReceipt {
    id: bigint;
    merchant: string;
    buyer: string;
    ipfsHash: string;
    timestamp: bigint;
    gadgetStatus: number;
    lastStatusUpdate: bigint;
}

interface IPFSMetadata {
    recipt: string;
    description: string;
    image: string;
    serial_number: string;
    ens?: string;
    price?: string;
    category?: string;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({
    id,
    onViewDetails,
    onGenerateQR,
    onUpdateStatus
}) => {
    const [contractReceipt, setContractReceipt] = useState<ContractReceipt | null>(null);
    const [ipfsMetadata, setIpfsMetadata] = useState<IPFSMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFlagging, setIsFlagging] = useState(false);

    // Fetch receipt data from smart contract
    const { data: receiptData } = useScaffoldReadContract({
        contractName: "ProofMint",
        functionName: "getReceipt",
        args: [id]
    });

    // Write contract hook for flagging
    const { writeContractAsync: writeProofMintAsync } = useScaffoldWriteContract({
        contractName: "ProofMint"
    });
    console.log(receiptData)

    // Format contract data
    const formatContractData = useCallback(async () => {
        if (!receiptData) {
            console.error("receiptData is empty or invalid:", receiptData);
            return;
        }

        // receiptData is an object with struct properties, not an array
        const { id, merchant, buyer, ipfsHash, timestamp, gadgetStatus, lastStatusUpdate } = receiptData;

        console.log("Formatted contract receipt:", {
            id, merchant, buyer, ipfsHash, timestamp, gadgetStatus, lastStatusUpdate
        });

        setContractReceipt({
            id: id as bigint,
            merchant: merchant as string,
            buyer: buyer as string,
            ipfsHash: ipfsHash as string,
            timestamp: timestamp as bigint,
            gadgetStatus: gadgetStatus as number,
            lastStatusUpdate: lastStatusUpdate as bigint
        });
    }, [receiptData]);

    // Fetch IPFS metadata
    const fetchIPFSMetadata = useCallback(async () => {
        if (!contractReceipt?.ipfsHash) return;

        try {
            setIsLoading(true);
            console.log("Fetching IPFS data with hash:", contractReceipt.ipfsHash);
            // fetchIPFSData already handles the ipfs:// prefix replacement
            const data = await fetchIPFSData(contractReceipt.ipfsHash);
            console.log("IPFS data fetched:", data);
            setIpfsMetadata(data);
        } catch (error) {
            console.error('Error fetching IPFS metadata:', error);
        } finally {
            setIsLoading(false);
        }
    }, [contractReceipt?.ipfsHash]);
    console.log(contractReceipt, "contract")

    useEffect(() => {
        formatContractData();
    }, [formatContractData]);

    useEffect(() => {
        fetchIPFSMetadata();
    }, [fetchIPFSMetadata]);
    console.log(ipfsMetadata, "ipfs data")

    const formatDate = (timestamp: bigint) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price: string, currency: string = "USD") => {
        return `$${price} ${currency}`;
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Get status from contract data
    const getStatusFromContract = () => {
        if (!contractReceipt) return 0;
        return contractReceipt.gadgetStatus;
    };

    // Check if user can flag (only buyer can flag)
    const canFlag = () => {
        if (!contractReceipt) return false;
        // This would need to be connected to the user's wallet address
        // For now, we'll assume the user can flag (this should be replaced with actual wallet check)
        return true;
    };

    // Get status display text
    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return "Active";
            case 1: return "Stolen";
            case 2: return "Lost";
            default: return "Unknown";
        }
    };

    // Get product name from IPFS or fallback
    const getProductName = () => {
        return ipfsMetadata?.recipt || "Unknown Product";
    };

    // Get product image from IPFS or fallback
    const getProductImage = () => {
        const ipfsUrl = ipfsMetadata?.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
        return ipfsUrl;
    };

    // Get product description from IPFS or fallback
    const getProductDescription = () => {
        return ipfsMetadata?.description || "";
    };

    // Get serial number from IPFS or fallback
    const getSerialNumber = () => {
        return ipfsMetadata?.serial_number || "N/A";
    };

    // Get price from IPFS or fallback
    const getPrice = () => {
        return ipfsMetadata?.price || "0";
    };

    // Flag gadget function
    const handleFlagGadget = async (status: number) => {
        if (!writeProofMintAsync) {
            toast.error("Contract not available");
            return;
        }

        if (!contractReceipt) {
            toast.error("Receipt data not available");
            return;
        }

        setIsFlagging(true);
        try {
            toast.loading("Updating gadget status...", { id: "flag" });

            const result = await writeProofMintAsync({
                functionName: "flagGadget",
                args: [contractReceipt.id, status]
            });

            console.log("Gadget flagged successfully:", result);
            toast.success("Gadget status updated successfully! Transaction hash: " + result, { id: "flag" });

            // Call the optional callback if provided
            if (onUpdateStatus) {
                onUpdateStatus(id, status);
            }
        } catch (error) {
            console.error("Error flagging gadget:", error);
            toast.error("Failed to update gadget status. Please try again.", { id: "flag" });
        } finally {
            setIsFlagging(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-sm flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mb-2"></div>
                        Loading receipt...
                    </div>
                </div>
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                {getProductImage() ? (
                    <img
                        src={getProductImage()}
                        alt={getProductName()}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-gray-400 text-sm flex flex-col items-center">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Product Image
                    </div>
                )}

                {/* Status Badge Overlay */}
                <div className="absolute top-3 right-3">
                    <StatusBadge status={getStatusFromContract()} size="sm" />
                </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {getProductName()}
                    </h3>
                </div>

                {/* Product Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                        <span className="font-medium">Serial Number:</span>
                        <span className="font-mono text-xs">{getSerialNumber()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Merchant:</span>
                        <span className="font-mono text-xs">{contractReceipt ? formatAddress(contractReceipt.merchant) : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Buyer:</span>
                        <span className="font-mono text-xs">{contractReceipt ? formatAddress(contractReceipt.buyer) : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Date:</span>
                        <span>{contractReceipt ? formatDate(contractReceipt.timestamp) : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Price:</span>
                        <span className="font-semibold text-green-600">
                            {formatPrice(getPrice())}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Receipt ID:</span>
                        <span className="font-mono text-xs text-blue-600">
                            {contractReceipt ? contractReceipt.id.toString() : "N/A"}
                        </span>
                    </div>
                    {ipfsMetadata?.ens && (
                        <div className="flex justify-between">
                            <span className="font-medium">ENS:</span>
                            <span className="font-mono text-xs text-purple-600">{ipfsMetadata.ens}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    {onViewDetails && (
                        <button
                            onClick={() => onViewDetails(id)}
                            className="flex-1 px-4 py-2 brand-gradient-primary text-white rounded-lg hover-brand-primary transition-colors text-sm font-medium shadow-brand-primary"
                        >
                            View Details
                        </button>
                    )}
                    {onGenerateQR && (
                        <button
                            onClick={() => onGenerateQR(id)}
                            className="px-4 py-2 border border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary/5 transition-colors text-sm font-medium focus-brand-primary"
                            title="Generate QR Code"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Status Update Buttons - Only show if user can flag */}
                {canFlag() && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="space-y-2">
                            <p className="text-xs text-gray-500 text-center">
                                Current Status: <span className="font-medium">{getStatusText(getStatusFromContract())}</span>
                            </p>

                            {/* Show different buttons based on current status */}
                            {getStatusFromContract() === 0 ? (
                                // Active status - show report options
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleFlagGadget(1)}
                                        disabled={isFlagging}
                                        className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isFlagging ? "Updating..." : "Report Stolen"}
                                    </button>
                                    <button
                                        onClick={() => handleFlagGadget(2)}
                                        disabled={isFlagging}
                                        className="px-3 py-2 text-sm text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isFlagging ? "Updating..." : "Report Lost"}
                                    </button>
                                </div>
                            ) : (
                                // Flagged status - show change options
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 text-center">Change Status:</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => handleFlagGadget(0)}
                                            disabled={isFlagging}
                                            className="px-3 py-2 text-sm text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isFlagging ? "Updating..." : "Mark Active"}
                                        </button>
                                        <button
                                            onClick={() => handleFlagGadget(1)}
                                            disabled={isFlagging || getStatusFromContract() === 1}
                                            className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isFlagging ? "Updating..." : "Stolen"}
                                        </button>
                                        <button
                                            onClick={() => handleFlagGadget(2)}
                                            disabled={isFlagging || getStatusFromContract() === 2}
                                            className="px-3 py-2 text-sm text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isFlagging ? "Updating..." : "Lost"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* IPFS Hash Display */}
                {contractReceipt?.ipfsHash && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                            <span className="font-medium">IPFS Hash:</span>
                            <span className="font-mono ml-1 break-all">{contractReceipt.ipfsHash}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceiptCard;
