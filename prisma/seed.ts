import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PrismaClient, Prisma } from "../lib/generated/prisma";
import { PuzzleCategory, ContentType } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

// Helper function untuk generate random XP
function getRandomXP(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function untuk calculate level dari XP
function calculateLevel(xp: number): number {
  // Formula: Level = floor(XP / 100) + 1
  // Setiap 100 XP = 1 level
  return Math.floor(xp / 100) + 1;
}

// Data Member dengan XP random (dari tinggi ke rendah)
const MemberUsersData = [
  {
    username: "ahmad_rizki",
    email: "ahmad.rizki@example.com",
    password: "password123",
    nis: "2024001",
    foto_profil: "/users/ahmad.jpg",
    bio: "Suka belajar sejarah dan budaya Indonesia",
    tanggal_lahir: new Date("2008-03-15"),
    jenis_kelamin: "L" as const,
    minat: "Sejarah, Budaya, Seni",
    xp: getRandomXP(2000, 3000), // XP Tinggi
  },
  {
    username: "siti_nurhaliza",
    email: "siti.nur@example.com",
    password: "password123",
    nis: "2024002",
    foto_profil: "/users/siti.jpg",
    bio: "Pencinta cerita rakyat Nusantara",
    tanggal_lahir: new Date("2008-07-20"),
    jenis_kelamin: "P" as const,
    minat: "Sastra, Cerita Rakyat, Musik",
    xp: getRandomXP(1500, 2000),
  },
  {
    username: "budi_santoso",
    email: "budi.santoso@example.com",
    password: "password123",
    nis: "2024003",
    foto_profil: "/users/budi.jpg",
    bio: "Gemar bermain kuis dan puzzle",
    tanggal_lahir: new Date("2008-11-05"),
    jenis_kelamin: "L" as const,
    minat: "Game Edukatif, Logika, Matematika",
    xp: getRandomXP(1200, 1500),
  },
  {
    username: "dewi_kartika",
    email: "dewi.kartika@example.com",
    password: "password123",
    nis: "2024004",
    foto_profil: "/users/dewi.jpg",
    bio: "Aktif dalam kompetisi sejarah",
    tanggal_lahir: new Date("2008-05-12"),
    jenis_kelamin: "P" as const,
    minat: "Sejarah, Geografi, Seni Rupa",
    xp: getRandomXP(1000, 1200),
  },
  {
    username: "eko_prasetyo",
    email: "eko.prasetyo@example.com",
    password: "password123",
    nis: "2024005",
    foto_profil: "/users/eko.jpg",
    bio: "Senang mempelajari candi-candi kuno",
    tanggal_lahir: new Date("2008-09-18"),
    jenis_kelamin: "L" as const,
    minat: "Arkeologi, Sejarah, Fotografi",
    xp: getRandomXP(800, 1000),
  },
  {
    username: "fitri_amanda",
    email: "fitri.amanda@example.com",
    password: "password123",
    nis: "2024006",
    foto_profil: "/users/fitri.jpg",
    bio: "Hobi membaca buku sejarah",
    tanggal_lahir: new Date("2008-02-28"),
    jenis_kelamin: "P" as const,
    minat: "Literasi, Sejarah, Menulis",
    xp: getRandomXP(600, 800),
  },
  {
    username: "gilang_ramadhan",
    email: "gilang.rama@example.com",
    password: "password123",
    nis: "2024007",
    foto_profil: "/users/gilang.jpg",
    bio: "Pemain game edukatif berbakat",
    tanggal_lahir: new Date("2008-06-10"),
    jenis_kelamin: "L" as const,
    minat: "Gaming, Teknologi, Sejarah",
    xp: getRandomXP(500, 600),
  },
  {
    username: "hani_safira",
    email: "hani.safira@example.com",
    password: "password123",
    nis: "2024008",
    foto_profil: "/users/hani.jpg",
    bio: "Suka berkunjung ke museum",
    tanggal_lahir: new Date("2008-12-03"),
    jenis_kelamin: "P" as const,
    minat: "Museum, Seni, Traveling",
    xp: getRandomXP(400, 500),
  },
  {
    username: "irfan_hakim",
    email: "irfan.hakim@example.com",
    password: "password123",
    nis: "2024009",
    foto_profil: "/users/irfan.jpg",
    bio: "Anggota baru yang antusias belajar",
    tanggal_lahir: new Date("2008-04-22"),
    jenis_kelamin: "L" as const,
    minat: "Sejarah, Olahraga, Musik",
    xp: getRandomXP(200, 400),
  },
  {
    username: "julia_permata",
    email: "julia.permata@example.com",
    password: "password123",
    nis: "2024010",
    foto_profil: "/users/julia.jpg",
    bio: "Baru mulai belajar tentang budaya lokal",
    tanggal_lahir: new Date("2008-08-15"),
    jenis_kelamin: "P" as const,
    minat: "Budaya, Tari, Fashion",
    xp: getRandomXP(100, 200),
  },
];

  const puzzles = Array.from({ length: 16 }).map((_, i) => ({
    judul: `Motif ${i + 1}`,
    gambar: `/puzzle/MOTIF_${i + 1}.jpg`,
    kategori: PuzzleCategory.Budaya, 
    xp_reward: 80,
    is_published: true,
  }));

const KategoriKuisData = [
  {
    nama_kategori: "Sejarah Kota Tulungagung",
    deskripsi:
      "Kuis tentang sejarah perkembangan Kota Tulungagung dari masa kerajaan kuno hingga era modern, mencakup etimologi, tokoh sejarah, dan peristiwa penting.",
    created_by: 1, // User Aditya
    created_at: dayjs().toDate(),
  },
  {
    nama_kategori: "Industri Marmer Tulungagung",
    deskripsi:
      "Kuis tentang sejarah dan perkembangan industri marmer di Kabupaten Tulungagung, dari masa kolonial hingga tantangan globalisasi saat ini.",
    created_by: 1, // User Aditya
    created_at: dayjs().toDate(),
  },
  {
    nama_kategori: "Candi-Candi Tulungagung",
    deskripsi:
      "Kuis tentang peninggalan sejarah candi-candi bersejarah di Tulungagung seperti Candi Sanggrahan, Candi Gayatri, Candi Mirigambar, dan lainnya.",
    created_by: 1, // User Aditya
    created_at: dayjs().toDate(),
  },
  {
    nama_kategori: "Goa dan Pertapaan Tulungagung",
    deskripsi:
      "Kuis tentang situs-situs spiritual dan pertapaan di Tulungagung seperti Goa Pasir, Goa Selomangleng, dan tradisi spiritualitas Jawa kuno.",
    created_by: 1, // User Aditya
    created_at: dayjs().toDate(),
  },
];

const KuisSejarahData = [
  {
    judul: "Kuis Interaktif Sejarah Kota Tulungagung - Tingkat Rendah",
    deskripsi:
      "Uji pengetahuan dasar Anda tentang sejarah Kabupaten Tulungagung dari masa kerajaan kuno hingga modern. Cocok untuk pemula.",
    kategori_id: 1,
    xp_reward: 100,
    created_by: 1, // User Aditya
    is_published: true,
    thumbnail: "/images/kuis/sejarah-tulungagung-rendah.jpg",
  },
  {
    judul: "Kuis Interaktif Sejarah Kota Tulungagung - Tingkat Sedang",
    deskripsi:
      "Tantang diri Anda dengan pertanyaan sejarah Tulungagung tingkat sedang. Pelajari lebih dalam tentang budaya dan perkembangan wilayah ini.",
    kategori_id: 2,
    xp_reward: 150,
    created_by: 1, // User Aditya
    is_published: true,
    thumbnail: "/images/kuis/sejarah-tulungagung-sedang.jpg",
  },
  {
    judul: "Kuis Interaktif Sejarah Kota Tulungagung - Tingkat Sulit",
    deskripsi:
      "Kuis tantangan untuk para ahli sejarah Tulungagung. Uji pemahaman mendalam tentang etimologi, pengaruh kerajaan, dan peristiwa penting.",
    kategori_id: 3,
    xp_reward: 200,
    created_by: 1, // User Aditya
    is_published: true,
    thumbnail: "/images/kuis/sejarah-tulungagung-sulit.jpg",
  },
];

const userData: Prisma.UserCreateInput[] = [
  {
    username: "Aditya",
    email: "Aditya@gmail.com",
    password_hash:
      "$2a$10$cKpVeVrdMtUL/gwSv3ErQumTbXG/9Vf3gaJbTk3Cw5scSzkHO2J/O",
    role: "member",
    created_at: dayjs().toDate(),
    last_login: dayjs().toDate(),
    is_active: true,
  },
  {
    username: "Helmi",
    email: "Helmi@gmail.com",
    password_hash:
      "$2a$10$cKpVeVrdMtUL/gwSv3ErQumTbXG/9Vf3gaJbTk3Cw5scSzkHO2J/O",
    role: "super_admin",
    created_at: dayjs().toDate(),
    last_login: dayjs().toDate(),
    is_active: true,
  },
  {
    username: "Mufi",
    email: "Mufi@gmail.com",
    password_hash:
      "$2a$10$cKpVeVrdMtUL/gwSv3ErQumTbXG/9Vf3gaJbTk3Cw5scSzkHO2J/O",
    role: "guru",
    created_at: dayjs().toDate(),
    last_login: dayjs().toDate(),
    is_active: true,
  },
];

// Data Sekolah untuk Tulungagung
const SekolahData: Prisma.SekolahCreateInput[] = [
  {
    nama_sekolah: "SMA Negeri 1 Tulungagung",
    alamat_sekolah: "Jl. Pahlawan No.15, Tulungagung, Jawa Timur 66214",
  },
  {
    nama_sekolah: "SMA Negeri 2 Tulungagung",
    alamat_sekolah: "Jl. Raya Boyolangu, Tulungagung, Jawa Timur 66233",
  },
  {
    nama_sekolah: "SMK Negeri 1 Tulungagung",
    alamat_sekolah:
      "Jl. Ki Mangun Sarkoro No.23, Tulungagung, Jawa Timur 66212",
  },
  {
    nama_sekolah: "SMP Negeri 1 Tulungagung",
    alamat_sekolah: "Jl. Ir. Soekarno No.45, Tulungagung, Jawa Timur 66211",
  },
  {
    nama_sekolah: "SMP Negeri 2 Tulungagung",
    alamat_sekolah: "Jl. Pahlawan No.32, Tulungagung, Jawa Timur 66214",
  },
  {
    nama_sekolah: "SMK Negeri 2 Tulungagung",
    alamat_sekolah: "Jl. Raya Kedungwaru, Tulungagung, Jawa Timur 66229",
  },
  {
    nama_sekolah: "SMA Islam Tulungagung",
    alamat_sekolah: "Jl. Masjid Agung No.18, Tulungagung, Jawa Timur 66213",
  },
  {
    nama_sekolah: "SMK Muhammadiyah 1 Tulungagung",
    alamat_sekolah: "Jl. Veteran No.67, Tulungagung, Jawa Timur 66215",
  },
  {
    nama_sekolah: "SMP Islam Al-Azhar Tulungagung",
    alamat_sekolah:
      "Jl. Raya Ngunut-Tulungagung, Tulungagung, Jawa Timur 66292",
  },
  {
    nama_sekolah: "SMA Katolik Santo Yosef Tulungagung",
    alamat_sekolah: "Jl. Gereja No.12, Tulungagung, Jawa Timur 66218",
  },
];

const CategoryArticleData: Prisma.KategoriArtikelCreateInput[] = [
  {
    nama_kategori: "Sejarah",
    created_at: dayjs().toDate(),
    deskripsi: "Lorem Ipsum Lorem Ipsum",
    User: {
      connect: {
        user_id: 1,
      },
    },
  },
  {
    nama_kategori: "Pendidikan",
    created_at: dayjs().toDate(),
    deskripsi: "Lorem Ipsum Lorem Ipsum",
    User: {
      connect: {
        user_id: 1,
      },
    },
  },
];

const ArticleData: Prisma.ArtikelCreateInput[] = [
  {
    judul: "Adit Makan Lontong Kupang",
    konten: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tempus ipsum, eu iaculis mi. In lacus ligula, convallis mollis semper eu, malesuada vel arcu. Vestibulum porta, augue vitae bibendum scelerisque, neque enim consequat turpis, nec dictum turpis ipsum non libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus erat sit amet tincidunt blandit. Phasellus fermentum vitae dolor ut ultricies. Cras venenatis, enim vel auctor laoreet, lectus est vulputate dui, scelerisque rhoncus erat nibh eget ligula. Donec hendrerit mi ac mi ornare, in fringilla orci finibus. Etiam et lacus elementum lacus ullamcorper iaculis. Sed scelerisque maximus luctus. Etiam tempor arcu id finibus tristique. Pellentesque quis tristique augue. Maecenas suscipit eros et pretium convallis. Maecenas mauris elit, rutrum ac rhoncus in, tristique a ligula. Nunc fermentum fermentum mattis.

Aliquam consectetur ex nunc, in faucibus augue aliquet vitae. Cras nec erat felis. Nam sit amet ligula mattis, ultrices nibh vitae, luctus orci. In in enim iaculis, eleifend enim et, iaculis turpis. Praesent bibendum nec leo sit amet semper. Phasellus scelerisque ex vitae augue accumsan dignissim. Ut accumsan euismod urna. Pellentesque tincidunt libero neque, id malesuada felis accumsan vitae. Nam tellus massa, fringilla a neque non, tincidunt accumsan mauris. Ut eu dapibus diam, in blandit purus. Donec ligula mauris, faucibus nec urna id, volutpat viverra purus. Cras id nunc ut metus tincidunt convallis. Sed in imperdiet leo, in elementum enim. Nullam quis risus dolor. In lacinia nisl est, vel fermentum tellus posuere in.

Ut justo felis, semper ut laoreet vitae, scelerisque sed lorem. Donec hendrerit porta viverra. Nullam non aliquet urna. Nulla vulputate ut quam vel volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce porttitor, ligula vel porttitor vestibulum, arcu diam sollicitudin ex, nec semper mi quam eu ligula. Mauris id ante enim. Etiam maximus pellentesque enim, eget vestibulum orci condimentum non. Aenean bibendum, massa nec euismod lobortis, mi velit mattis est, id viverra tellus ex vitae enim. Vestibulum ornare efficitur purus, quis hendrerit sapien porttitor et. Etiam lacinia vel turpis at suscipit. Donec nulla risus, faucibus eget rutrum non, ultricies sed dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Nam eu lacinia turpis. Pellentesque iaculis blandit tempus. Sed pharetra arcu et lectus imperdiet accumsan sed posuere ante. Maecenas leo eros, mollis vitae accumsan id, faucibus eget nisl. Donec efficitur tellus eget libero dictum fermentum sit amet quis est. Phasellus euismod mollis enim, nec blandit diam cursus non. Sed scelerisque nisi eget condimentum aliquam. Cras sagittis leo rutrum, imperdiet tellus sit amet, vulputate quam. Morbi maximus felis sit amet tristique tincidunt. Nam ultricies commodo arcu nec vulputate. Pellentesque ornare suscipit efficitur. Nulla eu fermentum massa. Nam venenatis porttitor dui eu placerat.

Aliquam pharetra molestie nulla, ut dignissim nisl efficitur nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec eget blandit dui. Fusce condimentum ante id quam pretium, non aliquam nisi laoreet. Etiam in risus molestie, eleifend quam id, facilisis libero. Ut mattis erat non justo bibendum pulvinar. Sed id lacinia purus. Phasellus molestie nisl rutrum, hendrerit metus vitae, dapibus arcu. Quisque ut elit eros. Aliquam sodales nunc ut odio interdum, at tincidunt libero tempus. Sed in magna feugiat, varius mauris laoreet, sodales nisl.`,
    created_at: dayjs().toDate(),
    thumbnail:
      "https://images.unsplash.com/photo-1596526145339-44043b497063?q=80&w=2070&auto=format&fit=crop",
    KategoriArtikel: {
      connect: {
        KategoriArtikel_id: 1,
      },
    },
    User: {
      connect: {
        user_id: 1,
      },
    },
  },
  {
    judul: "Helmi Juga Ikut Makan",
    konten: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tempus ipsum, eu iaculis mi. In lacus ligula, convallis mollis semper eu, malesuada vel arcu. Vestibulum porta, augue vitae bibendum scelerisque, neque enim consequat turpis, nec dictum turpis ipsum non libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus erat sit amet tincidunt blandit. Phasellus fermentum vitae dolor ut ultricies. Cras venenatis, enim vel auctor laoreet, lectus est vulputate dui, scelerisque rhoncus erat nibh eget ligula. Donec hendrerit mi ac mi ornare, in fringilla orci finibus. Etiam et lacus elementum lacus ullamcorper iaculis. Sed scelerisque maximus luctus. Etiam tempor arcu id finibus tristique. Pellentesque quis tristique augue. Maecenas suscipit eros et pretium convallis. Maecenas mauris elit, rutrum ac rhoncus in, tristique a ligula. Nunc fermentum fermentum mattis.

Aliquam consectetur ex nunc, in faucibus augue aliquet vitae. Cras nec erat felis. Nam sit amet ligula mattis, ultrices nibh vitae, luctus orci. In in enim iaculis, eleifend enim et, iaculis turpis. Praesent bibendum nec leo sit amet semper. Phasellus scelerisque ex vitae augue accumsan dignissim. Ut accumsan euismod urna. Pellentesque tincidunt libero neque, id malesuada felis accumsan vitae. Nam tellus massa, fringilla a neque non, tincidunt accumsan mauris. Ut eu dapibus diam, in blandit purus. Donec ligula mauris, faucibus nec urna id, volutpat viverra purus. Cras id nunc ut metus tincidunt convallis. Sed in imperdiet leo, in elementum enim. Nullam quis risus dolor. In lacinia nisl est, vel fermentum tellus posuere in.

Ut justo felis, semper ut laoreet vitae, scelerisque sed lorem. Donec hendrerit porta viverra. Nullam non aliquet urna. Nulla vulputate ut quam vel volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce porttitor, ligula vel porttitor vestibulum, arcu diam sollicitudin ex, nec semper mi quam eu ligula. Mauris id ante enim. Etiam maximus pellentesque enim, eget vestibulum orci condimentum non. Aenean bibendum, massa nec euismod lobortis, mi velit mattis est, id viverra tellus ex vitae enim. Vestibulum ornare efficitur purus, quis hendrerit sapien porttitor et. Etiam lacinia vel turpis at suscipit. Donec nulla risus, faucibus eget rutrum non, ultricies sed dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Nam eu lacinia turpis. Pellentesque iaculis blandit tempus. Sed pharetra arcu et lectus imperdiet accumsan sed posuere ante. Maecenas leo eros, mollis vitae accumsan id, faucibus eget nisl. Donec efficitur tellus eget libero dictum fermentum sit amet quis est. Phasellus euismod mollis enim, nec blandit diam cursus non. Sed scelerisque nisi eget condimentum aliquam. Cras sagittis leo rutrum, imperdiet tellus sit amet, vulputate quam. Morbi maximus felis sit amet tristique tincidunt. Nam ultricies commodo arcu nec vulputate. Pellentesque ornare suscipit efficitur. Nulla eu fermentum massa. Nam venenatis porttitor dui eu placerat.

Aliquam pharetra molestie nulla, ut dignissim nisl efficitur nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec eget blandit dui. Fusce condimentum ante id quam pretium, non aliquam nisi laoreet. Etiam in risus molestie, eleifend quam id, facilisis libero. Ut mattis erat non justo bibendum pulvinar. Sed id lacinia purus. Phasellus molestie nisl rutrum, hendrerit metus vitae, dapibus arcu. Quisque ut elit eros. Aliquam sodales nunc ut odio interdum, at tincidunt libero tempus. Sed in magna feugiat, varius mauris laoreet, sodales nisl.`,
    created_at: dayjs().toDate(),
    thumbnail:
      "https://images.unsplash.com/photo-1596526145339-44043b497063?q=80&w=2070&auto=format&fit=crop",
    KategoriArtikel: {
      connect: {
        KategoriArtikel_id: 1,
      },
    },
    User: {
      connect: {
        user_id: 1,
      },
    },
  },
  {
    judul: "Mufi Makan Lontong Kupang",
    konten: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut tempus ipsum, eu iaculis mi. In lacus ligula, convallis mollis semper eu, malesuada vel arcu. Vestibulum porta, augue vitae bibendum scelerisque, neque enim consequat turpis, nec dictum turpis ipsum non libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus erat sit amet tincidunt blandit. Phasellus fermentum vitae dolor ut ultricies. Cras venenatis, enim vel auctor laoreet, lectus est vulputate dui, scelerisque rhoncus erat nibh eget ligula. Donec hendrerit mi ac mi ornare, in fringilla orci finibus. Etiam et lacus elementum lacus ullamcorper iaculis. Sed scelerisque maximus luctus. Etiam tempor arcu id finibus tristique. Pellentesque quis tristique augue. Maecenas suscipit eros et pretium convallis. Maecenas mauris elit, rutrum ac rhoncus in, tristique a ligula. Nunc fermentum fermentum mattis.

Aliquam consectetur ex nunc, in faucibus augue aliquet vitae. Cras nec erat felis. Nam sit amet ligula mattis, ultrices nibh vitae, luctus orci. In in enim iaculis, eleifend enim et, iaculis turpis. Praesent bibendum nec leo sit amet semper. Phasellus scelerisque ex vitae augue accumsan dignissim. Ut accumsan euismod urna. Pellentesque tincidunt libero neque, id malesuada felis accumsan vitae. Nam tellus massa, fringilla a neque non, tincidunt accumsan mauris. Ut eu dapibus diam, in blandit purus. Donec ligula mauris, faucibus nec urna id, volutpat viverra purus. Cras id nunc ut metus tincidunt convallis. Sed in imperdiet leo, in elementum enim. Nullam quis risus dolor. In lacinia nisl est, vel fermentum tellus posuere in.

Ut justo felis, semper ut laoreet vitae, scelerisque sed lorem. Donec hendrerit porta viverra. Nullam non aliquet urna. Nulla vulputate ut quam vel volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce porttitor, ligula vel porttitor vestibulum, arcu diam sollicitudin ex, nec semper mi quam eu ligula. Mauris id ante enim. Etiam maximus pellentesque enim, eget vestibulum orci condimentum non. Aenean bibendum, massa nec euismod lobortis, mi velit mattis est, id viverra tellus ex vitae enim. Vestibulum ornare efficitur purus, quis hendrerit sapien porttitor et. Etiam lacinia vel turpis at suscipit. Donec nulla risus, faucibus eget rutrum non, ultricies sed dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Nam eu lacinia turpis. Pellentesque iaculis blandit tempus. Sed pharetra arcu et lectus imperdiet accumsan sed posuere ante. Maecenas leo eros, mollis vitae accumsan id, faucibus eget nisl. Donec efficitur tellus eget libero dictum fermentum sit amet quis est. Phasellus euismod mollis enim, nec blandit diam cursus non. Sed scelerisque nisi eget condimentum aliquam. Cras sagittis leo rutrum, imperdiet tellus sit amet, vulputate quam. Morbi maximus felis sit amet tristique tincidunt. Nam ultricies commodo arcu nec vulputate. Pellentesque ornare suscipit efficitur. Nulla eu fermentum massa. Nam venenatis porttitor dui eu placerat.

Aliquam pharetra molestie nulla, ut dignissim nisl efficitur nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec eget blandit dui. Fusce condimentum ante id quam pretium, non aliquam nisi laoreet. Etiam in risus molestie, eleifend quam id, facilisis libero. Ut mattis erat non justo bibendum pulvinar. Sed id lacinia purus. Phasellus molestie nisl rutrum, hendrerit metus vitae, dapibus arcu. Quisque ut elit eros. Aliquam sodales nunc ut odio interdum, at tincidunt libero tempus. Sed in magna feugiat, varius mauris laoreet, sodales nisl.`,
    created_at: dayjs().toDate(),
    thumbnail:
      "https://images.unsplash.com/photo-1596526145339-44043b497063?q=80&w=2070&auto=format&fit=crop",
    KategoriArtikel: {
      connect: {
        KategoriArtikel_id: 1,
      },
    },
    User: {
      connect: {
        user_id: 1,
      },
    },
  },
];

// Data Pertanyaan untuk Kuis Tingkat Rendah
const PertanyaanRendahData = [
  {
    kuis_id: 1,
    teks_pertanyaan:
      "Kabupaten Tulungagung secara resmi menggunakan tanggal 18 November 1205 M sebagai hari jadi berdirinya Kabupaten tersebut. Hal ini berdasarkan prasasti dari Raja Daha Kertajaya dari Kerajaan Kediri. Apa makna tanggal tersebut?",
    tipe: "pilihan_ganda",
    poin: 10,
    urutan: 1,
  },
  {
    kuis_id: 1,
    teks_pertanyaan:
      "Sebelum dikenal sebagai nama Tulungagung, wilayah ini mempunyai nama lain ...",
    tipe: "pilihan_ganda",
    poin: 10,
    urutan: 2,
  },
  {
    kuis_id: 1,
    teks_pertanyaan: 'Nama "Tulungagung" diartikan sebagai …',
    tipe: "pilihan_ganda",
    poin: 10,
    urutan: 3,
  },
  {
    kuis_id: 1,
    teks_pertanyaan: "Julukan khas Tulungagung di Provinsi Jawa Timur adalah…",
    tipe: "pilihan_ganda",
    poin: 10,
    urutan: 4,
  },
  {
    kuis_id: 1,
    teks_pertanyaan:
      'Fosil manusia purba "Homo wajakensis" ditemukan di wilayah Kecamatan...',
    tipe: "pilihan_ganda",
    poin: 10,
    urutan: 5,
  },
];

// Data Pilihan untuk Pertanyaan Tingkat Rendah
const PilihanRendahData = [
  // Pertanyaan 1
  {
    pertanyaan_id: 1,
    teks_jawaban: "Awal pengakuan administrasi Kabupaten Tulungagung",
    score: 0,
  },
  {
    pertanyaan_id: 1,
    teks_jawaban:
      "Pemberian penghargaan atas kesetiaan masyarakat Thani Lawadan",
    score: 10,
  },
  {
    pertanyaan_id: 1,
    teks_jawaban: "Awal pembentukan kota Tulungagung",
    score: 0,
  },
  {
    pertanyaan_id: 1,
    teks_jawaban: "Hari Banjir Besar di Tulungagung",
    score: 0,
  },
  {
    pertanyaan_id: 1,
    teks_jawaban:
      "Hari pertama ibukota pindah dari Ngrowo Kalangbret ke Tulungagung",
    score: 0,
  },
  // Pertanyaan 2
  {
    pertanyaan_id: 2,
    teks_jawaban: "Daha",
    score: 0,
  },
  {
    pertanyaan_id: 2,
    teks_jawaban: "Ngrowo",
    score: 10,
  },
  {
    pertanyaan_id: 2,
    teks_jawaban: "Pitulungan",
    score: 0,
  },
  {
    pertanyaan_id: 2,
    teks_jawaban: "Bonorowo",
    score: 0,
  },
  {
    pertanyaan_id: 2,
    teks_jawaban: "Wajak",
    score: 0,
  },
  // Pertanyaan 3
  {
    pertanyaan_id: 3,
    teks_jawaban: "Kota Marmer",
    score: 0,
  },
  {
    pertanyaan_id: 3,
    teks_jawaban: "Sumber Air Besar atau Pertolongan Besar",
    score: 10,
  },
  {
    pertanyaan_id: 3,
    teks_jawaban: "Hutan Rawan",
    score: 0,
  },
  {
    pertanyaan_id: 3,
    teks_jawaban: "Gunung Wilis",
    score: 0,
  },
  {
    pertanyaan_id: 3,
    teks_jawaban: "Dataran Tinggi",
    score: 0,
  },
  // Pertanyaan 4
  {
    pertanyaan_id: 4,
    teks_jawaban: "Kota Garam",
    score: 0,
  },
  {
    pertanyaan_id: 4,
    teks_jawaban: "Kota Batu",
    score: 0,
  },
  {
    pertanyaan_id: 4,
    teks_jawaban: "Kota Marmer",
    score: 10,
  },
  {
    pertanyaan_id: 4,
    teks_jawaban: "Kota Kopi",
    score: 0,
  },
  {
    pertanyaan_id: 4,
    teks_jawaban: "Kota Padi",
    score: 0,
  },
  // Pertanyaan 5
  {
    pertanyaan_id: 5,
    teks_jawaban: "Kauman",
    score: 0,
  },
  {
    pertanyaan_id: 5,
    teks_jawaban: "Campurdarat",
    score: 0,
  },
  {
    pertanyaan_id: 5,
    teks_jawaban: "Boyolangu",
    score: 0,
  },
  {
    pertanyaan_id: 5,
    teks_jawaban: "Ngantru",
    score: 0,
  },
  {
    pertanyaan_id: 5,
    teks_jawaban: "Besuki",
    score: 10,
  },
];

// Data Pertanyaan untuk Kuis Tingkat Sedang
const PertanyaanSedangData = [
  {
    kuis_id: 2,
    teks_pertanyaan:
      "Versi cerita rakyat menyebutkan Joko Baru menyumbat sumber air di Ngrowo. Ia kemudian dikutuk menjadi ular bernama...",
    tipe: "pilihan_ganda",
    poin: 15,
    urutan: 1,
  },
  {
    kuis_id: 2,
    teks_pertanyaan:
      "Candi yang menjadi makam Sri Rajapatni (istri Raja Raden Wijaya) yang berada di Kecamatan Boyolangu disebut...",
    tipe: "pilihan_ganda",
    poin: 15,
    urutan: 2,
  },
  {
    kuis_id: 2,
    teks_pertanyaan:
      "Pendapa Tulungagung dibangun pada masa perpindahan pusat pemerintahan dari Ngrowo di Kalangbret ke Tulungagung, yakni oleh bupati…",
    tipe: "pilihan_ganda",
    poin: 15,
    urutan: 3,
  },
  {
    kuis_id: 2,
    teks_pertanyaan:
      "Bendungan Wonorejo di Pagerwojo resmi dibuka pada tahun...",
    tipe: "pilihan_ganda",
    poin: 15,
    urutan: 4,
  },
  {
    kuis_id: 2,
    teks_pertanyaan:
      "Kabupaten Tulungagung memiliki… kecamatan secara administratif saat ini.",
    tipe: "pilihan_ganda",
    poin: 15,
    urutan: 5,
  },
];

// Data Pilihan untuk Pertanyaan Tingkat Sedang
const PilihanSedangData = [
  // Pertanyaan 1 (Sedang)
  {
    pertanyaan_id: 6,
    teks_jawaban: "Baru Tarung",
    score: 0,
  },
  {
    pertanyaan_id: 6,
    teks_jawaban: "Baruklinting",
    score: 15,
  },
  {
    pertanyaan_id: 6,
    teks_jawaban: "Baru Kriwil",
    score: 0,
  },
  {
    pertanyaan_id: 6,
    teks_jawaban: "Joko Kidu",
    score: 0,
  },
  {
    pertanyaan_id: 6,
    teks_jawaban: "Baru Winata",
    score: 0,
  },
  // Pertanyaan 2 (Sedang)
  {
    pertanyaan_id: 7,
    teks_jawaban: "Candi Penataran",
    score: 0,
  },
  {
    pertanyaan_id: 7,
    teks_jawaban: "Candi Sanggrahan",
    score: 0,
  },
  {
    pertanyaan_id: 7,
    teks_jawaban: "Candi Gayatri",
    score: 15,
  },
  {
    pertanyaan_id: 7,
    teks_jawaban: "Candi Dadi",
    score: 0,
  },
  {
    pertanyaan_id: 7,
    teks_jawaban: "Candi Slempit",
    score: 0,
  },
  // Pertanyaan 3 (Sedang)
  {
    pertanyaan_id: 8,
    teks_jawaban: "RT Patowidjojo",
    score: 0,
  },
  {
    pertanyaan_id: 8,
    teks_jawaban: "RMT Pringgodiningrat",
    score: 15,
  },
  {
    pertanyaan_id: 8,
    teks_jawaban: "RMT Djajaningrat",
    score: 0,
  },
  {
    pertanyaan_id: 8,
    teks_jawaban: "R.M. Soemodiningrat",
    score: 0,
  },
  {
    pertanyaan_id: 8,
    teks_jawaban: "RT Djojoatmojo",
    score: 0,
  },
  // Pertanyaan 4 (Sedang)
  {
    pertanyaan_id: 9,
    teks_jawaban: "1994",
    score: 0,
  },
  {
    pertanyaan_id: 9,
    teks_jawaban: "1997",
    score: 15,
  },
  {
    pertanyaan_id: 9,
    teks_jawaban: "2001",
    score: 0,
  },
  {
    pertanyaan_id: 9,
    teks_jawaban: "2005",
    score: 0,
  },
  {
    pertanyaan_id: 9,
    teks_jawaban: "2010",
    score: 0,
  },
  // Pertanyaan 5 (Sedang)
  {
    pertanyaan_id: 10,
    teks_jawaban: "15",
    score: 0,
  },
  {
    pertanyaan_id: 10,
    teks_jawaban: "17",
    score: 0,
  },
  {
    pertanyaan_id: 10,
    teks_jawaban: "19",
    score: 15,
  },
  {
    pertanyaan_id: 10,
    teks_jawaban: "21",
    score: 0,
  },
  {
    pertanyaan_id: 10,
    teks_jawaban: "23",
    score: 0,
  },
];

// Data Pertanyaan untuk Kuis Tingkat Sulit
const PertanyaanSulitData = [
  {
    kuis_id: 3,
    teks_pertanyaan:
      "Sejarah menyatakan, bahwa nama TULUNGAGUNG tidaklah timbul dengan tiba – tiba. Telah banyak musim silih berganti, berikut masa – masa yang dilampauinya, yang kesemuanya itu meninggalkan kenang – kenangan yang tersendiri di dalam lembaran riwayat terjadinya kota Tulungagung. Etimologi versi 'pitulungan agung' berkaitan dengan peran masyarakat lokal sebagai …",
    tipe: "pilihan_ganda",
    poin: 20,
    urutan: 1,
  },
  {
    kuis_id: 3,
    teks_pertanyaan:
      "Sejarah masa Demak di Tulungagung tidak banyak disebutkan secara spesifik dalam catatan sejarah. Namun, diketahui bahwa pada masa Kerajaan Demak, wilayah Jawa Timur, termasuk daerah yang sekarang menjadi Tulungagung, berada di bawah pengaruh Demak. Tulungagung berada di bawah kekuasaan Kesultanan Demak dikenal menghasilkan komoditas …",
    tipe: "pilihan_ganda",
    poin: 20,
    urutan: 2,
  },
  {
    kuis_id: 3,
    teks_pertanyaan:
      "Saat masa kekuasaan Kerajaan Mataram Islam, Wilayah Kabupaten Tulungagung dikenal sebagai pusat terbesar penghasil ...",
    tipe: "pilihan_ganda",
    poin: 20,
    urutan: 3,
  },
  {
    kuis_id: 3,
    teks_pertanyaan:
      "Dalam Operasi Trisula di Tahun 1968 menjadikan daerah selatan Tulungagung sebagai bagian wilayah penutupan, dalam penutupan wilayah tersebut bertujuan untuk …",
    tipe: "pilihan_ganda",
    poin: 20,
    urutan: 4,
  },
  {
    kuis_id: 3,
    teks_pertanyaan:
      "Arsitektur di dalam pelataran Pendapa Kabupaten Tulungagung dikenal menggabungkan gaya lokal Jawa-Mataraman dan …",
    tipe: "pilihan_ganda",
    poin: 20,
    urutan: 5,
  },
];


const PilihanSulitData = [
  {
    pertanyaan_id: 11,
    teks_jawaban: "Penambang marmer",
    score: 0,
  },
  {
    pertanyaan_id: 11,
    teks_jawaban: "Penolong dalam peristiwa penyerangan Daha",
    score: 20,
  },
  {
    pertanyaan_id: 11,
    teks_jawaban: "Pedagang padi",
    score: 0,
  },
  {
    pertanyaan_id: 11,
    teks_jawaban: "Pengrajin marmer ekspor",
    score: 0,
  },
  {
    pertanyaan_id: 11,
    teks_jawaban: "Penjaga candi",
    score: 0,
  },
  // Pertanyaan 2 (Sulit)
  {
    pertanyaan_id: 12,
    teks_jawaban: "Padi",
    score: 20,
  },
  {
    pertanyaan_id: 12,
    teks_jawaban: "Gula aren",
    score: 0,
  },
  {
    pertanyaan_id: 12,
    teks_jawaban: "Garam",
    score: 0,
  },
  {
    pertanyaan_id: 12,
    teks_jawaban: "Kopi",
    score: 0,
  },
  {
    pertanyaan_id: 12,
    teks_jawaban: "Kuda unggulan",
    score: 0,
  },
  // Pertanyaan 3 (Sulit)
  {
    pertanyaan_id: 13,
    teks_jawaban: "Kuda berkualitas",
    score: 0,
  },
  {
    pertanyaan_id: 13,
    teks_jawaban: "Kopi organik",
    score: 0,
  },
  {
    pertanyaan_id: 13,
    teks_jawaban: "Gula aren",
    score: 20,
  },
  {
    pertanyaan_id: 13,
    teks_jawaban: "Marmer",
    score: 0,
  },
  {
    pertanyaan_id: 13,
    teks_jawaban: "Garam laut",
    score: 0,
  },
  // Pertanyaan 4 (Sulit)
  {
    pertanyaan_id: 14,
    teks_jawaban: "Penyeberatan illegal logging",
    score: 0,
  },
  {
    pertanyaan_id: 14,
    teks_jawaban: "Sisa-sisa PKI",
    score: 20,
  },
  {
    pertanyaan_id: 14,
    teks_jawaban: "Pemberontakan komunisme Blitar",
    score: 0,
  },
  {
    pertanyaan_id: 14,
    teks_jawaban: "Peredaran narkoba",
    score: 0,
  },
  {
    pertanyaan_id: 14,
    teks_jawaban: "Aktivitas subversif asing",
    score: 0,
  },
  // Pertanyaan 5 (Sulit)
  {
    pertanyaan_id: 15,
    teks_jawaban: "Belanda modern",
    score: 20,
  },
  {
    pertanyaan_id: 15,
    teks_jawaban: "VOC tradisional",
    score: 0,
  },
  {
    pertanyaan_id: 15,
    teks_jawaban: "Eropa klasik",
    score: 0,
  },
  {
    pertanyaan_id: 15,
    teks_jawaban: "Jepang kolonial",
    score: 0,
  },
  {
    pertanyaan_id: 15,
    teks_jawaban: "Arab islami",
    score: 0,
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {}, 
      create: u, 
    });
  }
  for (const c of CategoryArticleData) {
    await prisma.kategoriArtikel.create({ data: c });
  }
  for (const a of ArticleData) {
    await prisma.artikel.create({ data: a });
  }

  // Seed Sekolah data
  console.log("🏫 Seeding data sekolah...");
  let sekolahCounter = 0;
  for (const sekolah of SekolahData) {
    await prisma.sekolah.create({ data: sekolah });
    console.log(
      `✅ Created sekolah ${++sekolahCounter}: ${sekolah.nama_sekolah}`
    );
  }
  console.log(`📚 Successfully seeded ${SekolahData.length} sekolah data`);

  console.log(
    "🚀 Starting seeding kuis sejarah Tulungagung dengan kategori..."
  );

  // 1. Create Kategori Kuis
  let kategoriCounter = 0;
  for (const kategori of KategoriKuisData) {
    await prisma.kategoriKuis.create({ data: kategori });
    console.log(
      `✅ Created kategori ${++kategoriCounter}: ${kategori.nama_kategori}`
    );
  }

  // 2. Create Kuis (dengan kategori_id yang sudah ada)
  let kuisCounter = 0;
  for (const kuis of KuisSejarahData) {
    await prisma.kuis.create({ data: kuis });
    console.log(`✅ Created kuis ${++kuisCounter}: ${kuis.judul}`);
  }

  // 3. Create Pertanyaan Tingkat Rendah
  let pertanyaanRendahCounter = 0;
  for (const pertanyaan of PertanyaanRendahData) {
    const createdPertanyaan = await prisma.pertanyaanKuis.create({
      data: pertanyaan,
    });
    console.log(
      `✅ Created pertanyaan rendah ${++pertanyaanRendahCounter}: ${createdPertanyaan.teks_pertanyaan.substring(
        0,
        50
      )}...`
    );
  }

  // 4. Create Pilihan Tingkat Rendah
  let pilihanRendahCounter = 0;
  for (const pilihan of PilihanRendahData) {
    await prisma.pilihanKuis.create({ data: pilihan });
    if (++pilihanRendahCounter % 5 === 0) {
      console.log(
        `✅ Created ${pilihanRendahCounter} pilihan jawaban tingkat rendah`
      );
    }
  }

  // 5. Create Pertanyaan Tingkat Sedang
  let pertanyaanSedangCounter = 0;
  for (const pertanyaan of PertanyaanSedangData) {
    const createdPertanyaan = await prisma.pertanyaanKuis.create({
      data: pertanyaan,
    });
    console.log(
      `✅ Created pertanyaan sedang ${++pertanyaanSedangCounter}: ${createdPertanyaan.teks_pertanyaan.substring(
        0,
        50
      )}...`
    );
  }

  // 6. Create Pilihan Tingkat Sedang
  let pilihanSedangCounter = 0;
  for (const pilihan of PilihanSedangData) {
    await prisma.pilihanKuis.create({ data: pilihan });
    if (++pilihanSedangCounter % 5 === 0) {
      console.log(
        `✅ Created ${pilihanSedangCounter} pilihan jawaban tingkat sedang`
      );
    }
  }

  // 7. Create Pertanyaan Tingkat Sulit
  let pertanyaanSulitCounter = 0;
  for (const pertanyaan of PertanyaanSulitData) {
    const createdPertanyaan = await prisma.pertanyaanKuis.create({
      data: pertanyaan,
    });
    console.log(
      `✅ Created pertanyaan sulit ${++pertanyaanSulitCounter}: ${createdPertanyaan.teks_pertanyaan.substring(
        0,
        50
      )}...`
    );
  }

  // 8. Create Pilihan Tingkat Sulit
  let pilihanSulitCounter = 0;
  for (const pilihan of PilihanSulitData) {
    await prisma.pilihanKuis.create({ data: pilihan });
    if (++pilihanSulitCounter % 5 === 0) {
      console.log(
        `✅ Created ${pilihanSulitCounter} pilihan jawaban tingkat sulit`
      );
    }
  }

    await prisma.puzzle.createMany({
      data: puzzles,
    });

  console.log('✅ Seed puzzle berhasil dimasukkan!');

  // ========================================
  // SEED USER, MEMBER, DAN PROGRES MEMBER
  // ========================================
  console.log("\n🚀 Mulai seeding User, Member, dan ProgresMember...");

  // Sort MemberUsersData berdasarkan XP dari tinggi ke rendah
  const sortedMembers = [...MemberUsersData].sort((a, b) => b.xp - a.xp);

  // Array untuk menyimpan ID member yang sudah dibuat
  const createdMemberIds: number[] = [];

  // Buat User dan Member untuk setiap data
  for (let i = 0; i < sortedMembers.length; i++) {
    const memberData = sortedMembers[i];
    const hashedPassword = await bcrypt.hash(memberData.password, 10);

    // Pilih sekolah secara random
    const randomSekolahIndex = Math.floor(Math.random() * SekolahData.length) + 1;

    // Buat User
    const user = await prisma.user.create({
      data: {
        username: memberData.username,
        email: memberData.email,
        password_hash: hashedPassword,
        role: "member",
        created_at: dayjs().toDate(),
        last_login: dayjs().toDate(),
        is_active: true,
      },
    });

    // Buat Member
    const member = await prisma.member.create({
      data: {
        user_id: user.user_id,
        sekolah_id: randomSekolahIndex,
        nis: memberData.nis,
        bio: memberData.bio,
        foto_profil: memberData.foto_profil,
        tanggal_lahir: memberData.tanggal_lahir,
        jenis_kelamin: memberData.jenis_kelamin,
        minat: memberData.minat,
        level: calculateLevel(memberData.xp),
        total_xp: memberData.xp,
      },
    });

    createdMemberIds.push(member.member_id);

    console.log(
      `✅ Created User & Member: ${memberData.username} (Level ${calculateLevel(
        memberData.xp
      )}, XP ${memberData.xp})`
    );

    // Generate ProgresMember untuk member ini
    // Buat beberapa progress entry dengan total skor = total_xp
    let remainingXp = memberData.xp;
    const contentTypes: ContentType[] = ["kuis", "cerita", "puzzle"];
    const progressEntries = [];

    // Buat 5-10 progress entries secara random
    const numEntries = Math.floor(Math.random() * 6) + 5; // 5-10 entries

    for (let j = 0; j < numEntries && remainingXp > 0; j++) {
      // Hitung skor untuk entry ini (10-200 XP per activity)
      const maxSkor = Math.min(remainingXp, 200);
      const minSkor = Math.min(10, maxSkor);
      const skor = Math.floor(Math.random() * (maxSkor - minSkor + 1)) + minSkor;

      // Pilih content type random
      const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];

      // Generate content_id random (1-10)
      const contentId = Math.floor(Math.random() * 10) + 1;

      // Generate tanggal random dalam 30 hari terakhir
      const daysAgo = Math.floor(Math.random() * 30);
      const completedAt = dayjs().subtract(daysAgo, "day").toDate();

      // Generate duration random (1-30 menit)
      const duration = Math.floor(Math.random() * 29) + 1;

      progressEntries.push({
        member_id: member.member_id,
        content_type: contentType,
        content_id: contentId,
        skor: skor,
        duration: duration,
        completed_at: completedAt,
      });

      remainingXp -= skor;
    }

    // Jika masih ada sisa XP, tambahkan ke entry terakhir
    if (remainingXp > 0 && progressEntries.length > 0) {
      progressEntries[progressEntries.length - 1].skor += remainingXp;
    }

    // Insert semua progress entries
    await prisma.progresMember.createMany({
      data: progressEntries,
    });

    console.log(
      `   📊 Created ${progressEntries.length} progress entries for ${memberData.username}`
    );
  }

  console.log("\n🎉 Seeding User, Member, dan ProgresMember completed!");
  console.log("📊 Summary:");
  console.log(`- ${sortedMembers.length} Users created (role: member)`);
  console.log(`- ${sortedMembers.length} Members created`);
  console.log(`- XP Range: ${Math.min(...sortedMembers.map(m => m.xp))} - ${Math.max(...sortedMembers.map(m => m.xp))}`);
  console.log(`- Level Range: ${calculateLevel(Math.min(...sortedMembers.map(m => m.xp)))} - ${calculateLevel(Math.max(...sortedMembers.map(m => m.xp)))}`);

  console.log("\n🎉 Seeding kuis sejarah Tulungagung completed successfully!");
  console.log("📊 Summary:");
  console.log(`- ${SekolahData.length} Sekolah created`);
  console.log(`- ${KategoriKuisData.length} Kategori Kuis created`);
  console.log(`- ${KuisSejarahData.length} Kuis created`);
  console.log(
    `- ${
      PertanyaanRendahData.length +
      PertanyaanSedangData.length +
      PertanyaanSulitData.length
    } Pertanyaan created`
  );
  console.log(
    `- ${
      PilihanRendahData.length +
      PilihanSedangData.length +
      PilihanSulitData.length
    } Pilihan jawaban created`
  );
  console.log("\n📋 Detail per kategori:");
  console.log(`1. Sejarah Kota Tulungagung: 3 kuis, 15 pertanyaan, 75 pilihan`);
  console.log(`2. Industri Marmer Tulungagung: Kategori siap digunakan`);
  console.log(`3. Candi-Candi Tulungagung: Kategori siap digunakan`);
  console.log(`4. Goa dan Pertapaan Tulungagung: Kategori siap digunakan`);
}

main();
