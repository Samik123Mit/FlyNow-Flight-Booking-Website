import Navbar from "../components/Navbar";
import Nav2 from "../components/Nav2";
import Footer from "../components/Footer";
import MyFlightCard from "../components/MyFlightCard";
import Loading from "../components/Loading";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../authContext";

// backend base url
const API_BASE = process.env.REACT_APP_BACKEND_URL;

function MyFlights() {
  const [myflights, setMyFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/getbookedflights`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch flights");
        return;
      }

      setMyFlights(data.flights || []);
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <div className={isLoading ? "loading" : "loaded"}>
      <Loading isLoading={isLoading} />
      <div className="content_">
        <Navbar />
        <Nav2>My Flights</Nav2>

        <div className="bg-slate-100 pt-4 pb-4">
          {!isAuthenticated ? (
            <div className="text-4xl text-center">
              Login first to view your flights.
              <br />
              Click{" "}
              <a className="underline" href="/login">
                here
              </a>{" "}
              to login.
            </div>
          ) : myflights.length === 0 ? (
            <div className="text-xl text-center">
              No flights booked yet.
            </div>
          ) : (
            <div>
              {myflights.map((flightData) => (
                <MyFlightCard
                  key={flightData._id}
                  flightData={flightData}
                />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default MyFlights;
