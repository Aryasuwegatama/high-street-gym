export default function ClassModal({
  selectedClass,
  handleCloseModal,
  handleBooking,
  selectedTrainer,
  setSelectedTrainer,
  fetchTrainerAvailability,
  loadingAvailability,
  trainerAvailability,
}) {
  return (
    <>
      {selectedClass && (
        <div className="modal modal-open">
          <div className="modal-box">
            <p className="text-xl font-bold py-2">
              {selectedClass.activity_name} - {selectedClass.class_time}
            </p>
            <div className="flex gap-2">
              <p>{selectedClass.activity_duration} Minutes</p>
              <p className="bg-gray-200 inline rounded-full px-4">
                {selectedClass.club_name}
              </p>
            </div>
            {selectedClass && selectedClass.trainer_name && (
              <div className="py-2">
                <p className="font-semibold">Trainer:</p>
                <select
                  className="select select-bordered w-full max-w-xs mt-2"
                  value={selectedTrainer}
                  onChange={(e) => {
                    setSelectedTrainer(e.target.value);
                    fetchTrainerAvailability(
                      selectedClass.class_id,
                      e.target.value
                    );
                  }}
                >
                  <option value="">--Select Trainer--</option>
                  {selectedClass.trainers.map((trainer, index) => (
                    <option key={index} value={trainer}>
                      {trainer}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <p className="py-2">
              <span className="font-semibold">Availability:</span>{" "}
              {loadingAvailability ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : trainerAvailability !== null ? (
                `${trainerAvailability}/${selectedClass.activity_capacity}`
              ) : (
                "Select a trainer"
              )}
              {trainerAvailability >= selectedClass.activity_capacity ? (
                <p className=" text-red-800">* Class is fully booked</p>
              ) : (
                ""
              )}
            </p>
            <p className="font-semibold pt-4">
              About Our {selectedClass.activity_name} Class
            </p>
            <hr className="w-1/5 my-2 border" />
            <p className="font-light">{selectedClass.activity_description}</p>
            <hr className="mt-4" />
            <div className="modal-action">
              <button
                className="button-secondary-style text-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className={`button-secondary-style text-sm ${
                  trainerAvailability >= selectedClass.activity_capacity
                    ? "disabled:bg-gray-400 disabled:text-red-700 disabled:cursor-not-allowed"
                    : ""
                }`}
                onClick={handleBooking}
                disabled={
                  trainerAvailability >= selectedClass.activity_capacity
                }
              >
                {trainerAvailability >= selectedClass.activity_capacity
                  ? "Fully Booked"
                  : "Book Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
