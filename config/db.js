import colors from 'colors'
import mongoose from "mongoose"

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`MonogDB Connected ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`MongoDB Error ${error}`.bgRed.white)
    }
}

export default connectDB;