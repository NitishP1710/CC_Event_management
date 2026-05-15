import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventAPI, registrationAPI } from "../api/eventAPI";
import RegistrationForm from "../components/RegistrationForm";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    fetchRegistrations();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await eventAPI.getById(id);
      setEvent(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch event details");
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await registrationAPI.getByEvent(id);
      setRegistrations(response.data.data);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await eventAPI.delete(id);
        alert("Event deleted successfully");
        navigate("/");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete event");
      }
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegisterForm(false);
    fetchEventDetails();
    fetchRegistrations();
  };

  if (loading)
    return (
      <div className="card" style={{ textAlign: "center", padding: "60px" }}>
        <div className="loading"></div>
      </div>
    );

  if (!event)
    return (
      <div className="alert alert-danger">
        Event not found. <a href="/">Go back to events</a>
      </div>
    );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const availableSeats = event.capacity - event.registeredCount;

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
        ← Back to Events
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <img src={event.image} alt={event.title} style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
          <div>
            <h1 style={{ marginBottom: "10px" }}>{event.title}</h1>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <span className="event-category">{event.category}</span>
              <span style={{ padding: "5px 10px", background: "#e7f3ff", borderRadius: "4px", color: "#0066cc" }}>Status: {event.status}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-secondary" onClick={() => navigate(`/edit-event/${id}`)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #667eea" }}>
            <strong>📅 Date & Time</strong>
            <p>{formatDate(event.date)} at {event.time}</p>
          </div>
          <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #667eea" }}>
            <strong>📍 Location</strong>
            <p>{event.location}</p>
          </div>
          <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #667eea" }}>
            <strong>👥 Capacity</strong>
            <p>{event.registeredCount} / {event.capacity} Registered</p>
          </div>
          <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #667eea" }}>
            <strong>🎫 Available</strong>
            <p style={{ color: availableSeats > 0 ? "#28a745" : "#dc3545" }}>
              {availableSeats > 0 ? `${availableSeats} seats` : "Event Full"}
            </p>
          </div>
        </div>

        <div className="capacity-bar" style={{ marginBottom: "20px" }}>
          <div className="capacity-fill" style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}></div>
        </div>

        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h3>📝 Description</h3>
          <p>{event.description}</p>
        </div>

        {availableSeats > 0 && !showRegisterForm && (
          <button className="btn btn-success" onClick={() => setShowRegisterForm(true)} style={{ width: "100%", marginBottom: "20px" }}>
            🎫 Register for This Event
          </button>
        )}

        {showRegisterForm && (
          <RegistrationForm
            eventId={id}
            onSuccess={handleRegistrationSuccess}
            onCancel={() => setShowRegisterForm(false)}
          />
        )}
      </div>

      {registrations.length > 0 && (
        <div className="card">
          <div className="card-header">Event Registrations ({registrations.length})</div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Tickets</th>
                <th>Status</th>
                <th>Registered On</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg._id}>
                  <td>{reg.name}</td>
                  <td>{reg.email}</td>
                  <td>{reg.phone}</td>
                  <td>{reg.numberOfTickets}</td>
                  <td>
                    <span style={{ padding: "4px 8px", background: "#e7f3ff", borderRadius: "4px", color: "#0066cc" }}>
                      {reg.status}
                    </span>
                  </td>
                  <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EventDetail;
