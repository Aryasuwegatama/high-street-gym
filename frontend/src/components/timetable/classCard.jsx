import React from "react";
import { PiDotsThreeCircleVertical } from "react-icons/pi";

export default function ClassCard({ day, classData, handleOpenModal, currentWeekDates }) {
  // Format the date to match your classData format
  const formattedDay = day
    .toLocaleDateString("en-AU", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    .replace(/\//g, "-");

  // Filter classes for the current day
  const dayClasses = classData.filter(
    (classItem) => classItem.date === formattedDay
  );

  // Check if the day is in the past
  const isPastDay = day < new Date().setHours(0, 0, 0, 0);

  return (
    <>
      <div className="col-span-full bg-gray-200 p-2 text-center font-semibold">
        Morning Class
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

        // Filter classes for the current day
        const dayClasses = classData.filter(
          (classItem) => classItem.date === formattedDay
        );

        // Check if the day is in the past
        const isPastDay = day < new Date().setHours(0, 0, 0, 0);

        return (
          <>
            <div key={day.toISOString()} className="flex flex-col gap-4">
              {dayClasses
                .filter(
                  (classItem) => parseInt(classItem.time.split(":")[0], 10) < 12
                )
                .map((classItem) => (
                  <div
                    key={classItem.id}
                    className={`card bg-base-100 shadow-xl p-3 my-2 ${
                      isPastDay ? "bg-gray-100 text-gray-400" : "bg-base-100"
                    }`}
                  >
                    <h3 className="text-xs font-bold">{classItem.class}</h3>
                    <hr className="my-1" />
                    <p className="text-xs font-semibold">{classItem.time}</p>
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
          </>
        );
      })}
      <div className="col-span-full bg-gray-200 p-2 text-center font-semibold">
        Afternoon Class
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

        // Filter classes for the current day
        const dayClasses = classData.filter(
          (classItem) => classItem.date === formattedDay
        );

        // Check if the day is in the past
        const isPastDay = day < new Date().setHours(0, 0, 0, 0);

        return (
          <>
            <div key={day.toISOString()} className="flex flex-col gap-4">
              {dayClasses
                .filter(
                  (classItem) =>
                    parseInt(classItem.time.split(":")[0], 10) >= 12 &&
                    parseInt(classItem.time.split(":")[0], 10) < 17
                )
                .map((classItem) => (
                  <div
                    key={classItem.id}
                    className={`card bg-base-100 shadow-xl p-3 my-2 ${
                      isPastDay ? "bg-gray-100 text-gray-400" : "bg-base-100"
                    }`}
                  >
                    <h3 className="text-xs font-bold">{classItem.class}</h3>
                    <hr className="my-1" />
                    <p className="text-xs font-semibold">{classItem.time}</p>
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
          </>
        );
      })}
      <div className="col-span-full bg-gray-200 p-2 text-center font-semibold">
        Evening Class
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

        // Filter classes for the current day
        const dayClasses = classData.filter(
          (classItem) => classItem.date === formattedDay
        );

        // Check if the day is in the past
        const isPastDay = day < new Date().setHours(0, 0, 0, 0);

        return (
          <>
            <div key={day.toISOString()} className="flex flex-col gap-4">
              {dayClasses
                .filter(
                  (classItem) =>
                    parseInt(classItem.time.split(":")[0], 10) >= 17
                )
                .map((classItem) => (
                  <div
                    key={classItem.id}
                    className={`card bg-base-100 shadow-xl p-3 my-2 ${
                      isPastDay ? "bg-gray-100 text-gray-400" : "bg-base-100"
                    }`}
                  >
                    <h3 className="text-xs font-bold">{classItem.class}</h3>
                    <hr className="my-1" />
                    <p className="text-xs font-semibold">{classItem.time}</p>
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
          </>
        );
      })}
    </>
  );
}
