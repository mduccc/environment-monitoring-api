require('dotenv').config()
const server = require('./Server')
const app = new server().start()
const checkpoint = require('./middleware/CheckPoint')

new checkpoint(app).go()