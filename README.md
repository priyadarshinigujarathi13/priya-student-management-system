# Simple Student Management System

A beginner-friendly CRUD mini project using **HTML, CSS, JavaScript, Node.js, Express.js and MySQL**.

## Project structure

```text
Simple_Student_Management_System/
├── database/
│   └── database.sql
├── public/
│   ├── index.html
│   ├── add-student.html
│   ├── students.html
│   ├── style.css
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## 1. Create the database

1. Open MySQL Workbench.
2. Open `database/database.sql`.
3. Execute the complete SQL script. It creates database `school`, table `student`, and three optional sample records.

The table columns are `student_id` and `student_name`.

## 2. Configure the connection

Open this project folder in VS Code / PowerShell and run:

```powershell
Copy-Item .env.example .env
```

Open `.env` and enter your actual MySQL password in `DB_PASSWORD`. If your MySQL root account has no password, leave it empty. Do not upload `.env` to GitHub.

## 3. Install packages and start server

Run these commands from the project root folder (the folder containing `server.js`):

```powershell
npm install
npm start
```

You should see `Connected to MySQL database: school` and `Server running at http://localhost:3000`.

Open **http://localhost:3000** in your browser.

## Features

- Add a student (POST)
- View all students (GET)
- Search students by ID or name (browser-side filter)
- Update a student's name (PUT)
- Delete a student (DELETE)

## API routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | View all students |
| GET | `/api/students/:id` | View one student |
| POST | `/api/students` | Add student |
| PUT | `/api/students/:id` | Update student name |
| DELETE | `/api/students/:id` | Delete student |

## Important

- Keep MySQL Server running while using the website.
- Start the Node server from the project root, not from the `public` folder.
- `node_modules` is not included in the ZIP; `npm install` creates it.
- `.env` contains your local database password and is ignored by Git.
