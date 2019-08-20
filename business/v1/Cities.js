module.exports = class Cities {
    constructor() {
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
                        break
                    }
                }
            })
            .catch(err => {
                console.log('Error adding documents', err)
            })

        console.log('City name => ', result)

        return result
    }
}