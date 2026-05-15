import React from "react";
import { Link } from "react-router-dom";

function EventCard({ event }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const capacityPercentage = (event.registeredCount / event.capacity) * 100;
  const availableSeats = event.capacity - event.registeredCount;

  return (
    <div className="event-card">
      <img src={event.image} alt={event.title} className="event-image" />
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-category">{event.category}</div>
        <div className="event-meta">
          <span>📅 {formatDate(event.date)} at {event.time}</span>
          <span>📍 {event.location}</span>
          <span>🏷️ Status: {event.status}</span>
        </div>
        <div className="event-capacity">
          <small>{event.registeredCount} / {event.capacity} Registered</small>
        </div>
        <div className="capacity-bar">
          <div
            className="capacity-fill"
            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
          ></div>
        </div>
        <small style={{ color: availableSeats > 0 ? "#28a745" : "#dc3545" }}>
          {availableSeats > 0 ? `${availableSeats} seats available` : "Event Full"}
        </small>
        <div className="event-actions">
          <Link to={`/event/${event._id}`} className="btn btn-primary">
            View Details
          </Link>
          <Link to={`/edit-event/${event._id}`} className="btn btn-secondary">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
