"use client";

import React from "react";
import { ReceiptCardProps } from "~~/types";
import StatusBadge from "./StatusBadge";

const ReceiptCard: React.FC<ReceiptCardProps> = ({
    receipt,
    onViewDetails,
    onGenerateQR,
    onUpdateStatus
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price: string, currency: string) => {
        return `$${price} ${currency}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                {receipt.image ? (
                    <img
                        src={receipt.image}
                        alt={receipt.productName}
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
                    <StatusBadge status={receipt.status} size="sm" />
                </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {receipt.productName}
                    </h3>
                </div>

                {/* Product Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                        <span className="font-medium">Product ID:</span>
                        <span className="font-mono text-xs">{receipt.productId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Merchant:</span>
                        <span>{receipt.merchant}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Date:</span>
                        <span>{formatDate(receipt.purchaseDate)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Price:</span>
                        <span className="font-semibold text-green-600">
                            {formatPrice(receipt.price, receipt.currency)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">TX Hash:</span>
                        <span className="font-mono text-xs text-blue-600">
                            {receipt.transactionHash}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => onViewDetails(receipt.id)}
                        className="flex-1 px-4 py-2 brand-gradient-primary text-white rounded-lg hover-brand-primary transition-colors text-sm font-medium shadow-brand-primary"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => onGenerateQR(receipt.id)}
                        className="px-4 py-2 border border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary/5 transition-colors text-sm font-medium focus-brand-primary"
                        title="Generate QR Code"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                    </button>
                </div>

                {/* Update Status Button (if provided) */}
                {onUpdateStatus && receipt.status === 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <button
                            onClick={() => onUpdateStatus(receipt.id, 1)}
                            className="w-full px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Report as Stolen
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceiptCard;
