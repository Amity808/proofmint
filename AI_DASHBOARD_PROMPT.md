# 🤖 AI Dashboard Generation Prompt for ProofMint

## Project Overview

Create a comprehensive frontend dashboard for **ProofMint** - a blockchain-powered proof of ownership system that mints NFT receipts at the point of purchase for electronics and gadgets.

## Core Concept

- **Proof of Mint**: Assets are minted as NFTs when customers purchase electronics
- **Lifecycle Tracking**: Track gadgets through Active → Stolen/Misplaced → Recycled states
- **Role-Based Access**: Merchants issue receipts, Buyers own receipts, Recyclers process disposal
- **IPFS Integration**: Receipt metadata stored on IPFS for immutability

## Smart Contract Structure

### Key Functions Available:

```solidity
// Admin functions
addMerchant(address merchant) - Add verified merchant
addRecycler(address recycler) - Add verified recycler

// Merchant functions
issueReceipt(address buyer, string ipfsHash) - Create NFT receipt

// Buyer functions
flagGadget(uint256 receiptId, GadgetStatus status) - Update gadget status

// Recycler functions
recycleGadget(uint256 receiptId) - Mark as recycled

// View functions
getReceipt(uint256 receiptId) - Get receipt details
getUserReceipts(address user) - Get user's receipts
getMerchantReceipts(address merchant) - Get merchant's receipts
```

### Gadget Status Enum:

- **Active** (0) - Normal use
- **Stolen** (1) - Reported stolen
- **Misplaced** (2) - Lost/misplaced
- **Recycled** (3) - Disposed of

## Required Dashboard Pages

### 1. **User Dashboard** (`/dashboard`)

**For Buyers - View owned NFT receipts**

**Features:**

- Stats cards: Total receipts, Total spent, Verified count
- Grid of receipt cards showing:
  - Product image placeholder
  - Product name, ID, merchant
  - Purchase date, price, transaction hash
  - Current gadget status with color coding
  - Action buttons: "View Details", "QR Code"
- Empty state with "Browse Marketplace" CTA
- Wallet connection requirement

**Dummy Data Structure:**

```typescript
interface Receipt {
  id: number;
  productName: string;
  productId: string;
  purchaseDate: string;
  price: string;
  currency: string;
  merchant: string;
  transactionHash: string;
  status: "Active" | "Stolen" | "Misplaced" | "Recycled";
  ipfsHash: string;
  image: string;
}
```

### 2. **Marketplace** (`/marketplace`)

**Product browsing and purchase flow**

**Features:**

- Product grid with search/filter
- Product cards showing:
  - Product image, name, description
  - Price, merchant, availability
  - "Buy Now" button (triggers minting)
- Purchase flow:
  - Connect wallet
  - Confirm transaction
  - Mint NFT receipt
  - Success confirmation
- Categories: Electronics, Gadgets, Accessories

**Dummy Data Structure:**

```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  merchant: string;
  category: string;
  image: string;
  inStock: boolean;
  specs: string[];
}
```

### 3. **Merchant Dashboard** (`/merchant`)

**For Merchants - Manage receipts and products**

**Features:**

- Merchant stats: Total receipts issued, Revenue
- Receipt management table
- Product catalog management
- Issue new receipts form
- Merchant verification status

### 4. **Recycler Dashboard** (`/recycler`)

**For Recyclers - Process gadget disposal**

**Features:**

- Available for recycling list
- Process recycling form
- Recycling history
- Environmental impact stats

### 5. **Admin Dashboard** (`/admin`)

**System administration**

**Features:**

- Add/remove merchants and recyclers
- View all receipts
- System statistics
- User role management

## Technical Requirements

### Tech Stack:

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **DaisyUI** for styling
- **Wagmi** + **Viem** for Web3 integration
- **RainbowKit** for wallet connection
- **React Query** for state management
- **Framer Motion** for animations

### Key Components Needed:

#### 1. **ReceiptCard Component**

```typescript
interface ReceiptCardProps {
  receipt: Receipt;
  onViewDetails: (id: number) => void;
  onGenerateQR: (id: number) => void;
}
```

#### 2. **ProductCard Component**

```typescript
interface ProductCardProps {
  product: Product;
  onBuy: (id: number) => void;
}
```

#### 3. **StatusBadge Component**

```typescript
interface StatusBadgeProps {
  status: GadgetStatus;
  size?: "sm" | "md" | "lg";
}
```

#### 4. **WalletConnection Component**

- Connect/Disconnect wallet
- Show wallet address
- Network switching (0G Testnet)

#### 5. **TransactionModal Component**

- Transaction progress
- Success/Error states
- Gas estimation

## Design System

### Colors:

- **Primary Green**: #22c55e (Sustainability theme)
- **Secondary Blue**: #3b82f6 (Trust/Technology)
- **Accent Purple**: #8b5cf6 (Innovation)
- **Status Colors**:
  - Active: Green
  - Stolen: Red
  - Misplaced: Yellow
  - Recycled: Gray

### Layout:

- **Header**: Logo, Navigation, Wallet Connection
- **Sidebar**: Role-based navigation (Buyer/Merchant/Recycler/Admin)
- **Main Content**: Dashboard-specific content
- **Footer**: Links, Social media

## User Flows

### 1. **Purchase Flow**:

1. Browse marketplace
2. Select product
3. Connect wallet
4. Confirm purchase
5. Mint NFT receipt
6. View in dashboard

### 2. **Status Update Flow**:

1. View receipt in dashboard
2. Click "Update Status"
3. Select new status (Stolen/Misplaced)
4. Confirm transaction
5. Status updated on blockchain

### 3. **Recycling Flow**:

1. Recycler views available items
2. Select item for recycling
3. Confirm recycling transaction
4. Item marked as recycled

## Dummy Data Requirements

### Sample Products (10+ items):

- iPhone 15 Pro, MacBook Air M3, Samsung Galaxy S24
- Gaming laptops, Smart watches, Headphones
- Various price ranges ($99 - $2999)
- Different merchants (Apple, Samsung, Dell, etc.)

### Sample Receipts (5+ items):

- Mix of statuses (Active, Stolen, Misplaced, Recycled)
- Different merchants and buyers
- Realistic transaction hashes
- Various purchase dates

## Responsive Design

- **Mobile-first** approach
- **Grid layouts** that adapt to screen size
- **Touch-friendly** buttons and interactions
- **Swipe gestures** for mobile navigation

## Accessibility

- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **High contrast** mode support
- **Focus indicators** for all interactive elements

## Performance Requirements

- **Lazy loading** for images and components
- **Optimistic updates** for better UX
- **Error boundaries** for graceful failure handling
- **Loading states** for all async operations

## Integration Points

- **0G Testnet** for blockchain transactions
- **IPFS** for metadata storage
- **ENS** for user profiles
- **QR Code generation** for receipt verification

## Success Metrics

- User can browse and purchase products
- NFT receipts are minted successfully
- Users can view and manage their receipts
- Status updates work correctly
- All user roles function properly
- Mobile-responsive design
- Fast loading times

## File Structure Expected:

```
app/
├── dashboard/page.tsx          # User dashboard
├── marketplace/page.tsx        # Product marketplace
├── merchant/page.tsx           # Merchant dashboard
├── recycler/page.tsx           # Recycler dashboard
├── admin/page.tsx              # Admin dashboard
└── layout.tsx                  # Root layout

components/
├── dashboard/
│   ├── ReceiptCard.tsx
│   ├── StatsCard.tsx
│   └── EmptyState.tsx
├── marketplace/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   └── PurchaseModal.tsx
├── common/
│   ├── WalletConnection.tsx
│   ├── StatusBadge.tsx
│   └── LoadingSpinner.tsx
└── layout/
    ├── Header.tsx
    ├── Sidebar.tsx
    └── Footer.tsx
```

## Additional Notes

- Use **dummy data** for demonstration (no real blockchain calls)
- Implement **proper TypeScript** interfaces
- Follow **React best practices** (hooks, proper state management)
- Include **error handling** and loading states
- Make it **demo-ready** for hackathon presentation
- Focus on **user experience** and visual appeal
- Ensure **mobile responsiveness**

---

**Generate a complete, production-ready frontend dashboard that showcases the ProofMint concept with beautiful UI, smooth interactions, and comprehensive functionality for all user roles.**
