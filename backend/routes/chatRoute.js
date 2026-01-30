const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { sendMessages, getMessages, clearChats, getConversations } = require('../controllers/chatController')

router.post('/message/send', authMiddleware, sendMessages)
router.get('/message/:userToChatId', authMiddleware, getMessages)
router.delete('/delete-chats/:friendId', authMiddleware, clearChats)

module.exports = router