import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Custom hook for ProofMint contract interactions
export const useProofMint = () => {
  const { address } = useAccount();

  // Read contract functions
  const { data: totalStats } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getTotalStats",
  });

  const { data: userReceipts } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getUserReceipts",
    args: address ? [address] : undefined,
  });

  const { data: isMerchant } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "isVerifiedMerchant",
    args: address ? [address] : undefined,
  });

  const { data: isRecycler } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "isRecycler",
    args: address ? [address] : undefined,
  });

  // Write contract functions
  const { writeContractAsync: writeProofMintAsync } = useScaffoldWriteContract({
    contractName: "ProofMint",
  });

  // Issue receipt (merchant only)
  const issueReceipt = async (buyer: string, ipfsHash: string) => {
    if (!writeProofMintAsync) return;

    return await writeProofMintAsync({
      functionName: "issueReceipt",
      args: [buyer as `0x${string}`, ipfsHash],
    });
  };

  // Flag gadget status (buyer only)
  const flagGadget = async (receiptId: number, status: number) => {
    if (!writeProofMintAsync) return;

    return await writeProofMintAsync({
      functionName: "flagGadget",
      args: [BigInt(receiptId), BigInt(status)],
    });
  };

  // Recycle gadget (recycler only)
  const recycleGadget = async (receiptId: number) => {
    if (!writeProofMintAsync) return;

    return await writeProofMintAsync({
      functionName: "recycleGadget",
      args: [BigInt(receiptId)],
    });
  };

  // Add merchant (admin only)
  const addMerchant = async (merchantAddress: string) => {
    if (!writeProofMintAsync) return;

    return await writeProofMintAsync({
      functionName: "addMerchant",
      args: [merchantAddress as `0x${string}`],
    });
  };

  // Add recycler (admin only)
  const addRecycler = async (recyclerAddress: string) => {
    if (!writeProofMintAsync) return;

    return await writeProofMintAsync({
      functionName: "addRecycler",
      args: [recyclerAddress as `0x${string}`],
    });
  };

  return {
    // Data
    totalStats,
    userReceipts,
    isMerchant,
    isRecycler,

    // Functions
    issueReceipt,
    flagGadget,
    recycleGadget,
    addMerchant,
    addRecycler,
  };
};

// Hook for getting specific receipt details
export const useReceipt = (receiptId: number) => {
  const { data: receipt } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getReceipt",
    args: [BigInt(receiptId)],
  });

  const { data: receiptStatus } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getReceiptStatus",
    args: [BigInt(receiptId)],
  });

  return {
    receipt,
    receiptStatus,
  };
};

// Hook for merchant operations
export const useMerchantOperations = () => {
  const { address } = useAccount();

  const { data: merchantReceipts } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getMerchantReceipts",
    args: address ? [address] : undefined,
  });

  const { writeContractAsync: writeProofMintAsync } = useScaffoldWriteContract({
    contractName: "ProofMint",
  });

  const issueReceipt = async (buyer: string, ipfsHash: string) => {
    if (!writeProofMintAsync) return;

    return await writeProofMintAsync({
      functionName: "issueReceipt",
      args: [buyer as `0x${string}`, ipfsHash],
    });
  };

  return {
    merchantReceipts,
    issueReceipt,
  };
};
