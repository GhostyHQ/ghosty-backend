const { Contract, KeyPair, connect } = require('near-api-js')
const { join } = require('path')
const { InMemoryKeyStore } = require('near-api-js').keyStores

const config = require('../config/near')(process.env.NODE_ENV || 'development')

const contractConfig = {
	changeMethods: ['init', 'mintToAndSell', 'updateMarketData', 'deleteMarketData'],
}

class Near {
	constructor() {
		this.ctx = null
	}

	async init() {
		if (!process.env.ROOT_ACCOUNT) {
			throw '[env] ROOT_ACCOUNT not found'
		}
		if (!process.env.CONTRACT_ACCOUNT) {
			throw '[env] CONTRACT_ACCOUNT not found'
		}
		const rootAccount = JSON.parse(process.env.ROOT_ACCOUNT)
		const contractAccount = JSON.parse(process.env.CONTRACT_ACCOUNT)
		const keyStore = new InMemoryKeyStore()

		// add root account
		const rootKeyPair = KeyPair.fromString(rootAccount.secret_key || rootAccount.private_key)
		await keyStore.setKey(config.networkId, rootAccount.account_id, rootKeyPair)

		// add contract account
		const contractKeyPair = KeyPair.fromString(
			contractAccount.secret_key || contractAccount.private_key
		)
		await keyStore.setKey(config.networkId, contractAccount.account_id, contractKeyPair)

		const near = await connect({
			deps: {
				keyStore: keyStore,
			},
			...config,
		})
		this.ctx = near
		this.masterAccount = await near.account(rootAccount.account_id)
		this.contractAccount = await near.account(contractAccount.account_id)
		this.contract = new Contract(this.masterAccount, this.contractAccount.accountId, contractConfig)
	}

	async deployContract() {
		console.log('Setting up and deploying contract')
		const contractPath = join(process.cwd(), 'out/main.wasm')
		await this.contractAccount.deployContract(require('fs').readFileSync(contractPath))
		try {
			await this.contract.init({
				initialOwner: this.masterAccount.accountId,
			})
		} catch (err) {
			console.log(err)
		}
		console.log(`Contract ${this.contractAccount.accountId} deployed`)
	}
}

module.exports = Near
