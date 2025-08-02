import * as classModel from "../models/classes.js";
import { body, validationResult } from "express-validator";

export async function getAllClasses(req, res) {
  try {
    const classes = await classModel.getAllClasses();
    if (classes.length === 0) throw new Error("No Classes Found");
    return res.status(200).json({
      status: 200,
      message: "Success get all class data",
      data: classes,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      message: "Failed get all class data",
      error: err.message,
    });
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
          trainers: [],
        };
      }
      acc[key].trainers.push(classData.trainer_name);
      return acc;
    }, {});

    // Convert grouped classes back to an array
    const groupedClassesArray = Object.values(groupedClasses);

    // Format the class_date field
    groupedClassesArray.forEach((classData) => {
      const date = new Date(classData.class_date);
      classData.class_date = date.toLocaleDateString("en-AU", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
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

    const bookingCount = await classModel.getBookingCountByTrainer(
      classId,
      trainerId
    );
    //   console.log(bookingCount)

    return res.status(200).json({ booking_count: bookingCount });
  } catch (err) {
    console.error("Error fetching trainer availability:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch trainer availability" });
  }
}

// Controller to check if any user booked the class
export async function checkClassBookings(req, res) {
  try {
    const classId = req.params.id;
    const hasBookings = await classModel.checkClassBookings(classId);

    return res.status(200).json({
      status: 200,
      message: hasBookings ? "Class has bookings" : "No bookings for this class",
      data: { hasBookings },
    });
  } catch (err) {
    console.error("Error checking class bookings:", err);
    return res.status(500).json({
      status: 500,
      message: "Failed to check class bookings",
      error: err.message,
    });
  }
}

// Controller to delete bookings for a specific class
export async function deleteClassBookings(req, res) {
  try {
    const classId = req.params.id;
    await classModel.deleteClassBookings(classId);

    return res.status(200).json({
      status: 200,
      message: "Bookings for the class deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting class bookings:", err);
    return res.status(500).json({
      status: 500,
      message: "Failed to delete class bookings",
      error: err.message,
    });
  }
}

export const validateUpdateClass = [
  body("class_date").isISO8601().withMessage("Class date must be a valid date"),
  body("class_time").notEmpty().withMessage("Class time is required"),
  body("class_club_id").isInt().withMessage("Club ID must be an integer"),
  body("class_activity_id").isInt().withMessage("Activity ID must be an integer"),
];

export async function updateClass(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const classId = req.params.id;
    const classData = req.body;

    // Convert class_date to MySQL format (yyyy-mm-dd)
    const [day, month, year] = classData.class_date.split("/");
    classData.class_date = `${year}-${month}-${day}`;

    console.log(classData);
    console.log(classId);

    const result = await classModel.updateClass(classId, classData);
    console.log("result ", result);

    return res.status(200).json({
      status: 200,
      message: "Class updated successfully",
      result: result,
    });
  } catch (err) {
    console.error("Error updating class:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status: 409,
        message: "Duplicate entry for class schedule",
        error: err.message,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "Failed to update class",
      error: err.message,
    });
  }
}

export const validateCreateClass = [
  body("class_date").isISO8601().withMessage("Class date must be a valid date"),
  body("class_time").notEmpty().withMessage("Class time is required"),
  body("class_activity_id").isInt().withMessage("Activity ID must be an integer"),
  body("class_club_id").isInt().withMessage("Club ID must be an integer"),
];

export async function createClass(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const classData = req.body;

    // Convert class_date to MySQL format (yyyy-mm-dd)
    const [day, month, year] = classData.class_date.split("/");
    classData.class_date = `${year}-${month}-${day}`;

    const classId = await classModel.createClass(classData);

    return res.status(201).json({
      status: 201,
      message: "Class created successfully",
      data: { class_id: classId },
    });
  } catch (err) {
    console.error("Error creating class:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status: 409,
        message: "Duplicate entry for class schedule",
        error: err.message,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "Failed to create class",
      error: err.message,
    });
  }
}

export async function deleteClass(req, res) {
  try {
    const classId = req.params.id;
    await classModel.deleteClass(classId);

    return res.status(200).json({
      status: 200,
      message: "Class deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting class:", err);
    return res.status(500).json({
      status: 500,
      message: "Failed to delete class",
      error: err.message,
    });
  }
}