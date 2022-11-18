const router = require('express').Router()

const {
	getProfileList,
	getProfile,
	putProfile,
	getChatList,
	putChatList,
} = require('../controllers/profileController')
const authenticate = require('../middleware/authenticate')

router.get('/profiles', getProfileList)
router.get('/profile', getProfile)
router.put('/profiles', authenticate, putProfile)
router.get('/profile/chatlist', getChatList)
router.put('/profiles/chatlist', authenticate, putChatList)

module.exports = router
