// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IEvidenceManager
 * @dev Interface for the Forensic Evidence Blockchain system. strictly dictates the methods
 * needed to enforce chain-of-custody.
 */
interface IEvidenceManager {
    
    // Events
    event EvidenceRegistered(uint256 indexed evidenceId, bytes32 indexed fileHash, address indexed registeredBy);
    event CustodyTransferred(uint256 indexed evidenceId, address indexed from, address indexed to);

    /**
     * @dev Registers new evidence payload on the blockchain.
     * @param _fileHash The SHA-256 hash of the evidence file.
     * @param _metadataCid The IPFS CID corresponding to the JSON metadata.
     * @return The unique ID assigned to this evidence item.
     */
    function registerEvidence(bytes32 _fileHash, string calldata _metadataCid) external returns (uint256);

    /**
     * @dev Transfers ownership (custody) of physical/digital evidence.
     * @param _evidenceId The ID of the evidence.
     * @param _newCustodian The address of the incoming custodian.
     */
    function transferCustody(uint256 _evidenceId, address _newCustodian) external;

    /**
     * @dev Retrieves core details of registered evidence for verification.
     * @param _evidenceId The ID of the evidence.
     * @return fileHash The originally registered SHA-256 hash.
     * @return metadataCid The IPFS CID for details.
     * @return currentCustodian The address currently holding custody.
     * @return timestamp The block timestamp of registration.
     */
    function getEvidenceDetails(uint256 _evidenceId) external view returns (
        bytes32 fileHash,
        string memory metadataCid,
        address currentCustodian,
        uint256 timestamp
    );
}
