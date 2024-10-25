import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import * as classes from "../../api/classes";

const clubs = [
  { id: 1, name: "Ashgrove", location: "Ashgrove" },
  { id: 2, name: "Brisbane City", location: "Brisbane" },
  { id: 3, name: "Chermside", location: "Chermside" },
  { id: 4, name: "Graceville", location: "Graceville" },
  { id: 5, name: "Westlake", location: "Westlake" },
];

export default function MobileTimetable() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [classData, setClassData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [trainerAvailability, setTrainerAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      if (!selectedClub) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await classes.getClassesByClub(selectedClub.name);
        setClassData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassData();
  }, [selectedClub]);

  const handlePrevDate = () => {
    const newDate = new Date(activeDate);
    newDate.setDate(newDate.getDate() - 1);
    setActiveDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(activeDate);
    newDate.setDate(activeDate.getDate() + 1);

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextSunday = 7 - dayOfWeek;
    const threeWeeksFromNow = new Date(today);
    threeWeeksFromNow.setDate(today.getDate() + daysUntilNextSunday + 21);
    if (newDate <= threeWeeksFromNow) {
      setActiveDate(newDate);
    }
  };

  const formattedActiveDate = activeDate.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const filterClasses = (timeFilter) => {
    return classData.filter((classItem) => {
      const classTimeHour =
        classItem.class_time && typeof classItem.class_time === "string"
          ? parseInt(classItem.class_time.split(":")[0], 10)
          : null;
      return (
        classItem.class_date === formattedActiveDate &&
        timeFilter(classTimeHour) &&
        classItem.club_name === selectedClub.name
      );
    });
  };

  const morningClasses = filterClasses((hour) => hour < 12);
  const afternoonClasses = filterClasses((hour) => hour >= 12 && hour < 17);
  const eveningClasses = filterClasses((hour) => hour >= 17);

  const handleOpenModal = (classItem) => {
    setSelectedClass(classItem);
    setSelectedTrainer(""); 
    setTrainerAvailability(null);  
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  // get trainer avaialability
  const fetchTrainerAvailability = async (classId, trainerName) => {
    try {
      setLoadingAvailability(true);
      const response = await classes.getTrainerAvailability(
        classId,
        trainerName
      );
      setTrainerAvailability(response.booking_count);
    } catch (error) {
      console.error("Failed to fetch trainer availability", error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Function to handle booking a class with the selected trainer
  const handleBooking = async () => {
    try {
      if (!selectedClass || !selectedTrainer) {
        alert("Please select a trainer to book this class.");
        return;
      }

      const result = await classes.bookClass(
        selectedClass.class_id,
        selectedTrainer
      );

      if (!result.success) {
        if (result.message === "You have already booked this class.") {
          alert("You have already booked this class.");
        } else if (result.message === "This class with the selected trainer is fully booked.") {
          alert("This class is fully booked. Please choose another class.");
        } else {
          alert(result.message);
        }
      } else {
        alert("Class booked successfully!");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error booking class:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // console.log(selectedTrainer)
  // console.log(selectedClass.class_id)

  return (
    <>
      <div className="form-control p-2">
        <select
          value={selectedClub ? selectedClub.id : ""}
          onChange={(e) => {
            const selectedClubId = parseInt(e.target.value, 10);
            const foundClub = clubs.find((club) => club.id === selectedClubId);
            setSelectedClub(foundClub);
          }}
          className="select select-bordered"
        >
          <option value="" disabled selected>
            Choose Club
          </option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>
      </div>

      <h3 className="font-semibold p-2">
        {new Date().toLocaleDateString("en-AU", {
          weekday: "long",
        })}
        ,{" "}
        {new Date().toLocaleDateString("en-AU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </h3>

      <div className="container mx-auto p-2 pb-20">
        <div className="bg-base-200 p-4 rounded-lg mb-4 flex justify-between items-center">
          <button
            onClick={handlePrevDate}
            disabled={activeDate.toDateString() === new Date().toDateString()}
            className={
              activeDate.toDateString() === new Date().toDateString()
                ? "text-gray-300"
                : ""
            }
          >
            <IoIosArrowBack className="h-8 w-8" />
          </button>

          <div className="text-center">
            <p className="text-2xl font-bold">
              {activeDate.toLocaleDateString("en-AU", { weekday: "long" })}
            </p>
            <p className="text-xl">
              {activeDate.toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button onClick={handleNextDate}>
            <IoIosArrowForward className="h-8 w-8" />
          </button>
        </div>

        {/* Class Cards */}
        {isLoading ? (
          <div className="col-span-full text-center py-4">
            <span className="loading loading-spinner loading-lg text-info"></span>
          </div>
        ) : error ? (
          <div role="alert" className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : selectedClub ? (
          <>
            {/* Morning Classes */}
            <div>
              <h4 className="text-lg font-semibold my-4 py-4 bg-gray-300 text-center ">
                Morning Classes
              </h4>
              {morningClasses.length === 0 ? (
                <p>No morning classes scheduled.</p>
              ) : (
                morningClasses.map((classItem) => (
                  <div
                    key={classItem.class_id}
                    className="card bg-base-100 shadow-xl p-6 mb-2"
                  >
                    <div className="flex">
                      <div className="flex-1 flex flex-col items-start">
                        <h3 className="text-xl font-bold py-2 ml-1">
                          {classItem.activity_name}
                        </h3>
                        <p className="bg-base-200 text-center rounded-full font-semibold py-1 px-5 my-1">
                          {classItem.club_name}
                        </p>
                      </div>
                      <div className="flex-2">
                        <p className="text-xl font-bold py-2">
                          {classItem.class_time}
                        </p>
                        <p className="py-1 my-1">
                          {classItem.activity_duration}{" "}
                          <span className="font-semibold">Minutes</span>
                        </p>
                      </div>
                    </div>
                    <hr className="my-4 border" />
                    <button
                      className="button-main-style text-base-100"
                      onClick={() => handleOpenModal(classItem)}
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Afternoon Classes */}
            <div>
              <h4 className="text-lg font-semibold my-4 py-4 bg-gray-300 text-center ">
                Afternoon Classes
              </h4>
              {afternoonClasses.length === 0 ? (
                <p>No afternoon classes scheduled.</p>
              ) : (
                afternoonClasses.map((classItem) => (
                  <div
                    key={classItem.class_id}
                    className="card bg-base-100 shadow-xl p-6 mb-2"
                  >
                    <div className="flex">
                      <div className="flex-1 flex flex-col items-start">
                        <h3 className="text-xl font-bold py-2 ml-1">
                          {classItem.activity_name}
                        </h3>
                        <p className="bg-base-200 text-center rounded-full font-semibold py-1 px-5 my-1">
                          {classItem.club_name}
                        </p>
                      </div>
                      <div className="flex-2">
                        <p className="text-xl font-bold py-2">
                          {classItem.class_time}
                        </p>
                        <p className="py-1 my-1">
                          {classItem.activity_duration}{" "}
                          <span className="font-semibold">Minutes</span>
                        </p>
                      </div>
                    </div>
                    <hr className="my-4 border" />
                    <button
                      className="button-main-style text-base-100"
                      onClick={() => handleOpenModal(classItem)}
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>
            {/* Evening Classes */}
            <div>
              <h4 className="text-lg font-semibold my-4 py-4 bg-gray-300 text-center ">
                Evening Classes
              </h4>
              {eveningClasses.length === 0 ? (
                <p>No evening classes scheduled.</p>
              ) : (
                eveningClasses.map((classItem) => (
                  <div
                    key={classItem.class_id}
                    className="card bg-base-100 shadow-xl p-6 mb-2"
                  >
                    <div className="flex">
                      <div className="flex-1 flex flex-col items-start">
                        <h3 className="text-xl font-bold py-2 ml-1">
                          {classItem.activity_name}
                        </h3>
                        <p className="bg-base-200 text-center rounded-full font-semibold py-1 px-5 my-1">
                          {classItem.club_name}
                        </p>
                      </div>
                      <div className="flex-2">
                        <p className="text-xl font-bold py-2">
                          {classItem.class_time}
                        </p>
                        <p className="py-1 my-1">
                          {classItem.activity_duration}{" "}
                          <span className="font-semibold">Minutes</span>
                        </p>
                      </div>
                    </div>
                    <hr className="my-4 border" />
                    <button
                      className="button-main-style text-base-100"
                      onClick={() => handleOpenModal(classItem)}
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <p className="text-lg text-center">Select a club to view classes</p>
        )}
      </div>

      {selectedClass && (
        <div className="modal modal-open">
          <div className="modal-box">
            <p className="text-xl font-bold py-2">
              {selectedClass.activity_name} - {selectedClass.class_time}
            </p>
            <div className="flex gap-2">
              <p>{selectedClass.activity_duration} </p>
              <p className="bg-gray-200 inline rounded-full px-4">
                {selectedClass.club_name}
              </p>
            </div>
            {selectedClass.trainers && (
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
            <p className="font-semibold">
              About Our {selectedClass.activity_name} Class
            </p>
            <hr className="w-1/5 my-2 border" />
            <p className="font-light">{selectedClass.activity_description}</p>
            <hr className="my-4" />
            <div className="modal-action">
              <button
                className="button-secondary-style text-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className={`button-main-style text-sm text-base-100 ${
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
