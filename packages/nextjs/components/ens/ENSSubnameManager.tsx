import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useENSValidation } from "~~/hooks/useENSProfile";
import { getProofMintSubname } from "~~/utils/ensUtils";

interface ENSSubnameManagerProps {
  type: "merchant" | "recycler" | "agent";
  onSubnameCreated?: (subname: string) => void;
  className?: string;
}

export const ENSSubnameManager: React.FC<ENSSubnameManagerProps> = ({ type, onSubnameCreated, className = "" }) => {
  const { address } = useAccount();
  const [subname, setSubname] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdSubname, setCreatedSubname] = useState<string | null>(null);
  const { isValid, error, validateName } = useENSValidation();

  const handleSubnameChange = (value: string) => {
    setSubname(value);
    validateName(value);
  };

  const handleCreateSubname = async () => {
    if (!isValid || !subname || !address) return;

    setIsCreating(true);
    try {
      // In a real implementation, this would interact with the Subnames Toolkit
      // For now, we'll simulate the process
      const fullSubname = getProofMintSubname(type, subname);

      // Simulate API call to Subnames Toolkit
      await new Promise(resolve => setTimeout(resolve, 2000));

      setCreatedSubname(fullSubname);
      onSubnameCreated?.(fullSubname);
    } catch (error) {
      console.error("Error creating subname:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const getTypeInfo = () => {
    switch (type) {
      case "merchant":
        return {
          title: "Merchant Subname",
          description: "Create a professional subname for your business",
          placeholder: "mybusiness",
          example: "mybusiness.proofmint.eth",
          color: "green",
        };
      case "recycler":
        return {
          title: "Recycler Subname",
          description: "Create a subname for your recycling services",
          placeholder: "ecorecycler",
          example: "ecorecycler.proofmint.eth",
          color: "blue",
        };
      case "agent":
        return {
          title: "Agent Subname",
          description: "Create a subname for your AI agent",
          placeholder: "myagent",
          example: "myagent.proofmint.eth",
          color: "purple",
        };
    }
  };

  const typeInfo = getTypeInfo();

  if (createdSubname) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Subname Created!</h3>
          <p className="text-gray-600 mb-4">Your {type} subname has been successfully created.</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-mono text-sm text-gray-900">{createdSubname}</p>
          </div>
          <button
            onClick={() => {
              setCreatedSubname(null);
              setSubname("");
            }}
            className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className={`text-lg font-semibold text-${typeInfo.color}-600 mb-2`}>{typeInfo.title}</h3>
        <p className="text-gray-600 mb-4">{typeInfo.description}</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-1">Example:</p>
          <p className="font-mono text-sm text-gray-900">{typeInfo.example}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose your subname</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={subname}
              onChange={e => handleSubnameChange(e.target.value)}
              placeholder={typeInfo.placeholder}
              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-${typeInfo.color}-500 focus:border-transparent ${
                subname && !isValid ? "border-red-300" : "border-gray-300"
              }`}
            />
            <span className="px-3 py-2 text-gray-500 bg-gray-100 rounded-lg">.proofmint.eth</span>
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          {isValid && subname && (
            <p className="mt-1 text-sm text-green-600">✓ {getProofMintSubname(type, subname)} is available</p>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Your subname will be registered on the ENS protocol</li>
            <li>• You'll be able to set text records for verification</li>
            <li>• Your subname will be linked to your wallet address</li>
            <li>• You can use it for payments and identification</li>
          </ul>
        </div>

        <button
          onClick={handleCreateSubname}
          disabled={!isValid || !subname || isCreating || !address}
          className={`w-full px-4 py-2 bg-${typeInfo.color}-600 text-white rounded-lg hover:bg-${typeInfo.color}-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
        >
          {isCreating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Subname...</span>
            </>
          ) : (
            <span>Create Subname</span>
          )}
        </button>

        {!address && (
          <p className="text-sm text-gray-500 text-center">Please connect your wallet to create a subname</p>
        )}
      </div>
    </div>
  );
};

export default ENSSubnameManager;
