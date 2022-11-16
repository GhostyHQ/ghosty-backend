const Message = require('../models/messageModel')

module.exports.sendMessage = async (req, res) => {
	const { senderId, receiverId, message } = req.body

	try {
		const insertMessage = await Message.create({
			senderId: senderId,
			receiverId: receiverId,
			message: {
				text: message,
				image: '',
			},
		})
		res.status(200).json({
			status: 1,
			message: insertMessage,
		})
	} catch (error) {
		res.status(500).json({
			status: 0,
			message: 'Internal server error',
		})
	}
}
