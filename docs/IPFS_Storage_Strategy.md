# IPFS Storage Strategy

## Objective
To ensure that evidence files and their corresponding metadata are stored in a decentralized, tamper-proof manner while keeping Ethereum gas costs minimally viable.

## Hashing Standard
All files uploaded to the backend MUST be hashed using the **SHA-256** algorithm *before* any upload to IPFS occurs. This hash acts as the definitive fingerprint of the file.

### Backend Process:
```javascript
const crypto = require('crypto');
function generateHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}
```

## IPFS Submission Workflow

1. **File Upload**: The original evidence file (e.g., `crime_scene_photo.jpg`) is pinned to IPFS (via Pinata API). This yields `File_CID`.
2. **Metadata Construction**: A JSON object is constructed matching `schema/evidence-metadata.json`, injecting the `File_CID` into the record.
3. **Metadata Upload**: The JSON object itself is pinned to IPFS. This yields the `Metadata_CID`.

## Smart Contract Storage
To preserve gas:
- The Smart Contract will **only** store the `sha256` hash (as `bytes32`) and the `Metadata_CID` (as `string`). 
- It will NOT store individual metadata fields (like officer name, date, location). These are fetched dynamically from IPFS using the `Metadata_CID`.

## Retrieval
To read evidence:
1. Fetch `Metadata_CID` from the blockchain.
2. Resolve `ipfs://<Metadata_CID>` to get the JSON.
3. Read the JSON to display case details and fetch the `File_CID` for rendering the actual evidence image/document.
