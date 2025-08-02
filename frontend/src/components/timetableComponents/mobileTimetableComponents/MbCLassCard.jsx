export default function ClassCard({ classItem, handleOpenModal }) {
  return (
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
          <p className="text-xl font-bold py-2">{classItem.class_time}</p>
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
  );
}
