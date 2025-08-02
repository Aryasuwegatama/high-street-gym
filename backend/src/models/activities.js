import { db } from "../database.js";

// 1. Get trainer activities
export async function getTrainerActivities(trainerId) {
  const query = `
    SELECT 
      activities.activity_id, 
      activities.activity_name, 
      activity_trainers.club_id,
      clubs.club_name
    FROM 
      activities
    JOIN 
      activity_trainers ON activities.activity_id = activity_trainers.activity_id
    JOIN 
      clubs ON activity_trainers.club_id = clubs.club_id
    WHERE 
      activity_trainers.trainer_id = ?;
  `;
  const [rows] = await db.query(query, [trainerId]);
  return rows;
}

// 2. Delete an activity associated with a user
export async function deleteTrainerActivity(userId, activityId) {
  const query = `
    DELETE FROM activity_trainers 
    WHERE trainer_id = ? AND activity_id = ?;
  `;
  return db.query(query, [userId, activityId]);
}

// 3. Create a new activity
export async function createActivity(activity) {
  const query = `
    INSERT INTO activities (activity_name, activity_description, activity_duration, activity_capacity)
    VALUES (?, ?, ?, ?);
  `;
  const [result] = await db.query(query, [
    activity.activity_name,
    activity.activity_description,
    activity.activity_duration,
    activity.activity_capacity,
  ]);
  return result.insertId;
}

// 4. Get all activities
export async function getAllActivities() {
  const query = `
    SELECT * FROM activities;
  `;
  const [rows] = await db.query(query);
  return rows;
}

// 5. Get an activity by ID
export async function getActivityById(activityId) {
  const query = `
    SELECT * FROM activities WHERE activity_id = ?;
  `;
  const [rows] = await db.query(query, [activityId]);
  return rows[0];
}

// 6. Update an activity by ID
export async function updateActivity(activityId, activity) {
  const query = `
    UPDATE activities
    SET activity_name = ?, activity_description = ?, activity_duration = ?, activity_capacity = ?
    WHERE activity_id = ?;
  `;
  await db.query(query, [
    activity.activity_name,
    activity.activity_description,
    activity.activity_duration,
    activity.activity_capacity,
    activityId,
  ]);
}

// 7. Delete an activity by ID
export async function deleteActivityById(activityId) {
  const query = `
    DELETE FROM activities WHERE activity_id = ?;
  `;
  await db.query(query, [activityId]);
}

// 8. Get all trainer activities
export async function getAllTrainerActivities() {
  const query = `
    SELECT 
      users.user_id,
      CONCAT(users.user_firstname, ' ', users.user_lastname) AS trainer_name,
      activities.activity_id,
      activities.activity_name,
      clubs.club_id,
      clubs.club_name
    FROM 
      activity_trainers
    JOIN 
      users ON activity_trainers.trainer_id = users.user_id
    JOIN 
      activities ON activity_trainers.activity_id = activities.activity_id
    JOIN 
      clubs ON activity_trainers.club_id = clubs.club_id
    ORDER BY 
      trainer_name, activities.activity_name, clubs.club_name;
  `;
  const [rows] = await db.query(query);
  return rows;
}

// 9. Assign a trainer to an activity
export async function assignTrainerToActivity(trainerId, activityId, clubId) {
  const query = `
    INSERT INTO activity_trainers (trainer_id, activity_id, club_id)
    VALUES (?, ?, ?);
  `;
  await db.query(query, [trainerId, activityId, clubId]);
}
