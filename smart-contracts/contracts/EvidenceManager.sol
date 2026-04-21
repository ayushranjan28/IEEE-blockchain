// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IEvidenceManager.sol";

/**
 * @title EvidenceManager
 * @dev Core implementation for Forensic Evidence chain-of-custody.
 */
contract EvidenceManager is IEvidenceManager {

    struct Evidence {
        bytes32 fileHash;
        string metadataCid;
        address currentCustodian;
        uint256 registrationTimestamp;
    }

    // Mapping from Evidence ID to Evidence struct
    mapping(uint256 => Evidence) public evidenceRegistry;
    
    // Auto-incrementing ID for evidence records
    uint256 private nextEvidenceId;

    // Define System Administrator
    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized: Admin only");
        _;
    }

    modifier onlyCustodian(uint256 _evidenceId) {
        require(evidenceRegistry[_evidenceId].currentCustodian == msg.sender, "Not authorized: Must be current custodian");
        _;
    }

    constructor() {
        admin = msg.sender;
        nextEvidenceId = 1;
    }

    function registerEvidence(bytes32 _fileHash, string calldata _metadataCid) external override returns (uint256) {
        require(_fileHash != 0, "Invalid file hash");
        require(bytes(_metadataCid).length > 0, "Invalid metadata CID");

        uint256 evidenceId = nextEvidenceId++;

        evidenceRegistry[evidenceId] = Evidence({
            fileHash: _fileHash,
            metadataCid: _metadataCid,
            currentCustodian: msg.sender,
            registrationTimestamp: block.timestamp
        });

        emit EvidenceRegistered(evidenceId, _fileHash, msg.sender);

        return evidenceId;
    }

    function transferCustody(uint256 _evidenceId, address _newCustodian) external override onlyCustodian(_evidenceId) {
        require(_newCustodian != address(0), "Invalid new custodian address");
        require(_newCustodian != msg.sender, "Cannot transfer to self");

        address previousCustodian = evidenceRegistry[_evidenceId].currentCustodian;
        evidenceRegistry[_evidenceId].currentCustodian = _newCustodian;

        emit CustodyTransferred(_evidenceId, previousCustodian, _newCustodian);
    }

    function getEvidenceDetails(uint256 _evidenceId) external view override returns (
        bytes32 fileHash,
        string memory metadataCid,
        address currentCustodian,
        uint256 timestamp
    ) {
        Evidence memory e = evidenceRegistry[_evidenceId];
        require(e.registrationTimestamp != 0, "Evidence ID does not exist");
        
        return (e.fileHash, e.metadataCid, e.currentCustodian, e.registrationTimestamp);
    }
}
