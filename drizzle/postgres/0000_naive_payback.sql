CREATE TYPE "public"."internet_infrastructure" AS ENUM('KABEL', 'WIRELESS');--> statement-breakpoint
CREATE TYPE "public"."jip" AS ENUM('checked', 'unchecked');--> statement-breakpoint
CREATE TYPE "public"."location_status" AS ENUM('active', 'inactive', 'maintenance');--> statement-breakpoint
CREATE TYPE "public"."opd_type" AS ENUM('OPD Utama', 'OPD Pendukung', 'Publik', 'Non OPD');--> statement-breakpoint
CREATE TYPE "public"."server_status" AS ENUM('online', 'offline', 'maintenance', 'standby');--> statement-breakpoint
CREATE TYPE "public"."ticket_priority" AS ENUM('rendah', 'sedang', 'tinggi', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('terbuka', 'dalam_progress', 'menunggu_jawaban', 'selesai', 'ditutup');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"nama" varchar(255) NOT NULL,
	"nip" varchar(100),
	"jabatan" varchar(255) NOT NULL,
	"instansi" varchar(255) NOT NULL,
	"whatsapp" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "answer_config" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"data_type" varchar(50) NOT NULL,
	"data_config" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_calendar" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"opd_name" varchar(100) NOT NULL,
	"color" varchar(20) DEFAULT '#3b82f6',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"location_name" varchar(255) NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"activation_date" varchar(10),
	"opd_pengampu" varchar(255) NOT NULL,
	"opd_type" "opd_type" NOT NULL,
	"isp_name" varchar(100) NOT NULL,
	"internet_speed" varchar(50) NOT NULL,
	"internet_ratio" varchar(50) NOT NULL,
	"internet_infrastructure" "internet_infrastructure" NOT NULL,
	"jip" "jip" DEFAULT 'unchecked' NOT NULL,
	"drop_point" varchar(100),
	"e_cat" varchar(255),
	"status" "location_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "server_data" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"server_name" varchar(255) NOT NULL,
	"unit_position" integer NOT NULL,
	"unit_size" integer NOT NULL,
	"brand" varchar(50) NOT NULL,
	"rack_name" varchar(50) NOT NULL,
	"asset_number" varchar(50) NOT NULL,
	"serial_number" varchar(50),
	"ip_address" varchar(50),
	"status" "server_status" DEFAULT 'offline' NOT NULL,
	"specification" json,
	"installed_apps" json,
	"notes" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "ticket_attachments" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"ticket_id" varchar(50) NOT NULL,
	"reply_id" varchar(50),
	"file_name" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"file_url" varchar(500) NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"uploaded_by" varchar(50) NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_categories" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"color" varchar(7) DEFAULT '#3b82f6',
	"icon" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_replies" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"ticket_id" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"message_html" text,
	"author_id" varchar(50) NOT NULL,
	"author_name" varchar(100) NOT NULL,
	"author_email" varchar(255) NOT NULL,
	"is_staff_reply" boolean DEFAULT false,
	"is_internal" boolean DEFAULT false,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"ticket_number" varchar(20) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"submitted_by" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"category_id" varchar(50) NOT NULL,
	"priority" "ticket_priority" DEFAULT 'sedang' NOT NULL,
	"status" "ticket_status" DEFAULT 'terbuka' NOT NULL,
	"assigned_to" varchar(50),
	"source" varchar(50) DEFAULT 'web',
	"ip_address" varchar(45),
	"user_agent" text,
	"first_response_at" timestamp,
	"resolved_at" timestamp,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "ticket_attachments" ADD CONSTRAINT "ticket_attachments_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_attachments" ADD CONSTRAINT "ticket_attachments_reply_id_ticket_replies_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."ticket_replies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_replies" ADD CONSTRAINT "ticket_replies_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_category_id_ticket_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ticket_categories"("id") ON DELETE no action ON UPDATE no action;