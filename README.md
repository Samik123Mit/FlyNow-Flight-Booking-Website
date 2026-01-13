# ✈️ FlyNow – Flight Booking Website

Welcome to **FlyNow**, a modern flight booking web application built using the **MERN** stack. FlyNow enables users to **search, book, and manage flights** with ease, featuring **secure Razorpay payment integration** for seamless transactions.

🔗 **Live Demo:** [https://flynow-five.vercel.app/](https://flynow-five.vercel.app/)  
<<<<<<< HEAD
🔗 **GitHub Repo:** [github.com/Samik123Mit/FlyNow-Flight-Booking-Website](https://github.com/Samik123Mit/FlyNow-Flight-Booking-Website)
=======
🔗 **GitHub Repo:** [https://github.com/Samik123Mit/FlyNow-Flight-Booking-Website](https://github.com/Samik123Mit/FlyNow-Flight-Booking-Website)
>>>>>>> 6eee4dd (Disable Razorpay when env keys missing)

---

## 📌 Overview

FlyNow provides:
- Flight search and listing
- Booking management
- Razorpay-powered secure payments
- Mobile-responsive design with Tailwind CSS
- Built on the robust MERN stack

---

## 🚀 Tech Stack

### Frontend
- **React.js** – Dynamic UI
- **Tailwind CSS** – Utility-first CSS framework
- **JavaScript (ES6+)**

### Backend
- **Node.js** – Server-side runtime
- **Express.js** – REST API framework
- **MongoDB** – NoSQL database
- **Razorpay** – Payment gateway integration

---

## ⚙️ Local Setup

### Clone the repository

```bash
git clone https://github.com/Samik123Mit/FlyNow-Flight-Booking-Website
```

### Setup Frontend

```bash
cd client
npm install
npm start
```

Frontend will run on [http://localhost:3000](http://localhost:3000)

### Setup Backend

```bash
cd server
npm install
npm start
```

Backend will run on [http://localhost:8080](http://localhost:8080)

> ⚠️ You must set up a `.env` file in `/server` with:
```
MONGO_URI=your_mongo_db_connection_string
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

---

## 📦 Usage

1. Search and select flights
2. Fill passenger details
3. Make payments securely via Razorpay
4. View/manage bookings after login

> Note: Some features like payment and DB may not work locally without valid API keys and URLs.

---

## 🧑‍💻 Contributing

We welcome contributions to enhance the app!  
To contribute:

```bash
# Fork the repository and create your branch
git checkout -b feature/your-feature-name

# Commit changes
git commit -m "Add new feature"

# Push and create PR
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙋‍♂️ Maintainer

Made with ❤️ by [Samiksha Mitra](https://github.com/Samik123Mit)
