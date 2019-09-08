module.exports = class UnsetToken {
    constructor() {
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
        this.validate = require('../v1/ValidateToken')
        this.Validate = new this.validate()
        this.httpStatus = require('../HttpStatus')
    }
    async unset(token, callback) {
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message
        let next = true

        if (await this.Validate.isTruth(token) == false)
            next = false

        if (next) {
            await this.db.collection('tokens').get()
                .then(async snapshot => {
                    let ids = snapshot.docs.map(doc => doc.id)
                    let datas = snapshot.docs.map(doc => doc.data())
                    for (let i = 0; i < datas.length; i++) {
                        let id = ids[i]
                        let element = datas[i]

                        //console.log('token => ', element)
                        if (element.token === token) {
                            await this.db.collection('tokens').doc(id).update({ date_created: '1-1-1970' })
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
                            break
                        }
                    }
                })
                .catch(err => {
                    console.log('Error get token', err)
                })
        }

        callback({
            code: code,
            message: message
        })
    }
} 