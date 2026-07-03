const express=require('express')
const app=express()
const router=express.Router()

const {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel
} = require("../controllers/hotelController");

router.post("/",createHotel)
router.get("/",getHotels)
router.get("/:id",getHotelById)
router.put("/:id",updateHotel)
router.delete("/:id",deleteHotel)

module.exports = router;