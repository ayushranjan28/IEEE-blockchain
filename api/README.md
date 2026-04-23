# IEEE Blockchain — Backend API (`api/`)

Node.js + Express backend for the **Blockchain-Based Chemical Evidence Verification System**.  
Lives at `api/` inside the monorepo, alongside `smart-contracts/`, `schema/`, and `docs/`.

---

## Prerequisites

1. **Deploy the smart contract first** (inside `smart-contracts/`):
   ```bash
   cd ../smart-contracts
   npm install
   npx hardhat compile               # generates artifact the ABI loader reads
   npx hardhat node                  # starts local blockchain at :8545
   # in a new terminal:
   npx hardhat run scripts/deploy.js --network localhost
   # → copy printed contract address
   ```

2. **Create your `.env`** (inside `api/`):
   ```bash
   cp .env.example .env
   # fill in: RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS, PINATA_API_KEY, PINATA_SECRET_KEY
   ```

3. **Install & run**:
   ```bash
   npm install
   npm run dev       # development (nodemon)
   npm start         # production
   npm test          # Jest tests
   ```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/evidence/register` | Upload file → hash → IPFS → blockchain |
| `GET`  | `/api/evidence/:id` | Fetch on-chain record |
| `POST` | `/api/evidence/:id/transfer` | Transfer custody (signed tx) |
| `POST` | `/api/evidence/:id/verify` | Re-hash uploaded file vs on-chain hash |
| `GET`  | `/health` | Server health check |

### POST `/api/evidence/register`
Send as `multipart/form-data`:

| Field | Type | Required |
|-------|------|----------|
| `file` | File | ✅ |
| `location` | string | ✅ |
| `investigator` | string | ✅ |
| `sampleType` | string | ❌ (e.g. "GC-MS") |
| `notes` | string | ❌ |

Response `201`:
```json
{
  "evidenceId": "1",
  "fileHash": "0x...",
  "ipfsCid": "QmXyz...",
  "ipfsGateway": "https://gateway.pinata.cloud/ipfs/QmXyz...",
  "txHash": "0x...",
  "blockNumber": 42,
  "metadata": { "location": "...", "investigator": "...", "uploadedAt": "..." }
}
```

### POST `/api/evidence/:id/transfer`
Send as JSON:
```json
{ "newCustodian": "0xNewAddress..." }
```

### POST `/api/evidence/:id/verify`
Send as `multipart/form-data` with `file`. Returns:
```json
{
  "verified": true,
  "verdict": "✅ INTACT — file matches the on-chain record.",
  "computedHash": "0x...",
  "storedHash": "0x..."
}
```

---

## Folder Structure

```
api/
├── server.js                    ← Entry point
├── .env.example                 ← Environment variable template
├── package.json
├── config/
│   └── contractABI.js           ← Auto-loads from Hardhat artifact
├── services/
│   ├── blockchainService.js     ← Ethers.js v6 → EvidenceManager.sol
│   ├── ipfsService.js           ← Pinata upload/pin
│   └── hashService.js           ← SHA-256 → bytes32 hex
├── controllers/
│   └── evidenceController.js    ← Business logic
├── routes/
│   └── evidence.js              ← Route definitions + multer
├── middleware/
│   └── errorHandler.js          ← Central error handling
└── tests/
    └── evidence.test.js         ← Jest + Supertest (mocked)
```

---

## Repo Structure (full monorepo)

```
IEEE-blockchain/
├── api/          ← THIS folder (backend)
├── smart-contracts/
│   ├── contracts/
│   │   ├── EvidenceManager.sol
│   │   └── IEvidenceManager.sol
│   ├── scripts/deploy.js
│   └── hardhat.config.js
├── schema/       ← JSON schemas for request/response validation
├── docs/         ← Project documentation
└── .gitignore
```
