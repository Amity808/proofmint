# ProofMint - Decentralized Receipt Management System

A blockchain-based platform for managing digital receipts, merchant verification, and sustainable electronics lifecycle tracking.

## 🌟 Features

### Core Functionality

- **Digital Receipt Management**: Create, store, and manage NFT-based receipts on the blockchain
- **Merchant Verification**: ENS-based domain registration for verified merchants
- **Gadget Lifecycle Tracking**: Track device status (Active, Stolen, Lost, Recycled)
- **IPFS Integration**: Immutable metadata storage for receipt details
- **Subscription Management**: Tiered subscription system for merchants

### User Features

- **Profile Management**: Comprehensive user profiles with ENS integration
- **Receipt Dashboard**: View and manage all your digital receipts
- **Status Updates**: Flag devices as stolen, lost, or mark as active
- **QR Code Generation**: Generate QR codes for receipt verification
- **Search & Filter**: Advanced search and filtering capabilities

### Merchant Features

- **Domain Registration**: Register `.proofmint.eth` domains
- **Receipt Issuance**: Issue digital receipts for products
- **Subscription Tiers**: Basic, Premium, and Enterprise tiers
- **Analytics Dashboard**: Track receipts and subscription usage
- **Base Pay Integration**: USDC payment processing

## 🏗️ Architecture

### Smart Contracts

- **ProofMint.sol**: Main contract handling receipts, merchants, and subscriptions
- **ERC721**: NFT standard for receipt tokens
- **ENS Integration**: Domain registration and resolution
- **Access Control**: Role-based permissions for merchants and recyclers

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **RainbowKit**: Wallet connection and management
- **Wagmi**: Ethereum interaction hooks
- **Framer Motion**: Smooth animations and transitions

### Backend Services

- **IPFS**: Decentralized file storage for metadata
- **ENS**: Ethereum Name Service for domain management
- **Base Pay**: Payment processing integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Amity808/proofmint.git
   cd proofmint
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:

   - `NEXT_PUBLIC_ALCHEMY_API_KEY`: Alchemy API key for Base Sepolia
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID

4. **Start the development server**

   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### For Users

1. **Connect Wallet**: Use RainbowKit to connect your Ethereum wallet
2. **View Dashboard**: Access your receipt dashboard to see all purchases
3. **Manage Receipts**: Update device status, generate QR codes, view details
4. **Profile Management**: Set up your profile with ENS integration

### For Merchants

1. **Register Domain**: Get your own `.proofmint.eth` domain
2. **Subscribe**: Choose a subscription tier (Basic/Premium/Enterprise)
3. **Issue Receipts**: Create digital receipts for customer purchases
4. **Manage Business**: Track receipts, manage subscriptions, view analytics

### For Recyclers

1. **Get Verified**: Contact admin for recycler verification
2. **Update Status**: Mark devices as recycled when processed
3. **Track Impact**: Monitor environmental impact of recycling efforts

## 🔧 Development

### Project Structure

```
proofmint/
├── packages/
│   ├── nextjs/                 # Frontend application
│   │   ├── app/               # Next.js app directory
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom hooks
│   │   └── utils/            # Utility functions
│   └── foundry/              # Smart contracts
│       ├── contracts/        # Solidity contracts
│       ├── scripts/          # Deployment scripts
│       └── test/             # Contract tests
├── contracts/                # Deployed contract addresses
└── README.md
```

### Available Scripts

**Frontend (Next.js)**

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn type-check   # Run TypeScript checks
```

**Smart Contracts (Foundry)**

```bash
yarn forge build     # Compile contracts
yarn forge test      # Run tests
yarn forge deploy    # Deploy contracts
yarn forge verify    # Verify contracts on explorer
```

### Smart Contract Functions

**Core Functions**

- `registerMerchant(label, address)`: Register a merchant domain
- `issueReceipt(buyer, ipfsHash)`: Issue a new receipt
- `flagGadget(receiptId, status)`: Update device status
- `recycleGadget(receiptId)`: Mark device as recycled

**View Functions**

- `getReceipt(receiptId)`: Get receipt details
- `getMerchantReceipts(merchant)`: Get merchant's receipts
- `isVerifiedMerchant(address)`: Check merchant status
- `getSubscription(merchant)`: Get subscription details

## 🌐 Network Configuration

### Base Sepolia Testnet

- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Contract Address**: `0x86058fcc782701b7fcbc31f85c2ea76cd58820b3`

### ENS Configuration

- **Base Node**: `proofmint.eth`
- **Registry**: `0xA0A5d77664D6C5E466156d78Ca98F98B146b90bA`

## 💰 Subscription Tiers

| Tier       | Monthly Price | Receipt Limit | Features                 |
| ---------- | ------------- | ------------- | ------------------------ |
| Basic      | $10 USDC      | 100 receipts  | Basic receipt management |
| Premium    | $50 USDC      | 500 receipts  | Advanced analytics       |
| Enterprise | $100 USDC     | Unlimited     | Full feature access      |

## 🔒 Security Features

- **Access Control**: Role-based permissions
- **Immutable Storage**: IPFS for metadata
- **Domain Verification**: ENS-based merchant verification
- **Smart Contract Audits**: Regular security reviews
- **Input Validation**: Comprehensive data validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Ensure all checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) - Development framework
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [ENS](https://ens.domains/) - Domain name service
- [IPFS](https://ipfs.io/) - Decentralized storage

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/Amity808/proofmint/wiki)
- **Issues**: [GitHub Issues](https://github.com/Amity808/proofmint/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Amity808/proofmint/discussions)

## 🔮 Roadmap

### Phase 1 (Current)

- ✅ Core receipt management
- ✅ Merchant verification
- ✅ Basic subscription system

### Phase 2 (Q2 2024)

- 🔄 Advanced analytics dashboard
- 🔄 Mobile application
- 🔄 API for third-party integrations

### Phase 3 (Q3 2024)

- 📋 Multi-chain support
- 📋 Advanced recycling rewards
- 📋 Community governance

---

**Built with ❤️ for a sustainable future**
