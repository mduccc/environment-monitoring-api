module.exports = class Router {
    constructor(app, io) {
        this.app = app
        this.io = io
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

            await CitiesData.getPlacesData(filter, place_id, token, data => {
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
            await CitiesData.insertPlacesData(datas, place_id, token, async data => {
                console.log(data)

                if (data.code === 200)
                    this.io.emit(token, 'Data changed')

                res.status(data.code)
                res.json(data)
            })
        })
    }

    v1_1() {
        this.app.get('/v1.1/', (req, res, next) => {
            res.json({ version: '1.1.0' })
        })

        this.app.get('/v1.1/data', (req, res, next) => {
            res.json({ message: 'No Action' })
        })

        this.app.post('/v1.1/login', async (req, res) => {
            const login = require('../business/v1_1/Login')
            let username = req.body.username
            let password = req.body.password
            let Login = new login()
            await Login.validate(username, password, async data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            })
        })

        this.app.post('/v1.1/logout', async (req, res) => {
            const unsetToken = require('../business/v1_1/UnsetToken')
            let UnsetToken = new unsetToken()
            let token = req.body.token

            await UnsetToken.unset(token, async data => {
                res.json(data)
            })
        })

        this.app.post('/v1.1/register', async (req, res) => {
            res.send('Register')
        })

        this.app.post('/v1.1/data/get', async (req, res) => {
            const citiesData = require('../business/v1_1/PlacesData')
            let CitiesData = new citiesData()
            let place_id = req.body.place_id
            let token = req.body.token
            let filter = req.body.filter
            let date = req.body.date

            await CitiesData.getPlacesData(filter, place_id, token, data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            }, false, date)
        })

        this.app.post('/v1.1/data/get/info', async (req, res) => {
            const validateToken = require('../business/v1_1/ValidateToken')
            const httpStatus = require('../business/HttpStatus')
            let ValidateToken = new validateToken()
            let token = req.body.token
            let valid = await ValidateToken.isTruth(token);

            if (valid != false) {
                res.status(httpStatus.success_code)
                valid.code = httpStatus.success_code
                res.json(valid)
            } else {
                res.status(httpStatus.unauthorized_code)
                res.json({
                    code: httpStatus.unauthorized_code,
                    message: httpStatus.unauthorized_message
                })
            }
        })

        this.app.post('/v1.1/data/get/current', async (req, res) => {
            const citiesData = require('../business/v1_1/PlacesData')
            let CitiesData = new citiesData()
            let place_id = req.body.place_id
            let token = req.body.token
            let filter = req.body.filter

            await CitiesData.getPlacesData(filter, place_id, token, data => {
                console.log(data)
                res.status(data.code)
                res.json(data)
            }, true, null)
        })

        this.app.post('/v1.1/data/insert', async (req, res) => {
            const citiesData = require('../business/v1_1/PlacesData')
            let CitiesData = new citiesData()

            let rain = req.body.rain
            let gas = req.body.gas
            let fire = req.body.fire
            let temp = req.body.temp
            let co = req.body.co
            let uv = req.body.uv
            let dust = req.body.dust
            let humidity = req.body.humidity
            let smoke = req.body.smoke
            let soil = req.body.soil
            let token = req.body.token
            let place_id = req.body.place_id

            if (rain === undefined)
                rain = ''
            if (gas === undefined)
                gas = ''
            if (fire === undefined)
                fire = ''
            if (temp === undefined)
                temp = ''
            if (co === undefined)
                co = ''
            if (uv === undefined)
                uv = ''
            if (dust === undefined)
                dust = ''
            if (humidity === undefined)
                humidity = ''
            if (smoke === undefined)
                smoke = ''
            if (soil === undefined)
                soil = ''

            let datas = {
                rain: rain,
                gas: gas,
                fire: fire,
                temp: temp,
                co: co,
                uv: uv,
                dust: dust,
                humidity: humidity,
                smoke: smoke,
                soil: soil
            }
            await CitiesData.insertPlacesData(datas, place_id, token, async (data, emitData) => {
                //console.log(data)
                console.log('place_id: ', emitData.place_id);
                if (data.code == 200)
                    this.io.emit(emitData.places[0].place_id, emitData)

                res.status(data.code)
                res.json(data)
            })
        })
    }
}