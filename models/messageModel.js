const { model, Schema } = require('mongoose')

const MessageSchema = new Schema(
	{
		senderId: {
			type: String,
			required: true,
		},
		receiverId: {
			type: String,
			required: true,
		},
		message: {
			text: {
				type: String,
				default: '',
			},
			image: {
				type: String,
				default: '',
			},
		},
		status: {
			type: String,
			default: 'unseen',
		},
	},
	{ timestamps: true }
)

// eslint-disable-next-line no-undef
module.exports = Message = model('messages', MessageSchema)
