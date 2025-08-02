import { db } from "../database.js";

// 1. Get all clubs
export async function getAll() {
  const query = `SELECT * FROM clubs;`;
  const [rows] = await db.query(query);
  return rows.map((row) => ({
    ...row,
    club_facilities:
      typeof row.club_facilities === "string"
        ? JSON.parse(row.club_facilities)
        : row.club_facilities,
  }));
}

// 2. Get club by ID
export async function getById(clubId) {
  const query = `SELECT * FROM clubs WHERE club_id = ?;`;
  const [rows] = await db.query(query, [clubId]);
  const club = rows[0];
  if (club) {
    club.club_facilities =
      typeof club.club_facilities === "string"
        ? JSON.parse(club.club_facilities)
        : club.club_facilities;
  }
  return club;
}

// 3. Create a new club
export async function createClub(club) {
  const query = `
        INSERT INTO clubs (club_name, club_address, club_phone, club_email, club_latitude, club_longitude, club_facilities) 
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
  const {
    club_name,
    club_address,
    club_phone,
    club_email,
    club_latitude,
    club_longitude,
    club_facilities,
  } = club;
  return db.query(query, [
    club_name,
    club_address,
    club_phone,
    club_email,
    club_latitude,
    club_longitude,
    JSON.stringify(club_facilities),
  ]);
}

// 4. Update a club
export async function updateClub(clubId, updatedFields) {
  const allowedFields = [
    "club_name",
    "club_address",
    "club_phone",
    "club_email",
    "club_latitude",
    "club_longitude",
    "club_facilities",
  ];

  // Convert club_facilities array to a JSON string if it exists
  if (
    updatedFields.club_facilities &&
    Array.isArray(updatedFields.club_facilities)
  ) {
    updatedFields.club_facilities = JSON.stringify(
      updatedFields.club_facilities
    );
  }

  // Build the query dynamically based on allowed fields
  const updates = Object.entries(updatedFields)
    .filter(([key]) => allowedFields.includes(key))
    .map(([key]) => `${key} = ?`)
    .join(", ");

  // Get the values in the same order as the keys and add clubId for the WHERE clause
  const values = Object.entries(updatedFields)
    .filter(([key]) => allowedFields.includes(key))
    .map(([, value]) => value);
  values.push(clubId);

  const query = `UPDATE \`high-street-gym\`.clubs SET ${updates} WHERE club_id = ?`;

  try {
    await db.query(query, values);
    return { success: true };
  } catch (error) {
    console.error("Error updating club:", error);
    throw new Error("Failed to update club details.");
  }
}

// 5. Delete a club by ID
export async function deleteById(clubId) {
  const query = `DELETE FROM clubs WHERE club_id = ?;`;
  return db.query(query, [clubId]);
}
