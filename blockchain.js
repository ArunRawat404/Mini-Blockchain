const crypto = require("crypto");
const readline = require("readline");

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

    validateBlockchain() {
        console.log("\nValidating the blockchain...");

        // Start checking from the second block (index 1)
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Recalculate the hash and compare to stored hash
            if (currentBlock.blockHeader.hash !== currentBlock.generateHash()) {
                console.log(`Block ${i} has been tampered with!`);
                return false;
            }

            // Check if current block is properly linked to the previous one
            if (currentBlock.blockHeader.previousHash !== previousBlock.blockHeader.hash) {
                console.log(`Block ${i} is not linked to the previous block!`);
                return false;
            }
        }
        console.log("Blockchain is valid!");
        return true;
    }

    displayBlockchain() {
        console.log("\n--- Blockchain Visualization ---");
        this.chain.forEach((block, index) => {
            // Display each block's details
            console.log(`\nBlock ${index}:`);
            console.log(`  Header:`);
            console.log(`    Index: ${block.blockHeader.index}`);
            console.log(`    Timestamp: ${new Date(block.blockHeader.timestamp)}`);
            console.log(`    Previous Hash: ${block.blockHeader.previousHash}`);
            console.log(`    Hash: ${block.blockHeader.hash}`);
            console.log(`    Nonce: ${block.blockHeader.nonce}`);
            console.log(`  Body:`);
            console.log(`    Data: ${block.blockBody.data}`);
        });

        console.log(
            "\n--- Chain Summary ---\n",
            this.chain.map((block) =>
                `[Block ${block.blockHeader.index}: ${block.blockHeader.hash.substring(0, 8)}...${block.blockHeader.hash.slice(-4)}]`
            ).join(" -> ")
        );
    }
}

// Setting up the Readline Interface for input and output streams
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to run an interactive blockchain session
function interactiveBlockchain() {
    const myBlockchain = new SimpleBlockchain();

    // Recursive function to add blocks based on user input
    function addBlockRecursively(blockIndex, totalBlocks) {
        // Base case: All requested blocks have been added
        if (blockIndex > totalBlocks) {
            console.log("\nFinal Blockchain Structure:");
            // Call the visualization method
            myBlockchain.displayBlockchain();
            rl.close();
            return;
        }

        // Ask the user to enter data for the current block
        rl.question(`\nEnter data for Block ${blockIndex}: `, (blockData) => {
            const newBlock = new SimpleBlock(
                blockIndex,
                Date.now(),
                blockData,
                myBlockchain.getLatestBlock().blockHeader.hash
            );

            myBlockchain.addNewBlock(newBlock);

            // Recursively prompt for the next block
            addBlockRecursively(blockIndex + 1, totalBlocks);
        });
    }

    // Ask how many blocks the user wants to add
    rl.question("\nHow many blocks would you like to add? ", (answer) => {
        const totalBlocks = parseInt(answer);

        // Validate input
        if (isNaN(totalBlocks) || totalBlocks <= 0) {
            console.log("Invalid input. Please enter a positive number.");
            // End the session on invalid input
            rl.close();
            return;
        }

        // Start adding blocks beginning from index 1
        addBlockRecursively(1, totalBlocks);
    });
}

// Start the interactive blockchain process
interactiveBlockchain();