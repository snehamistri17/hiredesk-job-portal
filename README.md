# HireDesk - Job Portal

A job portal web app built with MEAN Stack. I made this project to learn full stack web development. It has four roles - Guest, Job Seeker, Recruiter and Admin, each with their own dashboard and access level.

## Tech Used

- Angular 17
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Bootstrap for styling

## Features

### Guest
- Browse and search job listings without login
- View job details
- Register as job seeker or recruiter

### Job Seeker
- Register and login
- Browse and search jobs
- Apply for jobs
- Track all applied jobs
- Manage and update profile

### Recruiter
- Register and login
- Post new job listings
- Edit and delete own job listings
- View list of applicants who applied
- Manage and update profile

### Admin
- Secure admin dashboard
- View and manage all users
- View and manage all job listings
- Approve or block recruiters
- Remove any user or listing
- Full control over the platform

## Folder Structure

hiredesk/
├── src/
│   ├── app/
│   │   ├── guest/
│   │   ├── job-seeker/
│   │   ├── recruiter/
│   │   ├── admin/
│   │   ├── components/
│   │   ├── services/
|   |   ├── guards/
│   │   └── models/
├── server/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── middleware/
├── .env.example
├── .gitignore
└── README.md

## Getting Started

### Requirements

- Node.js
- Angular CLI
- MongoDB

### Backend Setup

cd server
npm install
npm start

### Frontend Setup

npm install
ng serve

Open http://localhost:4200 in your browser

## Environment Variables

Create a .env file inside the server folder and add these:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

## How Roles Work

- Guest - can only view jobs, no login needed
- Job Seeker - can apply for jobs after login
- Recruiter - can post and manage jobs after login
- Admin - has full access to manage the entire platform

## Screenshots

Add your project screenshots here

## About

This project was built by me as a personal project to practice and learn MEAN stack development from scratch.

Name - sneha mistri
Email - sneha.mistri@gmail.com
GitHub - https://github.com/snehamistri17
