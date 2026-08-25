const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Server running on port 5000");
});

app.get("/blogs", (req, res) => {
  res.json({ message: "GET blogs" });
});

app.post("/blogs", (req, res) => {
  res.json({ message: "POST blog" });
});

app.put("/blogs/:id", (req, res) => {
  res.json({ message: "PUT blog" });
});

app.delete("/blogs/:id", (req, res) => {
  res.json({ message: "DELETE blog" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
