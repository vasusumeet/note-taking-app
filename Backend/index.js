import express from "express";
import mongoose from "mongoose";
import { PORT } from "./config.js";
import { mongoDBURL } from "./config.js";
import loginRoute from "./routes/loginRoute.js";
import cors from 'cors';

const app=express();

app.use(cors());
app.get('/', (request, response)=>{
    console.log(request)
    return response.status(234).send("Welcome to note taking app");
})
app.use(express.json());

app.use('/api/auth', loginRoute);

mongoose
 .connect(mongoDBURL)
 .then(()=>{
    console.log("App is connected to database");
    app.listen(PORT, ()=>{
    console.log("App is listening to port: " + PORT);
    })
    
    })
    .catch((error)=>{
        console.log(error);

 });

