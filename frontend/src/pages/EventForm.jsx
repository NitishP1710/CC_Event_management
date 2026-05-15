import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventAPI } from "../api/eventAPI";

function EventForm({ onEventCreated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    category: "Workshop",
    image: "https://via.placeholder.com/300x200?text=Event+Image",
    status: "Upcoming",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchEventData();
    }
  }, [id, isEditMode]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getById(id);
      const event = response.data.data;

      const dateObj = new Date(event.date);
      const dateString = dateObj.toISOString().split("T")[0];

      setFormData({
        title: event.title,
        description: event.description,
        date: dateString,
        time: event.time,
        location: event.location,
        capacity: event.capacity,
        category: event.category,
        image: event.image,
        status: event.status,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditMode) {
        await eventAPI.update(id, formData);
      } else {
        await eventAPI.create(formData);
      }

      setSuccess(true);
      setTimeout(() => {
        onEventCreated();
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Workshop", "Conference", "Seminar", "Meetup", "Training", "Other"];
  const statuses = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
        ← Back to Events
      </button>

      <div className="card">
        <div className="card-header">{isEditMode ? "Edit Event" : "Create New Event"}</div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">✓ Event {isEditMode ? "updated" : "created"} successfully!</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
              maxLength="100"
            />
            <small>{formData.title.length}/100</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter event description"
              maxLength="500"
            />
            <small>{formData.description.length}/500</small>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label htmlFor="date">Event Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Event Time *</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter event location"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label htmlFor="capacity">Capacity (seats) *</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                placeholder="Enter event capacity"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {statuses.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.image && (
            <div className="form-group">
              <label>Image Preview</label>
              <img src={formData.image} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }} />
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button type="submit" className="btn btn-success" disabled={loading} style={{ flex: 1 }}>
              {loading ? "Saving..." : isEditMode ? "Update Event" : "Create Event"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/")} disabled={loading} style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
