import express, { response } from "express";
import mongoose from "mongoose";
import { PORT } from "./config.js";
import { mongoDBURL } from "./config.js";

const app=express();

app.get('/', (request, response)=>{
    console.log(request)
    return response.status(234).send("Welcome to note taking app");
})

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

