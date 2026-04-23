# Software Requirements Specification (SRS)
## Blockchain-Based Forensic Evidence Verification System
**Version**: 1.0

### 1. Introduction
**1.1 Purpose**: This system provides a decentralized, immutable chain-of-custody tracking mechanism for forensic evidence. It ensures that digital evidence remains tamper-proof and verifiable by all authorized parties.

**1.2 Scope**:
The Minimum Viable Product (MVP) covers the registration of digital evidence (images, PDFs) by authorized officers, tracking custody transfers, and verifying integrity through SHA-256 hash matching against the Ethereum blockchain.

### 2. Overall Description
**2.1 User Roles**:
- **Admin**: Manages authorized personnel and system configuration.
- **Forensic Officer**: Can upload new evidence and initiate custody transfers.
- **Custodian**: Receives evidence and acts as the current owner.
- **Verifier (Auditor)**: Can read public records to verify evidence integrity.

**2.2 Assumptions & Dependencies**:
- Users have MetaMask installed to interact with the frontend.
- IPFS is used as the decentralized storage layer.
- Access to Ethereum Sepolia testnet is available.

### 3. Specific Requirements
**3.1 Functional Requirements**:
- **REQ-1**: The system shall generate a SHA-256 hash of the uploaded file on the backend.
- **REQ-2**: The system shall upload the file and its metadata to IPFS.
- **REQ-3**: The system shall record the IPFS CID and file hash on the blockchain.
- **REQ-4**: A custodian shall be able to transfer ownership to another authorized address.
- **REQ-5**: The system shall verify integrity by hashing an uploaded file and comparing it against the blockchain record.

**3.2 Non-Functional Requirements**:
- **Performance**: IPFS uploads should complete successfully without timing out the API request (backend should handle processes asynchronously).
- **Security**: Smart contracts must prevent unauthorized state mutation (e.g., `msg.sender` checks).
- **Reliability**: The system must fail gracefully if the blockchain RPC network goes down.
