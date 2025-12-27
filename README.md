# QR-Based Attendance Management System (Frontend)

This is the **frontend** of a QR-Based Attendance Management System built using **React + Vite + Tailwind CSS**.  
The system allows users to log in, mark attendance using QR codes, and view attendance records based on roles (Admin/User).

---

## 🚀 Features

- 🔐 Authentication & Protected Routes
- 👤 Role-based dashboards (Admin / User)
- 📊 Attendance visualization
- ⏱️ JWT token expiry handling (auto logout)
- 🎨 Responsive UI with Tailwind CSS
- ⚡ Fast development with Vite

---

## 🛠️ Tech Stack

- **React (Vite)**
- **Tailwind CSS v3**
- **Axios**
- **React Router**
- **JWT-based authentication**

---

## 📂 Project Structure
frontend/
│── src/
│ ├── admin/ # Admin pages
│ ├── api/ # Axios & API calls
│ ├── auth/ # Protected routes
│ ├── components/ # Reusable components
│ ├── dashboard/ # User/Admin dashboards
│ ├── pages/ # Login, NotFound
│ ├── utils/ # Auth helpers (token, logout)
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
│
│── tailwind.config.js
│── postcss.config.cjs
│── vite.config.js
│── package.json
│── README.md


---

## ⚙️ Setup & Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/devbiswas1234/qr-based-ams.git
2️⃣ Go into the project folder
cd qr-based-ams
3️⃣ Install dependencies
npm install
4️⃣ Start the development server
npm run dev

Open browser at:
http://localhost:5173

🔐 Authentication Flow (Frontend)

JWT token stored in localStorage
Token expiry handled using a timer
Auto logout on token expiration
Protected routes using ProtectedRoute component

📌 Future Enhancements

🔁 Refresh token support
📱 Mobile responsiveness improvements
📷 QR scanner integration
🧪 Unit & integration tests
🚀 Deployment (Vercel / Netlify)

🤝 Contribution

This project is part of a learning + hackathon workflow.
Contributions and suggestions are welcome.

📄 License

This project is licensed under the MIT License.


---