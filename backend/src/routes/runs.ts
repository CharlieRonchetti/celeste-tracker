import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all runs
router.get("/", async (req, res) => {
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