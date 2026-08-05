# Task Manager API

## Overview

The Task Manager API is a robust, secure backend service designed to facilitate task tracking and management. It provides a comprehensive set of RESTful endpoints to handle user authentication, task creation, updates, and deletions. Built on a modular Model-View-Controller (MVC) architecture, the system guarantees separation of concerns, scalability, and maintainability.

The system incorporates essential security features, including password hashing, JWT-based authentication (with access and refresh tokens), and thorough input validation, ensuring reliable data integrity. 

## Tech Stack

- **Runtime Environment:** Node.js
- **Web Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT)
- **Security & Validation:** bcrypt (password hashing), express-validator (input validation)

## Local Setup Instructions

1. **Clone the repository and navigate to the project directory:**
   Change your working directory to the project backend folder.

2. **Install Dependencies:**
   Run the following command to install required Node packages:
   ```bash
   npm install
   ```

3. **Configure the Database:**
   Ensure MySQL is installed and running on your system.
   Execute the queries found in `backend/database.sql` in your MySQL client to set up the necessary `task_manager` database and its tables (`users`, `tasks`, and `refresh_tokens`).

4. **Set Up Environment Variables:**
   Copy the provided `.env.example` file to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and populate it with your specific database credentials, desired port, and secure JWT secret keys.

5. **Start the Application:**
   Run the application in development mode:
   ```bash
   npm run dev
   ```
   The server will start on the port specified in your `.env` file.

## API Endpoints

### Authentication
- `POST /auth/register`: Register a new user account.
- `POST /auth/login`: Authenticate a user and receive access and refresh tokens.
- `POST /auth/refresh-token`: Obtain a new access token using a valid refresh token.
- `POST /auth/logout`: Log out the current user and invalidate tokens.

### Users
- `GET /users`: Retrieve a list of all registered users (Protected).
- `GET /users/me`: Retrieve profile details of the currently authenticated user (Protected).
- `DELETE /users/me`: Delete the currently authenticated user's account (Protected).

### Tasks
- `POST /tasks`: Create a new task (Protected).
- `GET /tasks`: Retrieve a paginated list of tasks for the authenticated user, with optional filters (status, priority, search, sorting) (Protected).
- `GET /tasks/:id`: Retrieve details of a specific task (Protected).
- `PUT /tasks/:id`: Update an existing task's details (Protected).
- `PATCH /tasks/:id/status`: Update the status of a specific task (Protected).
- `DELETE /tasks/:id`: Delete a specific task (Protected).
- `POST /tasks/bulk-delete`: Delete multiple tasks simultaneously (Protected).

### Health Check
- `GET /health`: Verify the operational status of the server.
