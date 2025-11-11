const express = require("express");
const { exportUserDataZip, exportUserDataPdf, exportUserDataJson } = require("../controllers/meController.js");
const verifyAuth = require("../middleware/verifyAuth.js");

const router = express.Router();

router.post("/export/zip", verifyAuth, exportUserDataZip);
router.post("/export/pdf", verifyAuth, exportUserDataPdf);
router.post("/export/json", verifyAuth, exportUserDataJson);

module.exports = router;