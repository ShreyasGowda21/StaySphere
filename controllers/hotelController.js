const Hotel=require('../models/Hotel.js')

const createHotel= async (req,res)=>{
    try{
        const hotel= await Hotel.create(req.body);
        res.status(201).json({
            success:true,
            message:"Hotel created successfully",
            data:hotel
        })
    }
        catch (error){
            res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }

const getHotels=async(req,res)=>{

   try{

    const hotels=await Hotel.find()
    res.status(200).json({
        success:true,
        count:hotels.length,
        data:hotels
    })
   }
   catch(error){
    res.status(500).json({
        success:false,
        message:error.message
    })
   }
}

const getHotelById= async(req,res)=>{

try{
    const hotel=await Hotel.findById(req.params.id)
    if(!hotel){
        return res.status(404).json({
            success:false,
            message:"hotel not found"
        })
    } 
    res.status(200).json({
            success: true,
            data: hotel
        });
}
catch(error){
    res.status(500).json({
         success: false,
            message: error.message
    })
}
}

const updateHotel=async(req,res)=>{
    try{
        const{name,city,address,description,rating}=req.body;
        const hotel=await Hotel.findByIdAndUpdate(req.params.id,
            {
                name,
                city,
                address,
                description,
                rating
            },
            {
                new:true,
                runValidators:true
            }
        )
         if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            data: hotel
        });
    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

const deleteHotel=async(req,res)=>{
    try{
        const hotel=await Hotel.findById(req.params.id)
        if(!hotel){
            return res.status(404).json({
                success:false,
                message:"hotel not found"
            })
        }
        await hotel.deleteOne()
         res.status(200).json({
            success: true,
            message: "Hotel deleted successfully"
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


module.exports={
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel
}