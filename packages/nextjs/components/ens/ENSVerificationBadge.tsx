import React from 'react';
import { useENSProfile } from '~~/hooks/useENSProfile';
import { ENS_TEXT_RECORDS } from '~~/utils/ensUtils';

interface ENSVerificationBadgeProps {
    address?: string;
    name?: string;
    type?: 'merchant' | 'recycler' | 'general';
    showDetails?: boolean;
    className?: string;
}

export const ENSVerificationBadge: React.FC<ENSVerificationBadgeProps> = ({
    address,
    name,
    type = 'general',
    showDetails = false,
    className = '',
}) => {
    const { isVerified, reputationScore, textRecords, isLoading, error } = useENSProfile({
        address,
        name,
        type,
    });

    if (isLoading) {
        return (
            <div className={`inline-flex items-center space-x-1 ${className}`}>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Verifying...</span>
            </div>
        );
    }

    if (error || !isVerified) {
        return (
            <div className={`inline-flex items-center space-x-1 ${className}`}>
                <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                <span className="text-sm text-gray-500">
                    {name === 'Not set' ? 'No ENS name' : 'Unverified'}
                </span>
            </div>
        );
    }

    const getVerificationType = () => {
        if (textRecords[ENS_TEXT_RECORDS.MERCHANT_VERIFIED] === 'true') return 'Merchant';
        if (textRecords[ENS_TEXT_RECORDS.RECYCLER_VERIFIED] === 'true') return 'Recycler';
        return 'Verified';
    };

    const getVerificationColor = () => {
        if (textRecords[ENS_TEXT_RECORDS.MERCHANT_VERIFIED] === 'true') return 'bg-green-100 text-green-800';
        if (textRecords[ENS_TEXT_RECORDS.RECYCLER_VERIFIED] === 'true') return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className={`inline-flex items-center space-x-2 ${className}`}>
            <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor()}`}>
                    {getVerificationType()}
                </span>
            </div>

            {reputationScore !== undefined && (
                <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs text-gray-600">{reputationScore}</span>
                </div>
            )}

            {showDetails && (
                <div className="text-xs text-gray-500">
                    {textRecords[ENS_TEXT_RECORDS.MERCHANT_TIER] && `Tier: ${textRecords[ENS_TEXT_RECORDS.MERCHANT_TIER]}`}
                    {textRecords[ENS_TEXT_RECORDS.RECYCLER_CERTIFICATIONS] && `Certs: ${textRecords[ENS_TEXT_RECORDS.RECYCLER_CERTIFICATIONS].split(',').length}`}
                </div>
            )}
        </div>
    );
};

export default ENSVerificationBadge;
