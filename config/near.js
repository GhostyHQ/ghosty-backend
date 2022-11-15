function getConfig(env) {
	// if (!process.env.CONTRACT_NAME) {
	// 	throw '[env] CONTRACT_NAME not found'
	// }
	switch (env) {
		case 'production':
		case 'mainnet':
			return {
				networkId: 'mainnet',
				nodeUrl: 'https://rpc.mainnet.near.org',
				contractName: process.env.CONTRACT_NAME,
				walletUrl: 'https://wallet.mainnet.near.org',
				helperUrl: 'https://helper.mainnet.near.org',
			}
		case 'development':
		case 'testnet':
			return {
				networkId: 'default',
				nodeUrl: 'https://rpc.testnet.near.org',
				contractName: process.env.CONTRACT_NAME,
				walletUrl: 'https://wallet.testnet.near.org',
				helperUrl: 'https://helper.testnet.near.org',
			}
		case 'devnet':
			return {
				networkId: 'devnet',
				nodeUrl: 'https://rpc.devnet.near.org',
				contractName: process.env.CONTRACT_NAME,
				walletUrl: 'https://wallet.devnet.near.org',
				helperUrl: 'https://helper.devnet.near.org',
			}
		default:
			throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
	}
}

module.exports = getConfig
