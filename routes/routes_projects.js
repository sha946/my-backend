const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const Project = require("../models/Project");

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

// GET /api/projects  — get all projects for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (e) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// POST /api/projects  — create new project
router.post("/", auth, async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) return res.status(400).json({ message: "الاسم والنوع مطلوبان" });
    const project = new Project({ user: req.userId, name, type });
    await project.save();
    res.status(201).json(project);
  } catch (e) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// PUT /api/projects/:id/blocks  — save Blockly XML
router.put("/:id/blocks", auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.userId });
    if (!project) return res.status(404).json({ message: "المشروع غير موجود" });
    project.blocksSave = req.body.blocksSave || "";
    await project.save();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// PUT /api/projects/:id/draw  — save Draw JSON
router.put("/:id/draw", auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.userId });
    if (!project) return res.status(404).json({ message: "المشروع غير موجود" });
    project.drawSave = req.body.drawSave ?? null;
    // Required when updating Mixed fields in Mongoose
    project.markModified("drawSave");
    await project.save();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// GET /api/projects/:id/draw  — load Draw JSON  ← NEW
router.get("/:id/draw", auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.userId });
    if (!project) return res.status(404).json({ message: "المشروع غير موجود" });
    res.json({ drawSave: project.drawSave ?? null });
  } catch (e) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    await Project.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

module.exports = router;