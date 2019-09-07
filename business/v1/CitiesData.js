/* root or admin can see all data, but normal user not */

module.exports = class CitiesData {
    constructor() {
        this.httpStatus = require('../HttpStatus')
        this.validateToken = require('./ValidateToken')
        this.ValidateToken = new this.validateToken()
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
        this.cities = require('./Cities')
        this.Cities = new this.cities()
        this.random = require('../v1/StringRandom')
        this.todayWithHour = require('../v1/TodayWithHour')
    }

    filterData(input, filter) {
        if (filter == null)
            return null
        let newInput = input
        let i = -1
        let j = -1
        input.forEach(element => {
            //console.log(element)
            i++
            element.times.forEach(_element => {
                //console.log(_element.datas)
                j++
                if (_element.datas['rain'] != undefined && filter != 'rain')
                    delete newInput[i].times[j].datas['rain']
                if (_element.datas['dust'] != undefined && filter != 'dust')
                    delete newInput[i].times[j].datas['dust']
                if (_element.datas['humidity'] != undefined && filter != 'humidity')
                    delete newInput[i].times[j].datas['humidity']
                if (_element.datas['co2'] != undefined && filter != 'co2 ')
                    delete newInput[i].times[j].datas['co2']
                if (_element.datas['temp'] != undefined && filter != 'temp')
                    delete newInput[i].times[j].datas['temp']
                if (_element.datas['uv'] != undefined && filter != 'uv')
                    delete newInput[i].times[j].datas['uv']
                if (_element.datas['fire'] != undefined && filter != 'fire')
                    delete newInput[i].times[j].datas['fire']
                if (_element.datas['gas'] != undefined && filter != 'gas')
                    delete newInput[i].times[j].datas['gas']

                console.log( newInput[i].times[j].datas)
            })
        })

        return newInput
    }

    async getCitiesData(filter, city_id, token, callback) {
        let result = null
        let cityData = []
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message
        let isTruth = await this.ValidateToken.isTruth(token)
        let cityname = ''
        let newCityId = ''
        let next = true

        if (isTruth !== false) {
            if (isTruth.level === 'normal') {
                newCityId = isTruth.city_id
                // console.log('City id => ', isTruth.city_id)
                cityname = await this.Cities.getCityName(newCityId)
            } else {
                newCityId = city_id
                // console.log('City id => ', isTruth.city_id)
                cityname = await this.Cities.getCityName(newCityId)
                if (newCityId != null && cityname === false) {
                    cityname = null
                    next = false
                    code = this.httpStatus.not_found_code
                    message = this.httpStatus.not_found_message
                }
            }
            console.log('next => ', next)
            if (next) {
                await this.db.collection('cities_data').get()
                    .then(async snapshot => {
                        let ids = snapshot.docs.map(doc => doc.id)
                        let datas = snapshot.docs.map(doc => doc.data())
                        if (isTruth.level === 'normal') {
                            for (let i = 0; i < datas.length; i++) {
                                let id = ids[i]
                                let data = datas[i]
                                //console.log('City data =>', data)
                                if (data.city_id === newCityId) {
                                    //console.log('City data =>', data)
                                    cityData.push({
                                        city_id: data.city_id,
                                        city_name: cityname,
                                        times: data.times
                                    })
                                    code = this.httpStatus.success_code
                                    message = this.httpStatus.success_message
                                    break
                                }
                            }
                        } else {
                            if (newCityId == null) {
                                for (let i = 0; i < datas.length; i++) {
                                    let id = ids[i]
                                    let data = datas[i]
                                    //console.log('City data =>', data)
                                    //console.log('City data =>', data)
                                    cityData.push({
                                        city_id: data.city_id,
                                        city_name: await this.Cities.getCityName(data.city_id),
                                        times: data.times
                                    })
                                    code = this.httpStatus.success_code
                                    message = this.httpStatus.success_message
                                }
                            } else {
                                for (let i = 0; i < datas.length; i++) {
                                    let id = ids[i]
                                    let data = datas[i]
                                    //console.log('City data =>', data)
                                    //console.log('City data =>', data)
                                    if (data.city_id === newCityId) {
                                        cityData.push({
                                            city_id: data.city_id,
                                            city_name: cityname,
                                            times: data.times
                                        })
                                        code = this.httpStatus.success_code
                                        message = this.httpStatus.success_message
                                        break
                                    }
                                }
                            }
                        }
                    })
                    .catch(err => {
                        console.log('Error get cities_data #1', err)
                    })
            }
        }

        let filterData = this.filterData(cityData, filter)
        if (filterData != null)
            cityData = filterData

        if (code === this.httpStatus.success_code)
            result = {
                code: code,
                message: message,
                data: cityData
            }
        else
            result = {
                code: code,
                message: message,
            }

        callback(result)
    }

    async insertCitiesData(inputDatas, city_id, token, callback) {
        console.log(inputDatas)
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message
        let result = []
        let isTruth = await this.ValidateToken.isTruth(token)
        let cityname = ''
        let newCityId = ''
        let next = true

        if (isTruth !== false) {
            if (isTruth.level === 'normal') {
                newCityId = isTruth.city_id
                // console.log('City id => ', isTruth.city_id)
                cityname = await this.Cities.getCityName(newCityId)
            } else {
                if (city_id != null) {
                    newCityId = city_id
                    // console.log('City id => ', isTruth.city_id)
                    cityname = await this.Cities.getCityName(newCityId)
                    if (cityname === false) {
                        cityname = null
                        next = false
                        code = this.httpStatus.not_found_code
                        message = this.httpStatus.not_found_message
                    }
                } else {
                    cityname = null
                    next = false
                    code = this.httpStatus.not_found_code
                    message = this.httpStatus.not_found_message
                }
            }
            console.log('next => ', next)
            if (next) {
                await this.db.collection('cities_data').get()
                    .then(async snapshot => {
                        let ids = snapshot.docs.map(doc => doc.id)
                        let datas = snapshot.docs.map(doc => doc.data())

                        for (let i = 0; i < datas.length; i++) {
                            let id = ids[i]
                            let data = datas[i]
                            if (data.city_id == newCityId) {
                                let timeForUpdate = {
                                    id_times: this.random(128),
                                    time: this.todayWithHour(),
                                    datas: inputDatas
                                }

                                let times = data.times
                                times.push(timeForUpdate)
                                console.log(cityname, ' city times => ', times)
                                await this.db.collection('cities_data').doc(id).update({ times: times })
                                    .then(() => {
                                        code = this.httpStatus.success_code
                                        message = this.httpStatus.success_message
                                    })
                                    .catch(err => {
                                        code = this.httpStatus.bad_request_code
                                        message = this.httpStatus.bad_request_message
                                    })
                                break
                            }
                        }
                    })
                    .catch(err => {
                        console.log('Error get cities_data #3', err)
                    })
            }
        }

        result = {
            code: code,
            cityname: cityname,
            message: message
        }

        callback(result)
    }

}