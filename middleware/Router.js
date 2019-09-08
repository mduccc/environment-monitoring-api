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

        this.app.post('/v1/login', async (req, res) => {
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

        this.app.post('/v1/logout', async (req, res) => {
            const unsetToken = require('../business/v1/UnsetToken')
            let UnsetToken = new unsetToken()
            let token = req.query.token

            await UnsetToken.unset(token, async data => {
                res.json(data)
            })
        })

        this.app.get('/v1/register', async (req, res) => {
            res.send('Register')
        })

        this.app.get('/v1/data/get', async (req, res) => {
            const citiesData = require('../business/v1/PlacesData')
            let CitiesData = new citiesData()
            let place_id = req.query.place_id
            let token = req.query.token
            let filter = req.query.filter

            await CitiesData.getPlacesData(filter, place_id, token, async data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            })
        })

        this.app.get('/v1/data/insert', async (req, res) => {
            const citiesData = require('../business/v1/PlacesData')
            let CitiesData = new citiesData()

            let rain = req.query.rain
            let gas = req.query.gas
            let fire = req.query.fire
            let temp = req.query.temp
            let co2 = req.query.co2
            let uv = req.query.uv
            let dust = req.query.dust
            let humidity = req.query.humidity
            let token = req.query.token
            let place_id = req.query.place_id

            if (rain === undefined)
                rain = ''
            if (gas === undefined)
                gas = ''
            if (fire === undefined)
                fire = ''
            if (temp === undefined)
                temp = ''
            if (co2 === undefined)
                co2 = ''
            if (uv === undefined)
                uv = ''
            if (dust === undefined)
                dust = ''
            if (humidity === undefined)
                humidity = ''

            let datas = {
                rain: rain,
                gas: gas,
                fire: fire,
                temp: temp,
                co2: co2,
                uv: uv,
                dust: dust,
                humidity: humidity,
            }
            // http://localhost:5000/v1/data/insert?rain=0&gas=0&fire=0&temp=0&co2=0&uv=0&dust=0&humidity=0&token=
            await CitiesData.insertPlacesData(datas, place_id, token, data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            })
        })
    }
}
