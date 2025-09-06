// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import Durin’s registry interface
interface IL2Registry {
    /// Called to create a subnode under parentNode.
    /// Returns the ENS namehash of the new node.
    function createSubnode(
        bytes32 node,
        string calldata label,
        address owner,
        bytes[] calldata data
    ) external returns (bytes32);
    function baseNode() external view returns (bytes32);
    function setAddr(bytes32 node, uint256 coinType, bytes calldata a) external;
    function makeNode(
        bytes32 parentNode,
        string calldata label
    ) external pure returns (bytes32);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function namehash(string calldata name) external pure returns (bytes32);
    
}


contract ENSSubnameRegistrar{
    IL2Registry public registry;

    // Track creator info per creatorNode
    mapping(bytes32 => address) public creatorOwner;
    mapping(address => bytes32[]) public creatorFans;

    event CreatorRegistered(bytes32 indexed creatorNode, string label, address indexed owner);
    event FanRegistered(bytes32 indexed fanNode, string label, address indexed owner);

    /// @notice The chainId for the current chain
    uint256 public chainId;

    /// @notice The coinType for the current chain (ENSIP-11)
    uint256 public immutable coinType;

    /// @notice Initializes the registrar with a registry contract
    /// @param _registry Address of the L2Registry contract
    constructor(address _registry) {
        // Save the chainId in memory (can only access this in assembly)
        assembly {
            sstore(chainId.slot, chainid())
        }

        // Calculate the coinType for the current chain according to ENSIP-11
        coinType = (0x80000000 | chainId) >> 0;

        // Save the registry address
        registry = IL2Registry(_registry);
    }

    /// Admin registers a creator subname under the root (e.g. `davido.fantoken.eth`)
    function registerCreator(
        string calldata label,
        address creatorAddr
    ) external returns (bytes32 creatorNode) {

        bytes32 node = _labelToNode(label);
        require(creatorOwner[node] == address(0), "Label taken");
        bytes memory addr = abi.encodePacked(creatorAddr); // Convert address to bytes

        // Set the forward address for the current chain. This is needed for reverse resolution.
        // E.g. if this contract is deployed to Base, set an address for chainId 8453 which is
        // coinType 2147492101 according to ENSIP-11.
        registry.setAddr(node, coinType, addr);

        // Set the forward address for mainnet ETH (coinType 60) for easier debugging.
        registry.setAddr(node, 60, addr);

        creatorNode = registry.createSubnode(
            registry.baseNode(),
            label,
            creatorAddr,
            new bytes[](0)
        );

        creatorOwner[creatorNode] = creatorAddr;
        emit CreatorRegistered(creatorNode, label, creatorAddr);
    }

 

    function _labelToNode(
        string calldata label
    ) private view returns (bytes32) {
        return registry.makeNode(registry.baseNode(), label);
    }
}