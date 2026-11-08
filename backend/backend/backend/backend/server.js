const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*"
}));
app.use(express.json({ limit: "2mb" }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/", (req, res) => {
  res.json({
    name: "ONE HOUR STUDIO",
    status: "Backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ONE HOUR STUDIO API is ready"
  });
});

app.post("/api/generate-video", (req, res) => {
  const {
    script,
    duration,
    style,
    language
  } = req.body || {};

  if (!script || !script.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter your story."
    });
  }

  if (
    !Number.isInteger(Number(duration)) ||
    Number(duration) < 1 ||
    Number(duration) > 60
  ) {
    return res.status(400).json({
      success: false,
      message: "Duration must be 1 to 60 minutes."
    });
  }

  if (!["2D Cartoon", "3D Animation", "Realistic"].includes(style)) {
    return res.status(400).json({
      success: false,
      message: "Invalid video style."
    });
  }

  if (!["Hindi", "English"].includes(language)) {
    return res.status(400).json({
      success: false,
      message: "Invalid language."
    });
  }

  return res.status(501).json({
    success: false,
    message: "AI video provider integration is not configured yet."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ONE HOUR STUDIO running on port ${PORT}`);
});
