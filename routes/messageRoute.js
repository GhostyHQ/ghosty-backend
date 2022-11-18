const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const {
	sendMessage,
	getMessage,
	seenMessage,
	deliveredMessage,
} = require('../controllers/messageController')

router.post('/send-message', authenticate, sendMessage)
router.get('/get-message/:id', authenticate, getMessage)
router.post('/seen-message', authenticate, seenMessage)
router.post('/delivered-message', authenticate, deliveredMessage)

module.exports = router
