import User from "@/app/api/models/userModel.js";

// Create User
export async function createUserController(data) {
  let { residencyStatus, whoIsUsingPlatform, role } = data;

  if (!residencyStatus || !whoIsUsingPlatform || !role) {
    throw new Error("Kindly select all fields required");
  }

  // Normalize input
  if (whoIsUsingPlatform === "someone else") {
    whoIsUsingPlatform = "someoneElse";
  }


  // const existingUser = await User.findOne({
  //   residencyStatus,
  //   whoIsUsingPlatform,
  //   role,
  // });

  // if (existingUser) {
  //   throw new Error("User already exists");
  // }

  const newUser = new User({
    residencyStatus,
    whoIsUsingPlatform,
    role,
  });
await newUser.save();


  return {
    message: "New User created Successfully",
    user: newUser,
  };
}

// Get one User
export async function getUserController(_id) {
  if (!_id) {
    throw new Error("User ID is required");
  }

  const { default: User } = await import("../models/userModel.js");

  const user = await User.findById(_id)
    .populate("tenant")
    .populate("landlord")
    .populate("otp");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// Get all users
export async function getAllUserController() {

  const { default: User } = await import("../models/userModel.js");

  const users = await User.find()
    .populate("tenant")
    .populate("landlord")
    .populate("otp");

  return {
    message: "All users successfully pulled",
    success: true,
    user: users,
  };
}

// Delete user
export async function deleteUserController(_id) {
  if (!_id) {
    throw new Error("User ID is required");
  }

  const { default: User } = await import("../models/userModel.js");

  const user = await User.findByIdAndDelete(_id);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    message: "User deleted successfully from DB",
  };
}
