const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

const createBooking= async(req,res)=>{


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


const getBookings=async(req,res)=>{
    try{
        const bookings=await Booking.find()
        .populate("hotel","name city")
        .populate("room","roomNumber roomType price")
        .sort({ createdAt: -1 });
   
      res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        }); 
     }
     catch(error){
          res.status(500).json({
            success: false,
            message: error.message
        });
     }
}

const getBookingById=async(req,res)=>{
    try{
        const booking=await Booking.findById(req.params.id)
        .populate("hotel", "name city")
        .populate("room", "roomNumber roomType price");
        if(!booking){
            return res.json({
                status:false,
                message:"booking not found"
            })
        }
         res.status(200).json({
            success: true,
            data: booking
        });
    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}


const cancelBooking = async (req, res) => {

    try {

        const bookingId = req.params.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Booking ID"
            });
        }

        // Find Booking
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Already Cancelled
        if (booking.bookingStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        // Find Room
        const room = await Room.findById(booking.room);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Associated room not found"
            });
        }

        // Update booking status
        booking.bookingStatus = "Cancelled";

        // Free the room
        room.isAvailable = true;

        // Save both
        await booking.save();
        await room.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
module.exports={createBooking,getBookings,getBookingById,cancelBooking}