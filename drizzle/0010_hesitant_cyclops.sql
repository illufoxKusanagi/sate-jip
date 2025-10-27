CREATE TABLE `server_data` (
	`id` varchar(50) NOT NULL,
	`rack_name` varchar(50) NOT NULL,
	`unit_position` int NOT NULL,
	`unit_size` int NOT NULL,
	`server_name` varchar(255) NOT NULL,
	`brand` varchar(50) NOT NULL,
	`asset_number` varchar(50) NOT NULL,
	`serial_number` varchar(50),
	`ip_address` varchar(50),
	`status` enum('online','offline','maintenance','standby') DEFAULT 'offline',
	`specification` json,
	`installed_app` json,
	`notes` varchar(255),
	CONSTRAINT `server_data_id` PRIMARY KEY(`id`)
);
