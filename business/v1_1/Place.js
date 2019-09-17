module.exports = class Places {
    constructor() {
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
    }

    async getplaceName(place_id) {
        let result = false
        await this.db.collection('places').doc(place_id).get()
            .then(async snapshot => {
                if (snapshot.exists)
                    result = snapshot.data().place_name
            })
            .catch(err => {
                console.log('Error adding documents', err)
            })

        console.log('place name => ', result)

        return result
    }
}