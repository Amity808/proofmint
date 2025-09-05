// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Importing OpenZeppelin's Ownable for access control, allowing only the contract owner to perform admin tasks.
import "@openzeppelin/contracts/access/Ownable.sol";

// ProofMint contract enables decentralized tracking of gadget ownership and lifecycle (active, stolen, misplaced, recycled).
// It uses IPFS for immutable receipt metadata storage and enforces role-based access for merchants, buyers, and recyclers.
// This contract prioritizes security, transparency, and extensibility for supply chain use cases.
contract ProofMint is Ownable {

    // Enum defining gadget lifecycle states for clear status tracking.
    enum GadgetStatus {
        Active,     // 0 - Gadget is in normal use
        Stolen,     // 1 - Gadget reported as stolen
        Misplaced,  // 2 - Gadget reported as lost/misplaced
        Recycled    // 3 - Gadget has been recycled
    }

    // Enum defining subscription tiers with different limits and pricing.
    enum SubscriptionTier {
        Basic,      // 0 - Basic tier: 100 receipts/month
        Premium,    // 1 - Premium tier: 500 receipts/month  
        Enterprise  // 2 - Enterprise tier: unlimited receipts
    }

    // Struct to store merchant subscription details.
    struct Subscription {
        SubscriptionTier tier;        // Subscription tier level
        uint256 expiresAt;           // Timestamp when subscription expires
        uint256 receiptsIssued;      // Number of receipts issued this period
        uint256 lastResetTime;       // Last time receipt counter was reset
        bool isActive;               // Whether subscription is currently active
    }

    // Struct to store receipt details, linking ownership and metadata.
    struct Receipt {
        uint256 id;               // Unique identifier for the receipt
        address merchant;         // Address of the merchant issuing the receipt
        address buyer;            // Address of the buyer/owner
        string ipfsHash;          // IPFS hash storing receipt metadata (e.g., serial number, description)
        uint256 timestamp;        // Creation timestamp of the receipt
        GadgetStatus gadgetStatus;// Current status of the gadget
        uint256 lastStatusUpdate; // Timestamp of the last status change
    }

    // Storage mappings for efficient data retrieval.
    mapping(address => bool) public verifiedMerchants;       // Tracks verified merchants
    mapping(address => bool) public recyclers;               // Tracks verified recyclers
    mapping(uint256 => Receipt) public receipts;             // Maps receipt ID to receipt details
    mapping(address => uint256[]) public merchantReceipts;   // Maps merchant to their issued receipt IDs
    mapping(address => uint256[]) public buyerReceipts;      // Maps buyer to their purchased receipt IDs
    mapping(address => Subscription) public subscriptions;   // Maps merchant to their subscription details

    // Subscription pricing in wei (ETH)
    uint256 public constant BASIC_MONTHLY_PRICE = 0.01 ether;     // 0.01 ETH per month
    uint256 public constant PREMIUM_MONTHLY_PRICE = 0.05 ether;   // 0.05 ETH per month  
    uint256 public constant ENTERPRISE_MONTHLY_PRICE = 0.1 ether; // 0.1 ETH per month
    
    // Subscription limits
    uint256 public constant BASIC_RECEIPT_LIMIT = 100;
    uint256 public constant PREMIUM_RECEIPT_LIMIT = 500;
    uint256 public constant GRACE_PERIOD = 7 days;
    uint256 public constant MONTHLY_DURATION = 30 days;

    // Counter for generating unique receipt IDs, starting at 1.
    uint256 public nextReceiptId = 1;

    // Events for transparency and off-chain monitoring.
    event MerchantAdded(address indexed merchant);           // Emitted when a merchant is verified
    event RecyclerAdded(address indexed recycler);           // Emitted when a recycler is verified
    event ReceiptIssued(uint256 indexed id, address indexed merchant, address indexed buyer, string ipfsHash); // Emitted on receipt creation
    event GadgetStatusChanged(uint256 indexed receiptId, GadgetStatus newStatus, address updatedBy); // Emitted on status updates
    event GadgetRecycled(uint256 indexed receiptId, address indexed recycler); // Emitted when gadget is recycled
    event SubscriptionPurchased(address indexed merchant, SubscriptionTier tier, uint256 duration, uint256 expiresAt); // Emitted when subscription is purchased
    event SubscriptionExpired(address indexed merchant); // Emitted when subscription expires

    // Custom errors for gas-efficient revert messages.
    error NotVerifiedMerchant();  // Thrown when a non-verified merchant attempts an action
    error NotRecycler();          // Thrown when a non-verified recycler attempts an action
    error OnlyAdmin();            // Thrown when a non-owner attempts admin actions
    error OnlyBuyerCanFlag();     // Thrown when a non-buyer attempts to flag gadget status
    error InvalidReceipt();       // Thrown when an invalid receipt ID is provided
    error SubscriptionInactive(); // Thrown when merchant's subscription has expired
    error ReceiptLimitExceeded(); // Thrown when merchant exceeds their tier's receipt limit
    error InvalidPayment();       // Thrown when payment amount is incorrect
    error InvalidDuration();      // Thrown when subscription duration is invalid

    // Constructor initializing the contract with the deployer as the owner.
    constructor() Ownable(msg.sender) {}

    // Modifier ensuring only verified merchants can call specific functions.
    modifier onlyVerifiedMerchant() {
        if (!verifiedMerchants[msg.sender]) revert NotVerifiedMerchant();
        _;
    }

    // Modifier ensuring only verified recyclers can call specific functions.
    modifier onlyRecycler() {
        if (!recyclers[msg.sender]) revert NotRecycler();
        _;
    }

    // Modifier ensuring only the contract owner can call admin functions.
    modifier onlyAdmin() {
        if (msg.sender != owner()) revert OnlyAdmin();
        _;
    }

    // Admin function to add a verified merchant, restricted to contract owner.
    function addMerchant(address merchant) external onlyAdmin {
        verifiedMerchants[merchant] = true;
        emit MerchantAdded(merchant);
    }

    // Function for merchants to purchase a subscription.
    function purchaseSubscription(SubscriptionTier tier, uint256 durationMonths) external payable {
        if (!verifiedMerchants[msg.sender]) revert NotVerifiedMerchant();
        if (durationMonths == 0 || durationMonths > 12) revert InvalidDuration();
        
        uint256 monthlyPrice = getSubscriptionPrice(tier);
        uint256 totalPrice = monthlyPrice * durationMonths;
        
        // Apply yearly discount (10% off for 12 months)
        if (durationMonths == 12) {
            totalPrice = (totalPrice * 90) / 100;
        }
        
        if (msg.value != totalPrice) revert InvalidPayment();
        
        uint256 newExpirationTime = block.timestamp + (durationMonths * MONTHLY_DURATION);
        
        subscriptions[msg.sender] = Subscription({
            tier: tier,
            expiresAt: newExpirationTime,
            receiptsIssued: 0,
            lastResetTime: block.timestamp,
            isActive: true
        });
        
        emit SubscriptionPurchased(msg.sender, tier, durationMonths, newExpirationTime);
    }

    // Function for merchants to renew their existing subscription.
    function renewSubscription(uint256 durationMonths) external payable {
        if (!verifiedMerchants[msg.sender]) revert NotVerifiedMerchant();
        if (durationMonths == 0 || durationMonths > 12) revert InvalidDuration();
        
        Subscription storage sub = subscriptions[msg.sender];
        uint256 monthlyPrice = getSubscriptionPrice(sub.tier);
        uint256 totalPrice = monthlyPrice * durationMonths;
        
        // Apply yearly discount (10% off for 12 months)
        if (durationMonths == 12) {
            totalPrice = (totalPrice * 90) / 100;
        }
        
        if (msg.value != totalPrice) revert InvalidPayment();
        
        // Extend from current expiration or now, whichever is later
        uint256 extensionBase = sub.expiresAt > block.timestamp ? sub.expiresAt : block.timestamp;
        sub.expiresAt = extensionBase + (durationMonths * MONTHLY_DURATION);
        sub.isActive = true;
        
        emit SubscriptionPurchased(msg.sender, sub.tier, durationMonths, sub.expiresAt);
    }

    // Internal function to get subscription price based on tier.
    function getSubscriptionPrice(SubscriptionTier tier) internal pure returns (uint256) {
        if (tier == SubscriptionTier.Basic) return BASIC_MONTHLY_PRICE;
        if (tier == SubscriptionTier.Premium) return PREMIUM_MONTHLY_PRICE;
        return ENTERPRISE_MONTHLY_PRICE;
    }

    // Admin function to add a verified recycler, restricted to contract owner.
    function addRecycler(address recycler) external onlyAdmin {
        recyclers[recycler] = true;
        emit RecyclerAdded(recycler);
    }

    // Merchant function to issue a receipt, creating a new gadget record.
    // Stores metadata in IPFS and links it to buyer and merchant.
    function issueReceipt(
        address buyer,
        string calldata ipfsHash
    ) external onlyVerifiedMerchant returns (uint256 id) {
        // Check subscription validity and limits
        _checkSubscriptionAndLimits(msg.sender);
        
        id = nextReceiptId++; // Increment receipt ID counter
        
        // Create new receipt with initial Active status
        receipts[id] = Receipt({
            id: id,
            merchant: msg.sender,
            buyer: buyer,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            gadgetStatus: GadgetStatus.Active,
            lastStatusUpdate: block.timestamp
        });

        // Update merchant and buyer receipt lists
        merchantReceipts[msg.sender].push(id);
        buyerReceipts[buyer].push(id);

        // Increment receipt counter for the merchant
        subscriptions[msg.sender].receiptsIssued++;

        // Emit event for transparency
        emit ReceiptIssued(id, msg.sender, buyer, ipfsHash);
    }

    // Internal function to check subscription validity and receipt limits
    function _checkSubscriptionAndLimits(address merchant) internal {
        Subscription storage sub = subscriptions[merchant];
        
        // Check if subscription exists and is active
        if (!sub.isActive) revert SubscriptionInactive();
        
        // Check if subscription has expired (with grace period)
        if (block.timestamp > sub.expiresAt + GRACE_PERIOD) {
            sub.isActive = false;
            emit SubscriptionExpired(merchant);
            revert SubscriptionInactive();
        }
        
        // Reset monthly counter if a month has passed
        if (block.timestamp >= sub.lastResetTime + MONTHLY_DURATION) {
            sub.receiptsIssued = 0;
            sub.lastResetTime = block.timestamp;
        }
        
        // Check receipt limits (Enterprise tier has unlimited)
        if (sub.tier == SubscriptionTier.Basic && sub.receiptsIssued >= BASIC_RECEIPT_LIMIT) {
            revert ReceiptLimitExceeded();
        }
        if (sub.tier == SubscriptionTier.Premium && sub.receiptsIssued >= PREMIUM_RECEIPT_LIMIT) {
            revert ReceiptLimitExceeded();
        }
    }

    // View function to retrieve all receipt IDs issued by a merchant.
    function getMerchantReceipts(address merchant) external view returns (uint256[] memory) {
        return merchantReceipts[merchant];
    }

    // View function to retrieve all receipt IDs associated with a buyer.
    function getUserReceipts(address user) external view returns (uint256[] memory) {
        return buyerReceipts[user];
    }

    // Buyer function to flag a gadget's status (e.g., stolen, misplaced).
    // Only the receipt's buyer can update the status.
    function flagGadget(uint256 receiptId, GadgetStatus status) external {
        Receipt storage receipt = receipts[receiptId];
        if (receipt.merchant == address(0)) revert InvalidReceipt();
        if (receipt.buyer != msg.sender) revert OnlyBuyerCanFlag();
        
        receipt.gadgetStatus = status;
        receipt.lastStatusUpdate = block.timestamp;

        emit GadgetStatusChanged(receiptId, status, msg.sender);
    }

    // Recycler function to mark a gadget as recycled, restricted to verified recyclers.
    function recycleGadget(uint256 receiptId) external onlyRecycler {
        Receipt storage receipt = receipts[receiptId];
        if (receipt.merchant == address(0)) revert InvalidReceipt();
        
        receipt.gadgetStatus = GadgetStatus.Recycled;
        receipt.lastStatusUpdate = block.timestamp;

        // Emit both recycling and status change events for full traceability
        emit GadgetRecycled(receiptId, msg.sender);
        emit GadgetStatusChanged(receiptId, GadgetStatus.Recycled, msg.sender);
    }

    // Admin view function to retrieve all receipts, restricted to owner for auditing.
    function viewAllReceipts() external view onlyAdmin returns (Receipt[] memory) {
        Receipt[] memory allReceipts = new Receipt[](nextReceiptId - 1);
        
        for (uint256 i = 1; i < nextReceiptId; i++) {
            allReceipts[i - 1] = receipts[i];
        }
        
        return allReceipts;
    }

    // Public view function to retrieve details of a specific receipt.
    function getReceipt(uint256 receiptId) external view returns (Receipt memory) {
        if (receipts[receiptId].merchant == address(0)) revert InvalidReceipt();
        return receipts[receiptId];
    }

    // Public view function to retrieve key status information of a receipt.
    function getReceiptStatus(uint256 receiptId) external view returns (
        GadgetStatus status,
        address owner,
        address merchant,
        uint256 lastUpdate
    ) {
        Receipt memory receipt = receipts[receiptId];
        if (receipt.merchant == address(0)) revert InvalidReceipt();
        
        return (
            receipt.gadgetStatus,
            receipt.buyer,
            receipt.merchant,
            receipt.lastStatusUpdate
        );
    }

    // Public view function to check if an address is a verified merchant.
    function isVerifiedMerchant(address merchant) external view returns (bool) {
        return verifiedMerchants[merchant];
    }

    // Public view function to check if an address is a verified recycler.
    function isRecycler(address recycler) external view returns (bool) {
        return recyclers[recycler];
    }

    // Public view function to retrieve total number of receipts issued.
    function getTotalStats() external view returns (
        uint256 totalReceipts
    ) {
        return (nextReceiptId - 1);
    }

    // Public view function to get merchant's subscription details.
    function getSubscription(address merchant) external view returns (
        SubscriptionTier tier,
        uint256 expiresAt,
        uint256 receiptsIssued,
        uint256 receiptsRemaining,
        bool isActive,
        bool isExpired
    ) {
        Subscription memory sub = subscriptions[merchant];
        uint256 limit = sub.tier == SubscriptionTier.Basic ? BASIC_RECEIPT_LIMIT :
                       sub.tier == SubscriptionTier.Premium ? PREMIUM_RECEIPT_LIMIT : 0;
        
        // Calculate remaining receipts (0 means unlimited for Enterprise)
        uint256 remaining = 0;
        if (sub.tier != SubscriptionTier.Enterprise) {
            remaining = limit > sub.receiptsIssued ? limit - sub.receiptsIssued : 0;
        }
        
        return (
            sub.tier,
            sub.expiresAt,
            sub.receiptsIssued,
            remaining,
            sub.isActive,
            block.timestamp > sub.expiresAt
        );
    }

    // Public view function to get subscription pricing.
    function getSubscriptionPricing() external pure returns (
        uint256 basicMonthly,
        uint256 premiumMonthly,
        uint256 enterpriseMonthly,
        uint256 yearlyDiscount
    ) {
        return (
            BASIC_MONTHLY_PRICE,
            PREMIUM_MONTHLY_PRICE,
            ENTERPRISE_MONTHLY_PRICE,
            10 // 10% discount for yearly subscriptions
        );
    }

    // Admin function to withdraw accumulated subscription payments.
    function withdrawFunds() external onlyAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Admin function to pause/unpause a merchant's subscription (emergency).
    function pauseMerchantSubscription(address merchant, bool pause) external onlyAdmin {
        subscriptions[merchant].isActive = !pause;
        if (pause) {
            emit SubscriptionExpired(merchant);
        }
    }

    // Function to check if merchant can issue receipts (external view).
    function canIssueReceipts(address merchant) external view returns (bool) {
        if (!verifiedMerchants[merchant]) return false;
        
        Subscription memory sub = subscriptions[merchant];
        if (!sub.isActive) return false;
        if (block.timestamp > sub.expiresAt + GRACE_PERIOD) return false;
        
        // Check monthly limits
        uint256 currentReceiptCount = sub.receiptsIssued;
        if (block.timestamp >= sub.lastResetTime + MONTHLY_DURATION) {
            currentReceiptCount = 0; // Would be reset
        }
        
        if (sub.tier == SubscriptionTier.Basic && currentReceiptCount >= BASIC_RECEIPT_LIMIT) {
            return false;
        }
        if (sub.tier == SubscriptionTier.Premium && currentReceiptCount >= PREMIUM_RECEIPT_LIMIT) {
            return false;
        }
        
        return true;
    }
}