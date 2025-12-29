CREATE TABLE `activity_calendar` (
	`id` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`opd_name` varchar(100) NOT NULL,
	`description` varchar(255),
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`color` varchar(20) DEFAULT '#3b82f6',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activity_calendar_id` PRIMARY KEY(`id`)
);
