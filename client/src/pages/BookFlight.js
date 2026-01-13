import "../CSS/FlightCard.css";
import "../CSS/BookFlight.css";

import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import AuthContext from "../authContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import BookingDetails from "../components/BookingDetails";
import Nav2 from "../components/Nav2";
import Footer from "../components/Footer";

// backend base url
const API_BASE = process.env.REACT_APP_BACKEND_URL;

function BookFlight({ bookFlightData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { isAuthenticated, userName, email } = useContext(AuthContext);
  const navigate = useNavigate();
  const { flightNo } = bookFlightData;

  setTimeout(() => setIsLoading(false), 1500);

  const [passengers, setPassengers] = useState([
    {
      gender: "",
      firstName: "",
      lastName: "",
      email: "",
      nationality: "",
      phoneNumber: "",
      age: "",
      postalCode: "",
      passportNo: "",
    },
  ]);

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { ...passengers[0] }]);
    } else {
      toast.error("Maximum 6 passengers allowed");
    }
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updated = [...passengers];
    updated[index][name] = value;
    setPassengers(updated);
  };

  const deletePassenger = (index) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const bookFlight = async () => {
    if (!isAuthenticated) {
      toast.error("Login first to book flight");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);

      // get razorpay key
      const keyRes = await fetch(`${API_BASE}/api/payment/getkey`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { key } = await keyRes.json();

      // create order
      const orderRes = await fetch(`${API_BASE}/api/payment/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount: 500 }),
      });

      const { order } = await orderRes.json();

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "FlyNow",
        description: "Flight Booking",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch(
            `${API_BASE}/api/payment/paymentverification`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                response,
                flightNo,
              }),
            }
          );

          if (verifyRes.ok) {
            toast.success("Flight booked successfully");
            navigate("/my_flights");
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: userName,
          email: email,
        },
        theme: {
          color: "#121212",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      toast.error("Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={isLoading ? "loading" : "loaded"}>
      <Loading isLoading={isLoading} />
      <div className="content_">
        <Navbar />
        <Nav2>Flight Booking</Nav2>

        <div className="all-booking-info bg-slate-100">
          <BookingDetails flightData={bookFlightData} />

          <form onSubmit={handleConfirm}>
            {passengers.map((p, i) => (
              <input
                key={i}
                name="firstName"
                placeholder="First Name"
                value={p.firstName}
                onChange={(e) => handleChange(i, e)}
                required
              />
            ))}

            <button type="button" onClick={addPassenger}>
              Add Passenger
            </button>

            <button type="submit">Next</button>
          </form>

          {showConfirmDialog && (
            <div>
              <p>Confirm booking?</p>
              <button onClick={bookFlight}>Yes</button>
              <button onClick={() => setShowConfirmDialog(false)}>No</button>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default BookFlight;
