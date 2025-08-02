import React from "react";

export default function RoleFilter({
  selectedRole,
  handleRoleChange,
  navigate,
}) {
  return (
    <div className="flex justify-center mb-4 join">
      <div className="btn join-item border border-gray-300">Filter By:</div>
      <select
        className="p-2 border rounded join-item w-full border border-gray-300 bg-white"
        value={selectedRole}
        onChange={handleRoleChange}
      >
        <option value="all">All Roles</option>
        <option value="admin">Admin</option>
        <option value="member">Member</option>
        <option value="trainer">Trainer</option>
      </select>
      <button
        className="btn bg-primary join-item border border-gray-300"
        onClick={() => navigate("/create-user")}
      >
        Create New User
      </button>
    </div>
  );
}
