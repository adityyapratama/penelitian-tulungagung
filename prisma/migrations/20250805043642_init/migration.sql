-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('super_admin', 'guru', 'member') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `last_login` TIMESTAMP(0) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guru` (
    `guru_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `sekolah_id` INTEGER NULL,
    `nip` VARCHAR(20) NULL,
    `bidang_ajar` VARCHAR(100) NULL,

    UNIQUE INDEX `Guru_user_id_key`(`user_id`),
    UNIQUE INDEX `Guru_nip_key`(`nip`),
    PRIMARY KEY (`guru_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Group` (
    `group_id` INTEGER NOT NULL,
    `group_name` VARCHAR(191) NULL,
    `group_thumbnail` VARCHAR(191) NULL,
    `created_by` INTEGER NULL,
    `group_link` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupMember` (
    `group_id` INTEGER NOT NULL,
    `member_id` INTEGER NOT NULL,
    `tanggal_bergabung` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`group_id`, `member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `member_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `sekolah_id` INTEGER NULL,
    `nis` VARCHAR(20) NULL,
    `total_xp` INTEGER NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 1,
    `foto_profil` VARCHAR(255) NULL,
    `bio` TEXT NULL,
    `tanggal_lahir` DATE NULL,
    `jenis_kelamin` ENUM('L', 'P', 'Lainnya') NULL,
    `minat` TEXT NULL,
    `last_active` TIMESTAMP(0) NULL,

    UNIQUE INDEX `Member_user_id_key`(`user_id`),
    PRIMARY KEY (`member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProgresMember` (
    `progres_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NULL,
    `group_id` INTEGER NULL,
    `content_type` ENUM('kuis', 'cerita', 'puzzle') NOT NULL,
    `content_id` INTEGER NOT NULL,
    `skor` INTEGER NULL,
    `completed_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`progres_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sekolah` (
    `sekolah_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_sekolah` TEXT NULL,
    `alamat_sekolah` TEXT NULL,

    PRIMARY KEY (`sekolah_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberSocialLink` (
    `social_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NULL,
    `platform` ENUM('Instagram', 'Twitter', 'TikTok', 'Facebook', 'YouTube', 'Lainnya') NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`social_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberActivityLog` (
    `log_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NULL,
    `activity_type` ENUM('login', 'update_profile', 'complete_quiz', 'read_story', 'solve_puzzle') NOT NULL,
    `description` TEXT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KategoriKuis` (
    `kategori_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,
    `deskripsi` TEXT NULL,

    PRIMARY KEY (`kategori_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kuis` (
    `kuis_id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(100) NOT NULL,
    `deskripsi` TEXT NULL,
    `kategori_id` INTEGER NULL,
    `xp_reward` INTEGER NOT NULL DEFAULT 100,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_published` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`kuis_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PertanyaanKuis` (
    `pertanyaan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `kuis_id` INTEGER NULL,
    `teks_pertanyaan` TEXT NOT NULL,
    `tipe` ENUM('pilihan_ganda', 'benar_salah') NOT NULL,
    `poin` INTEGER NOT NULL DEFAULT 10,
    `urutan` INTEGER NOT NULL,

    PRIMARY KEY (`pertanyaan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pilihanKuis` (
    `jawaban_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pertanyaan_id` INTEGER NULL,
    `teks_jawaban` TEXT NOT NULL,
    `Score` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`jawaban_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cerita_interaktif` (
    `cerita_id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(100) NOT NULL,
    `thumbnail` VARCHAR(200) NULL,
    `deskripsi` TEXT NULL,
    `xp_reward` INTEGER NOT NULL DEFAULT 150,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`cerita_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scene` (
    `scene_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cerita_id` INTEGER NULL,
    `scene_key` VARCHAR(50) NOT NULL,
    `scene_text` TEXT NOT NULL,
    `scene_choices` JSON NULL,
    `condition` JSON NULL,
    `effect` JSON NULL,
    `is_ending` BOOLEAN NOT NULL DEFAULT false,
    `ending_point` INTEGER NOT NULL DEFAULT 0,
    `ending_type` VARCHAR(50) NULL,
    `urutan` INTEGER NULL,

    PRIMARY KEY (`scene_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Puzzle` (
    `puzzle_id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(100) NOT NULL,
    `gambar` VARCHAR(255) NOT NULL,
    `kategori` ENUM('Tempat_Wisata', 'Tokoh_Sejarah', 'Peta', 'Budaya', 'Lainnya') NOT NULL,
    `xp_reward` INTEGER NOT NULL DEFAULT 80,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`puzzle_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Artikel` (
    `artikel_id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(100) NOT NULL,
    `konten` TEXT NOT NULL,
    `kategori` INTEGER NULL,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `thumbnail` VARCHAR(255) NULL,

    PRIMARY KEY (`artikel_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KategoriArtikel` (
    `KategoriArtikel_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,
    `deskripsi` TEXT NULL,

    PRIMARY KEY (`KategoriArtikel_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Achievement` (
    `achievement_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,
    `deskripsi` TEXT NULL,
    `badge_icon` VARCHAR(255) NOT NULL,
    `xp_required` INTEGER NOT NULL,
    `tier` ENUM('bronze', 'silver', 'gold', 'platinum') NOT NULL,

    PRIMARY KEY (`achievement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberAchievement` (
    `member_id` INTEGER NOT NULL,
    `achievement_id` INTEGER NOT NULL,
    `unlocked_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`member_id`, `achievement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Guru` ADD CONSTRAINT `Guru_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guru` ADD CONSTRAINT `Guru_sekolah_id_fkey` FOREIGN KEY (`sekolah_id`) REFERENCES `Sekolah`(`sekolah_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Guru`(`guru_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupMember` ADD CONSTRAINT `GroupMember_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`group_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupMember` ADD CONSTRAINT `GroupMember_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `Member`(`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_sekolah_id_fkey` FOREIGN KEY (`sekolah_id`) REFERENCES `Sekolah`(`sekolah_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgresMember` ADD CONSTRAINT `ProgresMember_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `Member`(`member_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgresMember` ADD CONSTRAINT `ProgresMember_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`group_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberSocialLink` ADD CONSTRAINT `MemberSocialLink_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `Member`(`member_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberActivityLog` ADD CONSTRAINT `MemberActivityLog_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `Member`(`member_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KategoriKuis` ADD CONSTRAINT `KategoriKuis_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kuis` ADD CONSTRAINT `Kuis_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `KategoriKuis`(`kategori_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kuis` ADD CONSTRAINT `Kuis_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PertanyaanKuis` ADD CONSTRAINT `PertanyaanKuis_kuis_id_fkey` FOREIGN KEY (`kuis_id`) REFERENCES `Kuis`(`kuis_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pilihanKuis` ADD CONSTRAINT `pilihanKuis_pertanyaan_id_fkey` FOREIGN KEY (`pertanyaan_id`) REFERENCES `PertanyaanKuis`(`pertanyaan_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cerita_interaktif` ADD CONSTRAINT `cerita_interaktif_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scene` ADD CONSTRAINT `scene_cerita_id_fkey` FOREIGN KEY (`cerita_id`) REFERENCES `cerita_interaktif`(`cerita_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Puzzle` ADD CONSTRAINT `Puzzle_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Artikel` ADD CONSTRAINT `Artikel_kategori_fkey` FOREIGN KEY (`kategori`) REFERENCES `KategoriArtikel`(`KategoriArtikel_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Artikel` ADD CONSTRAINT `Artikel_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KategoriArtikel` ADD CONSTRAINT `KategoriArtikel_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberAchievement` ADD CONSTRAINT `MemberAchievement_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `Member`(`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberAchievement` ADD CONSTRAINT `MemberAchievement_achievement_id_fkey` FOREIGN KEY (`achievement_id`) REFERENCES `Achievement`(`achievement_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
