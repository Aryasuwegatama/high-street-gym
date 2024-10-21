import * as classModel from "../models/classes.js"

export async function getAllClasses(req, res) {
    try {
        const classes = await classModel.getAllClasses();
        if (classes.length === 0) throw new Error("No Classes Found");
        return res.status(200).json({ 
            status: 200,
            message: 'Success get all class data', 
            data: classes 
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: 400, 
            message: 'Failed get all class data', 
            error: err.message
        })
    }
}


// get classes by club controller
export async function getClassesByClub(req, res) {
    try {
        const clubName = req.params.clubName;
    
        const classes = await classModel.getClassesByClub(clubName);

          // Group classes by unique identifiers and populate trainer array
        const groupedClasses = classes.reduce((acc, classData) => {
            const key = `${classData.class_id}-${classData.class_date}-${classData.class_time}-${classData.activity_name}-${classData.club_name}`;
            if (!acc[key]) {
            acc[key] = {
                ...classData,
                trainers: []
            };
            }
            acc[key].trainers.push(classData.trainer_name);
            return acc;
        }, {});
        
        // Convert grouped classes back to an array
        const groupedClassesArray = Object.values(groupedClasses)
    
        // Format the class_date field
        groupedClassesArray.forEach(classData => {
            const date = new Date(classData.class_date);
            classData.class_date = date.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
            });
        });
  
        if (groupedClassesArray.length === 0) {
            return res.status(404).json({
            status: 404,
            message: `No classes found for ${clubName}`,
            });
        }
    
        return res.status(200).json({
          status: 200,
          message: `Success getting classes for ${clubName}`,
          data: groupedClassesArray,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({
          status: 500,
          message: `Failed to get classes for ${clubName}`,
          error: err.message,
        });
      }
}

// Controller to get the number of bookings for a specific trainer in a class
export async function getTrainerAvailability(req, res) {
    try {
      const { classId, trainerName } = req.query;
  
      const trainerId = await classModel.getTrainerIdByName(trainerName);
      
      if (!trainerId) {
        return res.status(400).json({ message: "Trainer not found" });
      }
  
      const bookingCount = await classModel.getBookingCountByTrainer(classId, trainerId);
    //   console.log(bookingCount)
  
      return res.status(200).json({ booking_count: bookingCount });
    } catch (err) {
      console.error('Error fetching trainer availability:', err);
      return res.status(500).json({ message: 'Failed to fetch trainer availability' });
    }
  }
  

// Controller to handle class bookings
export async function bookClass(req, res) {
    try {
      const { classId, trainerName, userId } = req.body;

      console.log(userId)
  
      const trainerId = await classModel.getTrainerIdByName(trainerName);
    //   console.log(trainerId)
  
      if (!trainerId) {
        return res.status(400).json({
          status: 400,
          message: 'Trainer not found',
        });
      }
  
      const bookingResult = await classModel.bookClass(classId, trainerId, userId);
      console.log(bookingResult)

      
        // Handle double booking or capacity full case
        if (bookingResult.error === "You have already booked this class.") {
            return res.status(409).json({
            status: 409,
            message: "You have already booked this class."
            });
        } else if (bookingResult.error === "This class with the selected trainer is fully booked.") {
            return res.status(409).json({
            status: 409,
            message: "This class with the selected trainer is fully booked."
            });
        }

  
      return res.status(200).json({
        status: 200,
        message: bookingResult.message, 
      });
    } catch (err) {
      console.error('Error booking class:', err);
      return res.status(500).json({
        status: 500,
        message: 'Failed to book class',
        error: err.message,
      });
    }
  }

  
  