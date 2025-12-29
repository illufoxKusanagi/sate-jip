CREATE TABLE `ticket_attachments` (
	`id` varchar(50) NOT NULL,
	`ticket_id` varchar(50) NOT NULL,
	`reply_id` varchar(50),
	`file_name` varchar(255) NOT NULL,
	`original_name` varchar(255) NOT NULL,
	`file_url` varchar(500) NOT NULL,
	`file_size` int NOT NULL,
	`mime_type` varchar(100) NOT NULL,
	`uploaded_by` varchar(50) NOT NULL,
	`uploaded_at` timestamp DEFAULT (now()),
	CONSTRAINT `ticket_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_categories` (
	`id` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`sort_order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`color` varchar(7) DEFAULT '#3b82f6',
	`icon` varchar(50),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ticket_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_replies` (
	`id` varchar(50) NOT NULL,
	`ticket_id` varchar(50) NOT NULL,
	`message` text NOT NULL,
	`message_html` text,
	`author_id` varchar(50) NOT NULL,
	`author_name` varchar(100) NOT NULL,
	`author_email` varchar(255) NOT NULL,
	`is_staff_reply` boolean DEFAULT false,
	`is_internal` boolean DEFAULT false,
	`ip_address` varchar(45),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ticket_replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` varchar(50) NOT NULL,
	`ticket_number` varchar(20) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`submitted_by` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`category_id` varchar(50) NOT NULL,
	`priority` enum('rendah','sedang','tinggi','urgent') DEFAULT 'sedang',
	`status` enum('terbuka','dalam_progress','menunggu_jawaban','selesai','ditutup') DEFAULT 'terbuka',
	`assigned_to` varchar(50),
	`source` varchar(50) DEFAULT 'web',
	`ip_address` varchar(45),
	`user_agent` text,
	`first_response_at` timestamp,
	`resolved_at` timestamp,
	`closed_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `tickets_ticket_number_unique` UNIQUE(`ticket_number`)
);
--> statement-breakpoint
ALTER TABLE `server_data` RENAME COLUMN `installed_app` TO `installed_apps`;--> statement-breakpoint
ALTER TABLE `ticket_attachments` ADD CONSTRAINT `ticket_attachments_ticket_id_tickets_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket_attachments` ADD CONSTRAINT `ticket_attachments_reply_id_ticket_replies_id_fk` FOREIGN KEY (`reply_id`) REFERENCES `ticket_replies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket_replies` ADD CONSTRAINT `ticket_replies_ticket_id_tickets_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_category_id_ticket_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`) ON DELETE no action ON UPDATE no action;