import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="container">
        <h1>🎉 Event Management System</h1>
        <nav>
          <Link to="/">All Events</Link>
          <Link to="/create-event">Create Event</Link>
          <Link to="/my-registrations">My Registrations</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
