# 💸 Digital Wallet API

A secure, modular, and role-based RESTful backend API for a digital wallet system (like Bkash or Nagad), built with **Express.js**, **Mongoose**, **TypeScript**, and **Zod**. Users can register, manage wallets, perform financial operations, and access role-specific features.

---

## 🧩 Tech Stack

- **Backend Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + Bcrypt
- **Validation:** Zod
- **Architecture:** Modular MVC

---

## 🧱 Project Features

### 🔐 Authentication
- JWT-based access & refresh tokens
- Secure password hashing using Bcrypt

### 👥 User Roles
- `admin`, `user`, `agent`
- Role-based route protection middleware

### 👤 User Functionality
- Register/login
- Auto-wallet creation with ৳50 balance
- Add money (top-up)
- Withdraw money
- Send money (with transaction fee)
- View wallet
- View transaction history (paginated)

### 🧑‍💼 Agent Functionality
- Cash-in to user wallet
- Cash-out from user wallet
- View commission history

### 👮 Admin Functionality
- View all users, agents, wallets, and transactions
- Block/unblock any wallet
- Approve/suspend agents

### 💸 Transactions
- All transactions are tracked and stored
- Types: `add`, `withdraw`, `send`, `cash-in`, `cash-out`, `fee`
- Commission (2%) for agents on cash-in
- Configurable transaction fee
- Daily send limit enforced

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following:

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

## 🚀 Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

---

## 🔁 API Endpoints Summary

### 🔐 Auth

| Method | Endpoint      | Description                 |
| ------ | ------------- | --------------------------- |
| POST   | `/auth/login` | Login with phone & password |

---

### 👤 User

| Method | Endpoint                  | Role   | Description            |
| ------ | ------------------------- | ------ | ---------------------- |
| POST   | `/api/v1/user/register`          | Public | Register user or agent |
| GET    | `/api/v1/user/all-users`         | Admin  | Get all users          |
| PATCH  | `/api/v1/user/agent/approve/:id` | Admin  | Approve agent          |
| PATCH  | `/api/v1/user/agent/suspend/:id` | Admin  | Suspend agent          |

---

### 💰 Wallet

| Method | Endpoint              | Role  | Description      |
| ------ | --------------------- | ----- | ---------------- |
| GET    | `/api/v1/wallet/my-wallet`   | All   | View my wallet   |
| GET    | `/api/v1/wallet/all-wallets` | Admin | View all wallets |
| PATCH  | `/api/v1/wallet/block/:id`   | Admin | Block a wallet   |
| PATCH  | `/api/v1/wallet/unblock/:id` | Admin | Unblock a wallet |

---

### 🔁 Transactions

| Method | Endpoint                      | Role       | Description                           |
| ------ | ----------------------------- | ---------- | ------------------------------------- |
| POST   | `/api/v1/transaction/add`            | User       | Add money (top-up)                    |
| POST   | `/api/v1/transaction/withdraw`       | User       | Withdraw money                        |
| POST   | `/api/v1/transaction/send`           | User       | Send money to another user (with fee) |
| GET    | `/api/v1/transaction/my-history`     | User/Agent | View transaction history (paginated)  |
| POST   | `/api/v1/transaction/cash-in`        | Agent      | Add money to user wallet              |
| POST   | `/api/v1/transaction/cash-out`       | Agent      | Withdraw from user wallet             |
| GET    | `/api/v1/transaction/my-commissions` | Agent      | View agent commissions                |
| GET    | `/api/v1/transaction`                | Admin      | View all transactions                 |

---

## 🧪 Testing the API

* Use [Postman](https://www.postman.com/) or Thunder Client
* Include `Authorization: Bearer <access_token>` for protected routes
* Test all major use cases:

  * Registration/login
  * Wallet ops (add, withdraw, send)
  * Role-based access
  * Agent cash-in/cash-out
  * Admin blocking/unblocking

---

## 🎥 Demo Video (Submitted Separately)

* ✅ Intro + overview
* ✅ Folder structure walkthrough
* ✅ Auth & role logic demo
* ✅ User & agent transactions
* ✅ Admin panel features
* ✅ Postman testing in real time

---

## 📁 Folder Structure

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

---

## ✨ Author

**Ansarul Islam Riyad**
Chapainawabganj Polytechnic Institute
8th Semester, Diploma in Computer Technology

---

## 📄 License

This project is for academic purposes only.

```

---

Let me know if you'd like the `README.md` translated into Bangla or want badges, screenshots, or links added.
```
