-- MySQL database schema for Vaksin backend

CREATE DATABASE IF NOT EXISTS vaksin_app;
USE vaksin_app;

CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(255) NOT NULL,
  batch_number VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 0,
  expiry_date DATE,
  storage_temp VARCHAR(100),
  used_this_month INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  patient_nik VARCHAR(100) NOT NULL,
  vaccine_type VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  status ENUM('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_date DATE NOT NULL,
  unit VARCHAR(255) NOT NULL,
  staff_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS request_medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  medicine VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  request_date DATE NOT NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS request_bmhp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  item VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  request_date DATE NOT NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS request_medical_equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  equipment VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  request_date DATE NOT NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  type ENUM('masuk','keluar') NOT NULL,
  item VARCHAR(255) NOT NULL,
  category ENUM('obat','bmhp','alat') NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(100) NOT NULL,
  source VARCHAR(255),
  destination VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
