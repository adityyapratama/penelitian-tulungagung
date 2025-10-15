/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `kategorikuis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `kategorikuis` DROP COLUMN `thumbnail`,
    ALTER COLUMN `created_at` DROP DEFAULT;
