const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");

// ── Middleware: verify JWT ──────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "غير مصرح" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "رمز غير صالح" });
  }
}

// GET /api/user/me  — fetch current user's profile (including avatar)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// PUT /api/user/profile  — update avatar, avatarBg, name
router.put("/profile", auth, async (req, res) => {
  try {
    const { avatar, avatarBg, name } = req.body;
    const updates = {};
    if (avatar)    updates.avatar   = avatar;
    if (avatarBg)  updates.avatarBg = avatarBg;
    if (name)      updates.name     = name;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, select: "-password" }
    );
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

module.exports = router;