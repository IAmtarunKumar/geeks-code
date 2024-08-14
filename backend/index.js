const express = require("express")
const connection = require("./config/db")
const dotenv = require("dotenv").config()
const cors = require("cors")
const userRouter = require("./route/userRoute")




const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.port || 5000

app.get("/" , (req,res)=>{
    return res.status(200).send("Welcome")
})



app.use("/api" , userRouter)

app.listen(port , async()=>{
    try {
        await connection
        console.log("MongoDB is connected")
    } catch (err) {
        console.log(err)
    }
    console.log(`server is running on ${port}`)
})