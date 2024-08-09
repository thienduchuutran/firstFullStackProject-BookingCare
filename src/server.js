import express from "express"
import bodyParser from "body-parser"
import viewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web"
import connectDB from "./config/connectDB"
import cors from 'cors'
require('dotenv').config()


let app = express()
app.use(cors({
    credentials: true,
    origin: true
}))

// app.use(function(req, res, next){
    
//     //Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT)

//     //Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

//     //Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    
// })

//config app

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))  

viewEngine(app)
initWebRoutes(app)

connectDB();

let port = process.env.PORT || 7070

app.listen(port, () => {
    console.log("backend nodejs is running on port: "+port)
})

