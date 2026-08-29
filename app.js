require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Post = require("./models/post");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

const blogs = [];

app.get("/", (req, res) => {
  res.send("Server running on port 5000");
});

app.get("/blogs", async (req, res) => {
  try {
    const posts = await Post.find();

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

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  res.json({
    message: "Login successful",
    token: "mock-jwt-token-123456",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
