// const transporter = require("../config/mailer")
// const Otp = require("../models/otp")

// async function generate6DigitOTP(email) {

//   try {
//     const OTP = Math.floor(100000 + Math.random() * 900000)
//     console.log("OTP ", OTP)

//     const otpDoc = new Otp({
//       identifier: email,
//       otp: OTP,
//     })


//     await transporter.sendMail({
//       from: `"OTP Service" <${process.env.USER_EMAIL}>`,
//       to: email,
//       subject: `OTP verification`,
//       html: `S
//       <p>Your OTP is <b>${OTP}</b></p>
//       `
//     })
//     await otpDoc.save()

//     return otpDoc
//   } catch (error) {
//     console.error(error)
//     throw new Error("Failed to send OTP")
//   }

// }




module.exports = generate6DigitOTP