import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Token Received:", token);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded Token:", decoded);

      if (!decoded.userId) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token format" });
      }

      // Fetch user from Prisma
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Protected Route Error:", error);
    res.status(500).json({ success: false, message: "Middleware error" });
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
