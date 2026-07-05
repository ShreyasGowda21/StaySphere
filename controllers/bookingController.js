const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

const createBooking= async(req,res)=>{

    //  console.log("Booking API Hit");

    const {
        customerName,
        customerEmail,
        hotel,
        room,
        checkIn,
        checkOut
    }=req.body

    try{
        console.log("1. Request received");
        const hotelExists = await Hotel.findById(hotel);
        console.log("2. Hotel found");
        if(!hotelExists){
           return res.status(404).json({
                success:false,
                message:"hotel not found"
            })
        }
    const roomExists = await Room.findOne({
    _id: room,
    hotel: hotel
});
// console.log("3. Room found");
if (!roomExists) {
    return res.status(404).json({
        success: false,
        message: "Room not found for this hotel"
    });
}
if (!roomExists.isAvailable) {
    return res.status(400).json({
        success: false,
        message: "Room is currently unavailable"
    });
}
const checkInDate=new Date(checkIn)
const checkOutDate=new Date(checkOut)
console.log("4. Dates validated");
if(checkOutDate<=checkInDate){
    return res.status(400).json({
        success:false,
        message: "Check-out date must be after check-in date"
    })
}
const difference=checkOutDate-checkInDate;
const numberOfNights = difference / (1000 * 60 * 60 * 24);
const totalPrice=roomExists.price * numberOfNights

const booking=await Booking.create({
    customerName,
    customerEmail,
    hotel,
    room,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice
})
console.log("5. Booking created");
roomExists.isAvailable = false;

await roomExists.save();
console.log("6. Room updated");

return res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking
});
    }
    catch(error){
     res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports={createBooking}