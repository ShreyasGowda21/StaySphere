const express=require('express')

const hotelRoutes=require("./routes/hotelRoutes")
const roomRoutes=require("./routes/roomRoutes")

const app=express()

app.use(express.json())

app.use("/api/hotels",hotelRoutes)
app.use("/api/rooms",roomRoutes)


app.get('/',(req,res)=>{
    res.send("hotel mgt Api is running")
})


module.exports = app;