const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL); // options removed
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connection;
