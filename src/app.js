import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express()
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
    
}))


app.use(express.json( { limit: '16kb' })) // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // to support URL-
app.use(express.static("public")) // for serving static files like images,
app.use(cookieParser()) // to support cookies in requests and responses


// Importing routes here
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)


 
export {app}