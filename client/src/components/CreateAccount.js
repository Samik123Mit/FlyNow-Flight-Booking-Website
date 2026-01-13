import React, { useContext, useState } from 'react';
import '../CSS/FlightCard.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../authContext';
import route_plan from '../images/route-plan.png';
import icon_2 from '../images/icon-2.png';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

function FlightCard({ flightData, setBookFlightData }) {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const {
    flightNo,
    from,
    to,
    category,
    date,
    departureTime,
    duration,
    arrivalTime,
    price,
    aircraft,
    airline,
    stops
  } = flightData;

  const bookFlight = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Login first to book flight");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/canbook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ flightNo })
      });

      const data = await response.json();

      if (response.ok && data.canbook) {
        setBookFlightData(flightData);
        navigate('/book_flight');
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (err) {
      toast.error("Network error, please try again later");
      console.error(err);
    }
  };

  return (
    <div className="flight-card">
      <div className="flight-block">
        <div className="flight-area">
          <div className="airline-name">
            <img src={icon_2} alt="Airline" className="airline-logo" />
            <div>
              <h5>{airline}</h5>
              <h6>{aircraft}</h6>
            </div>
          </div>

          <div className="flight-detail">
            <div>
              <h5>{departureTime}</h5>
              <h5>{from}</h5>
            </div>

            <div className="from-to">
              <h6>{duration}</h6>
              <img src={route_plan} alt="Route" />
              <h6>{stops} Stop</h6>
            </div>

            <div>
              <h5>{arrivalTime}</h5>
              <h5>{to}</h5>
            </div>
          </div>

          <div className="flight-button">
            <h5>₹{price}</h5>
            <button onClick={bookFlight}>Book Now</button>
          </div>
        </div>

        <hr />

        <div className="flight-summary">
          <span>{date}</span>
          <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <SlArrowUp /> : <SlArrowDown />} Flight Detail
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="flight-detail-section">
          <h6>{category} | Flight {flightNo}</h6>
          <h6>{departureTime} → {arrivalTime}</h6>
          <h6>{duration}</h6>
        </div>
      )}
    </div>
  );
}

export default FlightCard;
