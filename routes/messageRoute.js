const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const { sendMessage, getMessage } = require('../controllers/messageController')

router.post('/send-message', authenticate, sendMessage)
router.get('/get-message/:id', authenticate, getMessage)

module.exports = router
