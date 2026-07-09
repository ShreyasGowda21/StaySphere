const express=require('express')
const app=express()
const router=express.Router()

const {
    createRoom,
    getRooms,
    getRoomsByHotel,
    getRoomById,
    updateRoom,
    deleteRoom
} = require("../controllers/roomController");

router.get("/", getRooms);

router.get("/hotel/:hotelId", getRoomsByHotel);

router.get("/:id", getRoomById);

router.post("/", createRoom);

router.put("/:id", updateRoom);

router.delete("/:id", deleteRoom);

module.exports = router;