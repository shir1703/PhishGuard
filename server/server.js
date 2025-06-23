const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// התחברות ל־MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.error("❌ MongoDB connection error:", err));
db.once("open", () => console.log("✅ Connected to MongoDB"));

// סכימת הודעות
const ScanResultSchema = new mongoose.Schema({
  text: String,
  label: String,
  score: Number,
  model: String,
  timestamp: { type: Date, default: Date.now },
});
const ScanResult = mongoose.model("ScanResult", ScanResultSchema);

// פנייה ל־Flask
async function analyzeWithBERT(text) {
  const response = await fetch("http://13.50.105.172:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`BERT server responded with status ${response.status}`);
  }

  return await response.json();
}

// נקודת קצה לניתוח
app.post("/api/scan", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ result: "❌ Missing input text." });
  }

  try {
    const bertResult = await analyzeWithBERT(text);
    console.log("✅ Got BERT response:", bertResult);

    let { score, label: rawLabel } = bertResult;
    if (typeof score === "string") {
      score = parseFloat(score);
    }

    let label;
    if (rawLabel.toLowerCase() === "phishing") {
      label = score > 0.8 ? "🚨 Phishing detected" : "⚠️ Suspicious";
    } else {
      label = "✅ Safe";
    }

    const resultToSave = new ScanResult({
      text,
      label,
      score,
      model: rawLabel,
    });

    await resultToSave.save();
    console.log("💾 Saved result to MongoDB");

    res.json({ label, score, model: rawLabel });
  } catch (err) {
    console.error("❌ Error calling BERT service:", err);
    res.status(500).json({ result: "❌ Internal server error." });
  }
});

// הגשת קבצי UI (client)
app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Node.js server running at http://localhost:${PORT}`);
});
