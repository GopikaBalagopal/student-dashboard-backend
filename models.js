const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  hoursCompleted: {
    type: Number,
    default: 0
  },
  sessionCompleted: {
    type: Number,
    default: 0
  },
  // ... other user fields
});

// Define Class schema
const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  content: {
    type: [String], // Assuming content is an array of strings
    required: true
  },
  sessionNumber: {
    type: Number,
    required: true
  },
  hours: {
    type: Number,
    required: true
  },
  completedBy: {
    type: Array,
    default: []
  }
  // ... other class fields
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  education: {
    type: String
  },
  experience: {
    type: String
  },
  githubURL: {
    type: String
  },
  resumeURL: {
    type: String
  }
});

const Profile = mongoose.model('Profile', profileSchema);
// Create User model
const User = mongoose.model('User', userSchema);

// Create Class model
const Class = mongoose.model('Class', classSchema);

module.exports = { User, Class, Profile };
