const express = require("express");
const router = express.Router();
const { User, Class, Profile } = require("./models");
const jwt = require('jsonwebtoken')
// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "student");

    res.json({ message: "User created successfully", user: { token, username, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Signin route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "student");

    res.json({ message: "User authenticated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Complete class
// Complete class
router.post("/classes/complete", async (req, res) => {
  try {
    const classId = req.body.sessionId;
    const userId = req.body.userId;

    // Find class by ID
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if user has already completed the class
    if (classData.completedBy.includes(userId)) {
      return res.status(400).json({ message: "User has already completed this class" });
    }

    // Update user's sessionCompleted and hours
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.sessionCompleted += 1;
    user.hoursCompleted += classData.hours;

    await user.save();

    // Add user to completedBy array in classData
    classData.completedBy.push(user._id);
    await classData.save();

    res.json({ message: "Class completed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    // Retrieve all users
    const users = await User.find().sort({ hoursCompleted: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// CRUD operations for sessions
// Create a session
router.post("/sessions", async (req, res) => {
  try {
    const session = new Class(req.body);
    await session.save();

    res.json("session created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Read all sessions
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Class.find();
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Read a session by ID
router.get("/sessions/get/:id", async (req, res) => {
  try {
    const session = await Class.findOne({ sessionNumber: req.params.id });
    if (!session) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/sessions/all", async (req, res) => {
  try {
    const session = await Class.find().limit(5);
    if (!session) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a session
router.put("/sessions/:id", async (req, res) => {
  try {
    const { title, date, time } = req.body;

    const session = await Class.findByIdAndUpdate(
      req.params.id,
      { title, date, time },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a session
router.delete("/sessions/:id", async (req, res) => {
  try {
    const session = await Class.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a profile
router.post("/profiles", async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();

    res.json({ message: "Profile created successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Read all profiles
router.get("/profiles", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Read a profile by ID
router.get("/profiles/:id", async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a profile
router.put("/profiles/:id", async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate({ userId: req.params.id }, { $set: req.body });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
