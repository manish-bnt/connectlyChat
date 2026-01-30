const express = require('express')
const { registerUser, login, getMe, updateProfile, deleteAccount } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const upload = require('../middleware/multerConfig')
const { uploadProfile, deleteProfile } = require('../controllers/profileController')
const router = express.Router()

// router.get('/', (req, res) => {
//   res.send({ msg: 'server is running' })
// })

router.post('/signup', registerUser)
// router.post('/otp-verify', registerOTPverify)
// router.post('/resend-otp', resendOTP)
router.post('/login', login)
router.get('/getMe', authMiddleware, getMe)
router.post('/upload-profile', authMiddleware, upload.single('avataar'), uploadProfile)
router.delete('/delete-profile', authMiddleware, deleteProfile)
router.put('/update-profile', authMiddleware, updateProfile)
router.delete('/delete-account', authMiddleware, deleteAccount)



module.exports = router
