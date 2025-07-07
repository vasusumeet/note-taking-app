import express from "express";
import mongoose from "mongoose";
import { PORT } from "./config.js";
import { mongoDBURL } from "./config.js";
import loginRoute from "./routes/loginRoute.js";
import dataRoute from "./routes/dataRoute.js";
import cors from 'cors';
import passport from "passport";
import './Config/passport.js'

const app=express();

app.use(cors());
app.get('/', (request, response)=>{
    console.log(request)
    return response.status(234).send("Welcome to note taking app");
})

app.use(express.json());


app.use('/api/auth', loginRoute);
app.use('/api/notes', dataRoute);
app.use(passport.initialize());
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

