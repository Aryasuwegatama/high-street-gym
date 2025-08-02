import * as ActivityModel from "../models/activities.js";

// 1. Get trainer activities
export async function getTrainerActivities(req, res) {
  const { id } = req.params;
  try {
    const activities = await ActivityModel.getTrainerActivities(id);
    if (!activities.length) {
      return res
        .status(404)
        .json({ status: 404, message: "No activities found for this trainer" });
    }
    res.status(200).json({ status: 200, activities });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching trainer activities",
      error,
    });
  }
}

// Middleware to validate activity data
export function validateActivityData(req, res, next) {
  const {
    activity_name,
    activity_description,
    activity_duration,
    activity_capacity,
  } = req.body;
  if (
    !activity_name ||
    !activity_description ||
    !activity_duration ||
    !activity_capacity
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required activity data" });
  }
  next();
}

// 2. Delete an activity associated with a user
export async function deleteTrainerActivity(req, res) {
  const { userId, activityId } = req.params;
  try {
    await ActivityModel.deleteTrainerActivity(userId, activityId);
    res
      .status(200)
      .json({ status: 200, message: "Activity deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error deleting activity", error });
  }
}

// 3. Create a new activity
export async function createActivity(req, res) {
  const {
    activity_name,
    activity_description,
    activity_duration,
    activity_capacity,
  } = req.body;
  if (
    !activity_name ||
    !activity_description ||
    !activity_duration ||
    !activity_capacity
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required activity data" });
  }
  const activity = {
    activity_name,
    activity_description,
    activity_duration,
    activity_capacity,
  };
  try {
    const activityId = await ActivityModel.createActivity(activity);
    res.status(201).json({
      status: 201,
      message: "Activity created successfully",
      activityId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error creating activity", error });
  }
}

// 4. Get all activities
export async function getAllActivities(req, res) {
  try {
    const activities = await ActivityModel.getAllActivities();
    res.status(200).json({ status: 200, activities });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error fetching activities", error });
  }
}

// 5. Get an activity by ID
export async function getActivityById(req, res) {
  const { id } = req.params;
  try {
    const activity = await ActivityModel.getActivityById(id);
    if (!activity) {
      return res
        .status(404)
        .json({ status: 404, message: "Activity not found" });
    }
    res.status(200).json({ status: 200, activity });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error fetching activity", error });
  }
}

// 6. Update an activity by ID
export async function updateActivity(req, res) {
  const { id } = req.params;
  const {
    activity_name,
    activity_description,
    activity_duration,
    activity_capacity,
  } = req.body;
  if (
    !activity_name ||
    !activity_description ||
    !activity_duration ||
    !activity_capacity
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required activity data" });
  }
  const activity = {
    activity_name,
    activity_description,
    activity_duration,
    activity_capacity,
  };
  try {
    await ActivityModel.updateActivity(id, activity);
    res
      .status(200)
      .json({ status: 200, message: "Activity updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error updating activity", error });
  }
}

// 7. Delete an activity by ID
export async function deleteActivityById(req, res) {
  const { id } = req.params;
  try {
    await ActivityModel.deleteActivityById(id);
    res
      .status(200)
      .json({ status: 200, message: "Activity deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error deleting activity", error });
  }
}

// 8. Get all trainer activities
export async function getAllTrainerActivities(req, res) {
  try {
    const activities = await ActivityModel.getAllTrainerActivities();
    res.status(200).json({ status: 200, activities });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching trainer activities",
      error,
    });
  }
}

// 9. Assign a trainer to an activity
export async function assignTrainerToActivity(req, res) {
  const { trainerId, activityId, clubId } = req.body;
  try {
    await ActivityModel.assignTrainerToActivity(trainerId, activityId, clubId);
    res.status(200).json({
      status: 200,
      message: "Trainer assigned to activity successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error assigning trainer to activity",
      error,
    });
  }
}
