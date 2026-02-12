require("dotenv").config();
const app = require("./app");
const { connectMongo } = require("./config/db2");

const PORT = process.env.PORT || 5000;

// ================= SERVER START =================
connectMongo()
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
