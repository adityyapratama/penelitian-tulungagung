-- AlterTable
ALTER TABLE `cerita_interaktif` ADD COLUMN `kategori` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `KategoriCerita` (
    `KategoriId` INTEGER NOT NULL AUTO_INCREMENT,
    `NamaKategori` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`KategoriId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cerita_interaktif` ADD CONSTRAINT `cerita_interaktif_kategori_fkey` FOREIGN KEY (`kategori`) REFERENCES `KategoriCerita`(`KategoriId`) ON DELETE RESTRICT ON UPDATE CASCADE;
