import React from "react";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { classData } from "../data-testing";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { PiDotsThreeCircleVertical } from "react-icons/pi";

const clubs = [
  { id: 1, name: "Ashgrove", location: "Ashgrove" },
  { id: 2, name: "Brisbane City", location: "Brisbane" },
  { id: 3, name: "Chermside", location: "Chermside" },
  { id: 4, name: "Graceville", location: "Graceville" },
  { id: 5, name: "Westlake", location: "Westlake" },
];

export default function DesktopTimetable() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  
  // Function to get the first day of the week (Monday)
  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay() || 7; // Sunday is 0, so we use 7 for Sunday
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (dayOfWeek - 1));
    return startOfWeek;
  };

  // Get the start date of the active week (Monday)
  const activeWeekStart = getStartOfWeek(activeDate);
  const thisWeekStart = getStartOfWeek(new Date());

  // Function to generate an array of dates for the current week (starting from Monday)
  const getWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Get dates for the active week
  const currentWeekDates = getWeekDates(activeWeekStart);
  const firstWeekDates = getWeekDates(thisWeekStart);

  // Function to check if two arrays of dates have any dates in common
  const haveCommonDates = (arr1, arr2) => {
    return arr1.some((date1) =>
      arr2.some((date2) => date1.toDateString() === date2.toDateString())
    );
  };

  // Check if currentWeekDates and firstWeekDates have any common dates
  const checkThisWeekDates = haveCommonDates(currentWeekDates, firstWeekDates);

  // Handle previous week
  const handlePrevWeek = () => {
    const newDate = new Date(activeWeekStart);
    newDate.setDate(activeWeekStart.getDate() - 7);

    // Handle to limit showing the prev week up to the current week
    const currentWeek = new Date();
    currentWeek.setDate(currentWeek.getDate() - 7);
    if (newDate >= currentWeek) {
      setActiveDate(newDate);
    }
  };

  // Handle next week
  const handleNextWeek = () => {
    const newDate = new Date(activeWeekStart);
    newDate.setDate(activeWeekStart.getDate() + 7);

    // Check to limit showing for 3 weeks ahead
    const threeWeeksFromNow = new Date();
    threeWeeksFromNow.setDate(threeWeeksFromNow.getDate() + 21);
    if (newDate < threeWeeksFromNow) {
      setActiveDate(newDate);
    }
  };

  const handleOpenModal = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  return (
    <>
      <div className="flex gap-4 items-center p-4 justify-center">
      <h3 className="font-semibold">
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
      {/* Club Selection Dropdown */}
      <div className="dropdown">
          <select
            value={selectedClub ? selectedClub.id : ""}
            onChange={(e) => {
              const selectedClubId = parseInt(e.target.value, 10);
              const foundClub = clubs.find(
                (club) => club.id === selectedClubId
              );
              setSelectedClub(foundClub);
            }}
            className="select select-bordered w-full max-w-xs"
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
      </div>

      <div className="container py-2 mx-auto">
        {/* Timetable Date Header */}
        <div className="w-full bg-base-200 p-4 rounded-lg mb-4 flex justify-between items-center relative">
          <button
            onClick={handlePrevWeek}
            className="flex-2"
            disabled={checkThisWeekDates}
          >
            <IoIosArrowBack
              className={`h-8 w-8 ${checkThisWeekDates ? "text-gray-300" : ""
                }`}
            />
          </button>

          {/* Week View (Always show 7 days) */}
          <div className="flex gap-2 flex-1 px-4">
            {currentWeekDates.map((day, index) => {
              // Highlight today's date
              const isToday = day.toDateString() === new Date().toDateString();

              // Check if the day is in the past
              const isPastDay = day < new Date().setHours(0, 0, 0, 0);
              return (
                <div
                  key={index}
                  className={`w-full text-center cursor-pointer p-2 rounded-lg ${
                    isToday ? "bg-info text-white" : "bg-base-100"
                  } ${isPastDay ? "text-gray-300" : ""}`}
                >
                  <p className="text-lg font-semibold">
                    {day.toLocaleDateString("en-AU", { weekday: "short" })}
                  </p>
                  <p className="text-lg">
                    {day.toLocaleDateString("en-AU", { day: "numeric" })}
                  </p>
                </div>
              );
            })}
          </div>

          <button onClick={handleNextWeek} className="flex-2">
            <IoIosArrowForward className="h-8 w-8" />
          </button>
        </div>


        {/* Class Cards */}
        <div className="grid grid-cols-7 gap-2 mx-auto px-16">
          {selectedClub && ["Morning", "Afternoon", "Evening"].map((timeOfDay) => (
            <React.Fragment key={timeOfDay}>
              <div className="col-span-full bg-gray-200 p-2 text-center font-semibold">
                {timeOfDay} Class
              </div>
              {currentWeekDates.map((day) => {
                // Format the date to match your classData format
                const formattedDay = day
                  .toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })
                  .replace(/\//g, "-");

                // Filter classes for the current day and time of the day and the selected club
                const dayClasses = classData.filter((classItem) => {
                  const classHour = parseInt(
                    classItem.time.split(":")[0],
                    10
                  );
                  return (
                    classItem.date === formattedDay &&
                     classItem.location === selectedClub.location &&
                    ((timeOfDay === "Morning" && classHour < 12) ||
                      (timeOfDay === "Afternoon" &&
                        classHour >= 12 &&
                        classHour < 17) ||
                      (timeOfDay === "Evening" && classHour >= 17))
                  );
                });

                // Check if the day is in the past
                const isPastDay = day < new Date().setHours(0, 0, 0, 0);

                return (
                  <div key={day.toISOString()} className="flex flex-col gap-4">
                    {dayClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className={`card bg-base-100 shadow-xl p-3 my-2 ${
                          isPastDay
                            ? "bg-gray-100 text-gray-400"
                            : "bg-base-100"
                        }`}
                      >
                        <h3 className="text-xs font-bold">
                          {classItem.class}
                        </h3>
                        <hr className="my-1" />
                        <p className="text-xs font-semibold">
                          {classItem.time}
                        </p>
                        <p className="text-xs">{classItem.duration} Minutes</p>
                        <p className="text-xs">{classItem.location}</p>
                        <hr className="border my-2" />
                        <button
                          className="flex text-xs p-0 text-info "
                          disabled={isPastDay}
                          onClick={() => handleOpenModal(classItem)}
                        >
                          <PiDotsThreeCircleVertical className="h-4 w-4 mr-2 hidden lg:flex" />
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
           {!selectedClub && (
            <div className="col-span-full text-center py-4">
              <p>Select a club to view classes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div className="modal modal-open">
          <div className="modal-box">
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
            <p className="py-2">
              <span className="font-semibold">Availability:</span>{" "}
              {selectedClass.booked}/{selectedClass.capacity}
            </p>
            <hr />
            <div className="modal-action">
              <button
                className="button-secondary-style"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button className="button-main-style">Book Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
