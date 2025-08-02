import { db } from "../database.js";

// Insert a new activity and return its ID
export async function insertActivity(name, capacity, duration, description) {
  const query = `
    INSERT INTO activities 
    (activity_name, activity_capacity, activity_duration, activity_description) 
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [
    name,
    capacity,
    duration,
    description,
  ]);
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
export async function updateActivity(
  id,
  name,
  capacity,
  duration,
  description
) {
  const query = `
    UPDATE activities 
    SET activity_name = ?, activity_capacity = ?, activity_duration = ?, activity_description = ? 
    WHERE activity_id = ?
  `;
  await db.query(query, [name, capacity, duration, description, id]);
}

// Insert a new club and return its ID
export async function insertClub(
  name,
  address,
  phone,
  email,
  latitude,
  longitude,
  facilities
) {
  const query = `
    INSERT INTO clubs (club_name, club_address, club_phone, club_email, club_latitude, club_longitude, club_facilities)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [
    name,
    address,
    phone,
    email,
    latitude,
    longitude,
    JSON.stringify(facilities),
  ]);
  return result.insertId; // Return the ID of the inserted club
}

// Update an existing club
export async function updateClub(
  id,
  name,
  address,
  phone,
  email,
  latitude,
  longitude,
  facilities
) {
  const query = `
    UPDATE clubs
    SET club_name = ?, club_address = ?, club_phone = ?, club_email = ?, club_latitude = ?, club_longitude = ?, club_facilities = ?
    WHERE club_id = ?
  `;
  await db.query(query, [
    name,
    address,
    phone,
    email,
    latitude,
    longitude,
    JSON.stringify(facilities),
    id,
  ]);
}
