import * as bookingsModel from "../models/bookings.js"
import * as classesModel from "../models/classes.js"

// Controller to get user's booked classes
export async function getUserBookings(req, res) {
    try {
      const userId = req.params.userId; 
  
      const bookings = await bookingsModel.getUserBookings(userId);
    //   console.log(bookings)
  
      if (bookings.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No bookings found for this user.",
        });
      }
  
      return res.status(200).json({
        status: 200,
        message: "Success fetching user's bookings",
        data: bookings,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Failed to fetch user's bookings",
        error: err.message,
      });
    }
  }
  
// Controller to update the booking trainer
export async function updateBooking(req, res) {
    try {
      const { bookingId, newTrainerName } = req.body;
  
      // Get the trainer's user_id by name
      const newTrainerId = await classesModel.getTrainerIdByName(newTrainerName);
  
      if (!newTrainerId) {
        return res.status(400).json({
          status: 400,
          message: 'Trainer not found',
        });
      }
  
      // Call the model function to update the trainer
      const updateResult = await bookingsModel.updateBookingTrainer(bookingId, newTrainerId);
  
      return res.status(200).json({
        status: 200,
        message: updateResult.message,
      });
    } catch (err) {
      console.error('Error updating booking:', err);
      return res.status(500).json({
        status: 500,
        message: 'Failed to update booking',
        error: err.message,
      });
    }
  }

  // Controller to cancel a booking
export async function cancelBooking(req, res) {
    try {
      const { bookingId } = req.body;
  
      // Call the model function to cancel the booking
      const cancelResult = await bookingsModel.cancelBooking(bookingId);
      console.log(cancelResult)
  
      return res.status(200).json({
        status: 200,
        message: cancelResult.message,
      });
    } catch (err) {
      console.error('Error canceling booking:', err);
      return res.status(500).json({
        status: 500,
        message: 'Failed to cancel booking',
        error: err.message,
      });
    }
  }
  
// Controller to delete a booking by ID
export async function deleteClassBooking(req, res) {
    try {
      const { bookingId } = req.params;
  
      const deleteResult = await bookingsModel.deleteClassBooking(bookingId);
      console.log(deleteResult)
  
      if (deleteResult.error) {
        return res.status(404).json({
          status: 404,
          message: deleteResult.error,
        });
      }
  
      return res.status(200).json({
        status: 200,
        message: deleteResult.message,
      });
    } catch (err) {
      console.error("Error deleting booking:", err);
      return res.status(500).json({
        status: 500,
        message: "Failed to delete booking.",
        error: err.message,
      });
    }
  }