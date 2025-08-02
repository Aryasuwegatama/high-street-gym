import { db } from "../database.js";

// 1. Get all users (for admin)
export async function getAll() {
  const query = `
    SELECT user_id, user_email, user_role, user_phone, 
           user_firstname, user_lastname, user_address 
    FROM users;
  `;
  const [rows] = await db.query(query);
  return rows;
}

// 2. Get user by ID
export async function getById(userId) {
  const query = `
    SELECT user_id, user_email, user_role, user_phone, 
           user_firstname, user_lastname, user_address 
    FROM users WHERE user_id = ?;
  `;
  const [rows] = await db.query(query, [userId]);
  return rows[0];
}

// 3. Get user by email (includes password for sign-in)
export async function getByEmail(userEmail) {
  const query = `SELECT * FROM users WHERE user_email = ?;`;
  const [rows] = await db.query(query, [userEmail]);
  return rows[0];
}

// 4. Get user by auth token
export async function getByAuthToken(token) {
  const query = `
    SELECT user_id, user_email, user_role, user_firstname, 
           user_lastname, user_phone, user_address 
    FROM users WHERE user_auth_token = ?;
  `;
  const [rows] = await db.query(query, [token]);
  return rows[0];
}

// 5. Create a new user
export async function createUser(
  email,
  password,
  role,
  phone,
  firstName,
  lastName,
  address
) {
  const query = `
    INSERT INTO users (user_email, user_password, user_role, user_phone, 
                       user_firstname, user_lastname, user_address) 
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  return db.query(query, [
    email,
    password,
    role,
    phone,
    firstName,
    lastName,
    address,
  ]);
}

// 6. Update user using an object for flexibility
export async function updateUser(userId, updatedFields) {
  const allowedFields = [
    "user_email",
    "user_password",
    "user_role",
    "user_phone",
    "user_firstname",
    "user_lastname",
    "user_address",
    "user_auth_token",
  ];

  const updates = Object.entries(updatedFields)
    .filter(([key]) => allowedFields.includes(key)) // Keep only allowed fields
    .map(([key, value]) => `${key} = ?`)
    .join(", ");

  const values = Object.values(updatedFields);
  values.push(userId); // Add userId as the last parameter

  const query = `UPDATE users SET ${updates} WHERE user_id = ?`;
  return db.query(query, values);
}

// 7. Delete a user by ID
export async function deleteById(userId) {
  const query = `DELETE FROM users WHERE user_id = ?;`;
  return db.query(query, [userId]);
}
