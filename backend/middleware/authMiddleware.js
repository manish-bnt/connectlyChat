const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  //Get the token from the header
  const authHeader = req.header('Authorization');

  // console.log("authHeader ", authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1] // remove 'Bearer' from token

  try {
    //Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Finding User and saving in 'req.user' (except password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ msg: 'User not found, auth failed' });
    }

    next();
  } catch (error) {

    console.error("Auth Error:", error.message);
    res.status(401).json({ msg: 'Token is not valid' });

  }
}

module.exports = authMiddleware