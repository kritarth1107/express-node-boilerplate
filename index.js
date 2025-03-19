// ✅ Core Modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createServer } from "http"; // HTTP Server for WebSockets
import { Server } from "socket.io"; // WebSocket (Socket.io) integration
import config from "./config/app.config.js"; // Load app configuration

// ✅ Middleware Imports
import errorHandler from "./middlewares/error.handler.js"; // Global error handler
import verifyToken from "./middlewares/auth.middleware.js"; // JWT authentication middleware

// ✅ Import Routes
import { router as exampleRoutes } from "./routes/example.routes.js";

const app = express();
const httpServer = createServer(app);

// ✅ Initialize WebSocket Server (Socket.io)
// WebSockets allow real-time communication between the server and connected clients.
const io = new Server(httpServer, {
    cors: {
        origin: config.server.corsOrigins,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "socket-id", "Authorization"]
    }
});

/* ================================
✅ Security & Performance Middleware
==================================*/

// Helmet helps secure Express apps by setting various HTTP headers.
app.use(helmet());

// CORS (Cross-Origin Resource Sharing) configuration
app.use(cors({ origin: config.server.corsOrigins, credentials: true }));

// Rate Limiting (Prevents brute-force attacks)
const limiter = rateLimit({
    windowMs: config.security.rateLimiting.windowMs, // Example: 15 minutes
    max: config.security.rateLimiting.max // Example: 100 requests per windowMs
});
app.use(limiter);

// Logging Middleware (Only in Development Mode)
if (config.server.env === "development") {
    app.use(morgan("dev"));
}

// Body Parser Middleware (Handles JSON requests)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ================================
✅ WebSocket Handling (Real-Time Communication)
==================================*/
// Uncomment this section if you want to use WebSockets for real-time data transfer.
// io.on("connection", (socket) => {
//     console.log(`✅ New WebSocket Connection: ${socket.id}`);

//     socket.on("disconnect", () => {
//         console.log(`❌ User Disconnected: ${socket.id}`);
//     });
// });


/* ================================
✅ API Routes
==================================*/
// API version prefix
const apiPrefix = `/api/${config.server.apiVersion}`;

// Public Routes
app.use(`${apiPrefix}/example`, exampleRoutes); // Example routes (register/login)

// Protected Routes (Require JWT authentication)
// Middleware `verifyToken` ensures only authenticated users can access these routes.
// app.use(`${apiPrefix}/chain`, verifyToken, chainRoutes); // Requires valid JWT token
// app.use(`${apiPrefix}/deploy`, verifyToken, (req, res, next) => {
//     req.io = io; // Attach WebSocket instance to request object
//     next();
// }, deployRoute);

/* ================================
✅ Health Check Route
==================================*/
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        environment: config.server.env,
        timestamp: new Date().toISOString()
    });
});
/* ================================
✅ List API Route
==================================*/
app.get("/list", (req, res) => {
    const routes = [];

    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // ✅ Directly attached routes
            const { path } = middleware.route;
            const method = Object.keys(middleware.route.methods)[0].toUpperCase();
            routes.push({ method, path });

        } else if (middleware.name === "router") {
            // ✅ Handle Router-Level Middleware (like `/chain`)
            const basePath = middleware.regexp
                .toString()
                .replace(/^\/\^\\/, "")
                .replace(/\\\/\?\(\?=\\\/\|\$\)\/\$/, "")
                .replace(/\\/g, "")
                .replace(/\?.*/, "");

            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    const { path } = handler.route;
                    const method = Object.keys(handler.route.methods)[0].toUpperCase();
                    const fullPath = `${basePath}${path}`.replace("//", "/");
                    routes.push({ method, path: fullPath });
                }
            });
        }
    });

    res.status(200).json({
        success: true,
        message: "Available API Routes",
        routes,
    });
});

/* ================================
✅ Global Error Handling Middleware
==================================*/
app.use(errorHandler);

/* ================================
✅ Handle 404 Routes
==================================*/
app.use("*", (req, res) => {
    res.status(404).json({  
        success: false,
        message: "Route not found"
    });
});

/* ================================
✅ Database Connection (MongoDB)
==================================*/
const connectDB = async () => {
    try {
        await mongoose.connect(config.database.uri);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

/* ================================
✅ Graceful Shutdown Handling
==================================*/
const gracefulShutdown = async () => {
    try {
        console.log("📡 Closing MongoDB connection...");
        await mongoose.connection.close();
        console.log("✅ MongoDB connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error during graceful shutdown:", error);
        process.exit(1);
    }
};

// Handle process events
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
    gracefulShutdown();
});
process.on("unhandledRejection", (error) => {
    console.error("❌ Unhandled Rejection:", error);
    gracefulShutdown();
});

/* ================================
✅ Start Express Server
==================================*/
const startServer = async () => {
    try {
        await connectDB();
        httpServer.listen(config.server.port, "0.0.0.0", () => {
            console.log(`🚀 Server Running Successfully
📡 Mode: ${config.server.env}
🔌 Port: ${config.server.port}
🌐 API Version: ${config.server.apiVersion}
            `);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

export default app;

