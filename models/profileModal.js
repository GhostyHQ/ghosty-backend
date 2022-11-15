const { model, Schema } = require('mongoose')

const ProfileSchema = new Schema(
	{
		accountId: {
			type: String,
			required: true,
		},
		chatList: [
			{
				accountId: {
					type: String,
					required: false,
				},
				alias: {
					type: String,
					required: false,
				},
			},
		],
		isBlocked: {
			type: Boolean,
			required: false,
		},
	},
	{ timestamps: true }
)

// eslint-disable-next-line no-undef
module.exports = Profile = model('profiles', ProfileSchema)
