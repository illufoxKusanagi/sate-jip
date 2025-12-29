-- docker/init/01-schema.sql
CREATE DATABASE IF NOT EXISTS sate_jip_db;
USE sate_jip_db;

-- Locations table
CREATE TABLE locations (
    id VARCHAR(50) PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    opd_pengampu VARCHAR(255) NOT NULL,
    opd_type ENUM('OPD Utama', 'OPD Pendukung', 'Publik', 'Non OPD') NOT NULL,
    isp_name VARCHAR(100) NOT NULL,
    internet_speed VARCHAR(50) NOT NULL,
    internet_ratio VARCHAR(50) NOT NULL,
    internet_infrastructure ENUM('KABEL', 'WIRELESS') NOT NULL,
    jip ENUM('checked', 'unchecked') DEFAULT 'unchecked',
    drop_point VARCHAR(100),
    e_cat VARCHAR(255),
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE admins (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nip VARCHAR(100),
    jabatan VARCHAR(255) NOT NULL,
    instansi VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_locations_status ON locations(status);
CREATE INDEX idx_locations_opd_type ON locations(opd_type);
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);
CREATE INDEX idx_admins_instansi ON admins(instansi);