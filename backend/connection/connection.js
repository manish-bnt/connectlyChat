const mongoose = require('mongoose')
const URL = process.env.DB_URL
let connectDB = async () => {
  try {
    await mongoose.connect(URL)
    console.log("Database is connected")
  } catch (error) {
    console.error('Database connection failed', error.message)
    process.exit(1)
  }
}

module.exports = connectDB