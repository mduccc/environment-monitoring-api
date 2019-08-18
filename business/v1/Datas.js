/* root or admin can see all data, but normal user not */

module.exports = class Datas {
    constructor() {
        this.httpStatus = require('../HttpStatus')
        this.validateToken = require('../v1/ValidateToken')
        this.ValidateToken = new this.validateToken()
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
    }

    async getCityName(city_id) {
        let result = false
        await this.db.collection('cities').get()
            .then(async snapshot => {
                let ids = await snapshot.docs.map(doc => doc.id)
                let datas = await snapshot.docs.map(doc => doc.data())
                for (let i = 0; i < datas.length; i++) {
                    let id = ids[i]
                    let data = datas[i]
                    //console.log('City list =>', data)
                    if (city_id === id) {
                        //console.log('City name =>', data.city_name)
                        result = data.city_name
                    }
                }
            })
            .catch(err => {
                console.log('Error adding documents', err)
            })

        console.log('City name => ', result)

        return result
    }

    async getCityData(city_ID, token, callback) {
        let result = null
        let cityData = []
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message
        let isTruth = await this.ValidateToken.isTruth(token)

        if (isTruth !== false) {
            code = this.httpStatus.success_code
            message = this.httpStatus.success_message
            if (isTruth.level === 'normal') {
                await this.db.collection('cities_data').get()
                    .then(async snapshot => {
                        let ids = await snapshot.docs.map(doc => doc.id)
                        let datas = await snapshot.docs.map(doc => doc.data())
                        for (let i = 0; i < datas.length; i++) {
                            let id = ids[i]
                            let data = datas[i]
                            //console.log('City data =>', data)
                            if (data.city_id === isTruth.city_id) {
                                console.log('City data =>', data)
                                cityData = {
                                    city_id: data.city_id,
                                    city_name: await this.getCityName(data.city_id),
                                    times: data.times
                                }
                            }
                        }
                    })
                    .catch(err => {
                        console.log('Error adding documents', err)
                    })
            } else {
                await this.db.collection('cities_data').get()
                    .then(async snapshot => {
                        let ids = await snapshot.docs.map(doc => doc.id)
                        let datas = await snapshot.docs.map(doc => doc.data())
                        for (let i = 0; i < datas.length; i++) {
                            let id = ids[i]
                            let data = datas[i]
                            //console.log('City data =>', data)
                            console.log('City data =>', data)
                            cityData.push({
                                city_id: data.city_id,
                                city_name: await this.getCityName(data.city_id),
                                times: data.times
                            })

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

    async getCitiesData(token, callback) {

    }

}