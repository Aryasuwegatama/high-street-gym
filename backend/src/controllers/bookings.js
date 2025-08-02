import * as bookingsModel from "../models/bookings.js";
import * as classesModel from "../models/classes.js";

// Controller to get all bookings
export async function getAllBookings(req, res) {
  try {
    const bookings = await bookingsModel.getAllBookings();
    return res.status(200).json({
      status: 200,
      message: "Success fetching all bookings",
      data: bookings,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch all bookings",
      error: err.message,
    });
  }
}

// Controller to get user's booked classes
export async function getUserBookings(req, res) {
  try {
    const userId = req.params.userId;

    const bookings = await bookingsModel.getUserBookings(userId);

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

    const newTrainerId = await classesModel.getTrainerIdByName(newTrainerName);

    if (!newTrainerId) {
      return res.status(400).json({
        status: 400,
        message: "Trainer not found",
      });
    }

    const updateResult = await bookingsModel.updateBookingTrainer(
      bookingId,
      newTrainerId
    );

    return res.status(200).json({
      status: 200,
      message: updateResult.message,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to update booking",
      error: err.message,
    });
  }
}

// Controller to handle class bookings
export async function bookClass(req, res) {
  try {
    const { classId, trainerName, userId } = req.body;

    console.log(userId);

    const trainerId = await classesModel.getTrainerIdByName(trainerName);
    //   console.log(trainerId)

    if (!trainerId) {
      return res.status(400).json({
        status: 400,
        message: "Trainer not found",
      });
    }

    const bookingResult = await bookingsModel.bookClass(
      classId,
      trainerId,
      userId
    );
    console.log(bookingResult);

    // Handle double booking or capacity full case
    if (bookingResult.error === "You have already booked this class.") {
      return res.status(409).json({
        status: 409,
        message: "You have already booked this class.",
      });
    } else if (
      bookingResult.error ===
      "This class with the selected trainer is fully booked."
    ) {
      return res.status(409).json({
        status: 409,
        message: "This class with the selected trainer is fully booked.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: bookingResult.message,
    });
  } catch (err) {
    console.error("Error booking class:", err);
    return res.status(500).json({
      status: 500,
      message: "Failed to book class",
      error: err.message,
    });
  }
}

// Controller to cancel a booking
export async function cancelBooking(req, res) {
  try {
    const { bookingId } = req.body;

    const cancelResult = await bookingsModel.cancelBooking(bookingId);

    return res.status(200).json({
      status: 200,
      message: cancelResult.message,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Failed to cancel booking",
      error: err.message,
    });
  }
}

// Controller to delete a booking by ID
export async function deleteClassBooking(req, res) {
  try {
    const { bookingId } = req.params;

    const deleteResult = await bookingsModel.deleteClassBooking(bookingId);

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
    return res.status(500).json({
      status: 500,
      message: "Failed to delete booking.",
      error: err.message,
    });
  }
}

// Controller to delete all bookings of a user
export async function deleteAllUserBookings(req, res) {
  try {
    const { userId } = req.params;

    const deleteResult = await bookingsModel.deleteAllUserBookings(userId);

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
    return res.status(500).json({
      status: 500,
      message: "Failed to delete all bookings.",
      error: err.message,
    });
  }
}
