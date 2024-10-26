// models/XMLImportModel.js
import { db } from "../database.js";

// Insert a new activity and return its ID
export async function insertActivity(name, capacity, duration, description) {
  const query = `
    INSERT INTO activities 
    (activity_name, activity_capacity, activity_duration, activity_description) 
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [name, capacity, duration, description]);
  return result.insertId; // Return the ID of the inserted activity
}

// Associate a trainer with an activity in the activity_trainers table
export async function addTrainerToActivity(activityId, trainerId, clubId) {
  const query = `
    INSERT INTO activity_trainers (activity_id, trainer_id, club_id)
    VALUES (?, ?, ?)
  `;
  await db.query(query, [activityId, trainerId, clubId]);
}

// Update an existing activity
export async function updateActivity(id, name, capacity, duration, description) {
  const query = `
    UPDATE activities 
    SET activity_name = ?, activity_capacity = ?, activity_duration = ?, activity_description = ? 
    WHERE activity_id = ?
  `;
  await db.query(query, [name, capacity, duration, description, id]);
}
