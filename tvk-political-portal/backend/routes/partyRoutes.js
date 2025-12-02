// routes/partyRoutes.js
import express from "express";
import multer from "multer";
import checkApiKey from "../middleware/checkApiKey.js"; // make sure this file exists
// import { addPartyNetwork } from "../controllers/partyController.js"; // uncomment when ready

const router = express.Router();

// multer setup — memoryStorage keeps the file in req.file.buffer (you can change to diskStorage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (adjust as needed)
});

// Helper: consistent response for validation errors
const badRequest = (res, msg) => res.status(400).json({ ok: false, message: msg });

// POST /api/party-network/add
// - Accepts either JSON (application/json) OR multipart/form-data with an optional "photo" file.
// - Protect with API key middleware if you want (checkApiKey). Remove it if not used.
router.post(
  "/add",
  checkApiKey,      // remove this if you don't require API key for this route
  upload.single("photo"),
  async (req, res) => {
    try {
      // If client used JSON, express.json() has already parsed it.
      // If client used multipart/form-data, multer populated req.body & req.file.
      const body = req.body || {};
      const file = req.file || null;

      // Debug log (will appear in Render logs)
      console.log("Add party network request received. content-type:", req.headers["content-type"]);
      console.log("Parsed body keys:", Object.keys(body));
      if (file) {
        console.log("Received file:", { fieldname: file.fieldname, originalname: file.originalname, size: file.size });
      }

      // Basic validation: change fields to match your front-end shape
      const { networkName, founder, yearEstablished, age, office } = body;

      // Example required field check — adapt to your schema
      if (!networkName || typeof networkName !== "string" || networkName.trim().length === 0) {
        return badRequest(res, "Missing or invalid field: networkName");
      }

      // Optional: more validation
      if (yearEstablished && isNaN(Number(yearEstablished))) {
        return badRequest(res, "yearEstablished must be a number");
      }

      // At this point, insert into DB / call controller
      // Example (uncomment and implement addPartyNetwork controller):
      // const saved = await addPartyNetwork({ networkName, founder, yearEstablished, photo: file ? file.buffer : null, ... });

      // For now, mock the saved document
      const saved = {
        id: "mock_id_123",
        networkName,
        founder: founder || null,
        yearEstablished: yearEstablished || null,
        hasPhoto: !!file,
      };

      console.log(`Successfully added party network: ${networkName} (id=${saved.id})`);

      return res.status(201).json({
        ok: true,
        message: "Party network successfully added",
        data: saved,
      });
    } catch (err) {
      console.error("Error in /api/party-network/add:", err && err.stack ? err.stack : err);
      return res.status(500).json({ ok: false, message: "Internal server error" });
    }
  }
);

// GET /api/party-network/all
router.get("/all", async (req, res) => {
  // TODO: replace with DB fetch logic
  res.json({ ok: true, message: "List of all party networks (mock)", data: [] });
});

// GET /api/party-network/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // TODO: replace with DB fetch logic
  res.json({ ok: true, message: `Details for party network ID: ${id}`, data: null });
});

export default router;
