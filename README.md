# 💸 Digital Wallet API

A secure, modular, and role-based RESTful backend API for a digital wallet system (inspired by **Bkash**/**Nagad**), built with **Express.js**, **Mongoose**, **TypeScript**, and **Zod**. This system allows users to register, manage wallets, perform transactions, and interact based on roles (`admin`, `user`, `agent`).

---

## 📦 Tech Stack

- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (Access & Refresh tokens)
- **Password Hashing:** Bcrypt
- **Validation:** Zod
- **Architecture:** Modular MVC Pattern

---

## 🌐 Live Backend URL

> ✅ [https://digital-wallet-system-backend.vercel.app](https://digital-wallet-system-backend.vercel.app)

Use this as the base URL when testing endpoints.

---

## ✨ Key Features

### 🔐 Authentication
- JWT-based access & refresh token system
- Secure password hashing using Bcrypt

### 👥 Role-Based Access
- Roles: `admin`, `user`, `agent`
- Middleware-based role protection

### 👤 User Features
- Registration & Login
- Auto-wallet creation with initial ৳50 balance
- Add, Withdraw, Send Money
- Daily send limit enforcement
- View Wallet & Transaction History (paginated)

### 🧑‍💼 Agent Features
- Cash-in (deposit) to user wallet
- Cash-out (withdraw) from user wallet
- View commission earnings (2% per cash-in)

### 🛡️ Admin Features
- View all users, agents, wallets, and transactions
- Block/Unblock wallets
- Approve/Suspend agent accounts

### 💸 Transaction System
- Tracks every action: `add`, `withdraw`, `send`, `cash-in`, `cash-out`, `fee`
- Configurable fee system
- Agent commissions handled automatically

---

## ⚙️ Environment Setup

Create a `.env` file in the root:

```env
PORT=5000
DB_URL=your_mongodb_url
NODE_ENV=development

BCRYPT_SALT_ROUND=10
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=7d

TRANSACTION_FEE_PERCENT=1
DAILY_SEND_LIMIT=10000
````

---

## 🚀 Run the Project Locally

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

---

## 📮 API Endpoints Overview

> 🌐 **Base URL:** `https://digital-wallet-system-backend.vercel.app`

### 🔐 Auth

| Method | Endpoint      | Description                  |
| ------ | ------------- | ---------------------------- |
| POST   | `/auth/login` | Login using phone & password |

---

### 👤 User Management

| Method | Endpoint                         | Role   | Description               |
| ------ | -------------------------------- | ------ | ------------------------- |
| POST   | `/api/v1/user/register`          | Public | Register new user/agent   |
| GET    | `/api/v1/user/all-users`         | Admin  | View all registered users |
| PATCH  | `/api/v1/user/agent/approve/:id` | Admin  | Approve an agent          |
| PATCH  | `/api/v1/user/agent/suspend/:id` | Admin  | Suspend an agent          |

---

### 💰 Wallet Operations

| Method | Endpoint                     | Role  | Description             |
| ------ | ---------------------------- | ----- | ----------------------- |
| GET    | `/api/v1/wallet/my-wallet`   | All   | View own wallet details |
| GET    | `/api/v1/wallet/all-wallets` | Admin | View all wallets        |
| PATCH  | `/api/v1/wallet/block/:id`   | Admin | Block a wallet          |
| PATCH  | `/api/v1/wallet/unblock/:id` | Admin | Unblock a wallet        |

---

### 🔁 Transactions

| Method | Endpoint                             | Role       | Description                           |
| ------ | ------------------------------------ | ---------- | ------------------------------------- |
| POST   | `/api/v1/transaction/add`            | User       | Add money to wallet                   |
| POST   | `/api/v1/transaction/withdraw`       | User       | Withdraw from wallet                  |
| POST   | `/api/v1/transaction/send`           | User       | Send money to another user (with fee) |
| GET    | `/api/v1/transaction/my-history`     | User/Agent | View own transactions (paginated)     |
| POST   | `/api/v1/transaction/cash-in`        | Agent      | Cash-in to user wallet                |
| POST   | `/api/v1/transaction/cash-out`       | Agent      | Cash-out from user wallet             |
| GET    | `/api/v1/transaction/my-commissions` | Agent      | View commission history               |
| GET    | `/api/v1/transaction`                | Admin      | View all transactions                 |

---

## 🧪 Test with Postman

✅ Use this shared Postman collection to test all endpoints:

📥 [Download Postman Collection](https://drive.google.com/file/d/1vRJ4ArZCecQzOi-sFadmBdfjgjmguMXl/view?usp=sharing)

> ✅ **Set Base URL:** `https://digital-wallet-system-backend.vercel.app`
for protected routes

---

## 🗂 Folder Structure

```
src/
├── app.ts
├── server.ts
└── app/
    ├── config/
    ├── middlewares/
    ├── modules/
    │   ├── auth/
    │   ├── user/
    │   ├── wallet/
    │   └── transaction/
    ├── utils/
    ├── errorHelpers/
    └── routes/
```

## 👨‍💻 Developer

**Ansarul Islam**
📍 Northern University Bangladesh
🎓 1th Semester, Computer Science and Engineering (CSE)

---
