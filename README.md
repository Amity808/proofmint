# 🚀 ProofMint - Proof of Ownership NFT Receipts

> **Hackathon Project**: A blockchain-powered system that mints NFT receipts at the point of purchase, serving as verifiable proof of ownership for electronics and gadgets.

## 📋 Project Overview

ProofMint revolutionizes product ownership by creating blockchain-verified NFT receipts when customers purchase electronics. These NFTs serve as immutable proof of ownership, enabling:

- **🔐 Authentic Ownership**: Blockchain-verified proof of purchase
- **♻️ Sustainable Tracking**: Track products through their lifecycle
- **🎁 Recycling Rewards**: Earn tokens for responsible disposal
- **⚡ 0G Network Speed**: Lightning-fast transactions powered by 0G

## 🎯 Core Features

### ✅ Implemented

- Modern landing page with hero section
- Responsive design with Tailwind CSS
- Web3 wallet integration (RainbowKit)
- ENS support for user profiles
- Component-based architecture
- **Ethereum Identity Kit** integration for enhanced user experience

### 🔄 In Development (2-Day Sprint)

- **Marketplace**: Browse and purchase electronics
- **NFT Minting**: Automatic receipt generation on purchase
- **User Dashboard**: View owned NFT receipts
- **QR Verification**: Scan QR codes for ownership proof
- **Recycling System**: Track and earn rewards for disposal

## 🆔 Ethereum Identity Kit Integration

ProofMint leverages the [Ethereum Identity Kit](https://ethidentitykit.com/docs) to provide enhanced user experience and social features:

### 🎭 **User Profile Enhancement**

- **ProfileCard**: Display user profiles with ENS names, avatars, and social stats
- **Profile Stats**: Show user's transaction history, reputation, and activity metrics
- **Avatar**: ENS-based profile pictures for personalized experience

### 🤝 **Social Features & Trust**

- **Follow System**: Users can follow trusted merchants and recyclers
- **Follower Tags**: Community-driven verification (e.g., "Verified Recycler", "Trusted Merchant")
- **Followers You Know**: Social proof showing mutual connections
- **Leaderboard**: Gamify sustainability efforts with recycling leaderboards

### ⚡ **Enhanced UX**

- **Transaction Modal**: Streamlined transaction flows for purchases and recycling
- **Notifications**: Real-time updates for receipt status changes, new products
- **SIWE (Sign-In with Ethereum)**: Seamless authentication without traditional passwords
- **POAP Integration**: Award badges for environmental achievements

### 🔧 **Implementation Benefits**

- **Trust & Reputation**: Social verification for merchants and users
- **Community Building**: Follow system creates sustainable ecosystem
- **Gamification**: Leaderboards encourage recycling participation
- **Seamless UX**: Modern authentication and transaction flows

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **DaisyUI** for styling
- **Framer Motion** for animations
- **React Icons** + **Lucide React** for icons

### Web3 Integration

- **Wagmi** + **Viem** for Ethereum interactions
- **RainbowKit** for wallet connection
- **React Query** for state management
- **0G Network** for high-speed transactions
- **Ethereum Identity Kit** for enhanced user profiles and social features

### Smart Contracts

- **Foundry** for contract development
- **Solidity** for smart contract logic
- **OpenZeppelin** for security standards

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- Git

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd proofmint
```

2. **Install dependencies**

```bash
# Install root dependencies
yarn install

# Install frontend dependencies
cd packages/nextjs
yarn install
```

3. **Install missing dependencies**

```bash
yarn add framer-motion@^12.23.6 lucide-react@^0.539.0 react-icons
```

4. **Install Ethereum Identity Kit**

```bash
yarn add ethereum-identity-kit @tanstack/react-query
```

5. **Start development server**

```bash
yarn dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
proofmint/
├── packages/
│   ├── nextjs/                 # Frontend application
│   │   ├── app/               # Next.js app router
│   │   │   ├── marketplace/   # Product marketplace
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── nft-receipts/  # NFT management
│   │   │   └── recycling/     # Sustainability features
│   │   ├── components/        # React components
│   │   │   ├── home/         # Landing page components
│   │   │   └── scaffold-eth/ # Web3 components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   └── contracts/        # Contract ABIs
│   └── foundry/              # Smart contracts
│       ├── contracts/        # Solidity contracts
│       ├── scripts/         # Deployment scripts
│       └── test/            # Contract tests
└── README.md
```

## ⚙️ Ethereum Identity Kit Configuration

### Setup Providers

Add the required providers to your `app/layout.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TransactionProvider } from "ethereum-identity-kit";
import "ethereum-identity-kit/css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <TransactionProvider>{children}</TransactionProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### Usage Examples

```typescript
// Enhanced user profiles
import { ProfileCard, ProfileStats, Avatar } from "ethereum-identity-kit";

// In your dashboard
<ProfileCard addressOrName={userAddress} showStats={true} showSocials={true} />;

// Merchant verification
import { FollowerTag, FollowersYouKnow } from "ethereum-identity-kit";

<FollowerTag
  address={merchantAddress}
  tag="Verified Merchant"
  variant="success"
/>;

// Transaction flows
import { TransactionModal } from "ethereum-identity-kit";

<TransactionModal
  onSuccess={handlePurchaseSuccess}
  onError={handleTransactionError}
/>;
```

## 🎯 2-Day Development Plan

### Day 1: Core Infrastructure & MVP

**Morning (4-5 hours)**

- [x] Setup & Dependencies
- [ ] Marketplace Page with product listings
- [ ] NFT Minting System for purchases

**Afternoon (4-5 hours)**

- [ ] User Dashboard for owned NFTs
- [ ] Core Pages Structure (receipts, recycling, track)

### Day 2: Integration & Polish

**Morning (4-5 hours)**

- [ ] Smart Contract Integration
- [ ] Payment & Transaction Flow

**Afternoon (4-5 hours)**

- [ ] Advanced Features (ENS, QR codes)
- [ ] Testing & Polish
- [ ] Deployment & Demo Prep

## 🔧 Available Scripts

```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server

# Code Quality
yarn lint             # Run ESLint
yarn format           # Format code with Prettier
yarn check-types      # TypeScript type checking

# Deployment
yarn vercel           # Deploy to Vercel
yarn ipfs             # Deploy to IPFS
```

## 🌐 Environment Variables

Create a `.env.local` file in `packages/nextjs/`:

```env
# Alchemy API Key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key

# WalletConnect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Contract Addresses
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

## 🎨 Design System

### Colors

- **Primary**: Green (#22c55e) - Sustainability theme
- **Secondary**: Blue (#3b82f6) - Trust and technology
- **Accent**: Purple (#8b5cf6) - Innovation
- **Neutral**: Gray scale for text and backgrounds

### Components

- **Cards**: Product listings, NFT displays
- **Buttons**: Primary (green), Secondary (white)
- **Forms**: Input fields with validation
- **Modals**: Transaction confirmations, QR displays

## 🔗 Smart Contract Integration

### Key Functions

```solidity
// Mint NFT receipt on purchase
function mintReceipt(
    address to,
    string memory productId,
    string memory metadataURI
) external returns (uint256);

// Verify ownership
function verifyOwnership(
    address owner,
    uint256 tokenId
) external view returns (bool);
```

## 📱 User Flow

1. **Browse** → User visits marketplace
2. **Select** → Choose product to purchase
3. **Connect** → Connect wallet (MetaMask, etc.)
4. **Purchase** → Complete transaction
5. **Mint** → NFT receipt automatically minted
6. **View** → Access dashboard to see owned NFTs
7. **Verify** → Use QR code for ownership proof

## 🚀 Deployment

### Vercel (Recommended)

```bash
yarn vercel
```

### IPFS (Decentralized)

```bash
yarn ipfs
```

## 🤝 Contributing

This is a hackathon project. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Goals

- **Innovation**: Novel approach to product ownership
- **Sustainability**: Encouraging responsible disposal
- **User Experience**: Seamless Web3 integration
- **Technical Excellence**: Clean, maintainable code
- **Demo Ready**: Polished presentation

## 📞 Contact

- **Email**: contact@proofmint.com
- **Twitter**: [@ProofMint](https://twitter.com/proofmint)
- **LinkedIn**: [ProofMint](https://linkedin.com/company/proofmint)

---

**Built with ❤️ for the hackathon** | **Powered by 0G Network** | **Secured by Ethereum**
