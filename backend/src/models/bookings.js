import { db } from "../database.js";

// Get all bookings
export async function getAllBookings() {
  try {
    const [bookings] = await db.query(`
      SELECT 
        bookings.booking_id,
        bookings.booking_created_date,
        classes.class_date,
        classes.class_time,
        activities.activity_name,
        concat(trainers.user_firstname, " ", trainers.user_lastname) AS trainer_name,
        concat(users.user_firstname, " ", users.user_lastname) AS user_name,
        clubs.club_name,
        activities.activity_duration,
        activities.activity_description,
        bookings.booking_status
      FROM bookings
      JOIN classes ON bookings.booking_class_id = classes.class_id
      JOIN activities ON classes.class_activity_id = activities.activity_id
      JOIN users AS trainers ON bookings.booking_trainer_id = trainers.user_id
      JOIN users ON bookings.booking_user_id = users.user_id
      JOIN clubs ON classes.class_club_id = clubs.club_id
      ORDER BY classes.class_date, classes.class_time
    `);
    return bookings;
  } catch (err) {
    throw new Error("Failed to fetch all bookings: " + err.message);
  }
}

// Get the user's booked classes
export async function getUserBookings(userId) {
  try {
    const [userBookings] = await db.query(
      `
      SELECT 
        bookings.booking_id,
        bookings.booking_created_date,
        classes.class_date,
        classes.class_time,
        activities.activity_name,
        concat(trainers.user_firstname, " ", trainers.user_lastname) AS trainer_name,
        concat(users.user_firstname, " ", users.user_lastname) AS user_name,
        clubs.club_name,
        activities.activity_duration,
        activities.activity_description,
        bookings.booking_status
      FROM bookings
      JOIN classes ON bookings.booking_class_id = classes.class_id
      JOIN activities ON classes.class_activity_id = activities.activity_id
      JOIN users AS trainers ON bookings.booking_trainer_id = trainers.user_id
      JOIN users ON bookings.booking_user_id = users.user_id
      JOIN clubs ON classes.class_club_id = clubs.club_id
      WHERE bookings.booking_user_id = ?
      ORDER BY classes.class_date, classes.class_time
    `,
      [userId]
    );
    return userBookings;
  } catch (err) {
    throw new Error("Failed to fetch user bookings: " + err.message);
  }
}

// Insert the booking into the bookings table
export async function bookClass(classId, trainerId, userId) {
  try {
    // First check if user has any existing booking for this class (confirmed or cancelled)
    const [existingBooking] = await db.query(
      `SELECT * FROM bookings 
        WHERE booking_user_id = ? 
        AND booking_class_id = ? 
        AND booking_trainer_id = ?`,
      [userId, classId, trainerId]
    );

    // If there's a confirmed booking, return error
    if (
      existingBooking.length > 0 &&
      existingBooking[0].booking_status === "confirmed"
    ) {
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

    // Get the current number of confirmed bookings for the selected trainer
    const [trainerBookings] = await db.query(
      `SELECT COUNT(*) AS booking_count 
          FROM bookings 
          WHERE booking_class_id = ? 
          AND booking_trainer_id = ? 
          AND booking_status = 'confirmed'`,
      [classId, trainerId]
    );

    // Check if the booking count has reached or exceeded the activity capacity
    if (trainerBookings.booking_count >= classInfo.activity_capacity) {
      return { error: "This class with the selected trainer is fully booked." };
    }

    if (existingBooking.length > 0) {
      // Update existing booking status to confirmed
      await db.query(
        `UPDATE bookings 
               SET booking_status = 'confirmed', 
                   booking_created_date = NOW() 
               WHERE booking_user_id = ? 
               AND booking_class_id = ? 
               AND booking_trainer_id = ?`,
        [userId, classId, trainerId]
      );
    } else {
      // Create new booking if no existing booking found
      await db.query(
        `INSERT INTO bookings (booking_user_id, booking_class_id, booking_trainer_id, booking_created_date, booking_status)
               VALUES (?, ?, ?, NOW(), 'confirmed')`,
        [userId, classId, trainerId]
      );
    }

    return { success: true, message: "Class booked successfully!" };
  } catch (err) {
    throw new Error("Failed to book class: " + err.message);
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

// Delete all bookings of a user
export async function deleteAllUserBookings(userId) {
  try {
    const [result] = await db.query(
      `DELETE FROM bookings WHERE booking_user_id = ?`,
      [userId]
    );

    if (result.affectedRows === 0) {
      return { error: "No bookings found for this user." };
    }

    return { success: true, message: "All bookings deleted successfully." };
  } catch (err) {
    throw new Error("Failed to delete all bookings: " + err.message);
  }
}
