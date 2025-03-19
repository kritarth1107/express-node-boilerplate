# 🚀 Express.js API Boilerplate

A **scalable and structured** Express.js API boilerplate with **MongoDB**, **JWT authentication**, **WebSocket (Socket.io)**, and **best practices** for production-ready applications.

## 📌 Features

- **🚀 Express.js** - Minimal and flexible Node.js framework.
- **🔒 JWT Authentication** - Secure token-based authentication.
- **📡 WebSockets (Socket.io)** - Real-time event handling.
- **🛡️ Security Middleware** - Helmet, CORS, and Rate-limiting.
- **🌍 MongoDB with Mongoose** - Flexible NoSQL database integration.
- **📂 Modular Architecture** - Well-structured routes, controllers, and services.
- **📑 Centralized Error Handling** - Better debugging & error management.
- **🌟 Environment Configurations** - `.env` support for configurations.

---

## 📦 Installation

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/kritarth1107/express-node-boilerplate.git
cd express-node-boilerplate
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Configure Environment Variables**
Create a **`.env`** file in the root directory. Refer to `.env.example` for required configurations.

```ini
PORT=3000
NODE_ENV=development
JWT_SECRET=mysecretkey
JWT_VALIDITY=12h
MONGODB_URI=mongodb://localhost:27017/mydatabase
CORS_ORIGINS=*
LOG_LEVEL=info
AES_SECRET=myencryptionkey
```

### **4️⃣ Run the Application**
```sh
npm start
```
Or, for development mode:
```sh
npm run dev
```

---

## 🏗️ Project Structure

```
📂 express-node-boilerplate
│── 📂 config             # Configuration files (DB, App, etc.)
│── 📂 controllers        # Route Controllers
│── 📂 middleware         # Express Middleware (Auth, Error Handling)
│── 📂 models             # Mongoose Models (MongoDB Schema)
│── 📂 routes             # Express API Routes
│── 📂 utils              # Utility Functions
│── 📂 helper             # Helper functions (SSH, Vault, etc.)
│── 📂 public             # Public Assets (Optional)
│── index.js              # Main Express Server
│── package.json          # Node.js Dependencies
│── .env.example          # Environment Variables Example
│── README.md             # Documentation
```

---

## 🔑 Authentication

### **1️⃣ Generate JWT Token**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "success": true,
  "token": "your_jwt_token_here"
}
```

### **2️⃣ Protected Route Example**
To access **protected routes**, pass the `Bearer token` in headers.

```http
GET /api/v1/user/profile
Authorization: Bearer your_jwt_token_here
```

---

## 📡 WebSockets (Real-Time Communication)

This boilerplate includes **Socket.io** for real-time event handling.

### **📡 WebSocket Connection**
```javascript
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket Server");
});

socket.on("deployment-progress", (data) => {
  console.log("Deployment Update:", data);
});
```

---


## 🛠️ Built With

- [Express.js](https://expressjs.com/) - Fast and minimalist web framework.
- [MongoDB](https://www.mongodb.com/) - NoSQL database for flexible storage.
- [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js.
- [Socket.io](https://socket.io/) - Real-time bidirectional event-based communication.
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT token-based authentication.
- [cors](https://github.com/expressjs/cors) - Cross-Origin Resource Sharing.
- [helmet](https://helmetjs.github.io/) - Security middleware to protect HTTP headers.

---

## 🌍 Deployment

### **Docker (Optional)**
To run the application using **Docker**, create a `Dockerfile` and `.dockerignore`.

```sh
docker build -t express-boilerplate .
docker run -p 3000:3000 --env-file .env express-boilerplate
```

### **PM2 (For Production)**
Use **PM2** to manage and run the Node.js application in production.

```sh
npm install -g pm2
pm2 start index.js --name express-boilerplate
pm2 logs
```

---

## 🛡️ Security Best Practices

- **Use Strong Secrets** for `JWT_SECRET` & `AES_SECRET`.
- **Enable HTTPS** for secure communication.
- **Use Environment Variables** (Never store secrets in code).
- **Limit API Requests** with **rate-limiting** to prevent abuse.

---

## 💡 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a **Pull Request**.

---

## 🎯 License

This project is licensed under the **MIT License**.

📌 **Author:** [Kritarth Agrawal](https://github.com/kritarth1107)  
🔗 **GitHub:** [express-node-boilerplate](https://github.com/kritarth1107/express-node-boilerplate)  

🚀 **Happy Coding!**

