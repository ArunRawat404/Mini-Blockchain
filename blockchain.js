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

    // Mines the block by finding a hash that satisfies the difficulty level
    mineBlock(difficultyLevel) {
        // Keep trying different nonces until the hash meets the difficulty criteria
        while (
            this.blockHeader.hash.substring(0, difficultyLevel) !==
            Array(difficultyLevel + 1).join("0") // generates a string like '0000' for difficulty 4
        ) {
            this.blockHeader.nonce++; // Increment nonce to get a new hash each time
            this.blockHeader.hash = this.generateHash(); // Recalculate hash using updated nonce
        }

        console.log(`Block successfully mined with Hash: ${this.blockHeader.hash}`);
    }
}

// Creating the first block (Genesis Block)
const firstBlock = new SimpleBlock(0, Date.now(), "Genesis Block", "0");

console.log("Here is your first block : ", firstBlock);

// Creating a new block
const newBlock = new SimpleBlock(1, Date.now(), "This is a mined block", firstBlock.blockHeader.hash);

// Mining the new block
console.log("Mining the new block...");
newBlock.mineBlock(5); // Difficulty level of 5

// Displaying the mined block
console.log("Here is your mined block : ", newBlock);