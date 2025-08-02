import React from "react";
import ClassCard from "./ClassCard";
import LoadingSpinner from "../../common/LoadingSpinner";

export default function ClassList({
  isLoading,
  error,
  classData,
  selectedClub,
  handleOpenModal,
  currentWeekDates,
}) {
  return (
    <div className="grid grid-cols-7 gap-2 mx-auto px-16">
      {isLoading ? (
        <div className="col-span-full text-center py-4">
          <LoadingSpinner size="lg" color="info" />
        </div>
      ) : error ? (
        <div className="col-span-full text-center py-4">
          <div role="alert" className="alert alert-warning">
            <span>{error}</span>
          </div>
        </div>
      ) : selectedClub ? (
        classData.length > 0 ? (
          ["Morning", "Afternoon", "Evening"].map((timeOfDay) => (
            <React.Fragment key={timeOfDay}>
              <div className="col-span-full bg-gray-200 p-1 my-4 text-center font-semibold">
                {timeOfDay} Classes
              </div>
              {currentWeekDates.map((day) => {
                const formattedDay = day.toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                });
                const dayClasses = classData
                  .filter((classItem) => {
                    const classHour =
                      classItem.class_time &&
                      typeof classItem.class_time === "string"
                        ? parseInt(classItem.class_time.split(":")[0], 10)
                        : null;
                    return (
                      classItem.class_date === formattedDay &&
                      classItem.club_name === selectedClub.club_name &&
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
                    key={day.toISOString()}
                    day={day}
                    handleOpenModal={handleOpenModal}
                    dayClasses={dayClasses}
                    isPastDay={isPastDay}
                  />
                );
              })}
            </React.Fragment>
          ))
        ) : (
          <div className="col-span-full text-center py-4">
            <p>No classes found for this club.</p>
          </div>
        )
      ) : (
        <div className="col-span-full text-center py-4 mb-56">
          <p>Select a club to view classes.</p>
        </div>
      )}
    </div>
  );
}
