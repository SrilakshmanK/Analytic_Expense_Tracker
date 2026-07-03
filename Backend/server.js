import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
dotenv.config()

import userRoutes from './routes/userRoutes.js'

const app = express()
const port = 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.get('/',(req,res)=>{
  res.send("API is working . . .")
})

app.use('/api/auth/',userRoutes)

connectDB().then(app.listen(port, ()=>{
  console.log("Sever is running on port : ", port)
}))