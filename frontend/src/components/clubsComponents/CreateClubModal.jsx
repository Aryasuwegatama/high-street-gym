import React, { useState } from "react";

export default function CreateClubModal({
  handleCloseCreateModal,
  handleSaveCreate,
}) {
  const [newClub, setNewClub] = useState({
    club_name: "",
    club_address: "",
    club_phone: "",
    club_email: "",
    club_latitude: "",
    club_longitude: "",
    club_facilities: [],
  });
  const [loading, setLoading] = useState(false);

  const handleAddFacility = () => {
    setNewClub({
      ...newClub,
      club_facilities: [...newClub.club_facilities, ""],
    });
  };

  const handleFacilityChange = (index, value) => {
    const newFacilities = [...newClub.club_facilities];
    newFacilities[index] = value;
    setNewClub({ ...newClub, club_facilities: newFacilities });
  };

  const handleSave = async () => {
    setLoading(true);
    const formattedClub = {
      club_name: newClub.club_name,
      club_address: newClub.club_address,
      club_phone: newClub.club_phone,
      club_email: newClub.club_email,
      club_latitude: newClub.club_latitude,
      club_longitude: newClub.club_longitude,
      club_facilities: newClub.club_facilities.filter(
        (facility) => facility.trim() !== ""
      ),
    };
    await handleSaveCreate(formattedClub);
    setLoading(false);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Create Club</h3>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Club Name
            </label>
            <input
              type="text"
              value={newClub.club_name}
              onChange={(e) =>
                setNewClub({ ...newClub, club_name: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Club Address
            </label>
            <input
              type="text"
              value={newClub.club_address}
              onChange={(e) =>
                setNewClub({ ...newClub, club_address: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Club Phone
            </label>
            <input
              type="text"
              value={newClub.club_phone}
              onChange={(e) =>
                setNewClub({ ...newClub, club_phone: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Club Email
            </label>
            <input
              type="email"
              value={newClub.club_email}
              onChange={(e) =>
                setNewClub({ ...newClub, club_email: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Club Latitude
            </label>
            <input
              type="number"
              step="0.00000001"
              value={newClub.club_latitude}
              onChange={(e) =>
                setNewClub({ ...newClub, club_latitude: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Club Longitude
            </label>
            <input
              type="number"
              step="0.00000001"
              value={newClub.club_longitude}
              onChange={(e) =>
                setNewClub({ ...newClub, club_longitude: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Club Facilities
            </label>
            {newClub.club_facilities.map((facility, index) => (
              <input
                key={index}
                type="text"
                value={facility}
                onChange={(e) => handleFacilityChange(index, e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              />
            ))}
            <button
              type="button"
              className="button-secondary-style"
              onClick={handleAddFacility}
            >
              Add Facility
            </button>
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="button-secondary-style"
              onClick={handleCloseCreateModal}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button-main-style"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
