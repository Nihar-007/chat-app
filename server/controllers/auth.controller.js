import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import { sendEmail, generateOTP } from "../config/sendEmail.js";
import { generateToken } from "../config/utils.js";

const otpStore = new Map()

export const register = async (req, res) => {
  try {
    const { name, phno, email, password } = req.body;

    if (!name || !phno || !email || !password) return res.status(400).json({ message: 'All fields are required' });

    const existingUser = await User.findOne({ $or: [{email: email}, {phno: phno}] }).select('-password');
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const otp = generateOTP(6)
    otpStore.set(email, {name, phno, hashedPassword, otp})

    const verificationEmail = await sendEmail(name, email, otp)
    if (!verificationEmail) return res.status(500).json({ message: 'Error sending email to user' })
      
    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: `Error registering user: ${error}` });
    console.log("Error in auth controller - register: ", error)
  }
}

export const verifyEmail = async (req,res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore.get(email)

    if (!record || record.otp !== otp) return res.status(400).json({ message: "Invalid or expired OTP" });
    const { name, phno, hashedPassword } = record
    const user = new User({ name, phno, email, password: hashedPassword })

    await user.save()
    otpStore.delete(email)
    return res.status(201).json({ user: {name, phno, email}});
  } catch (error) {
    res.status(500).json({ message: `Error verifying email user: ${error}` });
    console.log("Error in auth controller - verifyEmail: ", error)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let phno = null;

    if (!email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    if (!email.includes("@")){ 
      phno = Number(email)
    }
    
    const user = await User.findOne({ $or: [{email: email}, {phno: phno}]})
    if(user === null) return res.status(404).json({ message: 'User not found' });
  
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = await generateToken(user._id)
    user.password = null; 
    // console.log(user)
    return {user, token}
    // return res.status(200).json({ message: 'Login successful',  user: user });
    
  } catch (error) {
    console.log("Error in auth controller - login: ", error)
    return res.status(500).json({ message: 'Error logging in user: ', error });
  }
}

export const logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
}