require('dotenv').config()
const fs = require('fs')
const server = require('./Server')
const Server = new server()
const app = Server.start()
const io = Server.io()

if(!fs.existsSync('./cache'))
    fs.mkdirSync('./cache')

const checkpoint = require('./middleware/CheckPoint')

new checkpoint(app, io).go()