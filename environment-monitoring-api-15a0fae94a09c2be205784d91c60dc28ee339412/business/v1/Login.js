module.exports = class Login {
    constructor() {
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
        this.httpStatus = require('../HttpStatus')
        this.random = require('../v1/StringRandom')
        this.validateToken = require('../v1/ValidateToken')
        this.ValidateToken = new this.validateToken()
        this.today = require('./Today')
        this.sha256 = require('sha256')
        this.private_key = process.env.private_key
    }

    async saveToken(token, accID) {
        console.log('Token created => ', token)
        let result = false
        let tokenExists = await this.ValidateToken.isExists(token)

        while (await tokenExists) {
            token = this.random(128)
            tokenExists = await this.ValidateToken.isExists(token)
        }

        let json = {
            token: token,
            accID: accID,
            date_created: this.today()
        }

        await this.db.collection('tokens').add(json)
            .then(async () => {
                result = true
            })
            .catch(err => {
                console.log('Error adding documents', err)
                result = false
            })

        console.log('Token saved => ', result)
        return result
    }

    async validate(username, password, callback) {
        username = username.trim()
        password = password.trim()
        password = this.sha256(password + this.private_key)

        let token = null
        let code = this.httpStatus.unauthorized_code
        let message = this.httpStatus.unauthorized_message

        await this.db.collection('accounts').get()
            .then(async snapshot => {
                //await console.log('id =>', snapshot.docs.map(doc => doc.id))
                //await console.log('snapshot =>', snapshot.docs.map(doc => doc.data()))
                let ids = await snapshot.docs.map(doc => doc.id)
                let datas = await snapshot.docs.map(doc => doc.data())
                for (let i = 0; i < datas.length; i++) {
                    let id = ids[i]
                    let element = datas[i]
                    if (username === element.username && password === element.password) {
                        let accId = id
                        token = this.random(128)
                        if (await this.saveToken(token, accId)) {
                            code = this.httpStatus.success_code
                            message = this.httpStatus.success_message
                            break
                        }
                    }
                }
            })
            .catch(err => {
                console.log('Error get accounts', err)
                code = this.httpStatus.bad_request_code
                message = this.httpStatus.bad_request_message
            })

        let result = null

        if (code == this.httpStatus.success_code)
            result = {
                code: code,
                message: message,
                token: token
            }
        else {
            result = {
                code: code,
                message: message,
            }
        }

        callback(result)
    }
}