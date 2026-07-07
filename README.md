# 🚀 MyTurn Frontend – Smart Fuel Queue System

MyTurn is a smart fuel queue optimization system designed to reduce waiting time at fuel stations.  
This frontend application is built with Next.js and provides a structured interface for interacting with backend services.

It enables users, staff, and administrators to manage bookings, monitor queues, and handle fuel station operations efficiently.

---

## 🚀 Features
- 🔐 Authentication (Login / Register)
- 👤 Role-Based Access (User / Staff / Admin)
- 🎟️ Queue Token Management
- ⏰ Time Slot Booking
- 📊 Real-time Queue Status
- 🔔 Notification Handling
- ⛽ Fuel Station Management Integration
- ⚡ Fast Rendering with Next.js (SSR / CSR)

---

## 🏗️ Tech Stack
- Framework: Next.js  
- Language: JavaScript / TypeScript  
- Styling: CSS / Tailwind CSS (if used)  
- API Communication: Axios / Fetch API  
- Routing: Next.js App Router / Pages Router  

---

## 📂 Project Structure
```
src/
 ├── app/ or pages/     # Routing structure (Next.js)
 ├── components/        # Reusable components
 ├── services/          # API service layer
 ├── utils/             # Helper functions
 ├── hooks/             # Custom hooks
 ├── styles/            # Styling files
 └── public/            # Static assets
```

---

## ⚙️ Setup & Installation

1. Clone the repository
```
git clone https://github.com/TharukaThennakoon/MyTurn-frontend.git
```

2. Navigate to the project
```
cd myturn-frontend
```

3. Install dependencies
```
npm install
```

4. Run the development server
```
npm run dev
```

5. Open in browser
```
http://localhost:3000
```

---

## 🔗 API Integration
This frontend communicates with the MyTurn backend via REST APIs.

- POST /api/auth/login → Authenticate user  
- GET /api/stations → Retrieve fuel stations  
- POST /api/bookings → Create booking  
- GET /api/queue → Get queue status  

---

## 🔐 User Roles

### 👤 User
- Register and login  
- Book fuel time slots  
- View queue status  

### 🧑‍💼 Staff
- Manage queue tokens  
- Update fuel availability  

### 🛠️ Admin
- Manage users and stations  
- Monitor system operations  


