import React from "react";

const BookingResultModal = ({ type, message, onClose }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3
          className={`text-xl font-bold ${type === "success" ? "text-success" : "text-error"}`}
        >
          {type === "success" ? "Success" : "Error"}
        </h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button
            className={`btn rounded-full px-6 ${type === "success" ? "btn" : "btn-error"}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingResultModal;
