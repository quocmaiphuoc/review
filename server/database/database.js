const mongoose = require('mongoose')
//Kết nối CSDL MongoDB
const connectDatabase = async () => {
    try {
        let uri = 'mongodb://127.0.0.1:27017/review'
        let options = {
            connectTimeoutMS: 10000,// 10 giây
        }
        await mongoose.connect(uri, options)
        console.log('Connect Mongo Database successfully')
    } catch(error) {
        console.log(`Cannot connect Mongo. Error: ${error}`)
    }
}
connectDatabase()
module.exports = {
    mongoose
}