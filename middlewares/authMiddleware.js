import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import dotenv from "dotenv";

dotenv.config("./.env");

// Protected Route Middleware
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No access token provided",
      });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      // Fetch user from Prisma
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true }, // Exclude password
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found with this id",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error("Protected Route Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in protected middleware",
    });
  }
};

// Admin Access Middleware
export const adminAccess = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Denied - Admin access only",
    });
  }
};
