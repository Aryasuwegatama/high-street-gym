import { db } from "../database.js"

  // Get the user's booked classes
  export async function getUserBookings(userId) {
    try {
      const [userBookings] = await db.query(`
        SELECT 
          bookings.booking_id,
          bookings.booking_created_date,
          classes.class_date,
          classes.class_time,
          activities.activity_name,
          concat(users.user_firstname, " ", users.user_lastname) AS trainer_name,
          clubs.club_name,
          activities.activity_duration,
          activities.activity_description,
          bookings.booking_status
        FROM bookings
        JOIN classes ON bookings.booking_class_id = classes.class_id
        JOIN activities ON classes.class_activity_id = activities.activity_id
        JOIN users ON bookings.booking_trainer_id = users.user_id
        JOIN clubs ON classes.class_club_id = clubs.club_id
        WHERE bookings.booking_user_id = ?
        ORDER BY classes.class_date, classes.class_time
      `, [userId]);
        // console.log(userId)
      return userBookings;
    } catch (err) {
      throw new Error("Failed to fetch user bookings: " + err.message);
    }
  }
  
  // Update the trainer for a booking
export async function updateBookingTrainer(bookingId, newTrainerId) {
    try {
      // Update the trainer for the booking
      await db.query(
        `UPDATE bookings
         SET booking_trainer_id = ?
         WHERE booking_id = ? AND booking_status = 'confirmed'`,
        [newTrainerId, bookingId]
      );
  
      return { success: true, message: "Trainer updated successfully!" };
    } catch (err) {
      throw new Error("Failed to update booking: " + err.message);
    }
  }
  

// Function to cancel a booking by updating the booking_status to 'canceled'
export async function cancelBooking(bookingId) {
    try {
      // Update the booking status to 'canceled'
      await db.query(
        `UPDATE bookings
         SET booking_status = 'cancelled'
         WHERE booking_id = ? AND booking_status = 'confirmed'`,
        [bookingId]
      );
  
      return { success: true, message: "Booking canceled successfully!" };
    } catch (err) {
      throw new Error("Failed to cancel booking: " + err.message);
    }
  }
  
// Delete a booking from the database
export async function deleteClassBooking(bookingId) {
    try {
      const [result] = await db.query(
        `DELETE FROM bookings WHERE booking_id = ?`,
        [bookingId]
      );
  
      if (result.affectedRows === 0) {
        return { error: "Booking not found." };
      }
  
      return { success: true, message: "Booking deleted successfully." };
    } catch (err) {
      throw new Error("Failed to delete booking: " + err.message);
    }
  }