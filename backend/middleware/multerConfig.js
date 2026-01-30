const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;




// const multer = require("multer")
// const path = require("path")
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("file destination ", file)
//     cb(null, 'uploads/')
//   },

//   filename: function (req, file, cb) {
//     console.log("file in filename.js ", file)
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
//     console.log("uniquesuffix ", uniqueSuffix)
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// })

// //Only images allowed
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true)
//   } else {
//     cb(new Error('Only images are allowed!', false))
//   }
// }

// const upload = multer({ storage, fileFilter })

// module.exports = upload