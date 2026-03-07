const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  avatar:    { type: String, default: "🤖" },
  avatarBg:  { type: String, default: "#6C63FF" },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);