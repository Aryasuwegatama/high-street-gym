import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllClubs } from "../../api/clubs";

const clubIcon = new L.Icon({
  iconUrl: "/logo-black.png",
  iconSize: [35, 25],
  iconAnchor: [16, 32],
});

export default function MobileClubs() {
  const navigate = useNavigate();
  const { authenticatedUser, authToken } = useAuth();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewMode, setViewMode] = useState("map");
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubData, setClubData] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
  }, []);

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
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      }
    };

    fetchClubs();
  }, [authToken]);

  const flyToClub = (latitude, longitude) => {
    if (mapRef.current) {
      const map = mapRef.current.leafletElement;
      map.flyTo([latitude, longitude], 14);
    }
  };

  const openModal = (club) => {
    setSelectedClub(club);
  };

  const closeModal = () => {
    setSelectedClub(null);
  };

  return (
    <>
      <div className="container mx-auto p-4 relative">
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
        <h2 className="text-3xl font-bold mb-6 text-center">Our Clubs</h2>
        {/* Navigation Buttons */}
        <div className="flex justify-center mb-4 join">
          <button
            className={`btn join-item ${
              viewMode === "map" ? "btn-active bg-info text-base-100" : ""
            }`}
            onClick={() => setViewMode("map")}
          >
            Show Map
          </button>
          <button
            className={`btn join-item ${
              viewMode === "list"
                ? "btn-active bg-info text-base-100 bg-info text-base-100"
                : ""
            }`}
            onClick={() => setViewMode("list")}
          >
            Club List
          </button>
        </div>

        {mapLoaded ? (
          <>
            {/* Map Container */}
            {viewMode === "map" && (
              <div className="h-screen">
                <MapContainer
                  center={[-27.445528, 152.992028]}
                  zoom={11}
                  scrollWheelZoom={false}
                  className="h-4/5 w-full z-10"
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
                              <h3 className="font-semibold">
                                HSG - {club.club_name}
                              </h3>
                              <p>{club.club_address}</p>
                            </Popup>
                          </Marker>
                        )
                    )}
                </MapContainer>
              </div>
            )}

            {/* Club List */}
            {viewMode === "list" && (
              <div className=" w-full h-full bg-base-100 z-20 p-4 mb-20">
                {clubData.map((club) => (
                  <div
                    key={club.club_id}
                    className="flex justify-between bg-base-200 p-4 rounded-lg mb-2 cursor-pointer"
                    onClick={() => {
                      openModal(club);
                    }}
                  >
                    <div className="flex flex-wrap px-1">
                      <h4 className="font-semibold">{club.club_name}</h4>
                      <p className="text-sm">{club.club_address}</p>
                    </div>
                    <div className="flex items-center">
                      <BsThreeDotsVertical className="h-6 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="h-screen w-full">
            <div className="skeleton h-4/5 -w-full"></div>
          </div>
        )}
        {/* Club Details Modal */}
        {selectedClub && (
          <div className="modal modal-open">
            <div className="modal-box">
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
              <hr className="border my-4" />
              <div className="modal-action">
                <button
                  onClick={closeModal}
                  className="button-secondary-style text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    flyToClub(
                      selectedClub.club_latitude,
                      selectedClub.club_longitude
                    );
                    setViewMode("map");
                    closeModal();
                  }}
                  className="button-main-style text-sm"
                >
                  Show on Map
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
