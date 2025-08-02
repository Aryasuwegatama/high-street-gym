import React from "react";

export default function ResultModal({ show, message, type, closeModal }) {
  if (!show) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3
          className={`text-xl font-bold ${
            type === "success" ? "text-success" : "text-error"
          }`}
        >
          {type === "success" ? "Success" : "Error"}
        </h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button
            className={`btn rounded-full px-6 ${
              type === "success" ? "btn-primary" : "btn-error"
            }`}
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
