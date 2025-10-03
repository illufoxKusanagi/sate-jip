CREATE TABLE `answer_config` (
	`id` varchar(50) NOT NULL,
	`data_config` json NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `answer_config_id` PRIMARY KEY(`id`)
);
