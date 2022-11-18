const Message = require('../models/messageModel')

module.exports.sendMessage = async (req, res) => {
	const { senderId, receiverId, message, image } = req.body

	try {
		const insertMessage = await Message.create({
			senderId: senderId,
			receiverId: receiverId,
			message: {
				text: message,
				image: image,
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

module.exports.getMessage = async (req, res) => {
	if (req.accountId) {
		try {
			const currentUser = req.accountId
			const receiverId = req.params.id
			const getAllMessage = await Message.find({
				$or: [
					{
						$and: [
							{
								senderId: {
									$eq: currentUser,
								},
							},
							{
								receiverId: {
									$eq: receiverId,
								},
							},
						],
					},
					{
						$and: [
							{
								receiverId: { $eq: currentUser },
							},
							{ senderId: { $eq: receiverId } },
						],
					},
				],
			})
			res.status(200).json({
				status: 1,
				data: getAllMessage,
			})
		} catch (error) {
			res.status(500).json({
				status: 0,
				message: error.message,
			})
		}
	}
}
