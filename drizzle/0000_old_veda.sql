CREATE TABLE `admins` (
	`id` varchar(50) NOT NULL,
	`nama` varchar(255) NOT NULL,
	`nip` varchar(100),
	`jabatan` varchar(255) NOT NULL,
	`instansi` varchar(255) NOT NULL,
	`whatsapp` varchar(20) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` varchar(50) NOT NULL,
	`location_name` varchar(255) NOT NULL,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`opd_pengampu` varchar(255) NOT NULL,
	`opd_type` enum('OPD Utama','OPD Pendukung','Publik','Non OPD') NOT NULL,
	`isp_name` varchar(100) NOT NULL,
	`internet_speed` varchar(50) NOT NULL,
	`internet_ratio` varchar(50) NOT NULL,
	`internet_infrastructure` enum('KABEL','WIRELESS') NOT NULL,
	`jip` enum('checked','unchecked') DEFAULT 'unchecked',
	`drop_point` varchar(100),
	`e_cat` varchar(255),
	`status` enum('active','inactive','maintenance') DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(50) NOT NULL,
	`usename` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
