const express = require("express");
const requireJson = require("../middleware/requireJson.js");
const { postSave, getJournal } = require("../controllers/journalController.js");
const verifyAuth = require("../middleware/verifyAuth.js");

const router = express.Router();

router.post("/upsert", [verifyAuth, requireJson], postSave);
router.get("/:authorId/:date", verifyAuth, getJournal);

module.exports = router;