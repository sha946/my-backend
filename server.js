require("dotenv").config();

const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json({ limit: "2mb" }));

/* ---------- ROUTES ---------- */
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/projects", require("./routes/routes_projects"));
app.use("/api/user",     require("./routes/routes_user"));   // ← NEW

app.get("/", (req, res) => res.send("🤖 Robot API running"));

/* ---------- DATABASE ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));