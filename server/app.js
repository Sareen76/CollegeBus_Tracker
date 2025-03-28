import express from "express";
import { config } from "dotenv";
import cors from "cors";
import dbConnect from "./db/db.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Server } from "socket.io";
import { createServer } from "http";
import authRoutes from "./routes/AuthRoutes.js";
import { AdminRouter } from "./routes/AdminRoutes.js";

config(); // Load env variables

const app = express();
const port = process.env.PORT || 3001;
const server = createServer(app);

// Configure CORS for Express and Socket.IO
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// ✅ Fix Express CORS (For API Requests)
app.use(cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies & authentication headers
}));

const io = new Server(server, {
    cors: {
        origin: FRONTEND_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
    },
});



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/tracker/auth", authRoutes);
app.use("/tracker/admin", AdminRouter);

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files
app.use(express.static(join(__dirname, "public")));

app.set('view engine', 'ejs');

// Set the views directory
app.set('views', join(__dirname, 'views'));

// Socket API
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    socket.on("send-location", (data) => {
        console.log(`📍 Location received from ${socket.id}:`, data);
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
        io.emit("user-disconnect", socket.id);
    });

    socket.onAny((event, ...args) => {
        console.log(`📩 Event received: ${event}`, args);
      });
});

// Basic Route
app.get("/", (req, res) => {
    res.render("index");
});

// Start Server
server.listen(port, () => {
    console.log(`🚀 Server with Socket.io is running on http://localhost:${port}`);
});

// Connect to MongoDB
dbConnect();
