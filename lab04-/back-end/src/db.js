// src/db.js
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/placesApp");
    console.log("✅ MongoDB холбогдлоо");
  } catch (err) {
    console.error("❌ MongoDB холболтын алдаа:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
