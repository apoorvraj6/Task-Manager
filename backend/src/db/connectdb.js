import mongoose from "mongoose"



const connectdb = async(req,res)=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database Connected");
    } catch (error) {
        console.log("Error while connecting to the database")
        process.exit(1);
    }
}

export default connectdb