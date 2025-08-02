import * as ClubModel from "../models/clubs.js";

// Create a new club
export async function createClub(req, res) {
  try {
    const club = await ClubModel.createClub(req.body);
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all clubs
export async function getAllClubs(req, res) {
  try {
    const clubs = await ClubModel.getAll();
    res.status(200).json({
      status: 200,
      clubs: clubs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a single club by ID
export async function getClubById(req, res) {
  const { id } = req.params;
  try {
    const club = await ClubModel.getById(id);
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a club by ID
export async function updateClub(req, res) {
  const { id } = req.params;
  const updatedFields = { ...req.body };

  try {
    await ClubModel.updateClub(id, updatedFields);
    res.status(200).json({ message: "Club updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a club by ID
export async function deleteClub(req, res) {
  const { id } = req.params;
  try {
    const club = await ClubModel.getById(id);
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }

    await ClubModel.deleteById(id);
    res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
