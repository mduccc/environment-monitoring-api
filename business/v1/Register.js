module.exports = class Register {
    constructor() {
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
    }

    exist(username) {
    }

    reg(username, password, rePassword, sex, callback) {
        console.log('register...')
    }
}