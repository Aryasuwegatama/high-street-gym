import React from "react";

export default function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-xl font-bold">Confirm</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="button-delete-style" onClick={onConfirm}>
            Delete Blog
          </button>
          <button className="button-secondary-style text-sm" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
