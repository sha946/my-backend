const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "2mb" }));   // allow large Blockly XML saves

// ── Routes ──────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));

// ── Health check ────────────────────────────────────────────────
app.get("/", (req, res) => res.send("🤖 Robot API is running!"));

// ── DB + Server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => { console.error("❌ MongoDB error:", err); process.exit(1); });