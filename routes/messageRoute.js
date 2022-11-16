const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const { sendMessage } = require('../controllers/messageController')

router.post('/send-message', authenticate, sendMessage)

module.exports = router
