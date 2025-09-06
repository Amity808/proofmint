import React from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { useAccount } from "wagmi";

interface ENSAvatarProps {
  address?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackSrc?: string;
  showName?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export const ENSAvatar: React.FC<ENSAvatarProps> = ({
  address,
  name,
  size = "md",
  className = "",
  fallbackSrc,
  showName = false,
}) => {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  // Get ENS name from address
  const { data: ensName } = useEnsName({
    address: targetAddress as `0x${string}`,
    query: { enabled: !!targetAddress },
  });

  // Get ENS avatar
  const { data: ensAvatar, isLoading } = useEnsAvatar({
    name: (name || ensName) as string,
    chainId: 1, // Ethereum Mainnet
    query: { enabled: !!(targetAddress || name) },
  });

  const displayName = name || ensName || "Not set";
  const avatarSrc =
    ensAvatar || fallbackSrc || (displayName !== "Not set" ? `https://avatars.jakerunzer.com/${displayName}` : null);

  if (showName) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}
        >
          {isLoading ? (
            <div className="w-full h-full bg-gray-300 animate-pulse" />
          ) : avatarSrc ? (
            <img
              src={avatarSrc}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={e => {
                // Fallback to default avatar if image fails to load
                const target = e.target as HTMLImageElement;
                if (displayName !== "Not set") {
                  target.src = `https://avatars.jakerunzer.com/${displayName}`;
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm font-medium">
              {displayName === "Not set" ? "?" : displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{displayName}</p>
          {ensName && <p className="text-sm text-gray-500">ENS Verified</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
    >
      {isLoading ? (
        <div className="w-full h-full bg-gray-300 animate-pulse" />
      ) : avatarSrc ? (
        <img
          src={avatarSrc}
          alt={displayName}
          className="w-full h-full object-cover"
          onError={e => {
            // Fallback to default avatar if image fails to load
            const target = e.target as HTMLImageElement;
            if (displayName !== "Not set") {
              target.src = `https://avatars.jakerunzer.com/${displayName}`;
            }
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm font-medium">
          {displayName === "Not set" ? "?" : displayName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default ENSAvatar;
