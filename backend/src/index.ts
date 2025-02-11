import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import runsRouter from "./routes/runs.js";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Allow JSON requests

// Sample route to test the backend
app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

app.use("/api/runs", runsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});