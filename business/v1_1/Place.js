module.exports = class Places {
    constructor() {
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
    }

    async getplaceName(place_id) {
        let result = false
        await this.db.collection('places').get()
            .then(async snapshot => {
                let ids = await snapshot.docs.map(doc => doc.id)
                let datas = await snapshot.docs.map(doc => doc.data())
                for (let i = 0; i < datas.length; i++) {
                    let id = ids[i]
                    let data = datas[i]
                    //console.log('place list =>', data)
                    if (place_id === id) {
                        //console.log('place name =>', data.place_name)
                        result = data.place_name
                        break
                    }
                }
            })
            .catch(err => {
                console.log('Error adding documents', err)
            })

        console.log('place name => ', result)

        return result
    }
}