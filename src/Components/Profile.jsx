import React from "react";
import "./Profile.css"; // Optional for additional styling

const Profile = () => {
  let { name, email, phone : mobile, gender } = localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data"))
    : {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        gender: "male",
      };

  // Since old data do not contain gender field, assign male gander to them.
  gender = gender?.toLowerCase() === "female" ? "female" : "male";
  const randomImageUrl =
  gender === "male"
    ? "https://randomuser.me/api/portraits/men/75.jpg"
    : "https://randomuser.me/api/portraits/women/75.jpg";

  return (
    <div className="profile-container container mt-5 d-flex justify-content-center">
      <div
        className="card shadow-lg"
        style={{ width: "22rem", borderRadius: "15px" }}
      >
        <div
          className="card-header bg-primary text-white text-center"
          style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
        >
          <h4>User Profile</h4>
        </div>
        <div className="card-body text-center">
          <img
            src={randomImageUrl}
            alt="Profile"
            className="rounded-circle mb-3"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              border: "3px solid #007bff",
            }}
          />
          <h5 className="card-title mb-1">{name}</h5>
          <p className="text-muted mb-3">
            {gender?.toLowerCase() === "female" ? "👩 Female" : "👨 Male"}
          </p>
          <div className="d-flex flex-column align-items-start px-3">
            <p className="mb-2">
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Mobile:</strong> {mobile}
            </p>
          </div>
        </div>
        <div className="card-footer text-center bg-light">
          <button className="btn btn-primary btn-sm">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
