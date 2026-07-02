import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
dotenv.config()

const app = express()
const port = 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.get('/',(req,res)=>{
  res.send("API is working . . .")
})

connectDB().then(app.listen(port, ()=>{
  console.log("Sever is running on port : ", port)
}))