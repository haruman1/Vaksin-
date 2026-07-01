-- Database schema for Medivaq / Perberkes app
-- MySQL 8+

CREATE DATABASE IF NOT EXISTS medivaq
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE medivaq;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS request_medical_equipment;
DROP TABLE IF EXISTS request_bmhp;
DROP TABLE IF EXISTS request_medicines;
DROP TABLE IF EXISTS inventory_movements;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS inventory;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE inventory (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(255) DEFAULT NULL,
  batch_number VARCHAR(100) DEFAULT NULL,
  quantity INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 0,
  expiry_date DATE DEFAULT NULL,
  storage_temp VARCHAR(50) DEFAULT NULL,
  used_this_month INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_inventory_name (name),
  KEY idx_inventory_expiry_date (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE appointments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_name VARCHAR(255) NOT NULL,
  patient_nik VARCHAR(32) NOT NULL,
  vaccine_type VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_appointments_date_time (date, time),
  KEY idx_appointments_status (status),
  KEY idx_appointments_patient_nik (patient_nik)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  request_date DATE NOT NULL,
  unit VARCHAR(255) NOT NULL,
  staff_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_requests_created_at (created_at),
  KEY idx_requests_request_date (request_date),
  KEY idx_requests_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE request_medicines (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  request_id BIGINT UNSIGNED NOT NULL,
  medicine VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  request_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_request_medicines_request_id (request_id),
  KEY idx_request_medicines_request_date (request_date),
  CONSTRAINT fk_request_medicines_request
    FOREIGN KEY (request_id) REFERENCES requests(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE request_bmhp (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  request_id BIGINT UNSIGNED NOT NULL,
  item VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  request_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_request_bmhp_request_id (request_id),
  KEY idx_request_bmhp_request_date (request_date),
  CONSTRAINT fk_request_bmhp_request
    FOREIGN KEY (request_id) REFERENCES requests(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE request_medical_equipment (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  request_id BIGINT UNSIGNED NOT NULL,
  equipment VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  request_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_request_medical_equipment_request_id (request_id),
  KEY idx_request_medical_equipment_request_date (request_date),
  CONSTRAINT fk_request_medical_equipment_request
    FOREIGN KEY (request_id) REFERENCES requests(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory_movements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  date DATE NOT NULL,
  type ENUM('masuk', 'keluar') NOT NULL,
  item VARCHAR(255) NOT NULL,
  category ENUM('obat', 'bmhp', 'alat') NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(100) NOT NULL,
  source VARCHAR(255) DEFAULT NULL,
  destination VARCHAR(255) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_inventory_movements_date (date),
  KEY idx_inventory_movements_type (type),
  KEY idx_inventory_movements_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
