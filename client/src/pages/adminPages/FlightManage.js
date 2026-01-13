import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import "../../CSS/FlightManagement.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

// backend base url
const API_BASE = process.env.REACT_APP_BACKEND_URL;

const FlightManage = () => {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFlight, setEditingFlight] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAirline, setFilterAirline] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortKey, setSortKey] = useState("");
  const navigate = useNavigate();

  const fetchFlights = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/admin/getallflights`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch flights");
        return;
      }

      setFlights(data.flights || []);
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/deleteflight/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to delete flight");
        return;
      }

      toast.success("Flight deleted successfully");
      setFlights(data.flights || []);
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error(error);
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
  };

  const handleCancelEdit = () => {
    setEditingFlight(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/updateFlight/${editingFlight._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editingFlight),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to update flight");
        return;
      }

      toast.success("Flight updated successfully");
      setEditingFlight(null);
      fetchFlights();
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingFlight((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") setFilterCategory(value);
    if (name === "airline") setFilterAirline(value);
    if (name === "date") setFilterDate(value);
  };

  const handleSortChange = (e) => {
    setSortKey(e.target.value);
  };

  const filteredFlights = flights.filter(
    (flight) =>
      (filterCategory ? flight.category === filterCategory : true) &&
      (filterAirline
        ? flight.airline
            .toLowerCase()
            .includes(filterAirline.toLowerCase())
        : true) &&
      (filterDate ? flight.date.split("T")[0] === filterDate : true)
  );

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortKey === "date") return new Date(a.date) - new Date(b.date);
    if (sortKey === "airline") return a.airline.localeCompare(b.airline);
    if (sortKey === "flightNo") return a.flightNo.localeCompare(b.flightNo);
    if (sortKey === "seats") return a.totalSeats - b.totalSeats;
    return 0;
  });

  return (
    <div className={isLoading ? "loading" : "loaded"}>
      <Loading isLoading={isLoading} />
      <div className="content_">
        <Layout>
          <div className="box-FM">
            <h2>Manage Flights</h2>

            <div className="filter-section">
              <div>
                <label>Category:</label>
                <select name="category" value={filterCategory} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>

              <div>
                <label>Airline:</label>
                <input
                  name="airline"
                  value={filterAirline}
                  onChange={handleFilterChange}
                  placeholder="Enter airline"
                />
              </div>

              <div>
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={filterDate}
                  onChange={handleFilterChange}
                />
              </div>

              <div>
                <label>Sort by:</label>
                <select value={sortKey} onChange={handleSortChange}>
                  <option value="">None</option>
                  <option value="date">Date</option>
                  <option value="airline">Airline</option>
                  <option value="flightNo">Flight No</option>
                  <option value="seats">Seats</option>
                </select>
              </div>
            </div>

            {editingFlight ? (
              <div className="modal-FM">
                <div className="modal-content-FM">
                  <form onSubmit={handleUpdate}>
                    <h3>Edit Flight</h3>

                    <input name="from" value={editingFlight.from} onChange={handleChange} required />
                    <input name="to" value={editingFlight.to} onChange={handleChange} required />
                    <input name="airline" value={editingFlight.airline} onChange={handleChange} required />
                    <input name="flightNo" value={editingFlight.flightNo} onChange={handleChange} required />
                    <input type="number" name="totalSeats" value={editingFlight.totalSeats} onChange={handleChange} required />

                    <button type="submit">Update</button>
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                  </form>
                </div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Airline</th>
                    <th>Flight No</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Category</th>
                    <th>Seats</th>
                    <th>Date</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFlights.map((flight) => (
                    <tr key={flight._id}>
                      <td>{flight.airline}</td>
                      <td>{flight.flightNo}</td>
                      <td>{flight.from}</td>
                      <td>{flight.to}</td>
                      <td>{flight.category}</td>
                      <td>{flight.totalSeats}</td>
                      <td>{flight.date.split("T")[0]}</td>
                      <td>{flight.departureTime}</td>
                      <td>{flight.arrivalTime}</td>
                      <td>
                        <button onClick={() => handleEdit(flight)}>Edit</button>
                        <button onClick={() => handleDelete(flight._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default FlightManage;
