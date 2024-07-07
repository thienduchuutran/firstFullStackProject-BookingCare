import express from "express"
import bodyParser from "body-parser"
import viewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web"
require('dotenv').config()
import connectDB from "./config/connectDB"
import cors from 'cors'


let app = express()
app.use(cors({origin: true}))

//config app

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

viewEngine(app)
initWebRoutes(app)

connectDB();

let port = process.env.PORT || 7070

app.listen(port, () => {
    console.log("backend nodejs is running on port: "+port)
})

