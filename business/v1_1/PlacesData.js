/* root or admin can see all data, but normal user not */

module.exports = class PlacesData {
    constructor() {
        this.httpStatus = require('../HttpStatus')
        this.validateToken = require('./ValidateToken')
        this.ValidateToken = new this.validateToken()
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
        this.places = require('./Place')
        this.Places = new this.places()
        this.random = require('./StringRandom')
        this.todayWithHour = require('./TodayWithHour')
        this.fs = require('fs')
    }

    currentData(input) {
        let result = []
        //eatch data
        for (let i = 0; i < input.length; i++) {
            let data = input[i]
            let newData = data.times[data.times.length - 1];

            result.push(newData)
        }

        return result
    }

    byDate(input, date) {
        console.log(date)
        let result = []
        // each data
        for (let i = 0; i < input.length; i++) {
            let data = input[i]
            let times = []
            // each time
            for (let j = 0; j < data.times.length; j++) {
                let time = data.times[j].time
                let getDate = time.substring(0, time.indexOf(' ')).trim()
                if (date.trim() === getDate) {
                    times.push(data.times[j])
                }
            }
            result.push({
                place_id: data.place_id,
                place_name: data.place_name,
                times: times
            })
        }

        return result
    }

    filterData(input, filter) {
        console.log('filter => ', filter)
        if (filter == null)
            return null
        let newInput = input
        // eatch data
        for (let i = 0; i < input.length; i++) {
            let data = input[i]
            // eatch time
            for (let j = 0; j < data.times.length; j++) {
                let time = data.times[j]
                for (let property in time.datas) {
                    console.log(i, ', ', j)
                    if (property != filter)
                        delete newInput[i].times[j].datas[property]
                }
            }
        }
        return newInput
    }

    async getPlacesData(filter, place_id, token, callback, onlyCurrent, date) {
        let result = null
        let placeData = []
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message
        let isTruth = await this.ValidateToken.isTruth(token)
        let placename = ''
        let newplaceId = ''
        let next = true

        if (isTruth !== false) {
            if (isTruth.level === 'normal') {
                newplaceId = isTruth.place_id
                placename = await this.Places.getplaceName(newplaceId)
            } else {
                newplaceId = place_id
                placename = await this.Places.getplaceName(newplaceId)
                if (newplaceId != null && placename === false) {
                    placename = null
                    next = false
                    code = this.httpStatus.not_found_code
                    message = this.httpStatus.not_found_message
                }
            }
            console.log('next => ', next)
            if (next) {
                if (!this.fs.existsSync('./cache/' + newplaceId + '.json')) {
                    await this.db.collection('places_data').doc(newplaceId).get()
                        .then(async snapshot => {
                            if (snapshot.exists) {
                                placeData.push({
                                    place_id: snapshot.data().place_id,
                                    place_name: placename,
                                    times: snapshot.data().times
                                })
                                code = this.httpStatus.success_code
                                message = this.httpStatus.success_message

                                let cache = {
                                    code: code,
                                    message: message,
                                    places: placeData
                                }

                                if (!this.fs.existsSync('./cache/' + newplaceId + '.json'))
                                    this.fs.writeFileSync('./cache/' + newplaceId + '.json', JSON.stringify(cache), 'utf8')
                            }
                        })
                        .catch(err => {
                            console.log('Error get places_data #1', err)
                            code = this.httpStatus.bad_request_code
                            message = this.httpStatus.bad_request_message
                        })
                } else {
                    // From cache
                    let cacheJson = JSON.parse(this.fs.readFileSync('./cache/' + newplaceId + '.json', 'utf8'))

                    // each data
                    for (let i = 0; i < cacheJson.places.length; i++) {
                        let data = cacheJson.places[i]
                        let time = []
                        // each time
                        for (let j = 0; j < data.times.length; j++)
                            time.push(data.times[j])

                        placeData.push({
                            place_id: data.place_id,
                            place_name: data.place_name,
                            times: time
                        })
                        code = this.httpStatus.success_code
                        message = this.httpStatus.success_message
                    }
                }
            }
        }

        let filterData = []
        if (filterData != null && filter != undefined) {
            let filterData = this.filterData(placeData, filter)
            placeData = filterData
        }

        if (date != null && date != undefined)
            placeData = this.byDate(placeData, date)

        if (onlyCurrent)
            placeData = this.currentData(placeData)

        if (code === this.httpStatus.success_code)
            result = {
                code: code,
                message: message,
                places: placeData
            }
        else
            result = {
                code: code,
                message: message,
            }

        callback(result)
    }

    async insertPlacesData(inputDatas, place_id, token, callback) {
        console.log(inputDatas)
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message
        let result = []
        let isTruth = await this.ValidateToken.isTruth(token)
        let placename = ''
        let newplaceId = ''
        let next = true

        if (isTruth !== false) {
            if (isTruth.level === 'normal') {
                newplaceId = isTruth.place_id
                // console.log('place id => ', isTruth.place_id)
                placename = await this.Places.getplaceName(newplaceId)
            } else {
                if (place_id != null) {
                    newplaceId = place_id
                    // console.log('place id => ', isTruth.place_id)
                    placename = await this.Places.getplaceName(newplaceId)
                    if (placename === false) {
                        placename = null
                        next = false
                        code = this.httpStatus.not_found_code
                        message = this.httpStatus.not_found_message
                    }
                } else {
                    placename = null
                    next = false
                    code = this.httpStatus.not_found_code
                    message = this.httpStatus.not_found_message
                }
            }
            console.log('next => ', next)
            console.log(newplaceId)
            if (next) {
                let timeInsertId = this.random(64)
                let timeInsert = this.todayWithHour()
                await this.db.collection('places_data').doc(newplaceId).get()
                    .then(async snapshot => {
                        if (snapshot.exists) {
                            let timeForUpdate = {
                                time_id: timeInsertId,
                                time: timeInsert,
                                datas: inputDatas
                            }

                            let times = snapshot.data().times
                            times.push(timeForUpdate)
                            await this.db.collection('places_data').doc(newplaceId).update({ times: times })
                                .then(() => {
                                    code = this.httpStatus.success_code
                                    message = this.httpStatus.success_message

                                    if (this.fs.existsSync('./cache/' + newplaceId + '.json')) {
                                        let cache = {
                                            code: code,
                                            message: message,
                                            places: [
                                                {
                                                    place_id: newplaceId,
                                                    place_name: placename,
                                                    times: times
                                                }
                                            ]
                                        }

                                        console.log(JSON.stringify(cache))
                                        this.fs.unlinkSync('./cache/' + newplaceId + '.json', JSON.stringify(cache))
                                        this.fs.writeFileSync('./cache/' + newplaceId + '.json', JSON.stringify(cache), 'utf8')
                                    }

                                })
                                .catch(err => {
                                    code = this.httpStatus.bad_request_code
                                    message = this.httpStatus.bad_request_message
                                })
                        }
                    })
            }
        }

        result = {
            code: code,
            place_name: placename,
            message: message
        }
        callback(result)
    }

}