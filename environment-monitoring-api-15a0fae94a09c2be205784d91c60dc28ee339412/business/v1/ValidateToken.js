module.exports = class ValidateToken {
    constructor() {
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
        this.today = require('../v1/Today')
    }

    async isExists(token) {
        let result = false

        await this.db.collection('tokens').get()
            .then(async snapshot => {
                let ids = await snapshot.docs.map(doc => doc.id)
                let datas = await snapshot.docs.map(doc => doc.data())
                for (let i = 0; i < datas.length; i++) {
                    let id = ids[i]
                    let element = datas[i]

                    //console.log('token => ', element)
                    if (element.token === token)
                        result = {
                            token: element.token,
                            accID: element.accID,
                            date_created: element.date_created,
                        }
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

        await this.db.collection('accounts').get()
            .then(async snapshot => {
                //await console.log('id =>', snapshot.docs.map(doc => doc.id))
                //await console.log('snapshot =>', snapshot.docs.map(doc => doc.data()))
                let ids = await snapshot.docs.map(doc => doc.id)
                let datas = await snapshot.docs.map(doc => doc.data())
                for (let i = 0; i < datas.length; i++) {
                    let id = ids[i]
                    let element = datas[i]
                    if (id === accID) {
                        if(element.level === 'normal')
                            result = {
                                level: element.level,
                                place_id: element.place_id   
                            }
                        else
                            result = {
                                level: element.level,
                            }
                        break
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
            let date = Date()
            let today = this.today()
            let date_created = isExists.date_created
            let datediff = this.datediff(this.dateFromString(date_created), this.dateFromString(today))
            console.log('Datediff => ', datediff)
            if (datediff <= 31) {
                let accInfo = await this.getAccInfo(isExists.accID)
                if(accInfo.level === 'normal')
                    result = {
                        token: isExists.token,
                        accID: isExists.accID,
                        level: accInfo.level,
                        date_created: isExists.date_created,
                        place_id: accInfo.place_id
                    }
                else
                result = {
                    token: isExists.token,
                    accID: isExists.accID,
                    level: accInfo.level,
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