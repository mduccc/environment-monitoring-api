module.exports = class FirebaseAdmin {
    constructor() {
        this.admin = require('firebase-admin')
        this.serviceAccount = require('./function-iot-firebase-adminsdk-jv35e-c20adb11c7.json') //json fiile
        
        // initializeApp just call once time
        if(!this.admin.apps.length)
            this.admin.initializeApp({
                credential: this.admin.credential.cert(this.serviceAccount),
                databaseURL: 'https://function-iot.firebaseio.com' //url database
            })

    }

    instance() {
        return this.admin
    }

    firestoreDB() {
        return this.instance().firestore()
    }
}