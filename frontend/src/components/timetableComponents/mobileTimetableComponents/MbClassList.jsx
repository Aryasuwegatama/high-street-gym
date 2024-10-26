// ClassList.jsx
import ClassCard from "./MbCLassCard";

export default function ClassList({
  isLoading,
  error,
  selectedClub,
  handleOpenModal,
  morningClasses,
  afternoonClasses,
  eveningClasses,
}) {
  return (
    <>
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
                <ClassCard
                  classItem={classItem}
                  handleOpenModal={handleOpenModal}
                />
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
                <ClassCard
                  classItem={classItem}
                  handleOpenModal={handleOpenModal}
                />
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
                <ClassCard
                  classItem={classItem}
                  handleOpenModal={handleOpenModal}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <p className="text-lg text-center">Select a club to view classes</p>
      )}
    </>
  );
}
