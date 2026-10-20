import { serviceArea, ssmRegistration } from "./site";
import type { Copy } from "./copy.en";

/**
 * Bahasa Melayu Malaysia, ditulis macam orang Malaysia bercakap dengan pelanggan: mesra tapi kemas,
 * bukan bahasa baku yang kaku dan bukan bunyi Indonesia. Nama jenis unit (Wall Mounted, Ceiling
 * Cassette, Ceiling Exposed), "aircond", "filter", "coil", harga, nombor telefon dan nama tempat
 * dikekalkan seperti yang pelanggan biasa guna. Pemilik perlu semak sekali lagi sebelum launch.
 */
export const ms: Copy = {
  htmlLang: "ms-MY",
  langName: "Bahasa Melayu",
  a11y: {
    skip: "Terus ke kandungan",
    mainNav: "Menu utama",
    home: "AJ Airconditioning Services, kembali ke atas",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    language: "Bahasa",
    languageGroup: "Pilih bahasa",
    opensWhatsApp: "(buka WhatsApp dalam tab baru)",
    opensNewTab: "(buka dalam tab baru)",
  },
  nav: ["Utama", "Servis", "Harga", "Jenis Unit", "Galeri", "Soalan Lazim", "Hubungi Kami"],
  cta: {
    bookNow: "Tempah Sekarang",
    viewServices: "Lihat Servis",
    whatsappName: "WhatsApp {name}",
    call: "Telefon",
  },
  hero: {
    eyebrow: "Servis aircond · Kuala Lumpur & Selangor",
    titleA: "Confirm sejuk,",
    titleB: "kerja mantap dan kemas.",
    body: "Servis, cuci kimia, tambah gas dan baiki aircond wall mounted, ceiling cassette dan ceiling exposed di Kuala Lumpur dan Selangor. Harga jelas ikut jenis unit, bukan ikut HP.",
    startingFrom: "Mula dari",
    startingNote: "Cuci kimia aircond wall mounted",
    facts: [
      { title: serviceArea, note: "Kawasan servis kami" },
      { title: "Rumah & premis perniagaan", note: "Kediaman dan komersial" },
      { title: "Berdaftar dengan SSM", note: ssmRegistration },
    ],
  },
  services: {
    eyebrow: "Servis",
    title: "Servis kami",
    intro:
      "Servis, cuci, gas dan pembaikan aircond untuk rumah dan premis perniagaan di Kuala Lumpur dan Selangor.",
    items: [
      {
        title: "Cuci Kimia",
        body: "Cuci dalam-dalam coil, blower dan saluran air unit dalam untuk buang kotoran, bau dan sumbatan.",
        points: ["Cuci coil & blower", "Bilas dulang air", "Cuci filter"],
      },
      {
        title: "Tambah Gas",
        body: "Periksa tekanan dan tambah gas bila aircond hidup tapi tak sejuk macam sepatutnya.",
        points: ["Bacaan tekanan", "Tambah gas", "Uji kesejukan"],
      },
      {
        title: "Pembaikan",
        body: "Selesaikan masalah biasa macam air bocor, bunyi bising, tak sejuk atau aircond tak boleh hidup.",
        points: ["Periksa kerosakan", "Penerangan yang jelas", "Sebut harga dulu sebelum mula"],
      },
      {
        title: "Servis Am",
        body: "Servis berkala unit dalam dan unit luar, termasuk cuci filter dan coil, periksa saluran air serta semak prestasi kesejukan.",
        points: ["Cuci unit dalam & luar", "Cuci filter & coil", "Periksa saluran air"],
      },
      {
        title: "Penyelenggaraan Berkala",
        body: "Penyelenggaraan rutin dan pemeriksaan sistem, dengan cadangan servis supaya aircond anda sentiasa elok.",
        points: ["Pemeriksaan sistem", "Semak saluran air", "Cadangan servis"],
      },
    ],
  },
  problems: {
    title: "Aircond ada masalah?",
    intro: "Pilih masalah yang anda alami dan kami siapkan borang tempahan dulu.",
    items: {
      cooling: { label: "Kurang sejuk", note: "Aircond saya kurang sejuk." },
      airflow: { label: "Angin lemah", note: "Angin aircond saya lemah." },
      leak: { label: "Air bocor", note: "Aircond saya bocor air." },
      noise: { label: "Bunyi pelik", note: "Aircond saya berbunyi pelik." },
      smell: { label: "Berbau", note: "Aircond saya berbau tak sedap." },
      power: { label: "Tak boleh hidup", note: "Aircond saya tak boleh hidup." },
    },
  },
  pricing: {
    eyebrow: "Harga",
    title: "Harga ikut jenis unit",
    lead: "Bukan ikut HP.",
    rest: "Satu harga yang jelas untuk setiap unit, berapa pun HP.",
    perUnit: "setiap unit · berapa pun HP",
    mostCommon: "Paling biasa",
    choose: "Pilih unit ini",
  },
  units: {
    eyebrow: "Jenis unit",
    title: "Jenis aircond yang kami servis",
    intro: "Untuk rumah, pejabat dan premis perniagaan lain.",
    notes: [
      "Jenis split yang paling biasa di rumah dan pejabat.",
      "Dipasang dalam siling dengan aliran udara empat arah.",
      "Unit tergantung pada siling untuk ruang terbuka yang lebih besar.",
    ],
    alts: [
      "Unit dalam aircond split wall mounted warna putih dipasang tinggi pada dinding",
      "Aircond ceiling cassette dipasang pada siling ruang komersial sementara juruteknik AJ membuka panel filternya",
      "Unit aircond ceiling exposed warna putih dipasang pada aras siling di bawah siling gantung",
    ],
  },
  gallery: {
    eyebrow: "Galeri kerja",
    title: "Hasil kerja kami",
    intro: "Foto kerja sebenar AJ. Tekan foto untuk lihat lebih besar.",
    viewLarger: "Lihat lebih besar: {label}",
    previous: "Foto sebelum ini",
    next: "Foto seterusnya",
    labels: [
      "Servis ceiling cassette",
      "Periksa ceiling cassette",
      "Cuci aircond wall mounted",
      "Servis unit luar",
      "Basuh unit wall mounted",
      "Bilas unit wall mounted",
      "Periksa unit luar",
      "Servis wall mounted di ruang komersial",
      "Mengendalikan unit luar",
    ],
    alts: [
      "Juruteknik membuka panel filter aircond ceiling cassette semasa servis",
      "Juruteknik guna gerudi tanpa wayar untuk buka panel unit ceiling cassette",
      "Juruteknik mencuci aircond wall mounted dengan penutup pelindung dan beg penadah air",
      "Juruteknik di atas tangga sedang kerja pada unit luar aircond yang dipasang pada dinding bangunan",
      "Juruteknik berlampu kepala membasuh unit wall mounted di bawah kain pelindung dengan hos saliran",
      "Juruteknik membilas aircond wall mounted dengan alat semburan di atas penutup pelindung",
      "Juruteknik memeriksa unit luar aircond yang dipasang pada birai tingkap",
      "Juruteknik menservis aircond wall mounted yang tinggi pada dinding dalam ruang komersial",
      "Dua juruteknik mengendalikan unit luar aircond dalam sebuah pangsapuri",
    ],
  },
  process: {
    eyebrow: "Cara kami bekerja",
    title: "Mudah, dari tempahan sampai sejuk",
    intro:
      "Kami periksa unit anda, terangkan apa yang perlu dibuat, kemudian servis dan uji kesejukan bersama anda sebelum anda bayar.",
    steps: [
      { title: "WhatsApp kami", body: "Beritahu jenis unit, bilangan dan lokasi anda." },
      { title: "Sahkan slot", body: "Kita tetapkan tarikh dan masa yang sesuai dengan anda." },
      { title: "Servis di lokasi", body: "Juruteknik kami periksa dan servis unit anda." },
      { title: "Semak & bayar", body: "Kami uji kesejukan bersama anda sebelum anda bayar." },
    ],
  },
  reviews: {
    eyebrow: "Ulasan",
    title: "Kata pelanggan di Google",
    intro:
      "Ulasan sebenar yang disalin daripada listing Google AJ pada {date}. Ia dipaparkan seperti asal, dalam kata-kata pelanggan sendiri. Ini ialah petikan pada tarikh itu dan tidak dikemas kini secara automatik.",
    stars: "5 bintang daripada 5",
    localGuide: "Google Local Guide",
    shortened: "Dipendekkan di sini. Baca ulasan penuh di Google.",
    source: "Sumber: ulasan Google",
    viewAll: "Lihat semua ulasan di Google",
    dateLabel: "20 Okt 2026",
  },
  area: {
    eyebrow: "Kawasan servis",
    title: "Kuala Lumpur & Selangor",
    intro: "Buat masa ini kami hanya servis di Kuala Lumpur dan Selangor.",
    note: "Liputan kami ikut kawasan umum. Kami tak dapat jamin setiap kawasan kejiranan, jadi tanya kami dulu sebelum tempah.",
    ctaLead: "Tak pasti kami layan kawasan anda?",
    ctaTail: "Tanya kami dulu sebelum tempah.",
    ctaBody: "Beritahu kawasan anda dan kami akan maklumkan sama ada kami boleh bantu.",
    ctaButton: "Tanya pasal kawasan saya",
    ctaNote: "Boleh sahkan sama ada anda servis kawasan saya: ",
    mapCaption:
      "Peta umum kawasan servis. Penanda menunjukkan kawasan, bukan lokasi kedai atau pejabat.",
    mapAttribution: "© penyumbang OpenStreetMap",
    pinLabel: "{name}: buka dalam Google Maps",
    openMap: "Buka dalam Google Maps",
    mapTitle: "Peta Google: paparan umum Kuala Lumpur dan Selangor",
  },
  faq: {
    eyebrow: "Soalan Lazim",
    title: "Soalan lazim",
    items: [
      {
        q: "Adakah harga ikut kuasa kuda (HP)?",
        a: "Tidak. Harga kami ikut jenis unit — Wall Mounted, Ceiling Cassette atau Ceiling Exposed — bukan ikut HP.",
      },
      {
        q: "Apa yang termasuk dalam cuci kimia?",
        a: "Cuci dalam-dalam coil, blower dan saluran air unit dalam untuk buang kotoran, bau dan sumbatan yang tak dapat dicapai dengan cucian biasa.",
      },
      {
        q: "Aircond tak sejuk. Kena tambah gas ke?",
        a: "Belum tentu. Kurang sejuk boleh jadi sebab kotoran, sumbatan atau gas yang rendah. Kami periksa dulu dan terangkan apa yang perlu sebelum mula kerja.",
      },
      {
        q: "Macam mana nak tempah?",
        a: "Hantar mesej WhatsApp dengan jenis unit, bilangan unit dan lokasi anda, nanti kami sahkan slot dengan anda.",
      },
      {
        q: "Kawasan mana yang anda layan?",
        a: "Kami layan Kuala Lumpur dan Selangor. Tak pasti kawasan anda dilayan atau tidak? Hantar mesej WhatsApp dan kami akan beritahu.",
      },
      {
        q: "Anda servis rumah dan premis perniagaan juga?",
        a: "Ya. Kami layan premis kediaman, komersial dan perniagaan di Kuala Lumpur dan Selangor.",
      },
      {
        q: "Ada tak penyelenggaraan berkala?",
        a: "Ada. Penyelenggaraan berkala merangkumi penyelenggaraan rutin, pemeriksaan sistem, semakan saluran air dan cadangan servis untuk membantu kekalkan prestasi aircond.",
      },
      {
        q: "Anda pasang aircond juga?",
        a: "Ya. Selain servis, cuci kimia, penyelenggaraan, perkhidmatan gas serta pembaikan dan periksa kerosakan, kami juga pasang aircond. Hantar mesej WhatsApp dengan jenis unit dan lokasi anda untuk tanya pasal pemasangan.",
      },
    ],
  },
  contact: {
    eyebrow: "Hubungi Kami",
    title: "Tempah servis anda hari ini",
    intro: "WhatsApp kami jenis unit, bilangan unit dan lokasi anda.",
    amirul: "Amirul",
    admin: "Admin",
    greeting: "Hai AJ Airconditioning, saya nak tempah servis aircond.",
  },
  form: {
    title: "Permintaan tempahan",
    intro:
      "Isi butiran, semak mesej, kemudian hantar melalui WhatsApp. Ini permintaan tempahan, bukan temu janji yang sudah disahkan. AJ akan sahkan slot dengan anda.",
    required: "Wajib",
    optional: "Pilihan",
    unit: "Jenis unit",
    quantity: "Bilangan unit",
    quantityLess: "Kurangkan unit",
    quantityMore: "Tambah unit",
    service: "Servis yang diperlukan",
    area: "Lokasi / kawasan",
    areaHelp: "Tulis nama bandar atau kawasan anda dalam nota.",
    notes: "Nota tambahan",
    notesPlaceholder: "cth. nama bandar atau kawasan, hari yang sesuai",
    notesCount: "{n} / {max}",
    serviceLabels: {
      general: "Servis Am",
      chemical: "Cuci Kimia",
      repair: "Pembaikan & periksa kerosakan",
      gas: "Perkhidmatan gas aircond",
      preventive: "Penyelenggaraan Berkala",
      install: "Pemasangan aircond (pertanyaan)",
    },
    priceNote:
      "Harga tersenarai untuk {unit}: RM{price} setiap unit (ikut jenis unit, bukan HP). AJ akan sahkan apa yang unit anda perlukan.",
    installNote: "Butiran pemasangan akan disahkan oleh AJ melalui WhatsApp.",
    errors: {
      summary: "Sila lengkapkan ruangan yang ditanda.",
      unit: "Sila pilih jenis unit.",
      service: "Sila pilih servis.",
      area: "Sila pilih kawasan anda.",
    },
    review: "Semak permintaan saya",
    reviewTitle: "Permintaan anda sudah siap",
    reviewIntro:
      "Belum ada apa-apa yang dihantar. Pilih siapa yang anda nak hubungi, kemudian tekan Hantar dalam WhatsApp. AJ akan sahkan slot dengan anda.",
    messageLabel: "Mesej anda",
    sendVia: "Hantar kepada",
    edit: "Ubah butiran",
    startOver: "Mula semula",
    stepDetails: "Butiran",
    stepCheck: "Semak",
    stepSend: "Hantar",
    msg: {
      greet: "Hai AJ Airconditioning, saya nak buat tempahan servis aircond.",
      greetInstall: "Hai AJ Airconditioning, saya nak tanya pasal pemasangan aircond.",
      service: "Servis",
      unit: "Jenis unit",
      quantity: "Bilangan unit",
      area: "Lokasi",
      notes: "Nota",
      closing: "Tolong sahkan slot. Terima kasih.",
      closingInstall: "Tolong beritahu butirannya. Terima kasih.",
    },
  },
  floating: {
    open: "Hubungi AJ melalui WhatsApp",
    welcome: "Nak tanya sesuatu?",
    title: "Hubungi AJ melalui WhatsApp",
    body: "Pilih siapa yang anda nak hubungi. WhatsApp akan dibuka dalam tab baru dan tiada mesej dihantar sehingga anda tekan Hantar.",
    close: "Tutup pilihan sembang",
  },
  footer: {
    tagline:
      "Servis, cuci kimia, tambah gas, pembaikan dan penyelenggaraan berkala di Kuala Lumpur dan Selangor. Harga ikut jenis unit, bukan HP.",
    pricing: "Harga",
    contact: "Hubungi Kami",
    contactNote: "Nombor telefon dan WhatsApp ada di bahagian Hubungi Kami.",
    contactLink: "Ke bahagian Hubungi Kami",
    area: "Kawasan servis: {area}",
    ssm: "No. Pendaftaran SSM {no}",
    credits: "Kredit foto",
  },
  credits: {
    title: "Kredit foto",
    intro: "Kebanyakan foto di laman ini milik AJ. Dua foto ini digunakan di bawah lesen terbuka.",
    by: "oleh",
    via: "melalui",
    items: [
      {
        use: "Foto Ceiling Exposed",
        changes:
          "Dipotong, diubah saiz dan dicerahkan; imej yang diubah suai ini dikongsi di bawah lesen yang sama.",
      },
      { use: "Foto Wall Mounted", changes: "Dipotong dan diubah saiz." },
    ],
  },
};
