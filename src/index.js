import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";
import connectDB from "./db/index.js";
import {app} from './app.js'
import 'dotenv/config'

connectDB

/*
import express from "express"
const app=express()
 
;  (async()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    app.on("error",()=>{
       conslotchange.log("error",error) 
       throw error
    })
    app.listen(process.env.PORT,()=>{
        console.log(`app is istening on port ${process.env.PORT}`)
    })
    }catch(error){
       console.error("Error",error) 
       throw err
    }
})()
    */