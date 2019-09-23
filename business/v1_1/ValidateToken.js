module.exports = class ValidateToken {
    constructor() {
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
        this.today = require('../v1/Today')
    }

    async isExists(token) {
        let result = false
        let tokenID = token.substring(0, 20)
        console.log(tokenID)

        await this.db.collection('tokens').doc(tokenID).get()
            .then(async snapshot => {
                console.log(snapshot.data())
                if (snapshot.exists)
                    if (snapshot.data().token == token)
                        result = {
                            token: snapshot.data().token,
                            accID: snapshot.data().accID,
                            date_created: snapshot.data().date_created,
                        }
            })
            .catch(err => {
                console.log('Error getting documents', err)
            })

        console.log('Token exists => ', result)

        return result
    }

    async getAccInfo(accID) {
        let result = false

        await this.db.collection('accounts').doc(accID).get()
            .then(async snapshot => {
                if (snapshot.exists) {
                    if (snapshot.data().level === 'normal')
                        result = {
                            level: snapshot.data().level,
                            place_id: snapshot.data().place_id,
                            email: snapshot.data().email
                        }
                    else
                        result = {
                            level: snapshot.data().level,
                        }
                }
            })
            .catch(err => {
                console.log('Error getting documents', err)
            })

        //console.log('Acc Info ==> ', result)

        return result
    }

    async isTruth(token) {
        let result = false
        console.log('Validate token...')
        let isExists = await this.isExists(token)
        if (isExists !== false) {
            let today = this.today()
            let date_created = isExists.date_created
            let datediff = this.datediff(this.dateFromString(date_created), this.dateFromString(today))
            console.log('Datediff => ', datediff)
            if (datediff <= 31) {
                let accInfo = await this.getAccInfo(isExists.accID)
                if (accInfo.level === 'normal')
                    result = {
                        token: isExists.token,
                        accID: isExists.accID,
                        level: accInfo.level,
                        email: accInfo.email,
                        date_created: isExists.date_created,
                        place_id: accInfo.place_id
                    }
                else
                    result = {
                        token: isExists.token,
                        accID: isExists.accID,
                        level: accInfo.level,
                        email: accInfo.email,
                        date_created: isExists.date_created,
                    }
            }
        }

        console.log('Token truth =>', result)

        return result
    }

    /* DD/MM/YY */
    dateFromString(dateString) {
        var dateToArray = dateString.split('-');
        return new Date(dateToArray[2], dateToArray[1], dateToArray[0] - 1);
    }

    datediff(first, second) {
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }
}