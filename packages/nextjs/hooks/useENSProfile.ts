import { useCallback, useEffect, useState } from "react";
import { normalize } from "viem/ens";
import { useEnsAddress, useEnsAvatar, useEnsName, useEnsText } from "wagmi";
import {
  ENS_TEXT_RECORDS,
  type MerchantENSProfile,
  type RecyclerENSProfile,
  isValidENSName,
  normalizeENSName,
} from "~~/utils/ensUtils";

export interface UseENSProfileOptions {
  address?: string;
  name?: string;
  type?: "merchant" | "recycler" | "general";
}

export interface ENSProfileData {
  name: string | null;
  address: string | null;
  avatar: string | null;
  isVerified: boolean;
  reputationScore?: number;
  textRecords: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

export function useENSProfile({ address, name, type = "general" }: UseENSProfileOptions) {
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Resolve ENS name from address
  const { data: ensName, isLoading: isNameLoading } = useEnsName({
    address: address as `0x${string}`,
    enabled: !!address && isMounted,
  });

  // Resolve address from ENS name
  const { data: ensAddress, isLoading: isAddressLoading } = useEnsAddress({
    name: name as string,
    enabled: !!name && isValidENSName(name) && isMounted,
  });

  // Get ENS avatar - use address if available, otherwise use name
  const { data: ensAvatar, isLoading: isAvatarLoading } = useEnsAvatar({
    name: (ensName || name) as string,
    chainId: 1, // Ethereum Mainnet
    enabled: !!(ensName || name) && isMounted,
  });

  const targetName = ensName || name;
  const normalizedName = targetName && isValidENSName(targetName) ? normalize(targetName) : undefined;

  // Get text records based on type
  const getTextRecordKeys = () => {
    switch (type) {
      case "merchant":
        return [
          ENS_TEXT_RECORDS.MERCHANT_VERIFIED,
          ENS_TEXT_RECORDS.MERCHANT_TIER,
          ENS_TEXT_RECORDS.MERCHANT_CREDENTIALS,
          ENS_TEXT_RECORDS.MERCHANT_BUSINESS_NAME,
          ENS_TEXT_RECORDS.MERCHANT_LOCATION,
          ENS_TEXT_RECORDS.REPUTATION_SCORE,
        ];
      case "recycler":
        return [
          ENS_TEXT_RECORDS.RECYCLER_VERIFIED,
          ENS_TEXT_RECORDS.RECYCLER_CREDENTIALS,
          ENS_TEXT_RECORDS.RECYCLER_CERTIFICATIONS,
          ENS_TEXT_RECORDS.RECYCLER_SERVICES,
          ENS_TEXT_RECORDS.REPUTATION_SCORE,
        ];
      default:
        return [
          ENS_TEXT_RECORDS.MERCHANT_VERIFIED,
          ENS_TEXT_RECORDS.RECYCLER_VERIFIED,
          ENS_TEXT_RECORDS.REPUTATION_SCORE,
        ];
    }
  };

  const textRecordKeys = getTextRecordKeys();

  // Use wagmi's useEnsText for each text record
  const textRecordQueries = textRecordKeys.map(key =>
    useEnsText({
      name: normalizedName,
      key,
      enabled: !!normalizedName && isMounted,
    }),
  );

  // Combine all text records
  const textRecords: Record<string, string> = {};
  textRecordKeys.forEach((key, index) => {
    const { data } = textRecordQueries[index];
    if (data) {
      textRecords[key] = data;
    }
  });

  // Determine verification status
  const isVerified =
    textRecords[ENS_TEXT_RECORDS.MERCHANT_VERIFIED] === "true" ||
    textRecords[ENS_TEXT_RECORDS.RECYCLER_VERIFIED] === "true";

  // Get reputation score
  const reputationScore = textRecords[ENS_TEXT_RECORDS.REPUTATION_SCORE]
    ? parseInt(textRecords[ENS_TEXT_RECORDS.REPUTATION_SCORE])
    : undefined;

  const isLoading =
    isNameLoading || isAddressLoading || isAvatarLoading || textRecordQueries.some(query => query.isLoading);

  const error = textRecordQueries.find(query => query.error)?.error?.message || null;

  return {
    name: targetName || "Not set",
    address: ensAddress || address || null,
    avatar: ensAvatar || null,
    isVerified,
    reputationScore,
    textRecords,
    isLoading,
    error,
    refetch: () => {
      // Refetch all queries
      textRecordQueries.forEach(query => query.refetch());
    },
  };
}

// Specialized hooks for different profile types
export function useMerchantENSProfile(address?: string, name?: string) {
  return useENSProfile({ address, name, type: "merchant" });
}

export function useRecyclerENSProfile(address?: string, name?: string) {
  return useENSProfile({ address, name, type: "recycler" });
}

// Removed agent-related hooks as they're not relevant to ProofMint

// Hook for ENS name validation
export function useENSValidation() {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateName = useCallback((name: string) => {
    if (!name) {
      setIsValid(null);
      setError(null);
      return;
    }

    const normalized = normalizeENSName(name);
    const valid = isValidENSName(normalized);

    setIsValid(valid);
    setError(valid ? null : "Invalid ENS name format");
  }, []);

  return {
    isValid,
    error,
    validateName,
  };
}
