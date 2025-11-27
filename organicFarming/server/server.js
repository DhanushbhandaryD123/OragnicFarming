// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// --------------------- Middleware ---------------------
app.use(cors());

// For regular JSON & URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For Stripe webhook (needs raw body)
app.use("/api/webhook/stripe", express.raw({ type: "application/json" }));

// --------------------- Ensure uploads folder ---------------------
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📂 Created uploads folder");
}

// Serve static files (images)
app.use("/uploads", express.static(uploadsPath));

// --------------------- Routes ---------------------
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/products");
const userListsRoutes = require("./routes/userLists");
const authRoutes = require("./routes/auth");
const farmersRoutes = require("./routes/farmers");
const sitesRoutes = require("./routes/sites");
const webhookRoutes = require("./routes/webhook"); // Stripe webhook

// Test route
app.get("/", (req, res) => res.send("🟢 Organic Farming API is running"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userListsRoutes);
app.use("/api/farmers", farmersRoutes);
app.use("/api/sites", sitesRoutes);
app.use("/api/webhook", webhookRoutes); // ✅ Stripe webhook

// --------------------- Database ---------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/organic-farming", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --------------------- Error Handlers ---------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

// --------------------- Start Server ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
