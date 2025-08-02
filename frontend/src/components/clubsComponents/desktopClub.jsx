import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import { getAllClubs } from "../../api/clubs";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Create a custom icon
const clubIcon = new L.Icon({
  iconUrl: "/logo-black.png",
  iconSize: [35, 25],
  iconAnchor: [16, 32],
});

export default function DesktopClubs() {
  const navigate = useNavigate();
  const { authenticatedUser, authToken } = useAuth();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubData, setClubData] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubs = await getAllClubs(authToken);
        setClubData(clubs.clubs);
        if (clubs.clubs.length > 0) {
          const lastClub = clubs.clubs[clubs.clubs.length - 1];
          if (lastClub.club_latitude && lastClub.club_longitude) {
            mapRef.current.leafletElement.setView(
              [lastClub.club_latitude, lastClub.club_longitude],
              14
            );
          }
        }
        setMapLoaded(true);
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      }
    };

    fetchClubs();
  }, [authToken]);

  console.log(clubData);

  const openModal = (club) => {
    setSelectedClub(club);
  };

  const closeModal = () => {
    setSelectedClub(null);
  };

  return (
    <>
      <div className="container mx-auto p-4 ">
        {authenticatedUser.user.user_role === "admin" && (
          <div>
            <button
              className="btn shadow"
              onClick={() => navigate("/manage-clubs")}
            >
              Manage Clubs
            </button>
            <hr className="my-4" />
          </div>
        )}
        <h2 className="text-3xl font-bold mb-6 text-center">OUR CLUBS</h2>

        {/* Conditionally render content based on mapLoaded */}
        {mapLoaded == null ? (
          // Skeleton loading
          <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 h-full">
              <div className="skeleton h-full"></div>
            </div>
            <div className="sm:col-span-1 space-y-4 shadow-xl p-4 rounded">
              <div className="skeleton h-8 w-3/5"></div>
              <div className="skeleton h-20 w-full"></div>
              <div className="skeleton h-20 w-full"></div>
              <div className="skeleton h-20 w-full"></div>
              <div className="skeleton h-20 w-full"></div>
              <div className="skeleton h-20 w-full"></div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Map Container */}
            <div className="sm:col-span-2 h-full">
              <MapContainer
                center={[-27.445528, 152.992028]}
                zoom={11}
                scrollWheelZoom={false}
                className="h-full w-full text-gray-200 z-10"
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Array.isArray(clubData) &&
                  clubData.map(
                    (club) =>
                      club.club_latitude &&
                      club.club_longitude && (
                        <Marker
                          key={club.club_id}
                          position={[club.club_latitude, club.club_longitude]}
                          icon={clubIcon}
                        >
                          <Popup>
                            {/* Detailed Popup Content */}
                            <div className="flex flex-col gap-1">
                              <h3 className="font-bold text-xl">
                                {club.club_name}
                              </h3>
                              <p className="">{club.club_address}</p>
                              <hr className="border my-4" />
                              <p className="flex items-center gap-1 font-semibold">
                                <HiOutlinePhone />
                                {club.club_phone}
                              </p>
                              <p className="flex items-center gap-1 font-semibold">
                                <HiOutlineMail />
                                {club.club_email}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      )
                  )}
              </MapContainer>
            </div>

            {/* Club List */}
            <div className="sm:col-span-1 space-y-4 shadow-xl p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">Club Locations</h3>
              {clubData.map((club) => (
                <div
                  key={club.club_id}
                  className="flex bg-base-200 p-4 rounded-lg"
                  onClick={() => openModal(club)}
                >
                  <div className="flex flex-wrap px-1">
                    <h4 className="font-semibold">{club.club_name}</h4>
                    <p className="text-sm font-light">{club.club_address}</p>
                  </div>
                  <div className="flex items-center">
                    <BsThreeDotsVertical className="h-6 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Club Details Modal */}
        {selectedClub && (
          <div className="modal modal-open">
            <div className="modal-box">
              <button
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xl">{selectedClub.club_name}</h3>
                <p className="">{selectedClub.club_address}</p>
                <hr className="border my-4" />
                <p className="flex items-center gap-1 font-semibold">
                  <HiOutlinePhone />
                  {selectedClub.club_phone}
                </p>
                <p className="flex items-center gap-1 font-semibold">
                  <HiOutlineMail />
                  {selectedClub.club_email}
                </p>
                <hr className="border my-2 w-1/5" />
                <p className="font-semibold">Facilities:</p>
                <ul className="pl-4">
                  {selectedClub.club_facilities.map((facility, i) => (
                    <li className="list-disc" key={i}>
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
