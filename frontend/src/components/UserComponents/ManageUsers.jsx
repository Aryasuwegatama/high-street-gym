import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/users";
import { getUserBookings, deleteAllUserBookings } from "../../api/bookings";
import {
  getAllTrainerActivities,
  deleteTrainerActivity,
} from "../../api/activities";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import AccessForbidden from "../common/AccessForbidden";
import UserCard from "./UserCard";
import TrainerCard from "./TrainerCard";
import RoleFilter from "./RoleFilter";
import ConfirmationModal from "./UserConfirmationModal";
import ResultModal from "./ResultModal";

export default function ManageUsers() {
  const { authenticatedUser, authToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [trainerActivities, setTrainerActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [deleting, setDeleting] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultType, setResultType] = useState("");
  const [userHasBookings, setUserHasBookings] = useState(false);
  const [selfDeleteAttempt, setSelfDeleteAttempt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticatedUser || authenticatedUser.user.user_role !== "admin") {
      setError(
        "Access forbidden. You do not have permission to view this page."
      );
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [usersResponse, activitiesResponse] = await Promise.all([
          getAllUsers(authToken),
          getAllTrainerActivities(authToken),
        ]);
        setUsers(usersResponse.users.sort((a, b) => b.user_id - a.user_id));
        setTrainerActivities(activitiesResponse.activities);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authenticatedUser, authToken, navigate]);

  const handleDelete = async (userId, userRole) => {
    if (authenticatedUser.user.user_id === userId) {
      setSelfDeleteAttempt(true);
      setModalMessage("You cannot delete your own account.");
      setShowConfirmationModal(true);
      return;
    }

    setDeleting(true);
    setModalMessage("Checking user bookings...");
    setShowConfirmationModal(true);

    try {
      if (userRole === "trainer") {
        const activities = trainerActivities.filter(
          (activity) => activity.user_id === userId
        );
        const message =
          activities.length === 0
            ? "This trainer has no assigned activities. Do you want to continue with the deletion?"
            : "This trainer has assigned activities. Deleting this trainer will unassign them from all activities and cannot be undone. Do you want to proceed?";

        setDeleting(false);
        setModalMessage(message);
        setUserIdToDelete(userId);
        setUserHasBookings(activities.length > 0);
      } else {
        const bookings = await getUserBookings(userId, authToken);
        const message =
          bookings.length === 0
            ? "This user has no bookings. Do you want to continue with the deletion?"
            : "This user has existing bookings. Deleting this user will remove all associated bookings and cannot be undone. Do you want to proceed?";

        setDeleting(false);
        setModalMessage(message);
        setUserIdToDelete(userId);
        setUserHasBookings(bookings.length > 0);
      }
    } catch (error) {
      if (error.message === "You don't have any bookings") {
        setDeleting(false);
        setModalMessage(
          "This user has no bookings. Do you want to continue with the deletion?"
        );
        setUserIdToDelete(userId);
        setUserHasBookings(false);
      } else {
        setDeleting(false);
        setModalMessage(
          "An error occurred while checking user bookings. Please try again later."
        );
        console.error("Failed to check user bookings", error);
      }
    }
  };

  const deleteUserWithBookings = async () => {
    try {
      await deleteAllUserBookings(userIdToDelete, authToken);
      await deleteUser(userIdToDelete, authToken);
      setUsers(users.filter((user) => user.user_id !== userIdToDelete));
      setShowConfirmationModal(false);
      setResultMessage(
        "User and all associated bookings deleted successfully."
      );
      setResultType("success");
      setShowResultModal(true);
    } catch (error) {
      setResultMessage("Failed to delete user and bookings.");
      setResultType("error");
      setShowResultModal(true);
      console.error("Failed to delete user and bookings", error);
    }
  };

  const deleteUserWithoutBookings = async () => {
    try {
      await deleteUser(userIdToDelete, authToken);
      setUsers(users.filter((user) => user.user_id !== userIdToDelete));
      setShowConfirmationModal(false);
      setResultMessage("User deleted successfully.");
      setResultType("success");
      setShowResultModal(true);
    } catch (error) {
      setResultMessage("Failed to delete user.");
      setResultType("error");
      setShowResultModal(true);
      console.error("Failed to delete user", error);
    }
  };

  const deleteTrainerWithActivities = async () => {
    try {
      const activities = trainerActivities.filter(
        (activity) => activity.user_id === userIdToDelete
      );
      for (const activity of activities) {
        await deleteTrainerActivity(
          userIdToDelete,
          activity.activity_id,
          authToken
        );
      }
      await deleteUser(userIdToDelete, authToken);
      setUsers(users.filter((user) => user.user_id !== userIdToDelete));
      setShowConfirmationModal(false);
      setResultMessage(
        "Trainer and all associated activities deleted successfully."
      );
      setResultType("success");
      setShowResultModal(true);
    } catch (error) {
      if (error.message === "No activities found for this trainer") {
        setDeleting(false);
        setModalMessage(
          "This trainer has no assigned activities. Do you want to continue with the deletion?"
        );
        setUserIdToDelete(userIdToDelete);
        setUserHasBookings(false);
      } else {
        setDeleting(false);
        setModalMessage(
          "An error occurred while checking trainer activities. Please try again later."
        );
        console.error("Failed to check trainer activities", error);
      }
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const filteredUsers =
    selectedRole === "all"
      ? users
      : users.filter((user) => user.user_role === selectedRole);

  if (loading) {
    return <LoadingSpinner size="lg" color="info" />;
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <AccessForbidden />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Users</h2>
      <RoleFilter
        selectedRole={selectedRole}
        handleRoleChange={handleRoleChange}
        navigate={navigate}
      />
      <hr className="border-gray-200 my-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredUsers.map((user) =>
          user.user_role === "trainer" ? (
            <TrainerCard
              key={user.user_id}
              user={user}
              navigate={navigate}
              handleDelete={handleDelete}
              activity={
                trainerActivities.find(
                  (activity) => activity.user_id === user.user_id
                ) || null
              }
            />
          ) : (
            <UserCard
              key={user.user_id}
              user={user}
              navigate={navigate}
              handleDelete={handleDelete}
            />
          )
        )}
      </div>

      <ConfirmationModal
        show={showConfirmationModal}
        message={modalMessage}
        deleting={deleting}
        selfDeleteAttempt={selfDeleteAttempt}
        setSelfDeleteAttempt={setSelfDeleteAttempt}
        userHasBookings={userHasBookings}
        deleteUserWithBookings={deleteUserWithBookings}
        deleteUserWithoutBookings={deleteUserWithoutBookings}
        deleteTrainerWithActivities={deleteTrainerWithActivities}
        closeModal={() => setShowConfirmationModal(false)}
        userRole={
          users.find((user) => user.user_id === userIdToDelete)?.user_role
        }
      />

      <ResultModal
        show={showResultModal}
        message={resultMessage}
        type={resultType}
        closeModal={() => setShowResultModal(false)}
      />
    </div>
  );
}
