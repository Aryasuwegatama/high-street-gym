import * as xmlImportModel from "../models/XMLimport.js"
import parseStringPromise from "xml2js"

// Helper funtion to parse the xml
export async function parseXML(xmlData) {
    try {
        return await parseStringPromise(xmlData);
    } catch (error) {
        console.error("Error parsing XML:", error);
        throw new Error("Invalid XML format");
    }
}

// Handle the upload and processing of the XML file
export async function uploadActivities(req, res) {
    try {
        // Check if the file is present in the request
        if (req.files && req.files["xml-file"]) {
            const XMLFile = req.files["xml-file"]; // Access the uploaded XML file
            const file_text = XMLFile.data.toString(); // Convert to string

            // Parse the XML into JavaScript object
            const data = await parseStringPromise(file_text);
            const activityUpload = data["activities-upload"]; // Root element
            const operation = activityUpload["$"]["operation"]; // Get operation attribute
            const activitiesData = activityUpload["activities"][0]["activity"]; // Nested activities

            if (operation === "insert") {
                // Insert new activities into the database
                Promise.all(activitiesData.map((activity) => {
                    const name = activity.name[0];
                    const duration = parseInt(activity.duration[0]);
                    const capacity = parseInt(activity.capacity[0]);
                    const description = activity.description ? activity.description[0] : "";

                    // Insert activity into the database
                    return insertActivity(name, capacity, description);
                }))
                .then(() => {
                    res.status(200).json({
                        status: 200,
                        message: "Activities uploaded successfully!",
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        status: 500,
                        message: "Failed to upload activities: " + error,
                    });
                });

            } else if (operation === "update") {
                // Update existing activities
                Promise.all(activitiesData.map((activity) => {
                    const id = parseInt(activity.id[0]);
                    const name = activity.name[0];
                    const duration = parseInt(activity.duration[0]);
                    const capacity = parseInt(activity.capacity[0]);
                    const description = activity.description ? activity.description[0] : "";

                    // Update the activity in the database
                    return updateActivity(id, name, duration, capacity, description);
                }))
                .then(() => {
                    res.status(200).json({
                        status: 200,
                        message: "Activities updated successfully!",
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        status: 500,
                        message: "Failed to update activities: " + error,
                    });
                });

            } else {
                res.status(400).json({
                    status: 400,
                    message: "Invalid operation attribute value in XML.",
                });
            }

        } else {
            res.status(400).json({
                status: 400,
                message: "No file selected.",
            });
        }
    } catch (error) {
        console.error("Error parsing XML:", error);
        res.status(500).json({
            status: 500,
            message: "Error processing XML: " + error.message,
        });
    }
}
