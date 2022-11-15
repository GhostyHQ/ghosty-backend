const Base64 = require('js-base64').Base64
const axios = require('axios')

const getConfig = require('../config/near')
const Profile = require('../models/profileModal')

module.exports.getProfileList = async (req, res) => {
	try {
		const profiles = await Profile.find({})
		res.json({
			status: 1,
			data: profiles,
		})
	} catch (error) {
		console.log(error)
		res.status(400).json({
			status: 0,
			message: error.message || error,
		})
	}
}

module.exports.getProfile = async (req, res) => {
	try {
		const profile = await Profile.findOne({
			accountId: req.query.accountId,
		})
		res.json({
			status: 1,
			data: profile || [],
		})
	} catch (error) {
		console.log(error)
		res.status(400).json({
			status: 0,
			message: error.message || error,
		})
	}
}

module.exports.putProfile = async (req, res) => {
	const authHeader = req.headers.authorization
	const decodeAuthHeader = Base64.decode(authHeader)
	const [userId] = decodeAuthHeader.split('&')

	const updateProfile = {
		accountId: req.body.accountId,
	}

	try {
		if (userId !== req.body.accountId) {
			throw new Error('AccountId does not match with authorization token')
		}

		const newProfile = await Profile.findOneAndUpdate(
			{
				accountId: req.body.accountId,
			},
			{
				$set: updateProfile,
				$setOnInsert: { createdAt: new Date().getTime() },
			},
			{
				upsert: true,
				returnOriginal: false,
			}
		)

		res.json({
			status: 1,
			data: newProfile,
		})
	} catch (err) {
		console.log(err)
		res.status(400).json({
			status: 0,
			message: err.message,
		})
	}
}

module.exports.putChatList = async (req, res) => {
	const authHeader = req.headers.authorization
	const decodeAuthHeader = Base64.decode(authHeader)
	const [userId] = decodeAuthHeader.split('&')

	try {
		if (userId !== req.body.accountId) {
			throw new Error('AccountId does not match with authorization token')
		}

		const nearConfig = getConfig(process.env.APP_ENV || 'development')
		const resp = await axios.post(nearConfig.nodeUrl, {
			jsonrpc: '2.0',
			id: 'dontcare',
			method: 'query',
			params: {
				request_type: 'view_account',
				finality: 'final',
				account_id: req.body.chatList,
			},
		})

		if (resp.data.error) {
			throw new Error(resp.data.error.data)
		} else {
			const isExistAddress = await Profile.findOne(
				{ accountId: req.body.accountId },
				{ chatList: { $elemMatch: { accountId: req.body.chatList } } }
			)

			if (isExistAddress.chatList.length === 0) {
				const addAddressChat = await Profile.findOneAndUpdate(
					{ accountId: req.body.accountId },
					{
						$push: {
							chatList: {
								accountId: req.body.chatList,
								alias: '',
							},
						},
					}
				)

				res.json({
					status: 1,
					data: addAddressChat,
				})
				return
			}
		}
		throw new Error('The address is already in the chat list')
	} catch (err) {
		console.log(err)
		res.status(400).json({
			status: 0,
			message: err.message,
		})
	}
}
