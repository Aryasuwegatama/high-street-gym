import React from "react";
import LoadingSpinner from "../common/LoadingSpinner";

export default function ClassTable({
  classes,
  loading,
  handleEditClick,
  handleDeleteClick,
  errorMessage,
}) {
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-AU", options);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : errorMessage ? (
        <div className="text-center text-red-500">{errorMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full hidden md:table">
            <thead>
              <tr>
                <th className="px-4 py-2">Class ID</th>
                <th className="px-4 py-2">Class Activity</th>
                <th className="px-4 py-2">Club</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem) => (
                <tr key={classItem.class_id} className="text-center">
                  <td className="border px-4 py-2">{classItem.class_id}</td>
                  <td className="border px-4 py-2">
                    {classItem.activity_name}
                  </td>
                  <td className="border px-4 py-2">{classItem.club_name}</td>
                  <td className="border px-4 py-2">
                    {formatDate(classItem.class_date)}
                  </td>
                  <td className="border px-4 py-2">{classItem.class_time}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="button-edit-style px-4 mr-2"
                      onClick={() => handleEditClick(classItem)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="button-delete-style px-4"
                      onClick={() => handleDeleteClick(classItem.class_id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="block md:hidden">
            <div className="font-semibold text-center py-2">Class Details</div>
            <div className="flex flex-col mx-auto gap-2">
              {classes.map((classItem) => (
                <div
                  key={classItem.class_id}
                  className="card bg-base-100 shadow-xl p-3"
                >
                  <div className="text-sm">
                    <div className="flex">
                      <h3 className="text-sm font-bold">
                        {classItem.activity_name}
                      </h3>
                      <h3 className="mx-2 text-sm font-bold">
                        {" "}
                        | {classItem.club_name} |{" "}
                      </h3>
                      <p className="font-bold">
                        Class ID: {classItem.class_id}
                      </p>
                    </div>
                    <hr className="my-1" />
                    <div className="flex items-center">
                      <p className="text-lg font-semibold">
                        {classItem.class_time}
                      </p>
                      <p className="text-sm ml-4">
                        {formatDate(classItem.class_date)}
                      </p>
                    </div>
                  </div>
                  <hr className="border my-4" />

                  <div className="flex justify-end mb-2">
                    <div className="flex space-x-2">
                      <button
                        className="button-edit-style px-4"
                        onClick={() => handleEditClick(classItem)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="button-delete-style px-4"
                        onClick={() => handleDeleteClick(classItem.class_id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
