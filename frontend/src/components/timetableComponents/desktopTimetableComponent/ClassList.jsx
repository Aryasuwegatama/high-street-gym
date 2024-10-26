import React from "react";
import ClassCard from "./ClassCard";

export default function ClassList({ isLoading, error, classData, selectedClub, handleOpenModal, currentWeekDates }) {


  return (
    <div className="grid grid-cols-7 gap-2 mx-auto px-16">
    {isLoading && (
      <div className="col-span-full text-center py-4">
        <span className="loading loading-spinner loading-lg text-info"></span>
      </div>
    )}
    {error && (
      <div className="col-span-full text-center py-4">
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    )}
    {selectedClub &&
      classData.length > 0 &&
      ["Morning", "Afternoon", "Evening"].map((timeOfDay) => (
        <React.Fragment key={timeOfDay}>
          <div className="col-span-full bg-gray-200 p-1 my-4 text-center font-semibold">
            {timeOfDay} Class
          </div>
          {currentWeekDates.map((day) => {
            // Format the date to match your classData format
            const formattedDay = day.toLocaleDateString("en-AU", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            });

            // console.log(formattedDay)

            // Filter classes for the current day and time of the day and the selected club
            const dayClasses = classData
              .filter((classItem) => {
                const classHour =
                  classItem.class_time &&
                  typeof classItem.class_time === "string"
                    ? parseInt(classItem.class_time.split(":")[0], 10)
                    : null;
                // console.log(classItem.class_date)

                return (
                  classItem.class_date == formattedDay &&
                  classItem.club_name === selectedClub.name &&
                  ((timeOfDay === "Morning" && classHour < 12) ||
                    (timeOfDay === "Afternoon" &&
                      classHour >= 12 &&
                      classHour < 17) ||
                    (timeOfDay === "Evening" && classHour >= 17))
                );
              })
              .sort((a, b) => {
                return a.class_time.localeCompare(b.class_time);
              });

            const isPastDay = day < new Date().setHours(0, 0, 0, 0);

            return (
              <ClassCard
              day={day}
              handleOpenModal={handleOpenModal}
              dayClasses={dayClasses}
              isPastDay={isPastDay}
              />
            );
          })}
        </React.Fragment>
      ))}
    {!selectedClub && (
      <div className="col-span-full text-center py-4 mb-56">
        <p>Select a club to view classes.</p>
      </div>
    )}
    {selectedClub && classData.length === 0 && (
      <div className="col-span-full text-center py-4">
        <p>No classes found for this club.</p>
      </div>
    )}
  </div>
  )
}
