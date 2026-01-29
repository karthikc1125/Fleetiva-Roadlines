require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin"); 
const fs = require("fs");

const errorHandler = require("./middleware/errorHandler");
require("./config/clients"); // redis/twilio safe

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


/* ================= FIREBASE ADMIN ================= */
// Use the variable from .env if it exists, otherwise default to the cloud path
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || "/etc/secrets/firebase-service-account.json";

if (!admin.apps.length) {
  if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ Firebase service account file not found");
    process.exit(1);
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin initialized");
}


 
/* ================= MONGODB ================= */
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
      console.error("⚠️ MongoDB connection failed (app still running):", err.message);
    });
}

/* ================= HEALTH ================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is reachable" });
});

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/logistics"));

/* ================= ERRORS ================= */
app.use(errorHandler);

/* ================= START ================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
