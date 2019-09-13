class Server {

    constructor() {
        this.app = require('express')()
        this.http = require('http').createServer(this.app);
        this._io = require('socket.io')(this.http)
        this.port = process.env.PORT
    }

    io() {
        return this._io
    }

    start() {
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