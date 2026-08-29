const express = require("express");
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

const blogs = [];

app.get("/", (req, res) => {
  res.send("Server running on port 5000");
});

app.get("/blogs", (req, res) => {
  res.json(blogs);
});

app.post("/blogs", (req, res) => {
  const blog = {
    id: blogs.length + 1,
    ...req.body,
  };
  blogs.push(blog);
  res.json(blog);
});

app.put("/blogs/:id", (req, res) => {
  const id = Number(req.params.id);
  const blog = blogs.find((blog) => blog.id === id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  Object.assign(blog, req.body);
  res.json(blog);
});

app.delete("/blogs/:id", (req, res) => {
  const id = Number(req.params.id);
  const filteredBlogs = blogs.filter((blog) => blog.id !== id);
  blogs.length = 0;
  blogs.push(...filteredBlogs);
  res.json({ message: "Blog deleted successfully" });
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
