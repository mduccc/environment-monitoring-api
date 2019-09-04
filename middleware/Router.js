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
            const citiesData = require('../business/v1/CitiesData')
            let CitiesData = new citiesData()
            let city_id = req.query.city_id
            let token = req.query.token
            await CitiesData.getCitiesData(city_id, token, async data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            })
        })

        this.app.get('/v1/data/get/gas', async (req, res) => {
            const gas = require('../business/v1/Gas')
            let Gas = new gas()
            let city_id = req.query.city_id
            let token = req.query.token
            await Gas.getGas(city_id, token, async data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            })
        })

        this.app.get('/v1/data/get/dust', async (req, res) => {
            const dust = require('../business/v1/Dust')
            let Dust = new dust()
            let city_id = req.query.city_id
            let token = req.query.token
            await Dust.getDust(city_id, token, async data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            })
        })

        this.app.get('/v1/data/insert', async (req, res) => {
            const citiesData = require('../business/v1/CitiesData')
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
            let city_id = req.query.city_id
            let time = req.query.time

            let datas = {
                rain: rain,
                gas: gas,
                fire: fire,
                temp: temp,
                co2: co2,
                uv: uv,
                dust: dust,
                humidity: humidity,
                time: time
            }
            // http://localhost:5000/v1/data/insert?time=18-08-2019 03:40&rain=0&gas=0&fire=0&temp=0&co2=0&uv=0&dust=0&humidity=0&token=
            await CitiesData.insertCitiesData(datas, city_id, token, data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            })
        })
    }
}
