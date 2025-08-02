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
        `);

  return classData[0];
}

// get classes by club
export async function getClassesByClub(clubName) {
  const classData = await db.query(
    `
        SELECT
    classes.class_id,
    classes.class_date,
    DATE_FORMAT(class_time, '%H:%i') AS class_time,
    activities.activity_id,
    activities.activity_name,
    concat(users.user_firstname, " ", users.user_lastname) AS trainer_name,
   activities.activity_capacity,
    activities.activity_duration,
    clubs.club_id,
    clubs.club_name,
    activities.activity_description
    FROM classes
    JOIN activities ON classes.class_activity_id = activities.activity_id
    JOIN activity_trainers ON activities.activity_id = activity_trainers.activity_id
    JOIN users ON activity_trainers.trainer_id = users.user_id
    JOIN clubs on classes.class_club_id = clubs.club_id
    WHERE clubs.club_name = ?
    AND activity_trainers.club_id = classes.class_club_id;`,
    [clubName]
  );
  return classData[0];
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
    console.error("Error fetching trainer ID:", error);
    throw new Error("Database error");
  }
}

//   count trainer booking
export async function getBookingCountByTrainer(classId, trainerId) {
  const [result] = await db.query(
    `SELECT COUNT(*) AS booking_count 
       FROM bookings 
       WHERE booking_class_id = ? 
       AND booking_trainer_id = ? 
       AND booking_status = 'confirmed'`,
    [classId, trainerId]
  );

  return result[0].booking_count;
}

// Check if any user booked the class
export async function checkClassBookings(classId) {
  const [result] = await db.query(
    `SELECT COUNT(*) AS booking_count 
     FROM bookings 
     WHERE booking_class_id = ?`,
    [classId]
  );

  return result[0].booking_count > 0;
}

export async function updateClass(classId, classData) {
  const { class_date, class_time, class_club_id, class_activity_id } = classData;

  const result = await db.query(
    `UPDATE classes
     SET class_date = ?, class_time = ?, class_club_id = ?, class_activity_id = ?
     WHERE class_id = ?`,
    [
      class_date,
      class_time,
      class_club_id,
      class_activity_id,
      classId,
    ]
  );

  return result;
}
// Create a new class
export async function createClass(classData) {
  const { class_date, class_time, class_activity_id, class_club_id } =
    classData;

  const result = await db.query(
    `INSERT INTO classes (class_date, class_time, class_activity_id, class_club_id)
     VALUES (?, ?, ?, ?)`,

    [class_date, class_time, class_activity_id, class_club_id]
  );

  return result.insertId;
}

// Delete a class by ID
export async function deleteClass(classId) {
  await db.query(`DELETE FROM classes WHERE class_id = ?`, [classId]);
}

// Delete bookings for a specific class
export async function deleteClassBookings(classId) {
  await db.query(`DELETE FROM bookings WHERE booking_class_id = ?`, [classId]);
}
