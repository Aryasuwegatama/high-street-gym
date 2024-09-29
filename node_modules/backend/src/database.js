import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "high-street-gym"
})

db.getConnection()
  .then(connection => {
    console.log("Connection to the database successful!");
    connection.release();
  })
  .catch(error => {
    console.error("Error connecting to the database:", error);
  });