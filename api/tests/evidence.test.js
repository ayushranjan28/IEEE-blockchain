/**
 * tests/evidence.test.js
 *
 * Run:  npm test
 *
 * All blockchain + IPFS calls are mocked — no real network needed.
 * Tests cover happy paths and key validation failures for all 4 endpoints.
 */

// ── Mock services BEFORE importing server ─────────────────────────────────
jest.mock("../services/blockchainService", () => ({
  init:               jest.fn(),
  registerEvidence:   jest.fn().mockResolvedValue({
    evidenceId: "1",
    txHash:     "0xaabbcc",
    blockNumber: 10,
  }),
  transferCustody:    jest.fn().mockResolvedValue({
    txHash:      "0xddeeff",
    blockNumber: 11,
  }),
  getEvidenceDetails: jest.fn().mockResolvedValue({
    // "0xaaa..." is the SHA-256 of Buffer.from("fake-forensic-content")
    fileHash:              "0x" + "a".repeat(64),
    metadataCid:           "QmTestCID123",
    currentCustodian:      "0xCafe1234567890CAFE1234567890CAFE12345678",
    registrationTimestamp: 1700000000,
  }),
}));

jest.mock("../services/ipfsService", () => ({
  uploadFile:  jest.fn().mockResolvedValue("QmTestCID123"),
  uploadJSON:  jest.fn().mockResolvedValue("QmMetaCID456"),
  gatewayUrl:  (cid) => `https://gateway.pinata.cloud/ipfs/${cid}`,
}));

// ── Imports ────────────────────────────────────────────────────────────────
const request = require("supertest");
const app     = require("../server");

const SAMPLE_FILE    = Buffer.from("fake-forensic-content");
const VALID_ADDRESS  = "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12";

// ── POST /api/evidence/register ───────────────────────────────────────────
describe("POST /api/evidence/register", () => {
  it("201 — registers evidence and returns evidenceId + txHash", async () => {
    const res = await request(app)
      .post("/api/evidence/register")
      .field("location",     "Crime Scene A, Bengaluru")
      .field("investigator", "Inspector Sharma")
      .field("sampleType",   "GC-MS")
      .attach("file", SAMPLE_FILE, "report.pdf");

    expect(res.status).toBe(201);
    expect(res.body.evidenceId).toBe("1");
    expect(res.body.txHash).toBe("0xaabbcc");
    expect(res.body.ipfsCid).toBe("QmTestCID123");
    expect(res.body.fileHash).toMatch(/^0x[0-9a-f]{64}$/i);
  });

  it("400 — no file", async () => {
    const res = await request(app)
      .post("/api/evidence/register")
      .field("location",     "Scene B")
      .field("investigator", "Officer Raj");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/file/i);
  });

  it("400 — missing location", async () => {
    const res = await request(app)
      .post("/api/evidence/register")
      .field("investigator", "Officer Raj")
      .attach("file", SAMPLE_FILE, "report.pdf");

    expect(res.status).toBe(400);
  });

  it("400 — missing investigator", async () => {
    const res = await request(app)
      .post("/api/evidence/register")
      .field("location", "Scene C")
      .attach("file", SAMPLE_FILE, "report.pdf");

    expect(res.status).toBe(400);
  });
});

// ── GET /api/evidence/:id ─────────────────────────────────────────────────
describe("GET /api/evidence/:id", () => {
  it("200 — returns on-chain evidence details", async () => {
    const res = await request(app).get("/api/evidence/1");

    expect(res.status).toBe(200);
    expect(res.body.evidenceId).toBe("1");
    expect(res.body.currentCustodian).toBe("0xCafe1234567890CAFE1234567890CAFE12345678");
    expect(res.body.ipfsCid).toBe("QmTestCID123");
    expect(res.body).toHaveProperty("registeredAt");
  });

  it("404 — zero-address custodian means ID never registered", async () => {
    const { getEvidenceDetails } = require("../services/blockchainService");
    getEvidenceDetails.mockResolvedValueOnce({
      fileHash:              "0x" + "0".repeat(64),
      metadataCid:           "",
      currentCustodian:      "0x0000000000000000000000000000000000000000",
      registrationTimestamp: 0,
    });

    const res = await request(app).get("/api/evidence/999");
    expect(res.status).toBe(404);
  });
});

// ── POST /api/evidence/:id/transfer ──────────────────────────────────────
describe("POST /api/evidence/:id/transfer", () => {
  it("200 — transfers custody", async () => {
    const res = await request(app)
      .post("/api/evidence/1/transfer")
      .send({ newCustodian: VALID_ADDRESS });

    expect(res.status).toBe(200);
    expect(res.body.txHash).toBe("0xddeeff");
    expect(res.body.newCustodian).toBe(VALID_ADDRESS);
  });

  it("400 — missing newCustodian", async () => {
    const res = await request(app)
      .post("/api/evidence/1/transfer")
      .send({});

    expect(res.status).toBe(400);
  });
});

// ── POST /api/evidence/:id/verify ─────────────────────────────────────────
describe("POST /api/evidence/:id/verify", () => {
  it("200 verified=false — wrong file doesn't match stored hash", async () => {
    const res = await request(app)
      .post("/api/evidence/1/verify")
      .attach("file", Buffer.from("totally different content"), "tampered.pdf");

    expect(res.status).toBe(200);
    expect(res.body.verified).toBe(false);
    expect(res.body.verdict).toMatch(/TAMPERED/i);
  });

  it("400 — no file", async () => {
    const res = await request(app).post("/api/evidence/1/verify");
    expect(res.status).toBe(400);
  });
});

// ── GET /health ────────────────────────────────────────────────────────────
describe("GET /health", () => {
  it("200 — server is alive", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});