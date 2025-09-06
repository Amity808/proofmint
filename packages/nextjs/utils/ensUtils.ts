// ENS utilities for ProofMint dApp
// Using wagmi hooks instead of direct contract calls for better performance and caching

// ENS Text Record Keys for ProofMint
export const ENS_TEXT_RECORDS = {
    // Merchant verification
    MERCHANT_VERIFIED: 'proofmint.merchant.verified',
    MERCHANT_TIER: 'proofmint.merchant.tier',
    MERCHANT_CREDENTIALS: 'proofmint.merchant.credentials',
    MERCHANT_BUSINESS_NAME: 'proofmint.merchant.business',
    MERCHANT_LOCATION: 'proofmint.merchant.location',

    // Recycler verification
    RECYCLER_VERIFIED: 'proofmint.recycler.verified',
    RECYCLER_CREDENTIALS: 'proofmint.recycler.credentials',
    RECYCLER_CERTIFICATIONS: 'proofmint.recycler.certifications',
    RECYCLER_SERVICES: 'proofmint.recycler.services',

    // Product verification
    PRODUCT_AUTHENTIC: 'proofmint.product.authentic',
    PRODUCT_SERIAL: 'proofmint.product.serial',
    PRODUCT_WARRANTY: 'proofmint.product.warranty',
    PRODUCT_MANUFACTURER: 'proofmint.product.manufacturer',

    // Community attestations
    COMMUNITY_ATTESTATION: 'proofmint.community.attestation',
    REPUTATION_SCORE: 'proofmint.reputation.score',
    TRUST_SCORE: 'proofmint.trust.score',
} as const;

export interface ENSProfile {
    name: string;
    address: string;
    avatar?: string;
    textRecords: Record<string, string>;
    isVerified: boolean;
    reputationScore?: number;
}

export interface MerchantENSProfile extends ENSProfile {
    tier?: string;
    credentials?: string;
    businessName?: string;
    location?: string;
    verified: boolean;
}

export interface RecyclerENSProfile extends ENSProfile {
    certifications?: string[];
    services?: string[];
    verified: boolean;
}

/**
 * Validate ENS name format
 */
export function isValidENSName(name: string): boolean {
    const ensRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.eth$/;
    return ensRegex.test(name.toLowerCase());
}

/**
 * Normalize ENS name
 */
export function normalizeENSName(name: string): string {
    return name.toLowerCase().trim();
}

/**
 * Get ENS subname for ProofMint ecosystem
 */
export function getProofMintSubname(type: 'merchant' | 'recycler', name: string): string {
    const normalizedName = normalizeENSName(name);
    return `${normalizedName}.proofmint.eth`;
}
