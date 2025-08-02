import React from "react";
import ConfirmedBookingCard from "./ConfirmedBookingCard";
import CancelledBookingCard from "./CancelledBookingCard";

export default function UserBookingTabContent({
  bookingsByDate,
  expandedDates,
  fetchUserBookings,
  tab,
  formatClassTime,
  formatDate,
  formatTime,
  onToggleDate,
  isLoading,
  error,
  setShowSuccessModal,
  setShowErrorModal,
  setModalMessage,
}) {
  if (isLoading) {
    return (
      <div className="col-span-full text-center py-4">
        <span className="loading loading-spinner loading-lg text-info"></span>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (Object.keys(bookingsByDate).length === 0) {
    return tab === "confirmed" ? (
      <p>No Confirmed bookings found.</p>
    ) : (
      <p>No Cancelled bookings found.</p>
    );
  }

  const handleSuccess = (message) => {
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const handleError = (message) => {
    setModalMessage(message);
    setShowErrorModal(true);
  };

  return (
    <div className="space-y-4">
      {Object.entries(bookingsByDate).map(([date, classes]) => (
        <div key={date} className="border rounded-lg p-4 bg-gray-100">
          <div
            className="cursor-pointer font-bold text-lg mb-2"
            onClick={() => onToggleDate(date)}
          >
            {date} ▼
          </div>
          {expandedDates[date] && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((classItem) =>
                tab === "confirmed" ? (
                  <ConfirmedBookingCard
                    key={classItem.booking_id}
                    classItem={classItem}
                    formatClassTime={formatClassTime}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    fetchUserBookings={fetchUserBookings}
                    userName={classItem.user_name}
                  />
                ) : (
                  <CancelledBookingCard
                    key={classItem.booking_id}
                    classItem={classItem}
                    formatClassTime={formatClassTime}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    fetchUserBookings={fetchUserBookings}
                    userName={classItem.user_name}
                  />
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
