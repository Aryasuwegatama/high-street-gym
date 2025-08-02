import React from "react";

export default function UserCard({ user, navigate, handleDelete }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-xl font-bold">
          {user.user_firstname} {user.user_lastname}
        </h3>
        <p className="text-sm">Email: {user.user_email}</p>
        <p className="text-sm">Role: {user.user_role}</p>
        <div className="mt-4 flex justify-between">
          <button
            className="button-edit-style"
            onClick={() => navigate(`/user/${user.user_id}`)}
          >
            View/Update
          </button>
          <button
            className="button-delete-style"
            onClick={() => handleDelete(user.user_id, user.user_role)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
