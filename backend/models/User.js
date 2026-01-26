const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, sparse: true },
    phone: String,
    password: String,
    role: {
      type: String,
      enum: ["customer", "driver", "admin"],
      default: "customer",
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    companyName: String,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
