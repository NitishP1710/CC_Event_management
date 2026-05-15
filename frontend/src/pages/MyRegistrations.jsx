import React, { useState } from "react";
import { registrationAPI } from "../api/eventAPI";

function MyRegistrations() {
  const [email, setEmail] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await registrationAPI.getByUserEmail(email);
      setRegistrations(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch registrations");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId) => {
    if (window.confirm("Are you sure you want to cancel this registration?")) {
      try {
        await registrationAPI.cancel(registrationId);
        setRegistrations(registrations.filter((reg) => reg._id !== registrationId));
        alert("Registration cancelled successfully");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to cancel registration");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">My Event Registrations</div>

        <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
          <div className="form-group">
            <label htmlFor="email">Enter your email to view registrations</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {searched && !loading && (
        <>
          {registrations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-text">No registrations found</div>
              <p>You haven't registered for any events yet. <a href="/">Explore events</a></p>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">Your Registrations ({registrations.length})</div>
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Tickets</th>
                    <th>Status</th>
                    <th>Registered On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg._id}>
                      <td>
                        <strong>{reg.eventId?.title || "Event"}</strong>
                      </td>
                      <td>
                        {reg.eventId?.date && reg.eventId?.time ? (
                          <>
                            {formatDate(reg.eventId.date)} <br /> {reg.eventId.time}
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{reg.eventId?.location || "-"}</td>
                      <td>{reg.numberOfTickets}</td>
                      <td>
                        <span
                          style={{
                            padding: "4px 8px",
                            background:
                              reg.status === "Registered"
                                ? "#e7f3ff"
                                : reg.status === "Cancelled"
                                ? "#ffe7e7"
                                : "#e7ffe7",
                            borderRadius: "4px",
                            color:
                              reg.status === "Registered"
                                ? "#0066cc"
                                : reg.status === "Cancelled"
                                ? "#cc0000"
                                : "#00cc00",
                          }}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td>{formatDate(reg.createdAt)}</td>
                      <td>
                        {reg.status === "Registered" && (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleCancel(reg._id)}
                            style={{ padding: "5px 10px", fontSize: "0.85rem" }}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyRegistrations;
