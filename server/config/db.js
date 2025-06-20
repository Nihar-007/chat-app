import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error in db connection", error)
    }
}

export default connectDB