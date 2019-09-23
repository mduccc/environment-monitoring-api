class Server {

    constructor() {
        this.app = require('express')()
        this.http = require('http').createServer(this.app);
        this._io = require('socket.io')(this.http)
        this.port = process.env.PORT
        this.validateToken = require('./business/v1_1/ValidateToken')
        this.ValidateToken = new this.validateToken()
    }

    io() {
        return this._io
    }

    start() {
        this._io.use(async (socket, next) => {
            let token = socket.handshake.query.token;
            console.log('Token: ', token);
            if (token != undefined && token != null && await this.ValidateToken.isTruth(token) != false)
                next()
        })
        this._io.on('connection', socket => {
            console.log('a user connected')

            socket.on('disconnect', () => {
                console.log('user disconnected')
            })
        })
        this.http.listen(this.port, () => {
            console.log('API running on port ' + this.port)
        })
        return this.app
    }
}

module.exports = Server