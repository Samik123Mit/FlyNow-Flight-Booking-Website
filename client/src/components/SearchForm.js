import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

function SearchForm({ setViewFlightData }) {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    category: ""
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE}/api/searchFlight`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setViewFlightData(data.flights);
        navigate('/view_flights');
      } else {
        toast.error(data.message || "Error Occurred");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error, please try again later");
    }
  }

  async function viewAllFlights(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE}/api/searchAllFlights`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setViewFlightData(data.flights);
        navigate('/view_flights');
      } else {
        toast.error(data.message || "Error Occurred");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error, please try again later");
    }
  }

  return (
    <div className='bg-slate-100 pt-5 pb-5'>
      <div className="contact-container bg-white">
        <form onSubmit={submitHandler}>
          <div className='first1-line'>
            <input
              type="text"
              placeholder='From'
              name="from"
              onChange={changeHandler}
              value={formData.from}
              required
            />
            <input
              type="text"
              placeholder='To'
              name="to"
              onChange={changeHandler}
              value={formData.to}
              required
            />
          </div>

          <div className='second1-line'>
            <input
              type="date"
              name="date"
              onChange={changeHandler}
              value={formData.date}
              required
            />
            <select
              name="category"
              onChange={changeHandler}
              value={formData.category}
              required
            >
              <option value="">Category</option>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First">First Class</option>
            </select>
          </div>

          <div className="flex justify-around mt-4">
            <button type="submit" className="btn-primary">
              View Flights
            </button>
            <button onClick={viewAllFlights} className="btn-primary">
              View All Flights
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchForm;
