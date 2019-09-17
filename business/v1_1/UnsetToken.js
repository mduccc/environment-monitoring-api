module.exports = class UnsetToken {
    constructor() {
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
        this.validate = require('../v1_1/ValidateToken')
        this.Validate = new this.validate()
        this.httpStatus = require('../HttpStatus')
    }
    async unset(token, callback) {
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message
        let next = true
        let tokenId = token.substring(0, 20)

        if (await this.Validate.isTruth(token) == false)
            next = false

        if (next) {
            await this.db.collection('tokens').doc(tokenId).update({ date_created: '01-01-1970' })
                .then(() => {
                    code = this.httpStatus.success_code
                    message = this.httpStatus.success_message
                }).catch(err => {
                    {
                        console.log('Error unset token', err)
                        code = this.httpStatus.bad_request_code
                        message = this.httpStatus.bad_request_message
                    }
                })
        }

        callback({
            code: code,
            message: message
        })
    }
} 