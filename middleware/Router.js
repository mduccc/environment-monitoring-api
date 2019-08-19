module.exports = class Router {
    constructor(app) {
        this.app = app
    }

    v1() {
        this.app.get('/v1/', (req, res, next) => {
            res.json({ version: '1.0.0' })
        })

        this.app.get('/v1/data', (req, res, next) => {
            res.json({ message: 'No Action' })
        })


        this.app.get('/v1/login', async (req, res) => {
            const login = require('../business/v1/Login')
            let username = req.query.username
            let password = req.query.password
            let Login = new login()
            await Login.validate(username, password, async data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            })
        })

        this.app.get('/v1/register', async (req, res) => {
            res.send('Register')
        })

        this.app.get('/v1/data/get', async (req, res) => {
            const datas = require('../business/v1/Datas')
            let Datas = new datas()
            let city_id = req.query.city_id
            let token = req.query.token
            await Datas.getCitiesData(city_id, token, async data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            })
        })
    }
}