import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAgentENSProfile } from "~~/hooks/useENSProfile";
import { ENS_TEXT_RECORDS } from "~~/utils/ensUtils";

interface Agent {
  name: string;
  address: string;
  type: string;
  capabilities: string[];
  status: string;
  reputationScore: number;
  lastActive: string;
}

interface ENSAgentRegistryProps {
  className?: string;
}

export const ENSAgentRegistry: React.FC<ENSAgentRegistryProps> = ({ className = "" }) => {
  const { address } = useAccount();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockAgents: Agent[] = [
      {
        name: "recycling-agent.proofmint.eth",
        address: "0x1234...5678",
        type: "Recycling",
        capabilities: ["Auto-detect", "Schedule Pickup", "Track Status"],
        status: "active",
        reputationScore: 95,
        lastActive: "2 minutes ago",
      },
      {
        name: "verification-agent.proofmint.eth",
        address: "0x2345...6789",
        type: "Verification",
        capabilities: ["Product Verification", "Merchant Check", "Fraud Detection"],
        status: "active",
        reputationScore: 88,
        lastActive: "5 minutes ago",
      },
      {
        name: "payment-agent.proofmint.eth",
        address: "0x3456...7890",
        type: "Payment",
        capabilities: ["Auto Payments", "Multi-sig", "Cross-border"],
        status: "maintenance",
        reputationScore: 92,
        lastActive: "1 hour ago",
      },
    ];

    setTimeout(() => {
      setAgents(mockAgents);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Recycling":
        return "bg-blue-100 text-blue-800";
      case "Verification":
        return "bg-purple-100 text-purple-800";
      case "Payment":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">ENS Agent Registry</h3>
        <p className="text-gray-600">
          Discover and interact with AI agents registered on the ENS protocol. Each agent has verifiable capabilities
          and reputation scores.
        </p>
      </div>

      {/* Agent List */}
      <div className="space-y-4">
        {agents.map(agent => (
          <div
            key={agent.name}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedAgent?.name === agent.name
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900">{agent.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(agent.type)}`}>
                    {agent.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{agent.address}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{agent.reputationScore}</span>
                  </div>
                  <span>Last active: {agent.lastActive}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  Interact
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedAgent.name}</h3>
              <button onClick={() => setSelectedAgent(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.capabilities.map((capability, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Agent Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 text-gray-900">{selectedAgent.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 text-gray-900">{selectedAgent.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Reputation:</span>
                    <span className="ml-2 text-gray-900">{selectedAgent.reputationScore}/100</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Active:</span>
                    <span className="ml-2 text-gray-900">{selectedAgent.lastActive}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Start Interaction
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  View ENS Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register New Agent */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Register Your Agent</h4>
        <p className="text-sm text-gray-600 mb-4">
          Register your AI agent with ENS to make it discoverable and verifiable.
        </p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Register Agent
        </button>
      </div>
    </div>
  );
};

export default ENSAgentRegistry;
