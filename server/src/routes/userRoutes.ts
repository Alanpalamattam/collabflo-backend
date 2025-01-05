import express, { Request, Response } from "express";
import User from "../models/User";

const router = express.Router();

// Add timestamp to logs
const log = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

router.post("/saveUser", async (req: Request, res: Response) => {
  log("📩 Request received at /saveUser");
  log("Request body", req.body);

  try {
    const { clerkId, email, username, firstName, lastName } = req.body;

    // Validate required fields
    if (!clerkId || !email) {
      log("❌ Validation failed - missing required fields");
      return res.status(400).json({
        message: "ClerkId and email are required",
        receivedData: req.body
      });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      log("👤 User already exists", { clerkId, email });
      return res.status(200).json({
        message: "User already exists",
        user: existingUser
      });
    }

    // Create new user
    const newUser = new User({
      clerkId,
      email,
      username: username || null,
      firstName: firstName || null,
      lastName: lastName || null
    });

    // Log the user object before saving
    log("📝 Attempting to save user", newUser);

    const savedUser = await newUser.save();
    log("✅ User saved successfully", savedUser);

    res.status(201).json({
      message: "User saved successfully",
      user: {
        id: savedUser._id,
        clerkId: savedUser.clerkId,
        email: savedUser.email
      }
    });
  } catch (error: any) {
    log("❌ Error in /saveUser route", {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists",
        error: error.message
      });
    }

    res.status(500).json({
      message: "Error saving user",
      error: error.message
    });
  }
});

export default router;