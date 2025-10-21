-- AlterTable
-- Tambahkan ini SEBELUM ALTER TABLE Guru
ALTER TABLE `Group` DROP FOREIGN KEY `Group_created_by_fkey`;
ALTER TABLE `guru` MODIFY `guru_id` INTEGER NOT NULL AUTO_INCREMENT;

ALTER TABLE `Group` ADD CONSTRAINT `Group_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Guru`(`guru_id`) ON DELETE SET NULL ON UPDATE CASCADE;
