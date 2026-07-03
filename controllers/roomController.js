const Hotel=require("../models/Hotel")
const Room=require("../models/Room")


const createRoom=async(req,res)=>{
    try{
         const {
            hotel,
            roomNumber,
            roomType,
            price,
            capacity
        } = req.body;

        const hotelExists=await Hotel.findById(hotel)
        if(!hotelExists){
            return res.status(404).json({
                success:false,
                message:"hotel not found"
            })
        }
           const existingRoom = await Room.findOne({
            hotel,
            roomNumber
        });

        if (existingRoom) {
            return res.status(400).json({
                success: false,
                message: "Room number already exists in this hotel"
            });
        }
        const room=await Room.create({
            hotel,
            roomNumber,
            roomType,
            price,
            capacity
        })
        res.status(201).json({
            success:true,
            data:room
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getRooms=async (req,res)=>{
    try{
        const rooms=await Room.find().populate("hotel");
        res.status(200).json({
            success:true,
            count:rooms.length,
            data:rooms
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getRoomById=async(req,res)=>{
   try{
    const room=await Room.findById(req.params.id).populate("hotel")
    if(!room){
        return res.status(400).json({
            success:false,
            message:"room not found"
        })
    }
      res.status(200).json({
            success: true,
            data: room
        });
   }
   catch(error){
    res.status(500).json({
        success:false,
        message:error.message
    })
   }
}

const updateRoom=async(req,res)=>{
    try{
        const {roomType,
            price,
            capacity,
            isAvailable}=req.body
        
        const room=await Room.findByIdAndUpdate(req.params.id,{
                roomType,
                price,
                capacity,
                isAvailable
        },
    {
        new:true,
        runValidators:true
    })
    if(!room){
        return res.status(404).json({
            success:false,
            message:"room not found"
        })
    }
    res.status(200).json({
        success:true,
        message:"room updated successfully",
        data:room
    })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const deleteRoom=async(req,res)=>{
    try{
        const room=await Room.findById(req.params.id)
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }
        await room.deleteOne()
         res.status(200).json({
            success: true,
            message: "Room deleted successfully"
        });
    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
module.exports={
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom
}