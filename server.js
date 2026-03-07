require("dotenv").config();

const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

const app = express();

/* ---------- MIDDLEWARE ---------- */
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Handle preflight for all routes — without wildcard path
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: "2mb" }));

/* ---------- ROUTES ---------- */
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/projects", require("./routes/routes_projects"));
app.use("/api/user",     require("./routes/routes_user"));

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