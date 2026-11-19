CREATE DATABASE IF NOT EXISTS school;
USE school;

CREATE TABLE IF NOT EXISTS student (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL
);

-- Optional sample records
INSERT IGNORE INTO student (student_id, student_name) VALUES
(101, 'Priya Darshini'),
(102, 'Rahul Kumar'),
(103, 'Ananya Sharma');

SELECT * FROM student;
