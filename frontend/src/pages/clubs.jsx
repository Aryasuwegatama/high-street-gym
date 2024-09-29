import React from "react";
import { clubData } from "../club-testing";

export default function Clubs() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Clubs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubData.map((club) => (
          <div key={club.id} className="card bg-base-100 shadow-lg">
            <figure>
              <img
                src={club.image}
                alt={club.name}
                className="h-64 w-full object-cover"
              />{" "}
              {/* Add club image */}
            </figure>
            <div className="card-body">
              <h3 className="text-xl font-bold">{club.location}</h3>
              <p className="font-light">{club.address}</p>
              <p>{club.phone}</p>
              <p>{club.email}</p>
              <div className="collapse collapse-arrow border-none bg-gray-200">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">
                  Facilities:
                </div>
                <div className="collapse-content">
                  <ul className="list-disc pl-4 font-light">
                    {club.facilities.map((facility, i) => (
                      <li key={i}>{facility}</li>
                    ))}
                  </ul>
                </div>
              </div>


              <div className="card-actions justify-end mt-4">
                <button className="btn button-main-style text-sm">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
