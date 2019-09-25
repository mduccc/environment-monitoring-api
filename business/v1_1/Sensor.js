module.exports = class Sensor {
    constructor() {
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
        this.httpStatus = require('../HttpStatus')
        this.validateToken = require('./ValidateToken')
        this.ValidateToken = new this.validateToken()
        this.places = require('./Place')
        this.Places = new this.places()
    }

    async get(token, callback) {
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message
        let result = null
        let isTrust = await this.ValidateToken.isTruth(token)
        let place_id = null
        let next = true
        if (isTrust == false)
            next = false

        if (next) {
            await this.db.collection('devices').doc(isTrust.place_id).get()
                .then(snapshot => {
                    if (snapshot.exists) {
                        code = this.httpStatus.success_code
                        message = this.httpStatus.success_message
                        result = snapshot.data()
                    }
                })
        }

        if (code == 200)
            callback({
                code: code,
                message: message,
                devices: result
            })
        else
            callback({
                code: code,
                message: message
            })
    }

    async switch(token, sensor_name, _switch, callback) {
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message
        let isTrust = await this.ValidateToken.isTruth(token)
        let next = true

        if (isTrust == false)
            next = false
        if (next && _switch != '1' && _switch != '0') {
            code = this.httpStatus.invalid_input_code
            message = this.httpStatus.invalid_input_message
            next = false
        }

        if (next) {
            await this.db.collection('devices').doc(isTrust.place_id).get()
                .then(async snapshot => {
                    if (snapshot.exists) {
                        if (snapshot.data().hasOwnProperty(sensor_name) == false) {
                            code = this.httpStatus.not_found_code
                            message = this.httpStatus.not_found_message
                        } else {
                            await this.db.collection('devices').doc(isTrust.place_id).update({ [sensor_name]: _switch })
                                .then(() => {
                                    code = this.httpStatus.success_code
                                    message = this.httpStatus.success_message
                                })
                                .catch(err => {
                                    console.log(err)
                                    code = this.httpStatus.not_found_code
                                    message = this.httpStatus.not_found_message
                                })
                        }
                    }
                })

        }

        if (code == 200)
            callback({
                code: code,
                message: message,
            })
        else
            callback({
                code: code,
                message: message
            })
    }
}