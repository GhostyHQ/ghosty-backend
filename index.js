const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

const databaseConnect = require('./config/database')
const profileRoute = require('./routes/profileRoute')

const PORT = process.env.PORT || 9090

const server = express()

dotenv.config({ path: 'config/config.env' })

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use('/api', profileRoute)

server.get('/', (req, res) => {
	res.json({ status: 1 })
})

databaseConnect()

server.listen(PORT, () => console.log(`server is running on port ${PORT}`))
