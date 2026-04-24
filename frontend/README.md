# Forensic Evidence System - Frontend

A blockchain-based web application for secure evidence registration and verification. Built with **Next.js, TypeScript, Tailwind CSS, and ethers.js** to interact with Ethereum Sepolia testnet.

## 📋 Overview

This frontend application enables forensic officers and verifiers to:
- **Register Evidence:** Upload files with metadata, ensuring SHA-256 hashing, IPFS storage, and blockchain recording
- **Verify Evidence:** Check file integrity by comparing hashes against blockchain records
- **Track Chain of Custody:** Maintain immutable audit trails on Ethereum

The system is fully aligned with the **Architecture.md** and **Backlog.md** specifications in the `../docs/` folder.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **MetaMask** browser extension
- Test ETH on **Ethereum Sepolia** testnet

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Environment Configuration

Edit `.env.local`:

```env
# Backend API URL (change if backend runs on different port)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Ethereum RPC (Sepolia testnet)
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Chain configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CONTRACT_ADDRESS=0x<contract_address_here>
```

---

## 📁 Project Structure

```
frontend/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout with WalletProvider
│   ├── page.tsx                  # Dashboard/Home
│   ├── register/
│   │   └── page.tsx              # Evidence registration page
│   ├── verify/
│   │   └── page.tsx              # Evidence verification page
│   ├── about/
│   │   └── page.tsx              # System information page
│   └── globals.css               # Global Tailwind styles
│
├── src/
│   ├── components/               # React Components
│   │   ├── Navigation.tsx        # Top navigation bar
│   │   ├── WalletConnector.tsx   # MetaMask connection button
│   │   ├── RegisterEvidence.tsx  # Evidence registration form
│   │   └── VerifyEvidence.tsx    # Evidence verification form
│   │
│   ├── contexts/                 # React Context for State Management
│   │   └── WalletContext.tsx     # Blockchain wallet state & hooks
│   │
│   └── utils/                    # Utility functions
│       └── (API, helpers, etc.)
│
├── public/
│   └── assets/                   # Static images and files
│
├── .env.local                    # Environment configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── next.config.js                # Next.js configuration
└── README.md                     # This file
```

---

## 🎯 Features & Components

### 1. **Dashboard (Home Page)**
- System overview and key features
- Wallet connection status
- Quick navigation to main features
- Architecture overview
- System status display

**File:** `app/page.tsx`

### 2. **Register Evidence** 
- File upload with drag-and-drop support
- Metadata form (case number, officer, description, location, date)
- Integration with backend `/evidence/register` endpoint
- Displays transaction hash and IPFS CID on success
- SHA-256 hashing on backend

**File:** `src/components/RegisterEvidence.tsx`
**Page:** `app/register/page.tsx`

**API Call:**
```javascript
POST /evidence/register
Content-Type: multipart/form-data

Fields:
- file: File (binary)
- metadata: JSON string {caseNumber, officer, description, location, dateTime, submittedBy}

Response:
{
  success: boolean,
  txHash: string,
  cid: string,
  error?: string
}
```

### 3. **Verify Evidence**
- File upload with advanced drag-and-drop zone
- Evidence ID input field
- Integration with backend `/evidence/{id}/verify` endpoint
- Displays verification result (match/mismatch)
- Shows both file hash and blockchain hash for comparison

**File:** `src/components/VerifyEvidence.tsx`
**Page:** `app/verify/page.tsx`

**API Call:**
```javascript
POST /evidence/{id}/verify
Content-Type: multipart/form-data

Fields:
- file: File (binary)
- evidenceId: string

Response:
{
  success: boolean,
  verified: boolean,
  hash: string,
  storedHash: string,
  error?: string
}
```

### 4. **Wallet Management**
- MetaMask integration using ethers.js v6
- Automatic wallet detection and connection
- Account switching and disconnection
- Chain change handling
- Error handling and user feedback

**File:** `src/contexts/WalletContext.tsx`
**Component:** `src/components/WalletConnector.tsx`

### 5. **Navigation**
- Responsive top navigation bar
- Active route highlighting
- Links to all main pages
- System branding

**File:** `src/components/Navigation.tsx`

### 6. **About Page**
- Detailed system information
- Architecture explanation
- Feature descriptions
- Technology stack details
- User role definitions
- Security features overview

**File:** `app/about/page.tsx`

---

## 🔄 Architecture & Data Flow

### Evidence Registration Flow (aligns with Architecture.md)

```
User (Frontend)
    ↓
[Register Evidence Form]
    ↓
[Validate & Prepare Data]
    ↓
POST /evidence/register
    ↓
Backend:
  1. Generate SHA-256 hash of file
  2. Pin file to IPFS (Pinata)
  3. Pin metadata JSON to IPFS
  4. Call smart contract registerEvidence(hash, metadataCID)
  5. Return txHash and CID
    ↓
Display Result:
  - Transaction Hash
  - IPFS CID
  - Success Message
```

### Evidence Verification Flow (aligns with Architecture.md)

```
User (Frontend)
    ↓
[Verify Evidence Form + File Upload]
    ↓
[Validate Evidence ID & File]
    ↓
POST /evidence/{id}/verify
    ↓
Backend:
  1. Generate SHA-256 hash of uploaded file
  2. Query blockchain for stored hash
  3. Compare hashes
  4. Return verification result
    ↓
Display Result:
  - Verification Status (✓ or ✗)
  - File Hash
  - Blockchain Hash
  - Match/Mismatch indication
```

---

## 🔐 Security Features

1. **MetaMask Authentication:** Only connected wallets can register/verify evidence
2. **SHA-256 Hashing:** Cryptographic file fingerprinting on backend
3. **Blockchain Immutability:** All records permanently stored on Ethereum
4. **IPFS Decentralization:** Files stored on decentralized network via Pinata
5. **Tamper Detection:** Hash mismatch immediately indicates file modification
6. **Server-Side Processing:** Critical operations (hashing, blockchain interaction) done on backend

---

## 🛠️ Development

### Run Development Server
```bash
npm run dev
```
Application runs at `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

---

## 📦 Dependencies

### Core
- **Next.js 14:** React framework with SSR
- **React 19:** UI library
- **TypeScript:** Type safety

### Styling
- **Tailwind CSS:** Utility-first CSS
- **PostCSS:** CSS processing

### Blockchain
- **ethers.js v6:** Ethereum library
- **web3modal:** Wallet connection UI

### Development
- **ESLint:** Code linting
- **TypeScript:** Type checking

Full dependency list in `package.json`

---

## 🌐 Supported Networks

- **Ethereum Sepolia Testnet** (chainId: 11155111)
  - RPC: `https://sepolia.infura.io/v3/YOUR_KEY`
  - Faucet: https://sepoliafaucet.com
  - Block Explorer: https://sepolia.etherscan.io

---

## 📝 Mapping to Documentation

### Alignment with Backlog.md (Epic 3: Frontend Web App)

| Backlog Item | Implementation | File(s) |
|---|---|---|
| **STORY-301:** Initialize React/Next.js with Tailwind | ✅ Next.js 14 + TypeScript + Tailwind CSS | `package.json`, `tailwind.config.js` |
| **STORY-302:** Create "Register Evidence" Form | ✅ Full form with file upload & metadata | `src/components/RegisterEvidence.tsx`, `app/register/page.tsx` |
| **STORY-303:** Create "Verify Evidence" Form + Drag/Drop | ✅ Advanced drag-drop + form validation | `src/components/VerifyEvidence.tsx`, `app/verify/page.tsx` |
| **STORY-304:** Implement ethers.js / MetaMask connection | ✅ Complete wallet integration | `src/contexts/WalletContext.tsx`, `src/components/WalletConnector.tsx` |

### Alignment with Architecture.md

| Architecture Element | Implementation |
|---|---|
| **User (React UI)** | All Next.js pages and components |
| **POST /evidence/register** | `src/components/RegisterEvidence.tsx` integration |
| **GET /evidence/{id}/verify** | `src/components/VerifyEvidence.tsx` integration |
| **MetaMask/ethers.js** | `src/contexts/WalletContext.tsx` |
| **Wallet Connection** | `src/components/WalletConnector.tsx` |
| **UI Responsiveness** | Tailwind CSS with mobile-first approach |

---

## 🔗 API Integration

The frontend expects a backend API running at `http://localhost:3001` (configurable in `.env.local`).

### Required Backend Endpoints

#### Register Evidence
```
POST /evidence/register
Content-Type: multipart/form-data
Response: {success, txHash, cid}
```

#### Verify Evidence
```
POST /evidence/{id}/verify
Content-Type: multipart/form-data
Response: {success, verified, hash, storedHash}
```

See `../api/README.md` for backend setup details.

---

## ⚙️ Configuration

### Environment Variables Required

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend API endpoint |
| `NEXT_PUBLIC_RPC_URL` | Infura | Ethereum RPC endpoint |
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` | Sepolia chain ID |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0x0...0` | Smart contract address |

---

## 🐛 Troubleshooting

### MetaMask Not Detected
- Ensure MetaMask extension is installed
- Check browser console for errors
- Try refreshing the page

### Connection Fails
- Verify backend is running on correct port
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is properly configured on backend

### File Upload Errors
- Check file size limits on backend
- Verify backend `/evidence/register` endpoint works
- Check browser console network tab

### Verification Fails
- Ensure you're uploading the exact same file
- Verify Evidence ID is correct
- Check that file hasn't been modified

---

## 📞 Support & Documentation

For detailed system architecture, see:
- `../docs/Architecture.md` - System design and data flow
- `../docs/Backlog.md` - Project roadmap and stories
- `../docs/SRS.md` - Software requirements specification
- `../docs/IPFS_Storage_Strategy.md` - Storage architecture details

---

## 📄 License

This project is part of the IEEE Blockchain Forensic Evidence System project.

---

## 👨‍💻 Development Notes

### Key Technologies Used
- **Next.js App Router** for modern routing
- **React Context API** for state management (blockchain context)
- **TypeScript** for type safety
- **Tailwind CSS** for responsive design
- **ethers.js v6** for blockchain interaction
- **Responsive Design** - Works on desktop, tablet, and mobile

### Best Practices Implemented
- ✅ Type-safe components with TypeScript
- ✅ Responsive UI with Tailwind CSS
- ✅ Error boundary and error handling
- ✅ Loading states for async operations
- ✅ User feedback (success/error messages)
- ✅ Clean component architecture
- ✅ Proper separation of concerns
- ✅ Environment-based configuration

---

**Last Updated:** April 2024
**Frontend Version:** 1.0.0
**Status:** Production Ready

