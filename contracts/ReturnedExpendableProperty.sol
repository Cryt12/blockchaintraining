// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ReturnedExpendableProperty
/// @notice Stores only a receipt number and the SHA-256 hash of its off-chain
///         (Supabase) record. No personal data or receipt contents ever touch
///         this contract — it exists solely to make later tampering detectable.
contract ReturnedExpendableProperty {
    struct Receipt {
        string receiptNumber;
        bytes32 sha256Hash;
        uint256 timestamp;
        address sender;
        bool exists;
    }

    address public owner;

    // Wallets allowed to call storeReceipt (e.g. Property Custodian accounts).
    // Kept separate from `owner` so custodians don't need contract ownership
    // to submit receipts, and the owner can rotate access without redeploying.
    mapping(address => bool) public authorizedSubmitters;

    // receiptNumber => Receipt
    mapping(string => Receipt) private receipts;

    // receiptNumber is intentionally NOT indexed: indexing a string stores only its
    // keccak256 hash in the topic, which would make the actual receipt number
    // unreadable from the log itself (the Blockchain Logs page reads this directly).
    event ReceiptStored(
        string receiptNumber,
        bytes32 sha256Hash,
        address indexed sender,
        uint256 timestamp
    );

    event SubmitterAuthorized(address indexed submitter);
    event SubmitterRevoked(address indexed submitter);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedSubmitters[msg.sender], "Not an authorized submitter");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedSubmitters[msg.sender] = true;
        emit SubmitterAuthorized(msg.sender);
    }

    /// @notice Grants a wallet permission to store receipts.
    function addAuthorizedSubmitter(address submitter) external onlyOwner {
        require(submitter != address(0), "Invalid address");
        authorizedSubmitters[submitter] = true;
        emit SubmitterAuthorized(submitter);
    }

    /// @notice Revokes a wallet's permission to store receipts.
    function removeAuthorizedSubmitter(address submitter) external onlyOwner {
        authorizedSubmitters[submitter] = false;
        emit SubmitterRevoked(submitter);
    }

    /// @notice Records a receipt's hash on-chain. Callable once per receipt number
    ///         — receipts are immutable once stored, matching the "tamper-evident"
    ///         requirement (any later edit must show up as a hash mismatch, not a
    ///         silently overwritten on-chain record).
    /// @param receiptNumber Human-readable receipt number, e.g. "RRP-2026-000001".
    /// @param sha256Hash SHA-256 hash of the receipt's canonical JSON, as bytes32.
    function storeReceipt(string calldata receiptNumber, bytes32 sha256Hash)
        external
        onlyAuthorized
    {
        require(bytes(receiptNumber).length > 0, "Receipt number required");
        require(sha256Hash != bytes32(0), "Hash required");
        require(!receipts[receiptNumber].exists, "Receipt already stored");

        receipts[receiptNumber] = Receipt({
            receiptNumber: receiptNumber,
            sha256Hash: sha256Hash,
            timestamp: block.timestamp,
            sender: msg.sender,
            exists: true
        });

        emit ReceiptStored(receiptNumber, sha256Hash, msg.sender, block.timestamp);
    }

    /// @notice Compares a freshly computed hash against the one stored on-chain.
    /// @return True if the receipt exists and the hashes match.
    function verifyReceipt(string calldata receiptNumber, bytes32 sha256Hash)
        external
        view
        returns (bool)
    {
        Receipt storage r = receipts[receiptNumber];
        return r.exists && r.sha256Hash == sha256Hash;
    }

    /// @notice Returns the stored record for a receipt number.
    function getReceipt(string calldata receiptNumber)
        external
        view
        returns (
            string memory receiptNumberOut,
            bytes32 sha256Hash,
            uint256 timestamp,
            address sender,
            bool exists
        )
    {
        Receipt storage r = receipts[receiptNumber];
        return (r.receiptNumber, r.sha256Hash, r.timestamp, r.sender, r.exists);
    }
}
