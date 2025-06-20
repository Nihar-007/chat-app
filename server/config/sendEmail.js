import nodemailer from "nodemailer"
import crypto from "crypto"


export const generateOTP = (length=6) => {
    const max = 10 **length
    const otp = crypto.randomInt(0,max).toString().padStart(length, '0')
    return otp
}

export const sendEmail = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    })

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Hi ${name}, Your verification code is: ${otp}`
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent: ", info.messageId)
    return info

  } catch (error) {
    res.status(500).json({ message: 'Error sending email to user: ', error });
    console.log("Error in auth controller - sendEmail: ", error)
  }
}