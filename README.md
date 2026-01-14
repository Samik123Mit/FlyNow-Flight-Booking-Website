# ✈️ FlyNow – Flight Booking Web Application (MERN Stack)

FlyNow is a full-stack flight booking web application built using the MERN stack.
The platform enables users to search flights, book tickets, manage bookings,
and complete secure online payments using Razorpay.

---

## 🌐 Live Deployment

Frontend  
https://fly-now-flight-booking-website.vercel.app/home

Backend  
Deployed on Render and securely consumed by the frontend

---

## 📂 GitHub Repository

https://github.com/Samik123Mit/FlyNow-Flight-Booking-Website

---

## 🧱 Tech Stack

### Frontend
- React.js (Create React App)
- React Router DOM
- Context API (AuthContext)
- Tailwind CSS
- React Toastify
- Razorpay Checkout SDK

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Razorpay API

### Deployment & Infrastructure
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📁 Project Structure

FlyNow-Flight-Booking-Website/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── CSS/
│   │   └── App.js
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── model/
│   ├── router/
│   ├── db/
│   └── index.js
│
└── README.md

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Tokens stored in localStorage
- Global authentication state managed using AuthContext
- Protected routes for booking and admin functionality

---

## 💳 Payments (Razorpay Integration)

- Secure Razorpay payment gateway integration
- Order creation handled on the backend
- Payment verification performed server-side
- Booking confirmed only after successful payment verification

---

## ⚙️ Environment Variables

### Frontend (client/.env)

REACT_APP_BACKEND_URL=https://your-backend-name.onrender.com

### Backend (server/.env)

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
RAZORPAY_KEY_ID=your_razorpay_key  
RAZORPAY_KEY_SECRET=your_razorpay_key_secret  

---

## 🧪 Local Development Setup

### Clone the Repository

git clone https://github.com/Samik123Mit/FlyNow-Flight-Booking-Website  
cd FlyNow-Flight-Booking-Website  

### Frontend Setup

cd client  
npm install  
npm start  

Runs on http://localhost:3000

### Backend Setup

cd server  
npm install  
npm start  

Runs on http://localhost:8080

---

## 🚀 Features

- Search flights with filters
- View all available flights
- User authentication (register and login)
- Book flights with passenger details
- Razorpay payment integration
- View booked flights
- Admin authentication and flight management
- Fully responsive UI

---

## 🛠️ Deployment Notes

- Frontend must not use localhost URLs in production
- All API calls use REACT_APP_BACKEND_URL
- AuthContext location:
  client/src/context/AuthContext.js
- File and folder name casing must match exactly (important for Linux and Vercel)
- Vercel Root Directory:
  client

---

## 🧑‍💻 Contributing

git checkout -b feature/your-feature  
git commit -m "Add feature"  
git push origin feature/your-feature  

Open a Pull Request after pushing your changes.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Maintainer

Samiksha Mitra  
GitHub: https://github.com/Samik123Mit
