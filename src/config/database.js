import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.mongo_uri);
    console.log("database connected successfully");

    const adminExist = await User.findOne({ email: "admin@gmail.com" });
    const hashedPassword = await bcrypt.hash("admin123", 10);
    if (adminExist) {
      console.log("Admin already exists");
    } else {
      await User.create({
        userName: "AdminUser",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "ADMIN",
      });

      console.log("Admin seeded successfully");
    }
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDb;
