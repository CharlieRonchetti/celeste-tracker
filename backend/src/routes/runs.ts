import express from "express";
import pool from "../config/db.js";
import { authenticateUser } from "../middleware/authMiddleware";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.ts"

const router = express.Router();

// Get all runs
// Protected route: Only logged-in users can fetch runs
router.get("/", authenticateUser, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("Authenticated")

  try {
    const result = await pool.query("SELECT * FROM test_users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new run
router.post("/", async (req, res) => {
  const { user_id, category, time } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO runs (user_id, category, time) VALUES ($1, $2, $3) RETURNING *",
      [user_id, category, time]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving run" });
  }
});

export default router;