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

    // Counter for generating unique receipt IDs, starting at 1.
    uint256 public nextReceiptId = 1;

    // Events for transparency and off-chain monitoring.
    event MerchantAdded(address indexed merchant);           // Emitted when a merchant is verified
    event RecyclerAdded(address indexed recycler);           // Emitted when a recycler is verified
    event ReceiptIssued(uint256 indexed id, address indexed merchant, address indexed buyer, string ipfsHash); // Emitted on receipt creation
    event GadgetStatusChanged(uint256 indexed receiptId, GadgetStatus newStatus, address updatedBy); // Emitted on status updates
    event GadgetRecycled(uint256 indexed receiptId, address indexed recycler); // Emitted when gadget is recycled

    // Custom errors for gas-efficient revert messages.
    error NotVerifiedMerchant();  // Thrown when a non-verified merchant attempts an action
    error NotRecycler();          // Thrown when a non-verified recycler attempts an action
    error OnlyAdmin();            // Thrown when a non-owner attempts admin actions
    error OnlyBuyerCanFlag();     // Thrown when a non-buyer attempts to flag gadget status
    error InvalidReceipt();       // Thrown when an invalid receipt ID is provided

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

        // Emit event for transparency
        emit ReceiptIssued(id, msg.sender, buyer, ipfsHash);
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
}