const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Contact = require('../models/contact')
// const welcomeEmail = require('../emails/welcome-email')
// const transporter = require('../config/mailer')
// const generate6DigitOTP = require('../emails/otp-email')
const Otp = require('../models/otp')
const path = require('path')
const fs = require('fs')
const { log } = require('console')

async function registerUser(req, res) {
  try {
    let { username, email, mobile, password } = req.body
    // console.log("mobile: ", mobile)

    if (!username || !email || !password || !mobile) {
      return res.status(400).json({ msg: 'username, email and password are required' })
    }

    username = String(username).trim()
    email = String(email).trim().toLowerCase()

    if (password.length < 6) {
      return res.status(400).json({ msg: 'password must be at least 6 characters' })
    }

    // Check existing by email OR mobile to avoid duplicates
    let existingUser = await User.findOne({ $or: [{ email }, { mobile }] })

    const hashPassword = await bcrypt.hash(password, 10)

    //Restore Account!

    if (existingUser && existingUser.isDeleted === true) {
      // const docsOTP = await generate6DigitOTP(email)
      // if (!docsOTP) {
      //   return res.status(500).json({ msg: 'failed to generate OTP' })
      // }
      await User.findByIdAndUpdate(
        existingUser._id,
        {
          username,
          password: hashPassword,
          isDeleted: false,
          deletedAt: null,
          isVerified: true
        }
      )

      return res.status(200).json({
        msg: 'signup sucess!'
      })
      // return res.status(200).json({
      //   msg: 'OTP sent in you email',
      //   OTPID: docsOTP._id
      // })
    }


    if (existingUser && existingUser.isDeleted === false) {
      if (existingUser.email === email) {
        return res.status(409).json({ msg: 'Email already registered' })
      }
      if (existingUser.mobile === mobile) {
        return res.status(409).json({ msg: 'Mobile number already registered' })
      }
    }

    //New user registration

    // Generate OTP before creating user so we have the OTP id to return
    // let docsOTP = await generate6DigitOTP(email)
    // if (!docsOTP) {
    //   return res.status(500).json({ msg: 'failed to generate OTP' })
    // }

    // const hashPassword = await bcrypt.hash(password, 10)

    const user = new User({
      username,
      email,
      mobile,
      password: hashPassword,
      isVerified: true
    })

    await user.save()

    return res.status(200).json({
      msg: 'Signup success!'
    })
    // return res.status(200).json({
    //   msg: 'OTP sent to your email',
    //   OTPID: docsOTP._id
    // })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ msg: 'registration failed' })
  }
}

//================== Registration OTP verification ====================//

/*
async function registerOTPverify(req, res) {
  try {
    const { email, OTP } = req.body
    // console.log("OTP entere by user: ", OTP)
    if (!email || !OTP) return res.status(400).json({ msg: 'email and OTP are required' })

    const docsOTP = await Otp.findOne({ identifier: email })
    if (!docsOTP) return res.status(401).json({ msg: 'OTP expired' })

    if (OTP !== docsOTP.otp) {
      return res.status(401).json({ msg: 'Incorrect OTP' })
    }
    // if (String(OTP) !== String(docsOTP.otp)) {
    //   return res.status(401).json({ msg: 'Incorrect OTP' })
    // }

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ msg: 'User not found' })

    if (user.isVerified) {
      // Clean up OTP if present to avoid reuse
      await Otp.deleteOne({ identifier: email })
      return res.status(400).json({ msg: 'Account already verified' })
    }

    const updateResult = await User.updateOne(
      { email },
      {
        isVerified: true,
        expiresAt: null
      }
    )

    // remove OTP document after successful verification
    await Otp.deleteOne({ identifier: email })

    const mail = welcomeEmail(user.username)

    try {
      await transporter.sendMail({
        to: email,
        subject: mail.subject,
        html: mail.html
      })
    } catch (error) {
      // don't fail verification just because email failed to send
      console.error(error.message)
    }

    // generate auth token so user can be logged in immediately after verification
    const payload = { id: user._id, email: user.email }
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET not set')
      return res.status(500).json({ msg: 'server misconfiguration: JWT secret not set' })
    }
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' })

    return res.status(200).json({ msg: 'Email verified successfully', token, user: { id: user._id, username: user.username, email: user.email } })

  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ msg: 'failed to verify OTP' })
  }

}

*/


//======================= Resend OTP ==============================//

/*
async function resendOTP(req, res) {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ msg: 'user not found!' })

  // 2. Check if already verified
  if (user.isVerified) return res.status(400).send("Account already verified");

  let docsOTP = await generate6DigitOTP(email)
  // console.log("docsOTP ", docsOTP)

  return res.status(200).json({ msg: 'New OTP sent to your email!' })

}

*/


//======================= Login ==============================//
async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ msg: 'email and password required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' })
    if (user.isDeleted) return res.status(401).json({ msg: 'No record found!' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ msg: 'Incorrect password' })

    if (!user.isVerified) return res.status(403).json({ msg: 'Email not verified' })

    const payload = {
      id: user._id,
      email: user.email
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET not set')
      return res.status(500).json({ msg: 'server misconfiguration: JWT secret not set' })
    }

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' })

    return res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ msg: 'login failed' })
  }

}

async function getMe(req, res) {
  try {
    // 1. Data already req.user me hai. (AuthMiddleware ki wajah se)
    const user = req.user
    if (!user) {
      return res.status(401).json({ msg: 'User not found or session expired' })
    }

    // Send direct response 
    return res.status(200).json({ sucess: true, data: user })
  } catch (error) {
    console.error("GetMe error", error.message)
    return res.status(500).json({ msg: 'failed to fetch user details' })
  }
}

// async function uploadProfile(req, res) {
//   try {
//     //Updation disable if user in demo account!
//     if (req.user.isDemo == true) {
//       return res.status(403).json({
//         msg: "Profile modifications are disabled for demo accounts."
//       })
//     }
//     const userId = req.user
//     if (!req.file) return res.status(400).json({ msg: 'No file uploaded!' })

//     // save the file path in database 
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { profile: req.file.path },
//       { new: true }
//     )

//     res.json({ msg: "Profile updated!", user });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// }

// async function deleteProfile(req, res) {
//   try {
//     const userId = req.user

//     const user = await User.findById(userId)

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     if (user.profile) {
//       const imagePath = path.join(__dirname, "..", user.profile);
//       console.log("imagepath: ", imagePath)
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }

//     // update in DB
//     user.profile = null;
//     await user.save()
//     console.log("user updated after deleting ", user)
//     if (!user) {
//       return res.status(401).json({ msg: "User not found" })
//     }

//     return res.status(200).json({ msg: "Profile cleared successfully!", data: user })
//   } catch (error) {
//     console.error(error.message)
//     return res.status(500).json({ msg: error.message })
//   }
// }

async function updateProfile(req, res) {
  try {
    const userId = req.user
    const { updatedInfo } = req.body
    // console.log("updatedInfo ", updatedInfo)
    // console.log("updatedInfo2 ", req.body)
    // console.log("req.user.. .", userId)
    // console.log("userIsdemo.. .", typeof userId.isDemo)

    //Updation profile info disable if user in demo account!
    if (req.user.isDemo == true) {
      return res.status(403).json({
        msg: "Profile modifications are disabled for demo accounts."
      })
    }


    const user = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    )



    // console.log("updated user ", user)
    if (!user) return res.status(401).json({ msg: 'User not found!' })


    return res.status(200).json({ msg: 'Updated successfully!', data: user })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ msg: error.message })
  }
}

async function deleteAccount(req, res) {
  try {
    const userId = req.user

    // console.log("req.user delete request: ", req.user)

    if (req.user.isDemo) {
      return res.status(403).json({
        msg: "Delete account is disabled for demo users."
      });
    }

    // 1. Soft delete user 
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isDeleted: true,
        isVerified: false,
        deletedAt: new Date()
      }
    )
    if (!user) return res.status(401).json({ msg: 'User not found!' })

    // 2. Soft delete user's own contacts

    await Contact.updateMany(
      { owner: userId },
      { $set: { isDeleted: true } }
    )


    return res.status(200).json({
      msg: 'Account deleted successfully!'
    })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ msg: error.message })
  }
}





module.exports = {
  registerUser,
  // registerOTPverify,
  // resendOTP,
  login, getMe, updateProfile, deleteAccount
}