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
    }

    currentData(input) {
        let result = []
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
        for (let i = 0; i < input.length; i++) {
            let data = input[i]
            for (let j = 0; j < data.times.length; j++) {
                let time = data.times[j].time
                let getDate = time.substring(0, time.indexOf(' ')).trim()
                if (date.trim() === getDate) {
                    //console.log(getDate)
                    result.push(data.times[j])
                }
            }
        }

        return result
    }

    filterData(input, filter) {
        console.log('filter => ', filter)
        if (filter == null)
            return null
        let newInput = input
        for (let i = 0; i < input.length; i++) {
            let element = input[i]
            //console.log(element)
            for (let j = 0; j < element.times.length; j++) {
                let _element = element.times[j]
                //console.log(_element.datas)
                for (let property in _element.datas) {
                    //console.log(property)
                    console.log(i, ', ', j)
                    //console.log(newInput[i].times[j].datas)
                    if (property != filter)
                        delete newInput[i].times[j].datas[property]
                }

                //console.log(newInput[i].times[j].datas)
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
                // console.log('place id => ', isTruth.place_id)
                placename = await this.Places.getplaceName(newplaceId)
            } else {
                newplaceId = place_id
                // console.log('place id => ', isTruth.place_id)
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
                await this.db.collection('places_data').get()
                    .then(async snapshot => {
                        let ids = snapshot.docs.map(doc => doc.id)
                        let datas = snapshot.docs.map(doc => doc.data())
                        if (isTruth.level === 'normal') {
                            for (let i = 0; i < datas.length; i++) {
                                let id = ids[i]
                                let data = datas[i]
                                //console.log('place data =>', data)
                                if (data.place_id === newplaceId) {
                                    //console.log('place data =>', data)
                                    placeData.push({
                                        place_id: data.place_id,
                                        place_name: placename,
                                        times: data.times
                                    })
                                    code = this.httpStatus.success_code
                                    message = this.httpStatus.success_message
                                    break
                                }
                            }
                        } else {
                            if (newplaceId == null) {
                                for (let i = 0; i < datas.length; i++) {
                                    let id = ids[i]
                                    let data = datas[i]
                                    //console.log('place data =>', data)
                                    //console.log('place data =>', data)
                                    placeData.push({
                                        place_id: data.place_id,
                                        place_name: await this.Places.getplaceName(data.place_id),
                                        times: data.times
                                    })
                                    code = this.httpStatus.success_code
                                    message = this.httpStatus.success_message
                                }
                            } else {
                                for (let i = 0; i < datas.length; i++) {
                                    let id = ids[i]
                                    let data = datas[i]
                                    //console.log('place data =>', data)
                                    //console.log('place data =>', data)
                                    if (data.place_id === newplaceId) {
                                        placeData.push({
                                            place_id: data.place_id,
                                            place_name: placename,
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
                        console.log('Error get places_data #1', err)
                        code = this.httpStatus.bad_request_code
                        message = this.httpStatus.bad_request_message
                    })
            }
        }

        let filterData = this.filterData(placeData, filter)
        if (filterData != null)
            placeData = filterData

        if (date != null)
            placeData = this.byDate(placeData, date)

        if (onlyCurrent)
            placeData = this.currentData(placeData)

        if (code === this.httpStatus.success_code)
            result = {
                code: code,
                message: message,
                data: placeData
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
            if (next) {
                await this.db.collection('places_data').get()
                    .then(async snapshot => {
                        let ids = snapshot.docs.map(doc => doc.id)
                        let datas = snapshot.docs.map(doc => doc.data())

                        for (let i = 0; i < datas.length; i++) {
                            let id = ids[i]
                            let data = datas[i]
                            if (data.place_id == newplaceId) {
                                let timeForUpdate = {
                                    time_id: this.random(128),
                                    time: this.todayWithHour(),
                                    datas: inputDatas
                                }

                                let times = data.times
                                times.push(timeForUpdate)
                                console.log(placename, ' place times => ', times)
                                await this.db.collection('places_data').doc(id).update({ times: times })
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
                        console.log('Error get places_data #3', err)
                        code = this.httpStatus.bad_request_code
                        message = this.httpStatus.bad_request_message
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