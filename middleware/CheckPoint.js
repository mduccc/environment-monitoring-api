module.exports = class CheckPoint {
    constructor(app) {
        this.app = app
        this.router = require('./Router')
        this.Router = new this.router(this.app)
        this.httpStatus = require('../business/HttpStatus')
    }

    go() {
        this.app.use((req, res, next) => {
            next()
        })

        this.app.use('/v1/:path', async (req, res, next) => {
            let path = req.params.path
            console.log(path)

            switch (path) {
                case null: {
                    res.json({ message: 'invalid path' })
                    break
                }
                case 'login': {
                    let username = req.query.username
                    let password = req.query.password
                    if (username == null || password == null || username.trim() === '' || password.trim() == '')
                        res.json({ message: 'invalid params' })
                    else
                        next()
                    break
                }
                case 'register': {
                    next()
                    break
                }
                case 'data': {
                    next()
                    break
                }
                case 'import': {
                    res.send('Importing...')
                    //const importDB = require('../business/v1/ImportDB')
                    //let ImportDB = new importDB()
                    //await ImportDB.importAccounts()
                    //await ImportDB.importplaces()
                    //await ImportDB.importplaceDatas()
                    //await ImportDB.importDust()
                    //await ImportDB.importGas()
                    //await ImportDB.importToken()
                    break
                }
                default: {
                    res.json({ message: 'invalid path' })
                    next()
                    break
                }
            }
        })

        this.app.use('/v1/data/get', (req, res, next) => {
            console.log('/v1/data/get')
            let token = req.query.token
            if (token == null)
                res.json({ message: 'invalid params' })
            else
                next()
        })

        this.app.use('/v1/data/insert', (req, res, next) => {
            console.log('/v1/data/insert')
            let token = req.query.token
            if (token == null && token.trim() === '')
                res.json({ message: 'invalid params' })
            else
                next()
        })

        this.Router.v1()
    }

}