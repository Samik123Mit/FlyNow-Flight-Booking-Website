import Layout from "./Layout";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../CSS/Feedback.css";
import Loading from "../../components/Loading";

// backend base url
const API_BASE = process.env.REACT_APP_BACKEND_URL;

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ date: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/feedback/getAllFeedback`,
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

      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredFeedbacks = sortedFeedbacks.filter((feedback) => {
    if (!filters.date) return true;
    const filterDate = new Date(filters.date).toDateString();
    const feedbackDate = new Date(feedback.date).toDateString();
    return filterDate === feedbackDate;
  });

  return (
    <div className={isLoading ? "loading" : "loaded"}>
      <Loading isLoading={isLoading} />
      <div className="content_">
        <Layout>
          <div className="box-feedback">
            <h2>Feedback</h2>

            <div className="filter-section-feedback">
              <label htmlFor="date">Filter by Date:</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>

            <div className="sort-section-feedback">
              <button onClick={() => handleSort("date")}>
                Sort by Date{" "}
                {sortConfig.key === "date" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </button>

              <button onClick={() => handleSort("user")}>
                Sort by User{" "}
                {sortConfig.key === "user" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </button>
            </div>

            <div className="feedback-list">
              {filteredFeedbacks.length === 0 ? (
                <p>No feedback found</p>
              ) : (
                filteredFeedbacks.map((feedback) => (
                  <div key={feedback._id} className="feedback-item">
                    <p className="user-feedback">{feedback.user}</p>
                    <p className="comment-feedback">
                      "{feedback.subject}"
                    </p>
                    <p className="date-feedback">
                      {new Date(feedback.date).toLocaleDateString()}
                    </p>
                    <p className="message-feedback">
                      {feedback.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default Feedback;
