import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import EventList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import EventForm from "./pages/EventForm";
import MyRegistrations from "./pages/MyRegistrations";

function App() {
  const [refreshEvents, setRefreshEvents] = useState(0);

  const handleEventCreated = () => {
    setRefreshEvents((prev) => prev + 1);
  };

  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<EventList key={refreshEvents} />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/create-event" element={<EventForm onEventCreated={handleEventCreated} />} />
          <Route path="/edit-event/:id" element={<EventForm onEventCreated={handleEventCreated} />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
