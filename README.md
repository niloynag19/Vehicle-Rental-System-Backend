# Vehicle Booking System

Live Demo: [link](https://vehicle-rental-system-flax.vercel.app/)

---

## Features

- **Role-Based Access Control**
  - Admin: Can view all bookings, mark bookings as returned.
  - Customer: Can create bookings, view own bookings, cancel bookings before start date.
- **Booking Management**
  - Create, view, update, and cancel bookings.
  - Automatic price calculation based on vehicle daily rent and duration.
  - Vehicle availability status updates automatically.
- **Vehicle Management**
  - Add, view, and manage vehicles.
  - Track availability for booking.
- **Authentication**
  - JWT-based secure authentication.
- **Auto-Return Logic**
  - Bookings are automatically marked as returned after the end date.

---

## Technology Stack

- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** PostgreSQL  
- **Authentication:** JWT  
- **ORM / DB Client:** `pg` (node-postgres)  
- **Environment Management:** dotenv  

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/niloynag19/Vehicle-Rental-System-Backend
cd Vehicle-Rental-System-Backend
```
### 2. Install dependencies
```
npm i
```
### 3. Create environment variables
```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
### 4. Start development server
```
npm run dev
```
## Usage Instructions

### Base API URL
```
/api/v1
```

### Authentication
Send the JWT token for protected endpoints:
```
Authorization: Bearer <your-jwt-token>
```