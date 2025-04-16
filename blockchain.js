const crypto = require("crypto");

class SimpleBlock {
    constructor(blockIndex, timestamp, blockData, previousBlockHash = "") {
        // Metadata that defines the block's identity and integrity
        this.blockHeader = {
            index: blockIndex,          // Position of the block in the chain (0 = genesis)
            timestamp,                  // Block creation time
            previousHash: previousBlockHash, // Hash of the previous block (links the chain)
            hash: "",                   // This block's hash (generated after mining)
            nonce: 0                    // Used during mining to find a valid hash (proof-of-work)
        };

        // Actual content or payload stored in the block
        this.blockBody = {
            data: blockData             // Transactions or messages for this block
        };

        // Automatically generate the block's unique hash when created
        this.blockHeader.hash = this.generateHash();
    }

    // Generates a SHA-256 hash based on block content (used as the block's unique ID)
    generateHash() {
        const { index, timestamp, previousHash, nonce } = this.blockHeader;
        const dataString = JSON.stringify(this.blockBody.data);

        return crypto
            .createHash("sha256") // Create SHA-256 hash instance
            .update(index + timestamp + previousHash + dataString + nonce) // Feed input
            .digest("hex"); // Return hash in hex format, 64 hex characters
    }
}

//  first (Genesis) block
const firstBlock = new SimpleBlock(0, Date.now(), "Genesis Block", 0)

console.log(`
    Block Details: 
    Index: ${firstBlock.blockHeader.index}
    Timestamp: ${new Date(firstBlock.blockHeader.timestamp)}
    Hash: ${firstBlock.blockHeader.hash}    
`);