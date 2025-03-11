# Blood Donation Application - Backend

## Overview
The Blood Donation Management System is a backend API built with Node.js, Express, and MongoDB, designed to facilitate blood donation requests, manage users, handle payments using Stripe, and provide an authentication system with JWT tokens.

## Features
- User Authentication:
  - JWT-based login/logout
  - Role-based access control (Admin, Donor, Receiver)
  - Secure password hashing with bcrypt
- Blood Donation Requests:
  - Create, update, delete, and view donation requests
  - Filter and search donation requests by location and blood group
  - Real-time request status updates
- User Management:
  - Full CRUD (Create, Read, Update, Delete) operations for users
  - Assign and update user roles (Admin, Donor, Receiver)
  - Manage user activation/deactivation
- Payments Integration:
  - Stripe payment processing for donations
  - Secure transaction handling with webhooks
  - Payment tracking and history
- Blog Management:
  - Create, update, delete, and fetch blog articles
  - Categorization and tagging for blogs
- Location API:
  - Fetch districts and upazilas for user selection
  - Efficient location-based filtering
- Security & Performance:
  - JWT Authentication for secure API access
  - HTTP-only Cookies for session management
  - CORS-enabled for safe cross-origin requests
  - Optimized database queries for better performance

## Tech Stack
- **Node.js & Express.js** - Backend framework
- **MongoDB Atlas** - NoSQL Database
- **Mongoose** - ODM for MongoDB
- **JWT Authentication** - Secure user authentication
- **Stripe** - Payment gateway integration
- **dotenv** - Environment variable management
- **cors & cookie-parser** - Handling CORS & HTTP cookies
- **bcrypt** - Secure password hashing
- **multer** - File upload handling for images and documents
- **nodemailer** - Email notifications for donations and users
- **helmet** - Security middleware to prevent attacks
- **rate-limiter-flexible** - Rate limiting for API protection

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/alamin20cse/Blood-Donation-Server

 2.**Live link of site**:
   
     [https://blood-donation-applicati-9d609.web.app](https://blood-donation-applicati-9d609.web.app/).
