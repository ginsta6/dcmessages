## 1. Overview

This is a basic backend system to manage movie screenings and ticket bookings. It includes features for both administrators and users.

---

## 2. User Roles

- **Administrator**
- **Regular User**

---

## 3. Functional Requirements

### 3.1. Administrator Capabilities

| Feature                 | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| Create Screening        | Add a new screening with timestamp and ticket count.                        |
| Delete Empty Screening  | Delete a screening **only** if no tickets are reserved. *(Optional)*        |
| Update Ticket Allocation| Update the number of tickets as long as it’s ≥ tickets already reserved. *(Optional)* |

---

### 3.2. User Capabilities

| Feature                   | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| Get Movies by ID          | Provide list of movie IDs and get their title & year.                       |
| View Available Screenings | See screening details (timestamp, total tickets, tickets left, movie info). |
| View My Tickets           | Get a list of all bookings (tickets) made by the user.                      |
| Book Ticket               | Reserve a ticket for a screening if tickets are available.                  |

---

## 4. Database Schema Changes

Add the following new tables:

### `users`
- `id`, `username`, `email`, `password_hash`, `role`, `created_at`

### `screenings`
- `id`, `movie_id`, `timestamp`, `total_tickets`

### `tickets`
- `id`, `user_id`, `screening_id`, `booked_at`

---

## 5. Technical Requirements

- **Validation**: All inputs must be validated (e.g. IDs, timestamps, ticket counts).
- **Migrations**: All database changes must be performed via migration scripts.
- **Testing**: 
  - Unit and integration tests required.
  - Aim for **80–95% test coverage**.
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org) standard.
  - Example: `feat: add ticket booking endpoint`

---

## Setup

**Note:** For this exercise, we have provided an `.env` file with the database connection string. Normally, you would not commit this file to version control. We are doing it here for simplicity and given that we are using a local SQLite database.

## Migrations

Before running the migrations, we need to create a database. We can do this by running the following command:

```bash
npm run migrate:latest
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run generate-types
```
