# 🔗 Simple JavaScript Blockchain

A beginner-friendly implementation of a blockchain written in JavaScript. This project simulates key concepts of blockchain technology such as block mining, hashing, nonce, and chain validation in a clear and interactive way.

## 📦 Features

- Block structure with header and body
- Hash generation using SHA256
- Mining process with adjustable difficulty
- Automatic linking between blocks
- Blockchain validation to detect tampering
- Interactive CLI to add custom data into the blocks
- Neatly formatted blockchain visualization

## 🔧 How It Works

### Block Structure

Each block consists of:

- `index`: Position of the block in the chain
- `timestamp`: When the block was created
- `data`: Payload (e.g., transaction details)
- `previousHash`: Hash of the previous block
- `hash`: Hash of the current block (generated from block data + nonce)
- `nonce`: Number that is adjusted to find a valid hash

### ⛏️ Mining a Block

```js
mineBlock(difficultyLevel) {
    while (
        this.blockHeader.hash.substring(0, difficultyLevel) !==
        Array(difficultyLevel + 1).join("0")
    ) {
        this.blockHeader.nonce++;
        this.blockHeader.hash = this.generateHash();
    }
}
```

This is a brute-force proof-of-work mechanism that simulates real mining. The miner keeps adjusting the nonce until a hash is found that starts with `difficultyLevel` number of leading zeroes.

### ✅ Chain Validation

To ensure the blockchain hasn't been tampered with:

- Each block's hash is recalculated and compared with the stored hash.
- Each block's `previousHash` must match the actual hash of the previous block.

### 💻 Installation & Running

Make sure you have Node.js installed.

Then, just run:

```bash
node blockchain.js
```

You’ll be prompted to enter how many blocks you want to add and provide custom data for each one.

### 🖨️ Output

```ansi
Creating the genesis block...

How many blocks would you like to add? 2

Enter data for Block 1: This is the first block
Mining a new block with difficulty 2...
Block successfully mined with Hash: 00abc3188ef5996f25e2982a902514f3e45d6ef16239794f227fc8935b621801
Block successfully added to the blockchain!

Enter data for Block 2: This is the second block
Mining a new block with difficulty 2...
Block successfully mined with Hash: 00b001322782377334d1bbb39788ef5a3720ca4bc890a860fd98ac6b2b703bd2
Block successfully added to the blockchain!

Final Blockchain Structure:

--- Blockchain Visualization ---

Block 0:
  Header:
    Index: 0
    Timestamp: Wed Apr 16 2025 21:06:53 GMT+0530 (India Standard Time)
    Previous Hash: 0
    Hash: f218d2219364feb70cee14f7ecc57ac782b37ced75aab63c3b66624f8ab4294b
    Nonce: 0
  Body:
    Data: Genesis Block

Block 1:
  Header:
    Index: 1
    Timestamp: Wed Apr 16 2025 21:07:04 GMT+0530 (India Standard Time)
    Previous Hash: f218d2219364feb70cee14f7ecc57ac782b37ced75aab63c3b66624f8ab4294b
    Hash: 00abc3188ef5996f25e2982a902514f3e45d6ef16239794f227fc8935b621801
    Nonce: 58
  Body:
    Data: This is the first Block

Block 2:
  Header:
    Index: 2
    Timestamp: Wed Apr 16 2025 21:07:12 GMT+0530 (India Standard Time)
    Previous Hash: 00abc3188ef5996f25e2982a902514f3e45d6ef16239794f227fc8935b621801
    Hash: 00b001322782377334d1bbb39788ef5a3720ca4bc890a860fd98ac6b2b703bd2
    Nonce: 78
  Body:
    Data: This is the second Block

--- Chain Summary ---
 [Block 0: f218d221...294b] -> [Block 1: 00abc318...1801] -> [Block 2: 00b00132...3bd2]
```

### 💬 License

MIT — feel free to use and modify for learning purposes.
