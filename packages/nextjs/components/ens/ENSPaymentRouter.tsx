import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useEnsAddress } from "wagmi";
import { useENSValidation } from "~~/hooks/useENSProfile";

interface ENSPaymentRouterProps {
  onPaymentInitiated?: (recipient: string, amount: string, ensName: string) => void;
  className?: string;
}

export const ENSPaymentRouter: React.FC<ENSPaymentRouterProps> = ({ onPaymentInitiated, className = "" }) => {
  const { address } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isValid, error, validateName } = useENSValidation();

  // Resolve ENS name to address
  const { data: resolvedAddress, isLoading: isResolving } = useEnsAddress({
    name: recipient as string,
    enabled: !!recipient && isValid,
  });

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    validateName(value);
  };

  const handlePayment = async () => {
    if (!isValid || !recipient || !amount || !resolvedAddress || !address) return;

    setIsProcessing(true);
    try {
      // In a real implementation, this would initiate the payment
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));

      onPaymentInitiated?.(resolvedAddress, amount, recipient);

      // Reset form
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentStatus = () => {
    if (!recipient) return null;
    if (isResolving) return { status: "resolving", message: "Resolving ENS name..." };
    if (error) return { status: "error", message: error };
    if (resolvedAddress) return { status: "success", message: `Resolved to: ${resolvedAddress}` };
    return { status: "pending", message: "Enter a valid ENS name" };
  };

  const paymentStatus = getPaymentStatus();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">ENS Payment Router</h3>
        <p className="text-gray-600">
          Send payments using ENS names instead of wallet addresses. Perfect for cross-border transactions and
          human-readable payments.
        </p>
      </div>

      <div className="space-y-4">
        {/* Recipient Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipient (ENS Name)</label>
          <div className="relative">
            <input
              type="text"
              value={recipient}
              onChange={e => handleRecipientChange(e.target.value)}
              placeholder="merchant.proofmint.eth"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                recipient && !isValid ? "border-red-300" : "border-gray-300"
              }`}
            />
            {isResolving && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {paymentStatus && (
            <div
              className={`mt-1 text-sm ${
                paymentStatus.status === "success"
                  ? "text-green-600"
                  : paymentStatus.status === "error"
                    ? "text-red-600"
                    : paymentStatus.status === "resolving"
                      ? "text-blue-600"
                      : "text-gray-500"
              }`}
            >
              {paymentStatus.message}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (ETH)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.1"
            step="0.001"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Payment Features */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">ENS Payment Features</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Human-readable addresses for easier payments</li>
            <li>• Automatic address resolution from ENS names</li>
            <li>• Cross-border coordination with named addresses</li>
            <li>• Integration with DAO tooling and multi-sig wallets</li>
          </ul>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={!isValid || !recipient || !amount || !resolvedAddress || isProcessing || !address}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <span>Send Payment</span>
            </>
          )}
        </button>

        {!address && <p className="text-sm text-gray-500 text-center">Please connect your wallet to send payments</p>}
      </div>

      {/* Recent Payments */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent ENS Payments</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">merchant.proofmint.eth</span>
            <span className="text-gray-900">0.05 ETH</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">recycler.proofmint.eth</span>
            <span className="text-gray-900">0.1 ETH</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">agent.proofmint.eth</span>
            <span className="text-gray-900">0.02 ETH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ENSPaymentRouter;
