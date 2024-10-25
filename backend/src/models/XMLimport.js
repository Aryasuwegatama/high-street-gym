import { db } from "../database.js";

// XML Import for ACTIVITIES

// Insert a new activity
export async function insertActivity(name, capacity, description) {
    const query = `
        INSERT INTO activities (activity_name, activity_capacity, activity_description)
        VALUES (?, ?, ?)
    `;
    return db.query(query, [name, duration, capacity, description]);
}

// Update an existing activity
export async function updateActivity(id, name, capacity, description) {
    const query = `
        UPDATE activities 
        SET activity_name = ?, activity_capacity = ?, activity_description = ?
        WHERE id = ?
    `;
    return db.query(query, [name, duration, capacity, description, id]);
}
