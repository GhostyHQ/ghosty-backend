const Base64 = require('js-base64').Base64
const nacl = require('tweetnacl')
const bs58 = require('bs58')
const sha256 = require('js-sha256')
const axios = require('axios')

const _hexToArr = (str) => {
	// eslint-disable-next-line no-useless-catch
	try {
		return new Uint8Array(str.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
	} catch (err) {
		throw err
	}
}

module.exports = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization
		const decodeAuthHeader = Base64.decode(authHeader)
		const [userId, pubKey, signature] = decodeAuthHeader.split('&')
		const pubKeyArr = _hexToArr(pubKey)
		const signatureArr = _hexToArr(signature)
		const hash = new Uint8Array(sha256.sha256.array(userId))
		const verify = nacl.sign.detached.verify(hash, signatureArr, pubKeyArr)
		if (!verify) {
			throw new Error('unauthorized')
		}
		const b58pubKey = bs58.encode(Buffer.from(pubKey.toUpperCase(), 'hex'))
		const response = await axios.post('https://rpc.testnet.near.org', {
			jsonrpc: '2.0',
			id: 'dontcare',
			method: 'query',
			params: {
				request_type: 'view_access_key',
				finality: 'final',
				account_id: userId,
				public_key: `ed25519:${b58pubKey}`,
			},
		})

		if (response.data.result && response.data.result.error) {
			console.log(response.data.result.error)
			throw new Error('unauthorized')
		}
		req.accountId = userId
		next()
	} catch (err) {
		return res.status(401).json({
			success: 0,
			message: err.message,
		})
	}
}
