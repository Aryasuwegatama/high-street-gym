import React, { useState } from "react";
import { FaRegCalendarXmark } from "react-icons/fa6";
import * as bookings from "../../api/bookings";
import { useAuth } from "../../context/AuthContext";
import BookingResultModal from "./BookingResultModal";

export default function ConfirmedBookingCard({
  classItem,
  formatClassTime,
  formatDate,
  formatTime,
  fetchUserBookings,
}) {
  const { authToken, authenticatedUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultType, setResultType] = useState("success");
  const [error, setError] = useState(null);

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
  };

  const handleOpenModal = () => setShowModal(true);

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setResultMessage("");
    fetchUserBookings();
  };

  const handleCancelBooking = async () => {
    try {
      const result = await bookings.cancelClassBooking(
        classItem.booking_id,
        authToken
      );
      if (!result || result.status !== 200) {
        throw new Error("Cancellation failed. Please try again.");
      }
      setResultMessage("The class booking cancelled successfully.");
      setResultType("success");
      setShowResultModal(true);
    } catch (error) {
      console.error("Cancel Booking Error:", error);
      setError(error.message);
      setResultMessage(error.message);
      setResultType("error");
      setShowResultModal(true);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="card bg-green-50 shadow-lg p-4 relative border">
      <div className="text-lg font-bold my-2">
        <div className="block py-2 md:inline">
          {classItem.activity_name} - {formatClassTime(classItem.class_time)}
        </div>
        <div className="block py-2 md:inline">
          <p className="bg-gray-200 inline rounded-full px-4 py-1 ml-0 md:ml-2 font-semibold text-sm">
            {classItem.club_name}
          </p>
          <span className="bg-success rounded-full px-4 py-1 ml-1 md:mx-2 font-semibold text-sm text-base-100">
            Confirmed
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <p>{classItem.activity_duration} Minutes</p>
        <p className="font-semibold">- {classItem.trainer_name}</p>
      </div>
      <p className="text-sm font-bold my-4">
        Booked At:{" "}
        <span className="font-semibold">
          {formatDate(classItem.class_date)},{" "}
          {formatTime(classItem.booking_created_date)}
        </span>
      </p>
      {/* <hr className="border-gray-400 my-4" /> */}
      {authenticatedUser.user.role !== "member" && (
        // Hide button for members
        <div className="modal-action absolute right-4 md:right-4 top-0">
          <button className="" onClick={handleOpenModal}>
            <FaRegCalendarXmark className="w-5 md:w-6 h-5 md:h-6 text-error" />
          </button>
        </div>
      )}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Cancel Booking</h3>
            <p>Are you sure you want to cancel this booking?</p>

            {error && <p className="text-error mt-4">{error}</p>}

            <div className="modal-action">
              <button
                className="button-secondary-style text-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="button-delete-style"
                onClick={handleCancelBooking}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showResultModal && (
        <BookingResultModal
          type={resultType}
          message={resultMessage}
          onClose={handleCloseResultModal}
        />
      )}
    </div>
  );
}
