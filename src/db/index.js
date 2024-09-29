
import mongoose from "mongoose";
import { DB_NAME } from '../constants.js'; 
import {app} from '../app.js'
import 'dotenv/config'
 const connectDB=async()=>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\nMongooseDB connected ${connectionInstance.connections[0].host}`)
    } catch (error) {
     console.log(error) 
    }
 }
 export default connectDB()
 .then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server is running at port :${process.env.PORT}`)
    })
 })
 .catch((err)=>{
    console.log("mongo db connection failed",err); 
 })