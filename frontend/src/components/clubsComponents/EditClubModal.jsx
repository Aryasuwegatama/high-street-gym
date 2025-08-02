import React, { useState } from "react";

export default function EditClubModal({
  selectedClub: initialSelectedClub,
  handleCloseEditModal,
  handleSaveEdit,
}) {
  const [selectedClub, setSelectedClub] = useState(initialSelectedClub);
  const [facilities, setFacilities] = useState(selectedClub.club_facilities);
  const [loading, setLoading] = useState(false);
  console.log(selectedClub);
  console.log(facilities);

  const handleAddFacility = () => {
    setFacilities([...facilities, ""]);
  };

  const handleFacilityChange = (index, value) => {
    const newFacilities = [...facilities];
    newFacilities[index] = value;
    setFacilities(newFacilities);
  };

  const handleDeleteFacility = (index) => {
    const newFacilities = facilities.filter((_, i) => i !== index);
    setFacilities(newFacilities);
  };

  const handleSave = async () => {
    setLoading(true);
    const updatedClub = { ...selectedClub, club_facilities: facilities };
    console.log(updatedClub);
    await handleSaveEdit(updatedClub);
    setLoading(false);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Club</h3>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Club Name
            </label>
            <input
              type="text"
              value={selectedClub.club_name}
              onChange={(e) =>
                setSelectedClub({
                  ...selectedClub,
                  club_name: e.target.value,
                })
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
              value={selectedClub.club_address}
              onChange={(e) =>
                setSelectedClub({
                  ...selectedClub,
                  club_address: e.target.value,
                })
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
              value={selectedClub.club_phone}
              onChange={(e) =>
                setSelectedClub({
                  ...selectedClub,
                  club_phone: e.target.value,
                })
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
              value={selectedClub.club_email}
              onChange={(e) =>
                setSelectedClub({
                  ...selectedClub,
                  club_email: e.target.value,
                })
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
              value={selectedClub.club_latitude}
              onChange={(e) =>
                setSelectedClub({
                  ...selectedClub,
                  club_latitude: e.target.value,
                })
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
              value={selectedClub.club_longitude}
              onChange={(e) =>
                setSelectedClub({
                  ...selectedClub,
                  club_longitude: e.target.value,
                })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Club Facilities
            </label>
            {facilities.map((facility, index) => (
              <div key={index} className="mb-2">
                <button
                  type="button"
                  className="text-error underline pb-2"
                  onClick={() => handleDeleteFacility(index)}
                >
                  Delete below facility
                </button>
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => handleFacilityChange(index, e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
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
              onClick={handleCloseEditModal}
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
