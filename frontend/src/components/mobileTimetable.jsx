import React from "react";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { classData } from "../data-testing";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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

  const handlePrevDate = () => {
    const newDate = new Date(activeDate);
    newDate.setDate(newDate.getDate() - 1);
    setActiveDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(activeDate);
    newDate.setDate(activeDate.getDate() + 1);

    // Calculate three weeks from today (always ending on a Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextSunday = 7 - dayOfWeek;
    const threeWeeksFromNow = new Date(today);
    threeWeeksFromNow.setDate(today.getDate() + daysUntilNextSunday + 21);
    if (newDate <= threeWeeksFromNow) {
      setActiveDate(newDate);
    }
  };

  // Format the date to match your classData format (dd-mm-yyyy)
  const formattedActiveDate = activeDate
    .toLocaleDateString("en-AU", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    .replace(/\//g, "-");

  // Filter classes based on the selected date and time of day
  const morningClasses = selectedClub
    ? classData.filter(
        (classItem) =>
          classItem.date === formattedActiveDate &&
          parseInt(classItem.time.split(":")[0], 10) < 12 &&
          classItem.location === selectedClub.location
      )
    : [];

  const afternoonClasses = selectedClub
    ? classData.filter(
        (classItem) =>
          classItem.date === formattedActiveDate &&
          parseInt(classItem.time.split(":")[0], 10) >= 12 &&
          parseInt(classItem.time.split(":")[0], 10) < 17 &&
          classItem.location === selectedClub.location
      )
    : [];

  const eveningClasses = selectedClub
    ? classData.filter(
        (classItem) =>
          classItem.date === formattedActiveDate &&
          parseInt(classItem.time.split(":")[0], 10) >= 17 &&
          classItem.location === selectedClub.location
      )
    : [];

  const handleOpenModal = (classItem) => {
    setSelectedClass(classItem);
  };
  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  return (
    <>
      {/* Club Selection Dropdown */}
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
      {/* show the date today */}
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
        {/* Timetable Date Header */}
        <div className="bg-base-200 p-4 rounded-lg mb-4 flex justify-between items-center relative">
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
          {/* Day and Date Column */}
          <div
            className="text-center"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
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
        <div className="space-y-4 flex justify-center flex-col">
          {selectedClub ? (
            <>
              {/* Morning Classes */}
              <div>
                <h4 className="text-lg font-semibold mb-2 bg-gray-300 text-center">
                  Morning Classes
                </h4>
                {morningClasses.length === 0 ? (
                  <p>No morning classes scheduled.</p>
                ) : (
                  morningClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="card bg-base-100 shadow-xl p-6 mb-2"
                    >
                      <div className="flex">
                        <div className="flex-1 flex flex-col items-start">
                          <h3 className="text-xl font-bold py-2 ml-1">
                            {classItem.class}
                          </h3>
                          <p className="bg-base-200 text-center rounded-full font-semibold py-1 px-5 my-1">
                            {classItem.location}
                          </p>
                        </div>
                        <div className="flex-2">
                          <p className="text-xl font-bold py-2">
                            {classItem.time}
                          </p>
                          <p className="py-1 my-1">
                            {classItem.duration}{" "}
                            <span className="font-semibold">Minutes</span>
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border" />
                      <button
                        className="button-main-style "
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
                <h4 className="text-lg font-semibold mb-2 bg-gray-300 text-center">
                  Afternoon Classes
                </h4>
                {afternoonClasses.length === 0 ? (
                  <p>No afternoon classes scheduled.</p>
                ) : (
                  afternoonClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="card bg-base-100 shadow-xl p-6 mb-2"
                    >
                      <div className="flex">
                        <div className="flex-1 flex flex-col items-start">
                          <h3 className="text-xl font-bold py-2 ml-1">
                            {classItem.class}
                          </h3>
                          <p className="bg-base-200 text-center rounded-full font-semibold py-1 px-5 my-1">
                            {classItem.location}
                          </p>
                        </div>
                        <div className="flex-2">
                          <p className="text-xl font-bold py-2">
                            {classItem.time}
                          </p>
                          <p className="py-1 my-1">
                            {classItem.duration}{" "}
                            <span className="font-semibold">Minutes</span>
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border" />
                      <button
                        className="button-main-style "
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
                <h4 className="text-lg font-semibold mb-2 bg-gray-300 text-center">
                  Evening Classes
                </h4>
                {eveningClasses.length === 0 ? (
                  <p>No evening classes scheduled.</p>
                ) : (
                  eveningClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="card bg-base-100 shadow-xl p-6 mb-2"
                    >
                      <div className="flex">
                        <div className="flex-1 flex flex-col items-start">
                          <h3 className="text-xl font-bold py-2 ml-1">
                            {classItem.class}
                          </h3>
                          <p className="bg-base-200 text-center rounded-full font-semibold py-1 px-5 my-1">
                            {classItem.location}
                          </p>
                        </div>
                        <div className="flex-2">
                          <p className="text-xl font-bold py-2">
                            {classItem.time}
                          </p>
                          <p className="py-1 my-1">
                            {classItem.duration}{" "}
                            <span className="font-semibold">Minutes</span>
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border" />
                      <button
                        className="button-main-style"
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
      </div>{" "}
      {/* container end tag */}
      {/* Class Details Modal */}
      {selectedClass && (
        <div className="modal modal-open">
          <div className="modal-box">
            {/* --------------- */}
            {/* TODO put more information here*/}
            {/* --------------- */}
            {/* Instructor Options */}
            <p className="text-xl font-bold py-2">
              {selectedClass.class} - {selectedClass.time}
            </p>
            <div className="flex gap-2">
              <p>{selectedClass.duration} Minutes</p>
              <p className="bg-gray-200 inline rounded-full px-4">
                {selectedClass.location}
              </p>
            </div>
            {selectedClass && selectedClass.instructor && (
              <div className="py-2">
                <p className="font-semibold">Instructor:</p>
                <select className="select select-bordered w-full max-w-xs mt-2">
                  {selectedClass.instructor.map((instructor, index) => (
                    <option key={index} value={instructor}>
                      {instructor}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Booking Status */}
            <p className="py-2">
              <span className="font-semibold">Availability:</span>{" "}
              {selectedClass.booked}/{selectedClass.capacity}
            </p>
            <hr />
            {/* -------------- */}
            {/* put the class description here */}
            {/* -------------- */}
            <div className="modal-action">
              <button
                className="button-secondary-style text-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button className="button-main-style text-sm">Book Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
