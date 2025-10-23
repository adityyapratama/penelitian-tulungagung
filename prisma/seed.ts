import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PrismaClient, Prisma } from "../lib/generated/prisma";
import { PuzzleCategory, ContentType } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";
import { SceneData } from "@/app/admin/dashboard/manage-stories/lib/database";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

  const puzzles = Array.from({ length: 16 }).map((_, i) => ({
    judul: `Motif ${i + 1}`,
    gambar: `/puzzle/MOTIF_${i + 1}.jpg`,
    kategori: PuzzleCategory.Budaya, 
    xp_reward: 80,
    is_published: true,
  }));

    const scenes2: SceneData[] = [
    {
      scene_key: "start",
      scene_text:
        "Joko kembali ke desa setelah lama merantau. Malam itu, ibu menunggu di serambi. Kala hujan turun, ibu memintanya menunaikan sebuah janji lama: bertapa di puncak bukit untuk memohon keselamatan keluarga.",
      scene_choices: [
        { text: "Taat: Pergi bertapa sesuai permintaan ibu", next: "taat_bertemu_pendeta" },
        { text: "Berbicara: Tanyakan alasan ibu", next: "tanya_alasan" },
        { text: "Tolak: Menolak karena sudah lelah merantau", next: "tolak_dengan_surat" },
      ],
      is_ending: false,
      urutan: 1,
    },

    {
      scene_key: "tanya_alasan",
      scene_text:
        "Joko duduk di hadapan ibu. Ibu bercerita tentang ketakutan lama—sebuah rahasia keluarga yang belum sempat diungkap sejak ayah meninggal.",
      scene_choices: [
        { text: "Mendengarkan lagi", next: "rahasia_ibu" },
        { text: "Tetap pergi bertapa", next: "taat_bertemu_pendeta" },
      ],
      is_ending: false,
      urutan: 2,
    },

    {
      scene_key: "rahasia_ibu",
      scene_text:
        "Ibu berkata: 'Ada janji yang tak boleh diingkari. Jika tanah ini tak ditaati, nasib keluarga bisa berubah buruk.' Kata-kata itu mengguncang Joko.",
      scene_choices: [
        { text: "Percaya dan menuruti", next: "taat_bertemu_pendeta" },
        { text: "Curiga, minta bukti", next: "minta_bukti" },
      ],
      is_ending: false,
      urutan: 3,
    },

    {
      scene_key: "minta_bukti",
      scene_text:
        "Ibu membuka sebuah peti kecil dan menunjukan sebentuk surat tua. Surat itu memuat permintaan leluhur: seorang anak sulung harus mengorbankan sesuatu setiap tujuh tahun.",
      scene_choices: [
        { text: "Ambil surat dan baca teliti", next: "baca_surat" },
        { text: "Tolak tradisi", next: "tolak_dengan_surat" },
      ],
      is_ending: false,
      urutan: 4,
    },

    {
      scene_key: "baca_surat",
      scene_text:
        "Isi surat menyiratkan korban bukan harus nyawa, melainkan pengorbanan simbolis. Namun banyak yang salah tafsir di generasi sebelumnya.",
      scene_choices: [
        { text: "Coba klarifikasi ritual", next: "klarifikasi_ritual" },
        { text: "Tetap menurut karena takut", next: "taat_bertemu_pendeta" },
      ],
      is_ending: false,
      urutan: 5,
    },

    {
      scene_key: "klarifikasi_ritual",
      scene_text:
        "Joko memutuskan menemui tokoh adat dan pendeta desa untuk mengklarifikasi maksud ritual. Mereka menerima menjelaskan namun memberi peringatan: 'Pilihanmu akan diuji.'",
      scene_choices: [
        { text: "Ikuti versi yang lebih ringan", next: "ritual_ringan" },
        { text: "Tolak ritual sepenuhnya", next: "konflik_dengan_ibu" },
      ],
      is_ending: false,
      urutan: 6,
    },

    {
      scene_key: "taat_bertemu_pendeta",
      scene_text:
        "Joko berangkat ke puncak bukit saat fajar. Di sana ia bertemu seorang pendeta tua yang menatapnya tajam.",
      scene_choices: [
        { text: "Ikuti arahan pendeta", next: "ritual_penuh" },
        { text: "Tanyakan tujuan ritual", next: "tanya_pendeta" },
      ],
      is_ending: false,
      urutan: 7,
    },

    {
      scene_key: "tanya_pendeta",
      scene_text:
        "Pendeta berkata: 'Ritual ini bukan menghukum tetapi menyeimbangkan. Tapi keseimbangan itu butuh pengorbanan yang sungguh-sungguh.'",
      scene_choices: [
        { text: "Terima penjelasan dan lanjut", next: "ritual_penuh" },
        { text: "Menolak di tengah ritual", next: "tinggalkan_ritual" },
      ],
      is_ending: false,
      urutan: 8,
    },

    {
      scene_key: "ritual_penuh",
      scene_text:
        "Ritual dimulai. Angin menguat, suara-suara lama bergema. Saat ritual mencapai puncak, pendeta meminta Joko memilih satu simbol pengorbanan.",
      scene_choices: [
        { text: "Serahkan cincin kenangan ayah", next: "serah_cincin" },
        { text: "Serahkan peta harta keluargamu", next: "serah_peta" },
        { text: "Tolak menyerahkan apapun", next: "tolak_di_ritual" },
      ],
      is_ending: false,
      urutan: 9,
    },

    {
      scene_key: "serah_cincin",
      scene_text:
        "Joko melepaskan cincin ayahnya ke dalam api ritual. Ia merasakan beban turun—namun ada rasa kehilangan mendalam.",
      scene_choices: [
        { text: "Kembali ke rumah memberi tahu ibu", next: "kembali_bahagia" },
        { text: "Tinggal lebih lama merenung di bukit", next: "renung_sendiri" },
      ],
      is_ending: false,
      urutan: 10,
    },

    {
      scene_key: "serah_peta",
      scene_text:
        "Peta tua dilemparkan ke api. Peta itu adalah harapan untuk masa depan yang berbeda. Seketika Joko merasa langkahnya kehilangan arah.",
      scene_choices: [
        { text: "Kembali tanpa berkata apa-apa", next: "kembali_diam" },
        { text: "Beritahu ibu tentang pengorbanan", next: "kembali_bahagia" },
      ],
      is_ending: false,
      urutan: 11,
    },

    {
      scene_key: "tolak_di_ritual",
      scene_text:
        "Joko menolak menyerahkan apa pun. Pendeta menatap kecewa. Di jalan pulang, rumor menyebar: 'Anak yang menolak membawa malapetaka.'",
      scene_choices: [
        { text: "Hadapi rumor bersama ibu", next: "hadapi_rumor" },
        { text: "Pergi merantau lagi", next: "merantau_lagi" },
      ],
      is_ending: false,
      urutan: 12,
    },

    {
      scene_key: "renung_sendiri",
      scene_text:
        "Di puncak bukit Joko menemukan sebuah goa kecil. Di dalamnya ada ukiran yang mengisahkan kisah cinta seorang ibu dan anak leluhur—ada yang hilang dari cerita itu.",
      scene_choices: [
        { text: "Telusuri ukiran lebih jauh", next: "temukan_catatan" },
        { text: "Kembali dan berdamai dengan ibu", next: "kembali_bahagia" },
      ],
      is_ending: false,
      urutan: 13,
    },

    {
      scene_key: "temukan_catatan",
      scene_text:
        "Di balik ukiran, Joko menemukan catatan kecil: 'Jika anak menolak tetapi mencari kebenaran, rahasia akan terbuka.'",
      scene_choices: [
        { text: "Bawa pulang catatan itu", next: "bawa_catatan" },
        { text: "Simpan diam-diam di bukit", next: "simpan_di_bukit" },
      ],
      is_ending: false,
      urutan: 14,
    },

    {
      scene_key: "bawa_catatan",
      scene_text:
        "Kembali ke desa, Joko membaca catatan bersama ibu. Ibu menangis—ternyata leluhur pernah dipaksa memilih antara keluarga dan amanah desa.",
      scene_choices: [
        { text: "Berterima kasih pada ibu & berdamai", next: "forgive_and_heal" },
        { text: "Ungkap penyimpangan adat ke tokoh desa", next: "ungkap_ke_tokoh" },
      ],
      is_ending: false,
      urutan: 15,
    },

    {
      scene_key: "simpan_di_bukit",
      scene_text:
        "Joko menyimpan catatan sebagai jembatan antara kebenaran dan tradisi. Ia ragu ingin menggunakannya.",
      scene_choices: [
        { text: "Kembali dan pura-pura setuju", next: "kembali_bahagia" },
        { text: "Kunjungi tokoh adat malam-malam", next: "kunjungi_adat_malam" },
      ],
      is_ending: false,
      urutan: 16,
    },

    {
      scene_key: "kembali_bahagia",
      scene_text:
        "Joko pulang, mengabarkan ritual selesai. Ibu lega. Seluruh desa mengucap syukur. Perasaan hangat melingkupi rumah.",
      scene_choices: [
        { text: "Buka usaha kecil bareng ibu", next: "usaha_bersama" },
        { text: "Kembali merantau mencari peluang", next: "merantau_lagi" },
      ],
      is_ending: false,
      urutan: 17,
    },

    {
      scene_key: "kembali_diam",
      scene_text:
        "Joko pulang tanpa menjelaskan. Ibu merasa ada yang disembunyikan. Ketegangan halus mulai tumbuh.",
      scene_choices: [
        { text: "Akhiri ketegangan dengan bicara dari hati", next: "forgive_and_heal" },
        { text: "Biarkan waktu yang menyelesaikan", next: "jarak_semakin_jauh" },
      ],
      is_ending: false,
      urutan: 18,
    },

    {
      scene_key: "forgive_and_heal",
      scene_text:
        "Mereka berbicara lama, mengenang masa kecil. Ibu meminta maaf atas tekanan masa lalu. Joko memeluk ibu. Ada harapan baru.",
      scene_choices: [
        { text: "Bangun rumah kecil bersama ibu", next: "good_ending_home" },
        { text: "Jual lahan untuk masa depan", next: "good_ending_move" },
      ],
      is_ending: false,
      urutan: 19,
    },

    {
      scene_key: "good_ending_home",
      scene_text:
        "Joko dan ibu hidup sederhana tapi penuh kasih. Desa menerima perubahan kecil yang Joko bawa. Keluarga kembali utuh.",
      scene_choices: [],
      is_ending: true,
      ending_point: 100,
      ending_type: "good",
      urutan: 20,
    },

    {
      scene_key: "good_ending_move",
      scene_text:
        "Dengan lahan yang dijual, Joko membiayai pendidikan adik-adiknya. Ibu bangga. Joko merasa telah memenuhi tanggung jawabnya dengan cara modern.",
      scene_choices: [],
      is_ending: true,
      ending_point: 95,
      ending_type: "good",
      urutan: 21,
    },

    {
      scene_key: "hadapi_rumor",
      scene_text:
        "Rumor memicu konflik. Beberapa tetangga menjauh. Ibu sakit karena stres. Joko menyesal menolak ritual.",
      scene_choices: [
        { text: "Cari pengobatan tradisional untuk ibu", next: "obat_tradisional" },
        { text: "Bawa ibu ke rumah sakit di kota", next: "rumah_sakit_kota" },
      ],
      is_ending: false,
      urutan: 22,
    },

    {
      scene_key: "obat_tradisional",
      scene_text:
        "Pengobatan tradisional menstabilkan kondisi ibu, tapi biaya ritual penenang tradisi tetap menimbulkan tuntutan masyarakat.",
      scene_choices: [
        { text: "Korbankan harta untuk menenangkan desa", next: "korbankan_harta" },
        { text: "Ungkap kebenaran surat leluhur ke desa", next: "ungkap_ke_tengah_desa" },
      ],
      is_ending: false,
      urutan: 23,
    },

    {
      scene_key: "rumah_sakit_kota",
      scene_text:
        "Di rumah sakit, dokter menyatakan bahwa kondisi ibu bukan supranatural. Joko mulai meragukan semua adat yang menekan keluarga.",
      scene_choices: [
        { text: "Tinggalkan desa demi kebaikan ibu", next: "good_ending_move" },
        { text: "Kembalikan bukti ke pendeta dan tuntut penjelasan", next: "konfrontasi_pendeta" },
      ],
      is_ending: false,
      urutan: 24,
    },

    {
      scene_key: "korbankan_harta",
      scene_text:
        "Joko menjual sebagian harta untuk menenangkan desanya—namun korban materi itu tidak menyembuhkan luka batin.",
      scene_choices: [
        { text: "Ibu sembuh, tapi hubungan renggang", next: "jarak_semakin_jauh" },
        { text: "Masih resah, cari jawaban", next: "kunjungi_adat_malam" },
      ],
      is_ending: false,
      urutan: 25,
    },

    {
      scene_key: "jarak_semakin_jauh",
      scene_text:
        "Waktu berlalu. Joko sibuk mencari nafkah, ibu sering termenung. Rasa bersalah menebal. Suatu hari ibu pergi tanpa pesan.",
      scene_choices: [
        { text: "Cari ibu ke mana-mana", next: "cari_ibu" },
        { text: "Terima dan lanjutkan hidup", next: "merantau_lagi" },
      ],
      is_ending: false,
      urutan: 26,
    },

    {
      scene_key: "cari_ibu",
      scene_text:
        "Joko menemui jejak: ibu pergi ke puncak bukit tempat ritual dulu. Di sana ia menemukan ibu duduk memandangi matahari terbenam.",
      scene_choices: [
        { text: "Mendekat dan bicara kecil", next: "last_confession" },
        { text: "Diam mengamati dari jauh", next: "diam_dan_menyesal" },
      ],
      is_ending: false,
      urutan: 27,
    },

    {
      scene_key: "last_confession",
      scene_text:
        "Ibu mengakui bahwa takut kehilangan keluarga membuatnya menekan Joko. Ia menitipkan sebuah rahasia: ada surat tersembunyi yang mengubah tafsir ritual.",
      scene_choices: [
        { text: "Minta tunjukkan surat itu", next: "temukan_surat_tersembunyi" },
        { text: "Peluk ibu dan pulang bersama", next: "good_ending_home" },
      ],
      is_ending: false,
      urutan: 28,
    },

    {
      scene_key: "temukan_surat_tersembunyi",
      scene_text:
        "Surat tersembunyi itu menyatakan bahwa leluhur menulis dua versi ritual: satu untuk mengekang keserakahan, satu untuk melindungi keluarga. Banyak generasi salah pilih.",
      scene_choices: [
        { text: "Buka ke publik: ungkap kebenaran", next: "ungkap_ke_tengah_desa" },
        { text: "Simpan agar ibu tetap tenang", next: "hidden_ending_return" },
      ],
      is_ending: false,
      urutan: 29,
    },

    // Hidden ending branch
    {
      scene_key: "hidden_ending_return",
      scene_text:
        "Joko memilih menyimpan surat agar ibu tetap tenang. Mereka hidup sisa hari dalam damai sederhana, rahasia tetap seperti rahasia. Hidup tenang tapi ada beban tak terucap.",
      scene_choices: [],
      is_ending: true,
      ending_point: 60,
      ending_type: "hidden",
      urutan: 30,
    },

    // Confrontation & social reveal branch
    {
      scene_key: "ungkap_ke_tengah_desa",
      scene_text:
        "Joko membuka kebenaran di hadapan warga. Reaksi beragam: beberapa marah, beberapa lega. Perdebatan memanas hingga tokoh adat turun tangan.",
      scene_choices: [
        { text: "Tokoh adat mendamaikan dan ritual direvisi", next: "good_ending_move" },
        { text: "Tokoh adat menuduh Joko mengacaukan adat", next: "konflik_besar" },
      ],
      is_ending: false,
      urutan: 31,
    },

    {
      scene_key: "konflik_besar",
      scene_text:
        "Konflik memuncak. Sebagian warga menuntut agar keluarga Joko dihukum. Malam itu rumah mereka diserang—ibu terluka parah.",
      scene_choices: [
        { text: "Selamatkan ibu tapi kalah dalam kerusuhan", next: "bad_ending_stone" },
        { text: "Korbankan diri untuk tenangkan warga", next: "secret_true_ending" },
      ],
      is_ending: false,
      urutan: 32,
    },

    {
      scene_key: "bad_ending_stone",
      scene_text:
        "Ibu meninggal akibat luka. Desa membekukan kisah itu sebagai peringatan—nama Joko menjadi beban. Kehilangan dan rasa bersalah tak terobati.",
      scene_choices: [],
      is_ending: true,
      ending_point: 0,
      ending_type: "bad",
      urutan: 33,
    },

    // Secret true ending
    {
      scene_key: "secret_true_ending",
      scene_text:
        "Untuk menenangkan warga, Joko memilih upacara pengorbanan simbolis yang mewakili dirinya—ia rela 'membekukan' dirinya secara simbolis agar desa menerima perubahan. Setelah upacara, muncul dokumen leluhur lain yang mengakui kelalaian generasi lama. Kebenaran terbuka, namun Joko memilih menghilang demi menutup luka.",
      scene_choices: [],
      is_ending: true,
      ending_point: 120,
      ending_type: "secret_true",
      urutan: 34,
    },

    // Merantau branch
    {
      scene_key: "merantau_lagi",
      scene_text:
        "Joko pergi lagi, meninggalkan desa. Di kota ia membangun hidup, namun rindu ibu tak pernah padam. Kadang ia bertanya apakah ia memilih benar.",
      scene_choices: [
        { text: "Kirim kabar dan kembali", next: "kirim_kabar_kembali" },
        { text: "Pilih hidup baru dan lupakan", next: "bad_lonely_ending" },
      ],
      is_ending: false,
      urutan: 35,
    },

    {
      scene_key: "kirim_kabar_kembali",
      scene_text:
        "Ia mengirim kabar, ibu membalas dengan doa. Suatu hari ia pulang, disambut sunyi tapi hangat. Mereka punya kesempatan memperbaiki.",
      scene_choices: [
        { text: "Berdamai dan rawat ibu sampai tua", next: "good_ending_home" },
        { text: "Temukan surat lama di loteng yang mengguncang lagi", next: "temukan_surat_tersembunyi" },
      ],
      is_ending: false,
      urutan: 36,
    },

    {
      scene_key: "bad_lonely_ending",
      scene_text:
        "Joko sukses materi namun hatinya sepi. Di malam yang sunyi ia menyesal dan sadar bahwa beberapa keputusan tak bisa kembali. Ending hidup yang damai secara materi, hampa secara jiwa.",
      scene_choices: [],
      is_ending: true,
      ending_point: 20,
      ending_type: "bad",
      urutan: 37,
    },
  ]

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
const scenes: SceneData[] = [
    {
      scene_key: "start",
      scene_text:
        "Kamu sampai di desa kecil tempat Sanggar Waru berada. Malam ini ada festival ringan, tapi cerita lama tentang pohon Waru tetap menghantui warganya. Di gerbang desa, seorang nenek menyapamu: 'Kalau mau tahu, dengarkan hatimu.'",
      scene_choices: [
        { text: "Tanya nenek soal pohon Waru", next: "ask_grandma" },
        { text: "Langsung menuju sanggar yang disebut orang-orang", next: "to_sanggar" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 1,
    },
    {
      scene_key: "ask_grandma",
      scene_text:
        "Nenek bercerita singkat: 'Putri dulu menjaga Waru. Ada yang hilang ketika malam penuh bulan. Kalau kamu ke sanggar, hati-hati.'",
      scene_choices: [
        { text: "Minta petunjuk arah", next: "to_sanggar" },
        { text: "Tinggalkan desa, ini terlalu menyeramkan", next: "leave_village" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 2,
    },
    {
      scene_key: "to_sanggar",
      scene_text:
        "Sanggar terletak di tepi ladang. Di sana ada pohon Waru besar yang daunnya seolah berbisik ketika angin lewat.",
      scene_choices: [
        { text: "Periksa kaki pohon", next: "check_root" },
        { text: "Masuk ke dalam sanggar (gedung)", next: "enter_sanggar" },
        { text: "Duduk dan coba ngobrol dengan pohon (aneh, tapi nyoba)", next: "talk_tree" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 3,
    },
    {
      scene_key: "check_root",
      scene_text:
        "Di bawah akar kamu menemukan sebuah kain batik lusuh dan sebuah kotak kecil. Kotak itu berisi surat setengah robek: 'Maafkan aku...' Tanda-tanda pergolakan lama.",
      scene_choices: [
        { text: "Bawa kotak untuk dibaca lebih lanjut", next: "read_box" },
        { text: "Tinggalkan kotak—takut ada kutukan", next: "ignore_box" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 4,
    },
    {
      scene_key: "enter_sanggar",
      scene_text:
        "Di dalam sanggar ada lukisan-lukisan tua dan alat musik yang jarang dipakai. Seorang pemuda penjaga sanggar menatapmu curiga.",
      scene_choices: [
        { text: "Bicara baik-baik dengan pemuda", next: "talk_guard" },
        { text: "Cari ruang belakang sendiri", next: "back_room" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 5,
    },
    {
      scene_key: "talk_tree",
      scene_text:
        "Kamu mengeluarkan kata-kata sederhana. Angin berhenti sejenak. Ada bisikan halus: 'Berikan yang hilang.'",
      scene_choices: [
        { text: "Coba tafsir 'yang hilang' sebagai benda", next: "check_root" },
        { text: "Anggap itu ucapan kosong dan pergi", next: "ignore_tree" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 6,
    },
    {
      scene_key: "read_box",
      scene_text:
        "Surat itu menceritakan penyesalan putri yang menghilang setelah konflik dengan warga. Di akhir surat ada petunjuk: 'Di balik panggung ada pintu kecil.'",
      scene_choices: [
        { text: "Pergi ke sanggar untuk cek panggung", next: "back_room" },
        { text: "Bawa surat ke pemuda penjaga", next: "talk_guard" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 7,
    },
    {
      scene_key: "ignore_box",
      scene_text:
        "Kamu meninggalkan kotak. Semalam, bisik-bisik bertambah kuat. Suasana membuatmu gelisah.",
      scene_choices: [
        { text: "Kembali mencari kotak", next: "check_root" },
        { text: "Tinggalkan desa (ending netral)", next: "ending_neutral" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 8,
    },
    {
      scene_key: "talk_guard",
      scene_text:
        "Pemuda itu awalnya tertutup, tapi setelah kamu jujur dia menunjukkan pintu kecil di belakang panggung.",
      scene_choices: [
        { text: "Masuk ke pintu kecil", next: "secret_passage" },
        { text: "Minta lebih banyak cerita tentang putri", next: "guard_story" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 9,
    },
    {
      scene_key: "back_room",
      scene_text:
        "Ruang belakang panggung sempit dan berdebu. Ada tangga turun menuju lorong gelap—seperti ruang rahasia.",
      scene_choices: [
        { text: "Turun ke lorong", next: "secret_passage" },
        { text: "Kembali ke pohon Waru", next: "to_sanggar" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 10,
    },
    {
      scene_key: "secret_passage",
      scene_text:
        "Lorong berakhir di sebuah ruangan kecil dengan sebuah patung kayu kecil bergaya putri. Ada aura berbeda: sejuk dan pilu.",
      scene_choices: [
        { text: "Sentuh patung dengan penuh hormat", next: "good_ending" },
        { text: "Ratakan patung dengan niat membuktikan takhayul (brutal)", next: "bad_ending" },
        { text: "Ambil patung dan bawa keluar tanpa memikirkannya", next: "neutral_ending" },
        { text: "Coba menempatkan kotak dari akar pada kaki patung (rahasia)", next: "secret_ending" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 11,
    },

    // ENDINGS
    {
      scene_key: "good_ending",
      scene_text:
        "Kamu menyentuh patung dengan hormat. Angin lembut berputar, dan cahaya kecil muncul. Suara putri terasa lega. Desa merasa damai kembali. Kamu mendapatkan pengakuan dari warga dan cerita dituturkan dengan hangat.",
      scene_choices: [],
      is_ending: true,
      ending_point: 100,
      ending_type: "baik",
      scene_image: null,
      urutan: 100,
    },
    {
      scene_key: "bad_ending",
      scene_text:
        "Kemarahanmu membangkitkan sesuatu yang lama terkurung. Suasana berubah tegang, pohon Waru menggugurkan daun seperti hujan tajam. Kamu tak sempat melarikan diri. Desa menyimpan trauma baru.",
      scene_choices: [],
      is_ending: true,
      ending_point: 0,
      ending_type: "buruk",
      scene_image: null,
      urutan: 101,
    },
    {
      scene_key: "neutral_ending",
      scene_text:
        "Kamu membawa patung keluar; orang-orang melihat tapi tak terjadi apa-apa istimewa. Legenda tetaplah legenda—sebagai cerita di warung kopi. Kamu pergi dengan rasa penasaran yang tak sepenuhnya terjawab.",
      scene_choices: [],
      is_ending: true,
      ending_point: 50,
      ending_type: "netral",
      scene_image: null,
      urutan: 102,
    },
    {
      scene_key: "secret_ending",
      scene_text:
        "Saat kotak dipasang di kaki patung, patung itu seketika menangis embun. Sebuah pintu kecil terbuka, menampakkan relief lama yang menceritakan bahwa putri memilih mengorbankan dirinya untuk menjaga desa. Kamu menemukan catatan rahasia yang memberi nama baru untuk sanggar — dan satu lagu yang tak boleh dilupakan.",
      scene_choices: [],
      is_ending: true,
      ending_point: 999,
      ending_type: "rahasia",
      scene_image: null,
      urutan: 103,
    },

    // Leave village (direct neutral-ish)
    {
      scene_key: "leave_village",
      scene_text:
        "Rasa takut mengalahkan rasa ingin tahu. Kamu meninggalkan desa, tetapi kadang malam kembali menghadirkan mimpi tentang Waru.",
      scene_choices: [],
      is_ending: true,
      ending_point: 40,
      ending_type: "netral",
      scene_image: null,
      urutan: 104,
    },

    {
      scene_key: "ignore_tree",
      scene_text:
        "Kamu pergi dari pohon, tapi rasa bersalah terselip—seolah hal kecil yang kamu abaikan sebenarnya penting. Desa tetap hidup, namun hatimu selalu bertanya-tanya.",
      scene_choices: [],
      is_ending: true,
      ending_point: 30,
      ending_type: "netral",
      scene_image: null,
      urutan: 105,
    },

    {
      scene_key: "guard_story",
      scene_text:
        "Pemuda itu bercerita lebih banyak: konflik lama, cinta yang tak berbalas, dan lagu-lagu yang pernah mengisi sanggar. Dia memperingatkan satu hal: 'Jangan mengambil sembarang barang.'",
      scene_choices: [
        { text: "Tetap masuk ke pintu kecil", next: "secret_passage" },
        { text: "Hormati nasihat dan pergi (netral)", next: "leave_village" },
      ],
      is_ending: false,
      scene_image: null,
      urutan: 106,
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

    await prisma.kategoriCerita.create({
      data:{
        NamaKategori:"Budaya",
      }
    })

  const cerita = await prisma.ceritaInteraktif.create({
        data: {
          judul: "Sanggar Waru: Jejak Putri dan Pohon Waru",
          thumbnail: "https://example.com/thumbnail_sanggar_waru.jpg",
          deskripsi:
            "Versi modern dari legenda Sanggar Waru. Kamu bermain sebagai remaja yang kembali ke desa untuk menyelidiki cerita lama tentang pohon Waru yang dianggap keramat.",
          kategori: 1,
          xp_reward: 150,
          created_by: null,
          created_at: new Date(),
          is_published: true,
        },
  });

  const cerita2 = await prisma.ceritaInteraktif.create({
    data: {
      judul: "Anak dan Ibu: Pilihan yang Tersisa",
      thumbnail: "https://example.com/thumbnail-anak-ibu.jpg",
      deskripsi:
        "Sebuah drama emosional tentang Joko yang dihadapkan pada pilihan: taat pada tradisi, patuh pada ibu, atau mengikuti kata hatinya. Pilihan kecil menimbulkan konsekuensi besar.",
      kategori: 1,
      xp_reward: 300,
      created_by: 1,
      is_published: true,
    },
  })

  for (const s of scenes) {
    await prisma.scene.create({
      data: {
        cerita_id: cerita.cerita_id,
        scene_key: s.scene_key,
        scene_image: s.scene_image ?? null,
        scene_text: s.scene_text,
        scene_choices: s.scene_choices as any,
        is_ending: s.is_ending,
        ending_point: s.ending_point ?? 0,
        ending_type: s.ending_type ?? null,
        urutan: s.urutan ?? null,
      },
    });
    console.log(`Inserted scene ${s.scene_key}`);
  }

    for (const scene of scenes2) {
    await prisma.scene.create({
      data: {
        cerita_id: cerita2.cerita_id,
        scene_key: scene.scene_key,
        scene_text: scene.scene_text,
        scene_choices: scene.scene_choices as any,
        is_ending: scene.is_ending,
        ending_point: scene.ending_point ?? 0,
        ending_type: scene.ending_type ?? null,
        scene_image: scene.scene_image ?? null,
        urutan: scene.urutan ?? null,
      },
    })
  }

  console.log(`Seeder selesai: cerita_id = ${cerita2.cerita_id} (${cerita2.judul})`)



  console.log('✅ Seed puzzle berhasil dimasukkan!');

  console.log("\n📋 Detail per kategori:");
  console.log(`1. Sejarah Kota Tulungagung: 3 kuis, 15 pertanyaan, 75 pilihan`);
  console.log(`2. Industri Marmer Tulungagung: Kategori siap digunakan`);
  console.log(`3. Candi-Candi Tulungagung: Kategori siap digunakan`);
  console.log(`4. Goa dan Pertapaan Tulungagung: Kategori siap digunakan`);
}

main();
