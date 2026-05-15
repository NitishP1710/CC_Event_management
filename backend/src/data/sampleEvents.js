// Sample data for Event Management System
// This file contains sample events that can be used to seed the database

const sampleEvents = [
  {
    title: "React Advanced Concepts",
    description:
      "Deep dive into advanced React patterns including hooks, context API, performance optimization, and code splitting. Perfect for developers with intermediate React knowledge.",
    date: new Date("2024-06-20"),
    time: "10:00",
    location: "Tech Hub Downtown",
    capacity: 50,
    category: "Workshop",
    image: "https://via.placeholder.com/400x250?text=React+Workshop",
    status: "Upcoming",
  },
  {
    title: "Web Development Conference 2024",
    description:
      "Annual conference bringing together web developers, designers, and tech enthusiasts. Features keynote speeches, workshops, and networking sessions.",
    date: new Date("2024-07-10"),
    time: "09:00",
    location: "Convention Center",
    capacity: 500,
    category: "Conference",
    image: "https://via.placeholder.com/400x250?text=Web+Dev+Conference",
    status: "Upcoming",
  },
  {
    title: "Node.js Best Practices Seminar",
    description:
      "Learn best practices for building scalable Node.js applications. Topics include clustering, load balancing, security, and performance monitoring.",
    date: new Date("2024-06-25"),
    time: "14:00",
    location: "Startup Hub",
    capacity: 40,
    category: "Seminar",
    image: "https://via.placeholder.com/400x250?text=Node.js+Seminar",
    status: "Upcoming",
  },
  {
    title: "MongoDB and NoSQL Databases",
    description:
      "Introduction to NoSQL databases with a focus on MongoDB. Learn about document-oriented databases, indexing, aggregation pipeline, and best practices.",
    date: new Date("2024-06-28"),
    time: "11:00",
    location: "Tech Hub Downtown",
    capacity: 60,
    category: "Training",
    image: "https://via.placeholder.com/400x250?text=MongoDB+Training",
    status: "Upcoming",
  },
  {
    title: "Frontend Developers Meetup",
    description:
      "Monthly meetup for frontend developers to share experiences, discuss new technologies, and network with peers in the community.",
    date: new Date("2024-06-22"),
    time: "18:00",
    location: "Coffee & Code Cafe",
    capacity: 30,
    category: "Meetup",
    image: "https://via.placeholder.com/400x250?text=Frontend+Meetup",
    status: "Upcoming",
  },
  {
    title: "Full Stack MERN Development Bootcamp",
    description:
      "Intensive bootcamp covering MongoDB, Express, React, and Node.js. Build real-world projects and learn industry best practices.",
    date: new Date("2024-07-01"),
    time: "08:00",
    location: "Tech Academy",
    capacity: 25,
    category: "Training",
    image: "https://via.placeholder.com/400x250?text=MERN+Bootcamp",
    status: "Upcoming",
  },
  {
    title: "JavaScript ES6+ Features Workshop",
    description:
      "Explore modern JavaScript features including async/await, destructuring, spread operator, template literals, and more.",
    date: new Date("2024-06-30"),
    time: "10:00",
    location: "Code Academy",
    capacity: 45,
    category: "Workshop",
    image: "https://via.placeholder.com/400x250?text=JavaScript+ES6",
    status: "Upcoming",
  },
  {
    title: "DevOps and Docker Essentials",
    description:
      "Learn containerization with Docker and deployment strategies. Cover Docker basics, Docker Compose, orchestration, and CI/CD pipelines.",
    date: new Date("2024-07-05"),
    time: "13:00",
    location: "Tech Hub Downtown",
    capacity: 35,
    category: "Workshop",
    image: "https://via.placeholder.com/400x250?text=Docker+DevOps",
    status: "Upcoming",
  },
];

// To seed the database with this data, run:
// 1. Connect to MongoDB
// 2. Insert these documents into the events collection
// 3. Use this MongoDB command:
/*
db.events.insertMany([
  {
    title: "React Advanced Concepts",
    description: "Deep dive into advanced React patterns...",
    ...
  },
  ...
])
*/

// Or use this Node.js code in backend:
/*
import Event from "./src/models/Event.js";
import connectDB from "./src/config/db.js";

connectDB();
Event.insertMany(sampleEvents)
  .then(() => console.log("Sample data inserted"))
  .catch(err => console.log(err));
*/

export default sampleEvents;
