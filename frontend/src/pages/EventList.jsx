import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import { eventAPI } from "../api/eventAPI";

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;

      if (filter === "upcoming") {
        response = await eventAPI.getUpcoming();
      } else {
        response = await eventAPI.getAll();
      }

      setEvents(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="card" style={{ textAlign: "center", padding: "60px" }}>
        <div className="loading"></div>
        <p>Loading events...</p>
      </div>
    );

  return (
    <div>
      <div className="card">
        <div className="card-header">Available Events</div>
        <div style={{ marginBottom: "20px" }}>
          <button
            className={`btn ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilter("all")}
          >
            All Events
          </button>
          <button
            className={`btn ${filter === "upcoming" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilter("upcoming")}
            style={{ marginLeft: "10px" }}
          >
            Upcoming Events
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-text">No events found</div>
          <p>Create your first event or check back later!</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventList;
