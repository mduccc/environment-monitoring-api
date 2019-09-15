require('dotenv').config()
const server = require('./Server')
const Server = new server()
const app = Server.start()
const io = Server.io()
const checkpoint = require('./middleware/CheckPoint')

new checkpoint(app, io).go()