const accounts = [
    {
        "username": "root",
        "password": "123456789",
        "level": "root"
    },
    {
        "username": "admin",
        "password": "123456789",
        "level": "admin"
    }
]

const citys = [
    {
        "city_name": "Thai Nguyen"
    },
    {
        "city_name": "Ha Noi"
    },
    {
        "city_name": "Yen Bai"
    },
    {
        "city_name": "Ho Chi Minh"
    },
    {
        "city_name": "Da Nang"
    },
    {
        "city_name": "Thanh Hoa"
    },
    {
        "city_name": "Lao Cai"
    },
]

const city_datas = [
    {
        "city_id": "VSD0W2Um1o6ukjmgLe1Z",
        "times": [
            {
                "id_times": "dnfkldnfjkfngjf",
                "time": "2019-08-18 02:31",
                "datas": {
                    "temp": "30.10",
                    "humidity": "60.0",
                    "dust": "0.0",
                    "co2": "361.00",
                    "noise": "0.0",
                    "dust": "0.0"
                }

            },
            {
                "id_times": "dklskjfkhgjkfhj",
                "time": "2019-08-18 02:32",
                "datas":
                {
                    "temp": "30.3",
                    "humidity": "60.0",
                    "dust": "0.0",
                    "co2": "361.00",
                    "noise": "0.0",
                    "dust": "0.0"
                }
            },
            {
                "id_times": "dfldjrglrjgiurhgk",
                "time": "2019-08-18 02:33",
                "datas":
                {
                    "temp": "30.4",
                    "humidity": "60.0",
                    "dust": "0.0",
                    "co2": "361.00",
                    "noise": "0.0",
                    "dust": "0.0"
                }
            },
            {
                "id_times": "34y50398fmkrjkdfdng",
                "time": "2019-08-18 02:34",
                "datas":
                {
                    "temp": "30.5",
                    "humidity": "60.0",
                    "dust": "0.0",
                    "co2": "361.00",
                    "noise": "0.0",
                    "dust": "0.0"
                }
            },
            {
                "id_times": "mfiordt8934ijggrrg",
                "time": "2019-08-18 02:35",
                "datas":
                {
                    "temp": "30.6",
                    "humidity": "60.0",
                    "dust": "0.0",
                    "co2": "361.00",
                    "noise": "0.0",
                    "dust": "0.0"
                }
            },
            {
                "id_times": "gmrklgoiwu485094uf",
                "time": "2019-08-18 02:36",
                "datas":
                {
                    "temp": "30.7",
                    "humidity": "60.0",
                    "dust": "0.0",
                    "co2": "361.00",
                    "noise": "0.0",
                    "dust": "0.0"
                }
            },
            {
                "id_times": "dnfkldnfjkfngjf",
                "time": "2019-08-18 02:37",
                "datas":
                {
                    "temp": "30.8",
                    "humidity": "60.0",
                    "dust": "0.0",
                    "co2": "361.00",
                    "noise": "0.0",
                    "dust": "0.0"
                }
            },
            {
                "id_times": "lkgerug943850",
                "time": "2019-08-18 02:38",
                "datas":
                {
                    "temp": "30.85",
                    "humidity": "60.0",
                    "dust": "0.0",
                    "co2": "361.00",
                    "noise": "0.0",
                    "dust": "0.0"
                }
            },
            {
                "id_times": "dnfkldnfjkfngjf",
                "time": "2019-08-18 02:39",
                "datas":
                {
                    "temp": "30.86",
                    "humidity": "60.0",
                    "dust": "0.0",
                    "co2": "361.00",
                    "noise": "0.0",
                    "dust": "0.0"
                }
            },
        ]
    },
    {
        "city_id": "TKkF0rVI6DxeiJe1zASU",
        "times": [
            {
                "id_times": "ehrfjknvuifdhfiho",
                "time": "2019-08-18 03:40",
                "datas":
                {
                    "temp": "31.10",
                    "humidity": "62.3",
                    "dust": "0.0",
                    "co2": "364.40",
                    "noise": "0.0",
                    "dust": "0.0"
                }
            }
        ]
    },
    {
        "city_id": "KUSC3rMRwhLnPCWcHBPU",
        "times": [
            {
                "id_times": "cmdf48549nvfkdjbfjk",
                "time": "2019-08-18 04:31",
                "datas":
                {
                    "temp": "30.10",
                    "humidity": "60.0",
                    "noise": "0.0",
                    "co2": "361.00"
                }
            }
        ]
    }
]

const tokens = [
    {
        token: "sdhfidfuihfkdjhfuihr",
        account_id: "fdjfdfj",
        dateCreated: "18-08-2019"
    },
    {
        token: "mfkljgkljgkjf",
        accID: "dsdfdfd",
        dateCreated: "16-08-2019"
    },
    {
        token: "fl;mfklnfjkrngj",
        accID: "vfrrtrtr",
        dateCreated: "16-01-2019"
    }
]

module.exports = class ImportDB {
    constructor() {
        this.admin = require('../../FirebaseAdmin')
        this.db = new this.admin().firestoreDB()
    }

    async importAccounts() {
        accounts.forEach(async element => {
            await this.db.collection('accounts').add(element)
        })
    }

    async importCitys() {
        citys.forEach(async element => {
            await this.db.collection('cities').add(element)
        })
    }

    async importCityDatas() {
        city_datas.forEach(async element => {
            await this.db.collection('cities_data').add(element)
        })
    }

    async importToken() {
        tokens.forEach(async element => {
            await this.db.collection('tokens').add(element)
        })
    }
}