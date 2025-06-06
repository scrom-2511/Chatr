import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const databaseURL:string = process.env.DATABASE_URL!; 

export const connectToDatabase = () => {
    mongoose.connect(databaseURL).then(() => {
        console.log("connected")
    }).catch((err:Error) => {
       console.log(err) 
    });
}