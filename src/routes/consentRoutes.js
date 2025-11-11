const express = require("express");
const { updateConsent, getAuditTrail } = require("../controllers/consentController");
const consentUUID = require("../middleware/consentUUID");
const { get } = require("mongoose");
const verifyAuth = require("../middleware/verifyAuth");

const router = express.Router();

router.post("/update", consentUUID, updateConsent);
router.get("/audit/:userId", verifyAuth, getAuditTrail);
router.get("/audit-trail/:userId", verifyAuth, getAuditTrail);

module.exports = router;
