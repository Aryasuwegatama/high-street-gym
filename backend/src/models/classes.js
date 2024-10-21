import { db } from "../database.js";

// GET all class data
export async function getAllClasses() {
    const classData = await db.query(`
      SELECT
    classes.class_id,
    classes.class_date,
    classes.class_time,
    activities.activity_name,
    concat(users.user_firstname, " ", users.user_lastname) AS trainer_name,
    activities.activity_capacity,
    clubs.club_name
    FROM classes
    JOIN activities ON classes.class_activity_id = activities.activity_id
    JOIN activity_trainers ON activities.activity_id = activity_trainers.activity_id
    JOIN users ON activity_trainers.trainer_id = users.user_id
    JOIN clubs on classes.class_club_id = clubs.club_id;
        `)
    
        return classData[0];
}

// get classes by club 
export async function getClassesByClub(clubName) {
    const classData = await db.query(`
        SELECT
    classes.class_id,
    classes.class_date,
    DATE_FORMAT(class_time, '%H:%i') AS class_time,
    activities.activity_name,
    concat(users.user_firstname, " ", users.user_lastname) AS trainer_name,
   activities.activity_capacity,
    activities.activity_duration,
    clubs.club_name,
    activities.activity_description
    FROM classes
    JOIN activities ON classes.class_activity_id = activities.activity_id
    JOIN activity_trainers ON activities.activity_id = activity_trainers.activity_id
    JOIN users ON activity_trainers.trainer_id = users.user_id
    JOIN clubs on classes.class_club_id = clubs.club_id
    WHERE clubs.club_name = ?
    AND activity_trainers.club_id = classes.class_club_id;`, 
    [clubName])
    return classData[0]
}

/// Get the trainer's user_id by their full name
export async function getTrainerIdByName(trainerName) {
    try {
      const [trainer] = await db.query(
        `SELECT user_id FROM users WHERE CONCAT(user_firstname, ' ', user_lastname) = ?`,
        [trainerName]
      );
  
      if (!trainer || trainer.length === 0) {
        return null; 
      }
  
      return trainer[0].user_id;
    } catch (error) {
      console.error('Error fetching trainer ID:', error);
      throw new Error('Database error');
    }
  }

//   count trainer booking
export async function getBookingCountByTrainer(classId, trainerId) {
    const [result] = await db.query(
      `SELECT COUNT(*) AS booking_count 
       FROM bookings 
       WHERE booking_class_id = ? AND booking_trainer_id = ?`,
      [classId, trainerId]
    );
    // console.log(result)
    
    return result[0].booking_count;
  }
  
  
// Insert the booking into the bookings table
export async function bookClass(classId, trainerId, userId) {
    try {
        // check if the user has already booked this class
        const [existingBooking] = await db.query(
         `SELECT * FROM bookings WHERE booking_user_id = ? AND booking_class_id = ? AND booking_trainer_id = ?`,
      [userId, classId, trainerId]
        );
    
        // If a booking exists, return an error message
        if (existingBooking.length > 0) {
          return { error: "You have already booked this class." };
        }

         // Get the current booking count and the activity capacity
        const [classInfo] = await db.query(
            `SELECT activity_capacity 
            FROM activities
            JOIN classes ON activities.activity_id = classes.class_activity_id
            WHERE classes.class_id = ?`, 
            [classId]
        );
    
        // Get the current number of bookings for the selected trainer
        const [trainerBookings] = await db.query(
            `SELECT COUNT(*) AS booking_count 
            FROM bookings 
            WHERE booking_class_id = ? AND booking_trainer_id = ?`,
            [classId, trainerId]
        );
    
        // Check if the booking count has reached or exceeded the activity capacity
        if (trainerBookings.booking_count >= classInfo.activity_capacity) {
            return { error: "This class with the selected trainer is fully booked." };
        }
        
        // Proceed to insert the booking if no existing booking is found
        await db.query(
          `INSERT INTO bookings (booking_user_id, booking_class_id, booking_trainer_id, booking_created_date, booking_status)
           VALUES (?, ?, ?, NOW(), 'confirmed')`,
          [userId, classId, trainerId]
        );
    
        return { success: true, message: "Class booked successfully!" };
      } catch (err) {
        throw new Error("Failed to book class: " + err.message);
      }
  }



