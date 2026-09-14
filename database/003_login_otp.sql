-- Jalankan file ini SATU KALI di phpMyAdmin (sesudah 002_updates_and_push.sql).
-- Tabel buat nyimpen kode OTP sementara pas login (2FA lewat Discord DM).
-- Terpisah dari database GM, aman.

CREATE TABLE IF NOT EXISTS `login_otp_codes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ucp` VARCHAR(22) NOT NULL,
  `temp_token` VARCHAR(64) NOT NULL,
  `code_hash` VARCHAR(64) NOT NULL,
  `attempts` INT NOT NULL DEFAULT 0,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `temp_token_unique` (`temp_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
