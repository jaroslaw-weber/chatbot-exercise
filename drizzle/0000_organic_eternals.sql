CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phone_number` text NOT NULL,
	`amount` real NOT NULL,
	`item` text NOT NULL,
	`category` text NOT NULL,
	`store` text,
	`created_at` integer NOT NULL
);
