import jwt from "jsonwebtoken";

function generateToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
}

function generateRefetchToken(payload) {
  if (!process.env.REFRESH_TOKEN) {
    throw new Error("REFRESH_TOKEN is not defined in environment variables");
  }

  return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "30d" });
}

function verifyRefreshToken(refreshToken) {
  if (!process.env.REFRESH_TOKEN) {
    throw new Error("REFRESH_TOKEN is not defined in environment variables");
  }

  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
}

module.exports = { generateToken, generateRefetchToken, verifyRefreshToken };