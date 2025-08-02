import * as XMLImportModel from "../models/XMLimport.js";
import xml2js from "xml2js";

// Helper function to parse XML
async function parseXML(xmlData) {
  try {
    const parser = new xml2js.Parser();
    return await parser.parseStringPromise(xmlData);
  } catch (error) {
    console.error("Error parsing XML:", error);
    throw new Error("Invalid XML format");
  }
}

// Upload and process the XML for activities
export async function uploadActivities(req, res) {
  // console.log("Request Files:", req.files);
  try {
    if (!req.files || !req.files["xml-file"]) {
      return res.status(400).json({ message: "No file selected." });
    }

    const XMLFile = req.files["xml-file"];
    const fileText = XMLFile.data.toString();
    // console.log("Received File Content:", fileText);

    const data = await parseXML(fileText);
    const activityUpload = data["activities-upload"];
    const operation = activityUpload["$"]["operation"];
    const activitiesData = activityUpload["activities"][0]["activity"];

    if (operation === "insert") {
      await Promise.all(
        activitiesData.map(async (activity) => {
          const { name, capacity, duration, description, trainers, club_id } =
            extractActivity(activity);
          const activityId = await XMLImportModel.insertActivity(
            name,
            capacity,
            duration,
            description
          );

          // Add trainers to the activity
          await Promise.all(
            trainers.map((trainerId) =>
              XMLImportModel.addTrainerToActivity(
                activityId,
                trainerId,
                club_id
              )
            )
          );
        })
      );
      return res
        .status(200)
        .json({ message: "Activities uploaded successfully!" });
    } else if (operation === "update") {
      await Promise.all(
        activitiesData.map(async (activity) => {
          const { id, name, capacity, duration, description } =
            extractActivity(activity);
          await XMLImportModel.updateActivity(
            id,
            name,
            capacity,
            duration,
            description
          );
        })
      );
      return res
        .status(200)
        .json({ message: "Activities updated successfully!" });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid operation attribute in XML." });
    }
  } catch (error) {
    console.error("Error processing XML:", error);
    return res
      .status(500)
      .json({ message: "Error processing XML: " + error.message });
  }
}

// extract activity data from XML structure
function extractActivity(activity) {
  return {
    id: activity.id ? parseInt(activity.id[0], 10) : null,
    name: activity.name[0],
    capacity: parseInt(activity.capacity[0], 10),
    duration: parseInt(activity.duration[0], 10),
    description: activity.description ? activity.description[0] : "",
    trainers: activity.trainers
      ? activity.trainers[0].trainer.map((t) => parseInt(t, 10))
      : [],
    club_id: parseInt(activity.club_id[0], 10),
  };
}

// Upload and process the XML for clubs
export async function uploadClubs(req, res) {
  try {
    if (!req.files || !req.files["xml-file"]) {
      return res.status(400).json({ message: "No file selected." });
    }

    const XMLFile = req.files["xml-file"];
    const fileText = XMLFile.data.toString();
    const data = await parseXML(fileText);
    const clubUpload = data["clubs-upload"];
    const operation = clubUpload["$"]["operation"];
    const clubsData = clubUpload["clubs"][0]["club"];

    if (operation === "insert") {
      await Promise.all(
        clubsData.map(async (club) => {
          const {
            name,
            address,
            phone,
            email,
            latitude,
            longitude,
            facilities,
          } = extractClub(club);
          await XMLImportModel.insertClub(
            name,
            address,
            phone,
            email,
            latitude,
            longitude,
            facilities
          );
        })
      );
      return res.status(200).json({ message: "Clubs uploaded successfully!" });
    } else if (operation === "update") {
      await Promise.all(
        clubsData.map(async (club) => {
          try {
            const {
              id,
              name,
              address,
              phone,
              email,
              latitude,
              longitude,
              facilities,
            } = extractClub(club);
            console.log("Extracted Facilities:", facilities);
            await XMLImportModel.updateClub(
              id,
              name,
              address,
              phone,
              email,
              latitude,
              longitude,
              facilities
            );
          } catch (err) {
            console.error(`Error processing club ${club.name[0]}:`, err);
          }
        })
      );
      return res.status(200).json({ message: "Clubs updated successfully!" });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid operation attribute in XML." });
    }
  } catch (error) {
    console.error("Error processing XML:", error);
    return res
      .status(500)
      .json({ message: "Error processing XML: " + error.message });
  }
}

// extract club data from XML structure
function extractClub(club) {
  return {
    id: club.id ? parseInt(club.id[0], 10) : null,
    name: club.name[0],
    address: club.address[0],
    phone: club.phone[0],
    email: club.email[0],
    latitude: club.latitude ? parseFloat(club.latitude[0]) : null,
    longitude: club.longitude ? parseFloat(club.longitude[0]) : null,
    facilities: club.facilities
      ? club.facilities[0]
          .trim()
          .split(";")
          .map((facility) => facility.trim())
      : [],
  };
}
