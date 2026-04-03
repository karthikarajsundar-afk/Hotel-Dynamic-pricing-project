

### Smart Hotel Booking System with Dynamic Pricing & Price Alerts

---

## 📌 Overview

**StayDynamic** is a modern web application that simulates a real-world hotel booking platform with **dynamic pricing**, **price tracking**, and **user alerts**.

The system allows users to:

* 🔍 Search and explore hotels
* 📈 View real-time price trends
* 🔔 Set price alerts
* 🏨 Book hotels efficiently

This project is designed to mimic platforms like Booking.com using a scalable and modular architecture.

---

## 🚀 Features

### 🧠 Dynamic Pricing

* Prices change based on simulated demand and trends
* Real-time updates using custom React hooks

### 🔔 Price Alert System

* Users can set target prices
* Alerts trigger when prices drop

### 🔐 Authentication

* Secure login/signup using Supabase
* User session management

### 🏨 Booking System

* Select rooms and dates
* Calculate total cost dynamically

### 📊 Data Visualization

* Price trends using charts and sparklines

### 🎨 Modern UI/UX

* Responsive design (mobile + desktop)
* Sidebar, drawers, skeleton loaders
* Reusable component-based architecture

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React (TypeScript)
* ⚡ Vite
* 🎨 Tailwind CSS
* 🧩 Radix UI

### Backend (Current)

* 🔐 Supabase (Authentication & Database)

### Libraries

* 📊 Recharts (charts)
* 🔄 React Query
* 🎯 React Router
* 🎨 Lucide Icons

### Testing

* 🧪 Vitest
* 🧪 Testing Library

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/             # Application pages
├── hooks/             # Custom logic (dynamic pricing)
├── contexts/          # Auth management
├── integrations/      # Supabase setup
├── lib/               # Utility functions
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/staydynamic.git
cd staydynamic
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

---

### 4️⃣ Run the project

```
npm run dev
```

👉 Open: http://localhost:5173/

---

## 🧪 Running Tests

```
npm run test
```

---

## 🏗️ Build for Production

```
npm run build
npm run preview
```

---

## 🔄 Future Improvements

* 🤖 Integration of Machine Learning for price prediction
* 🌐 Migration to MongoDB + Express backend
* 📱 Mobile app version
* 🔔 Push notifications

---

## 🧠 System Architecture

```
User
  ↓
React Frontend (UI + Hooks)
  ↓
Supabase Backend
  ↓
Database (Bookings, Alerts)
```

---

## 🎓 Learning Outcomes

* Built a full-stack scalable web application
* Implemented dynamic pricing logic
* Integrated authentication and database
* Designed modular and reusable UI components

---

## 👩‍💻 Author

**Saranya**
B.Tech Electrical and Electronics Engineering

---

## ⭐ Acknowledgment

This project was developed as part of academic learning and practical implementation of modern web technologies.

---

## 📌 Note

This project currently uses a **rule-based dynamic pricing system**.
Future work includes integrating **AI/ML models for intelligent predictions**.

---


