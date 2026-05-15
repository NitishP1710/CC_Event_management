import React, { useState } from "react";
import { registrationAPI } from "../api/eventAPI";

function RegistrationForm({ eventId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfTickets: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfTickets" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registrationAPI.registerForEvent({
        eventId,
        ...formData,
      });
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", numberOfTickets: 1 });
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px", background: "#f9f9f9" }}>
      <div className="card-header" style={{ marginBottom: "20px" }}>Register for Event</div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">✓ Registration successful! Please check your email for confirmation.</div>}

      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="Enter your phone number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="numberOfTickets">Number of Tickets *</label>
        <input
          type="number"
          id="numberOfTickets"
          name="numberOfTickets"
          value={formData.numberOfTickets}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default RegistrationForm;
