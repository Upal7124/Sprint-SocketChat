const express = require("express");
const app = express();
app.use(express.json());

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
