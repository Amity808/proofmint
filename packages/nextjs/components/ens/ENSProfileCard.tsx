import React from "react";
import ENSVerificationBadge from "./ENSVerificationBadge";
import { useENSProfile } from "~~/hooks/useENSProfile";
import { ENS_TEXT_RECORDS } from "~~/utils/ensUtils";

interface ENSProfileCardProps {
  address?: string;
  name?: string;
  type?: "merchant" | "recycler" | "general";
  showTextRecords?: boolean;
  className?: string;
}

export const ENSProfileCard: React.FC<ENSProfileCardProps> = ({
  address,
  name,
  type = "general",
  showTextRecords = true,
  className = "",
}) => {
  const {
    name: ensName,
    address: ensAddress,
    avatar,
    isVerified,
    reputationScore,
    textRecords,
    isLoading,
    error,
  } = useENSProfile({ address, name, type });

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ensName) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ENS Profile</h3>
          <p className="text-gray-500">{error || "This address does not have an ENS profile"}</p>
        </div>
      </div>
    );
  }

  const getProfileType = () => {
    if (textRecords[ENS_TEXT_RECORDS.MERCHANT_VERIFIED] === "true") return "Merchant";
    if (textRecords[ENS_TEXT_RECORDS.RECYCLER_VERIFIED] === "true") return "Recycler";
    return "User";
  };

  const getProfileColor = () => {
    if (textRecords[ENS_TEXT_RECORDS.MERCHANT_VERIFIED] === "true") return "text-green-600";
    if (textRecords[ENS_TEXT_RECORDS.RECYCLER_VERIFIED] === "true") return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={`${ensName} avatar`} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">{ensName.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{ensName}</h3>
            <ENSVerificationBadge address={ensAddress || undefined} name={ensName} type={type} showDetails={true} />
          </div>

          <p className={`text-sm font-medium ${getProfileColor()}`}>{getProfileType()}</p>

          {ensAddress && (
            <p className="text-sm text-gray-500 font-mono">
              {ensAddress.slice(0, 6)}...{ensAddress.slice(-4)}
            </p>
          )}

          {reputationScore !== undefined && (
            <div className="flex items-center space-x-1 mt-2">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-600">Reputation: {reputationScore}</span>
            </div>
          )}
        </div>
      </div>

      {/* Text Records */}
      {showTextRecords && Object.keys(textRecords).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">ENS Records</h4>
          <div className="space-y-2">
            {Object.entries(textRecords).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start">
                <span className="text-sm text-gray-500 font-mono">{key}</span>
                <span className="text-sm text-gray-900 text-right max-w-xs truncate ml-4">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialized Information */}
      {textRecords[ENS_TEXT_RECORDS.MERCHANT_TIER] && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <h5 className="text-sm font-medium text-green-800 mb-1">Merchant Tier</h5>
          <p className="text-sm text-green-700">{textRecords[ENS_TEXT_RECORDS.MERCHANT_TIER]}</p>
        </div>
      )}

      {textRecords[ENS_TEXT_RECORDS.RECYCLER_CERTIFICATIONS] && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h5 className="text-sm font-medium text-blue-800 mb-1">Certifications</h5>
          <div className="flex flex-wrap gap-1">
            {textRecords[ENS_TEXT_RECORDS.RECYCLER_CERTIFICATIONS].split(",").map((cert, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {cert.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* {textRecords[ENS_TEXT_RECORDS.AGENT_CAPABILITIES] && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <h5 className="text-sm font-medium text-purple-800 mb-1">Agent Capabilities</h5>
          <div className="flex flex-wrap gap-1">
            {textRecords[ENS_TEXT_RECORDS.AGENT_CAPABILITIES].split(",").map((capability, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {capability.trim()}
              </span>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ENSProfileCard;
