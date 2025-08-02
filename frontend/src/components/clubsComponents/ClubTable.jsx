import React from "react";

export default function ClubTable({
  clubs,
  loading,
  handleEditClick,
  handleDeleteClick,
}) {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">Club Name</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {clubs.map((club) => (
          <tr key={club.club_id} className="text-center">
            <td className="border px-4 py-2">{club.club_name}</td>
            <td className="border px-4 py-2">
              <button
                className="button-edit-style px-4 mr-2"
                onClick={() => handleEditClick(club)}
                disabled={loading}
              >
                Edit
              </button>
              <button
                className="button-delete-style px-4"
                onClick={() => handleDeleteClick(club.club_id)}
                disabled={loading}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
