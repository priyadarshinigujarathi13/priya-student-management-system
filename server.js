const express = require("express");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "school"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL database:", process.env.DB_NAME || "school");
});

app.get("/api/students", (req, res) => {
  db.query("SELECT student_id, student_name FROM student ORDER BY student_id", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/students/:id", (req, res) => {
  db.query("SELECT student_id, student_name FROM student WHERE student_id = ?",
    [req.params.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) return res.status(404).json({ error: "Student not found" });
      res.json(rows[0]);
    });
});

app.post("/api/students", (req, res) => {
  const { student_id, student_name } = req.body;
  if (!student_id || !student_name || !student_name.trim()) {
    return res.status(400).json({ error: "Student ID and student name are required" });
  }
  db.query("INSERT INTO student (student_id, student_name) VALUES (?, ?)",
    [student_id, student_name.trim()], (err) => {
      if (err) return res.status(400).json({ error: err.code === "ER_DUP_ENTRY" ? "Student ID already exists" : err.message });
      res.status(201).json({ message: "Student added successfully" });
    });
});

app.put("/api/students/:id", (req, res) => {
  const { student_name } = req.body;
  if (!student_name || !student_name.trim()) {
    return res.status(400).json({ error: "Student name is required" });
  }
  db.query("UPDATE student SET student_name = ? WHERE student_id = ?",
    [student_name.trim(), req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.affectedRows) return res.status(404).json({ error: "Student not found" });
      res.json({ message: "Student updated successfully" });
    });
});

app.delete("/api/students/:id", (req, res) => {
  db.query("DELETE FROM student WHERE student_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.affectedRows) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
