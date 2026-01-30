const express = require('express')
const { addContact, getContacts, updateContact, deleteContact } = require('../controllers/contactController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/add-contact', authMiddleware, addContact)
router.post('/all-contacts', authMiddleware, getContacts)
router.put('/update-contact/:id', authMiddleware, updateContact)
router.delete('/delete-contact/:id', authMiddleware, deleteContact)

module.exports = router