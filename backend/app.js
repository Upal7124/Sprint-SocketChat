require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const Post = require("./models/post");
const User = require("./models/user");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://sprint-09-10-1.onrender.com",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  let currentRoom = "general";

  socket.join(currentRoom);

  socket.on("joinRoom", (room) => {
    socket.leave(currentRoom);

    currentRoom = room;

    socket.join(currentRoom);

    console.log(`${socket.id} joined room: ${currentRoom}`);
  });

  socket.on("message", (data) => {
    console.log("Message received:", data);

    io.to(data.room).emit("message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("typing", data.username);
  });

  socket.on("stopTyping", (data) => {
    socket.to(data.room).emit("stopTyping", data.username);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Server running on port 5000");
});

app.get("/blogs", async (req, res) => {
  try {
    const posts = await Post.find().populate("authorId");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/blogs", async (req, res) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/blogs/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});
app.delete("/blogs/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({
      message: "Post deleted successfully",
      post: post,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid post ID",
    });
  }
});
app.get("/blogs/recent", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("authorId");

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  res.json({
    message: "Login successful",
    token: "mock-jwt-token-123456",
  });
});

app.post("/users", async (req, res) => {
  console.log("MongoDB readyState:", mongoose.connection.readyState);

  try {
    const user = await User.create(req.body);

    res.status(201).json(user);
  } catch (err) {
    console.log("USER CREATE ERROR:", err);

    res.status(400).json({
      message: err.message,
    });
  }
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
