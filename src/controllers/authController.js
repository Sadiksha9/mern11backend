import User from "../models/User.js";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import generateOtp from "../config/generateOtp.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../utils/sendMail.js";

const register = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;
    console.log(req.body);

    if (!userName || !email || !password || !confirmPassword) {
      throw new Error("User Credientials Missing");
    }
    if (password !== confirmPassword) {
      throw new Error("Password don't match");
    }

    const userFound = await User.findOne({ email: email });

    //  userFound = [ {}]

    if (userFound) {
      throw new Error("user already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await User.create({
      userName,
      password: hashedPassword,
      email,
    });

    res.status(200).json({ message: "user registered successful", data });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email: email });

    if (!userExist) {
      throw new Error("Invalid User");
    }

    const ispasswordMatched = await bcrypt.compare(
      password,
      userExist.password
    );

    if (!ispasswordMatched) {
      throw new Error("Invalid Credentials");
    }

    const payload = {
      email: userExist.email,
      id: userExist._id,
      role: userExist.role,
      userName: userExist.userName,
    };

    const token = jwt.sign(payload, "secretKey");

    res.cookie("authToken", token);

    res.status(200).json({ message: "userLoggedIN successfully", token });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("hdlleo", email);

    if (!email) {
      throw new Error("Email is required!");
    }

    const doesUserExist = await User.findOne({ email });

    if (!doesUserExist) {
      throw new Error("User doesnot exist!");
    }

    const otp = generateOtp();

    const data = await Otp.create({
      email,
      otp,
    });
    sendMail(email, otp);
    res.send("otp sent");
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new Error("Email and otp is required for verifiation ");
    }

    const doesEmailMatch = await User.findOne({ email });
    if (!doesEmailMatch) {
      throw new Error("user is not registered");
    }

    const doesHaveOtp = await Otp.findOne({ email });
    if (!doesHaveOtp) {
      throw new Error("User doesn't have otp");
    }

    if (doesHaveOtp.otp !== otp) {
      throw new Error("otp doesn't match");
    }
    await User.findOneAndUpdate(
      { email },
      { isOtpVerified: true },
      { new: true }
    );

    res.status(200).json({ message: "otp verified", data: doesHaveOtp });

    console.log(email, otp);
    res.status(200).json({ email, otp });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("email and password are required");
    }

    const doesUserExist = await User.findOne({ email });
    if (!doesUserExist) {
      throw new Error("User is not registered");
    }
    if (!doesUserExist.isOtpVerified) {
      throw new Error("otp is not verified");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, isOtpVerified: false },
      { new: true }
    );

    res.status(200).json({ message: "password changed sucessfully!", data });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
};
export { register, login, forgotPassword, verifyOtp, resetPassword };
