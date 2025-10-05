import express from 'express'

import dotenv from 'dotenv'

import AuthRouter from './routes/auth.route.js'
import MessageRouter from './routes/message.route.js'
import {server,app} from './config/socket.js'
import path from "path"


dotenv.config();

import cors from 'cors'
import cookieParser from 'cookie-parser';
import {connectDB} from './config/db.connection.js'


const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

app.use(express.json({limit:'10mb'})); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth',AuthRouter);
app.use('/api/messages',MessageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./Client/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(process.cwd(),'Client','dist','index.html'));
  });
}
server.listen(PORT,()=>{
    console.log(`Server Started on Port ${PORT}`);
    connectDB()
})