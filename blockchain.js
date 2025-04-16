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

class SimpleBlockchain {
    constructor() {
        // Initialize the blockchain with the genesis block
        this.chain = [this.createGenesisBlock()];
    }

    // Method to create the genesis block
    createGenesisBlock() {
        console.log("Creating the genesis block...");
        return new SimpleBlock(0, Date.now(), "Genesis Block", "0");
    }

    // Returns the most recent block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Adds a new block to the chain after linking and mining it
    addNewBlock(newBlock) {
        // Set previousHash of new block to the hash of the latest block
        newBlock.blockHeader.previousHash = this.getLatestBlock().blockHeader.hash;

        // Begin mining with a difficulty of 2
        console.log(`Mining a new block with difficulty 2...`);
        newBlock.mineBlock(2);

        // Append the mined block to the blockchain
        this.chain.push(newBlock);
        console.log("Block successfully added to the blockchain!");
    }
}

// Instantiate a new blockchain
const myBlockchain = new SimpleBlockchain();

// Create and add the first block after the genesis block
const block1 = new SimpleBlock(1, Date.now(), "First block after genesis");
myBlockchain.addNewBlock(block1);

// Create and add the second block
const block2 = new SimpleBlock(2, Date.now(), "Second block after genesis");
myBlockchain.addNewBlock(block2);

// Print the entire blockchain in a structured format
console.log("\n--- Blockchain Structure ---");
console.log(JSON.stringify(myBlockchain, null, 2));