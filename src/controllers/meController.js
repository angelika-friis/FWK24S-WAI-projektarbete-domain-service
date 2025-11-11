const { requireReauth } = require("../middleware/requireReauth");
const jwt = require('jsonwebtoken');
const AdmZip = require('adm-zip');
const PDFDocument = require("pdfkit");
const { aggregateUserData } = require("../services/aggregator");
const { generateUserPdf } = require("../utils/generateUserPdf");

const { logEvent } = require('../services/auditLogService');

const exportUserDataZip = async (req, res) => {
  try {
    const { userId } = req.user;
    //const reauthenticated = await requireReauth(req, userId);
    //if (!reauthenticated) return res.status(403).json({ error: "Re-auth required" });

    await logEvent(userId, 'DATA_REQUEST', { format: 'ZIP' });

    // const auditId = await createAudit({ userId, action: "EXPORT_REQUEST" });
    const auditId = 0;
    const dataBundle = await aggregateUserData(userId);

    const manifest = {
      generatedAt: new Date().toISOString(),
      auditId,
      userId,
      legal: { reference: "GDPR Articel 15" }
    }

    const zip = new AdmZip();
    zip.addFile("manifest.json", Buffer.from(JSON.stringify(manifest, null, 2)));
    for (const [key, val] of Object.entries(dataBundle)) {
      zip.addFile(`${key}.json`, Buffer.from(JSON.stringify(val, null, 2)));
    }

    const buffer = zip.toBuffer();

    await logEvent(userId, 'DATA_EXPORT', { format: 'ZIP' });

    // await createAudit({ userId, action: "EXPORT_CREATED", meta: { auditId }});

    res
      .set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="user-${userId}-export.zip"`,
      })
      .status(200)
      .send(buffer);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error." });
  }
};

const exportUserDataPdf = async (req, res) => {
  const { userId } = req.user;

  try {
    // const reauthenticated = await requireReauth(req, userId);
    // if (!reauthenticated) {
    //   return res.status(403).json({ error: "Re-auth required" });
    // }

    await logEvent(userId, 'DATA_REQUEST', { format: 'PDF' });
    const dataBundle = await aggregateUserData(userId);

    const doc = new PDFDocument({
      autoFirstPage: true, // or false if you add pages manually
    });

    // Set headers BEFORE piping
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="user-data.pdf"',
      // 'Cache-Control': 'no-store', // optional
    });
    res.status(200);

    // Handle stream errors explicitly
    doc.on('error', (err) => {
      console.error('PDF stream error:', err);
      // Only attempt once—headers may be already sent.
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'PDF generation error' });
      } else {
        // End the response if possible
        try { res.end(); } catch {}
      }
    });

    // End response when PDF finishes
    doc.on('end', () => {
      // res.end() will be called by the stream once finished
    });

    // Pipe AFTER listeners set
    doc.pipe(res);

    // Generate the PDF contents
    await logEvent(userId, 'DATA_EXPORT', { format: 'PDF' });
    generateUserPdf(doc, dataBundle); // your function writing to `doc`

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error(error);
    // Make sure this is JSON, distinct from the PDF path
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Server Error.' });
    }
  }
};

const exportUserDataJson = async (req, res) => {
  console.log("controller")
  try {
    console.log("testing")
    const { userId } = req.user;
    //const reauthenticated = await requireReauth(req, userId);
    //if (!reauthenticated) return res.status(403).json({ error: "Re-auth required" });
    
    await logEvent(userId, 'DATA_REQUEST', { format: 'JSON' });

    const dataBundle = await aggregateUserData(userId);

    const manifest = {
      generatedAt: new Date().toISOString(),
      userId,
      legal: { reference: "GDPR Article 15" },
    };

    const responseData = {
      manifest,
      data: dataBundle,
    };

    await logEvent(userId, 'DATA_EXPORT', { format: 'JSON' });

    res
      .set({
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="user-${userId}-data.json"`,
      })
      .status(200)
      .json(responseData);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports = { exportUserDataZip, exportUserDataPdf, exportUserDataJson };