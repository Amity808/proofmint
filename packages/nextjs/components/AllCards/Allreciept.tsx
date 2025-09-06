import React, { useCallback, useEffect, useState } from "react";
import ReceiptCard from "~~/components/common/ReceiptCard";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Allreciept = () => {
  const [receiptIds, setReceiptIds] = useState<Map<string, string>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");

  // Get total receipt count from smart contract
  const { data: totalReceipts } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getTotalStats",
    args: [],
  });

  console.log(totalReceipts, "Total receipts count");

  // Generate receipt IDs based on total count
  const getReceiptIds = useCallback(() => {
    try {
      if (!totalReceipts) {
        console.log("totalReceipts is undefined or null");
        return;
      }

      const newMap = new Map<string, string>();
      // totalReceipts[0] is the total receipts count
      const receiptCount = Array.isArray(totalReceipts) ? totalReceipts[0] : totalReceipts;

      if (typeof receiptCount === "bigint" && receiptCount > 0) {
        for (let i = 1; i <= receiptCount; i++) {
          // Receipt IDs start from 1
          newMap.set(i.toString(), i.toString());
        }
        setReceiptIds(new Map(newMap));
      } else {
        console.log("receiptCount is not a valid bigint:", receiptCount);
      }
    } catch (error) {
      console.error("Error setting receipt IDs:", error);
    }
  }, [totalReceipts]);

  useEffect(() => {
    getReceiptIds();
  }, [totalReceipts, getReceiptIds]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div>
      {/* Search functionality can be added here */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search receipts..."
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...receiptIds.entries()].map(([key, value]) => (
          <ReceiptCard
            key={key}
            id={value}
            onViewDetails={id => console.log("View receipt:", id)}
            onGenerateQR={id => console.log("Generate QR:", id)}
            onUpdateStatus={(id, status) => console.log("Update status:", id, status)}
          />
        ))}
      </div>
    </div>
  );
};

export default Allreciept;
