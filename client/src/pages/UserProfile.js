import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../components/Loading";
import "../CSS/UserProfile.css";
import "../CSS/Loading.css";

// backend base url
const API_BASE = process.env.REACT_APP_BACKEND_URL;

function UserProfile() {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
  });

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/getuserdetails`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error occurred");
        return;
      }

      setUserData(data.user);
      setFormData({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        mobile: data.user.mobile || "",
        address: data.user.address || "",
      });
    } catch (error) {
      toast.error("Network error, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/updateuserdetails`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error occurred");
        return;
      }

      setUserData(data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Network error, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={isLoading ? "loading" : "loaded"}>
      <Loading isLoading={isLoading} />
      <div className="content_">
        <Navbar />

        {!isEditing ? (
          <div className="user-profile-container">
            <h2>User Profile</h2>

            <div className="user-info">
              <div className="user1">
                <div className="user2">First Name</div>
                <div className="user3">{userData.firstName}</div>
              </div>
              <hr />

              <div className="user1">
                <div className="user2">Last Name</div>
                <div className="user3">{userData.lastName}</div>
              </div>
              <hr />

              <div className="user1">
                <div className="user2">Mobile</div>
                <div className="user3">{userData.mobile}</div>
              </div>
              <hr />

              <div className="user1">
                <div className="user2">Address</div>
                <div className="user3">{userData.address}</div>
              </div>
              <hr />

              <div className="user1">
                <div className="user2">Username</div>
                <div className="user3">{userData.username}</div>
              </div>
              <hr />

              <div className="user1">
                <div className="user2">Email</div>
                <div className="user3">{userData.email}</div>
              </div>
            </div>

            <button
              className="inline text-white rounded text-l mt-6 font-bold p-2 sm:w-[8rem] transition duration-500 ease-in-out bg-blue-600 hover:bg-slate-300 hover:text-black"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <label>First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={changeHandler}
                required
              />

              <label>Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={changeHandler}
                required
              />

              <label>Mobile</label>
              <input
                name="mobile"
                value={formData.mobile}
                onChange={changeHandler}
                required
              />

              <label>Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={changeHandler}
                required
              />

              <button type="submit">Update</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
