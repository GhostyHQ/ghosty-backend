const express = require('express')
require('dotenv').config()
const cors = require('cors')

const databaseConnect = require('./config/database')
const profileRoute = require('./routes/profileRoute')
const messageRoute = require('./routes/messageRoute')

const PORT = process.env.PORT || 9090

const server = express()

databaseConnect()

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use('/api', profileRoute)
server.use('/api', messageRoute)

server.get('/', (req, res) => {
	res.json({ status: 1 })
})

server.listen(PORT, () => console.log(`server is running on port ${PORT}`))
