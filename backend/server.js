require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN ||
    "https://amzadkhan981106-gif.github.io"
}));

app.use(express.json({ limit: "2mb" }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: {
    error: "Too many requests. Please try again later."
  }
}));

app.get("/", (req, res) => {
  res.send("ONE HOUR STUDIO Backend is running.");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    app: "ONE HOUR STUDIO"
  });
});

app.post("/api/generate-video", (req, res) => {
  const {
    script,
    duration,
    style,
    language
  } = req.body;

  if (!script || typeof script !== "string") {
    return res.status(400).json({
      error: "Please provide a valid story."
    });
  }

  if (
    !Number.isInteger(Number(duration)) ||
    Number(duration) < 1 ||
    Number(duration) > 60
  ) {
    return res.status(400).json({
      error: "Duration must be between 1 and 60 minutes."
    });
  }

  const allowedStyles = [
    "2D Cartoon",
    "3D Animation",
    "Realistic"
  ];

  if (!allowedStyles.includes(style)) {
    return res.status(400).json({
      error: "Invalid video style."
    });
  }

  if (!["Hindi", "English"].includes(language)) {
    return res.status(400).json({
      error: "Invalid language."
    });
  }

  return res.status(501).json({
    message: "AI video provider is not connected yet.",
    nextStep: "Connect a real AI video generation API."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ONE HOUR STUDIO running on port ${PORT}`);
});
