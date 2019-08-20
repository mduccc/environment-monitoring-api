/* root or admin can see all data, but normal user not */

module.exports = class Gas {
    constructor() {
        this.httpStatus = require('../HttpStatus')
        this.validateToken = require('./ValidateToken')
        this.ValidateToken = new this.validateToken()
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
        this.cities = require('./Cities')
        this.Cities = new this.cities()
    }

    async getGas(city_id, token, callback) {
        let result = null
        let cityData = []
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message
        let isTruth = await this.ValidateToken.isTruth(token)

        if (isTruth !== false) {
            code = this.httpStatus.success_code
            message = this.httpStatus.success_message
            if (isTruth.level === 'normal') {
                await this.db.collection('gas').get()
                    .then(async snapshot => {
                        let ids = await snapshot.docs.map(doc => doc.id)
                        let datas = await snapshot.docs.map(doc => doc.data())
                        for (let i = 0; i < datas.length; i++) {
                            let id = ids[i]
                            let data = datas[i]
                            //console.log('Gas data =>', data)
                            if (data.city_id === isTruth.city_id) {
                                console.log('Gas data =>', data)
                                cityData.push({
                                    city_id: data.city_id,
                                    city_name: await this.Cities.getCityName(data.city_id),
                                    times: data.times
                                })
                                break
                            }
                        }
                    })
                    .catch(err => {
                        console.log('Error adding documents', err)
                    })
            } else {
                await this.db.collection('gas').get()
                    .then(async snapshot => {
                        let ids = await snapshot.docs.map(doc => doc.id)
                        let datas = await snapshot.docs.map(doc => doc.data())
                        if (city_id == null) {
                            for (let i = 0; i < datas.length; i++) {
                                let id = ids[i]
                                let data = datas[i]
                                //console.log('Gas data =>', data)
                                //console.log('Gas data =>', data)
                                cityData.push({
                                    city_id: data.city_id,
                                    city_name: await this.Cities.getCityName(data.city_id),
                                    times: data.times
                                })
                            }
                        } else {
                            if (await this.getCityName(city_id) !== false) {
                                for (let i = 0; i < datas.length; i++) {
                                    let id = ids[i]
                                    let data = datas[i]
                                    //console.log('Gas data =>', data)
                                    //console.log('Gas data =>', data)
                                    if (data.city_id === city_id) {
                                        cityData.push({
                                            city_id: data.city_id,
                                            city_name: await this.Cities.getCityName(data.city_id),
                                            times: data.times
                                        })
                                        break
                                    }
                                }
                            } else {
                                code = this.httpStatus.not_found_code,
                                message = this.httpStatus.not_found_message
                            }
                        }
                    })
                    .catch(err => {
                        console.log('Error adding documents', err)
                    })
            }
        }

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

}