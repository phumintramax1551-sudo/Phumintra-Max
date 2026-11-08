export type Language = 'th' | 'ms' | 'en';

export interface Translations {
  gameTitle: string;
  gameSubtitle: string;
  playNow: string;
  classicMap: string;
  desertMap: string;
  iceMap: string;
  tdmMode: string;
  mutantMode: string;
  trainingMode: string;
  gold: string;
  gems: string;
  guestWarning: string;
  loginGuest: string;
  loginGoogle: string;
  selectAccount: string;
  leadDevBadge: string;
  vipBadge: string;
  profile: string;
  changeNickname: string;
  saveNickname: string;
  store: string;
  angelRoyale: string;
  wardrobe: string;
  quiz: string;
  dailyReward: string;
  claim: string;
  claimed: string;
  exchange: string;
  exchangeDesc: string;
  exchangeBtn: string;
  spin1: string;
  spin10: string;
  congrats: string;
  equipped: string;
  equip: string;
  buy: string;
  free: string;
  danceHeal: string;
  emotes: string;
  health: string;
  armor: string;
  ammo: string;
  kills: string;
  deaths: string;
  score: string;
  victory: string;
  defeat: string;
  playAgain: string;
  quitLobby: string;
  resume: string;
  settings: string;
  sensitivity: string;
  volume: string;
  botGender: string;
  character: string;
  evaDesc: string;
  kevinDesc: string;
  kellyDesc: string;
  hayatoDesc: string;
  gameFile: string;
  exportJson: string;
}

export const I18N: Record<Language, Translations> = {
  th: {
    gameTitle: 'CYBER ANGEL: TACTICAL FPS',
    gameSubtitle: 'สุดยอดเกมยิง 3D สไตล์ Bullet Angel & Free Fire บน Google Play',
    playNow: 'เริ่มเกม (PLAY)',
    classicMap: 'ไซเบอร์ ซิตี้ (Classic City)',
    desertMap: 'โอเอซิสทะเลทราย (Desert Outpost)',
    iceMap: 'ภูเขาน้ำแข็ง (Frozen Tundra)',
    tdmMode: 'ทีมเดธแมตช์ (TDM 5v5)',
    mutantMode: 'มัมมี่กลายพันธุ์ (Mutant)',
    trainingMode: 'ห้องซ้อมยิง (Training)',
    gold: 'ทอง (Gold)',
    gems: 'เพชร (Gems)',
    guestWarning: 'เล่นเป็นเกสต์ (Guest): ข้อมูลอาจสูญหายหากคุณล้างประวัติเบราว์เซอร์',
    loginGuest: 'เข้าเล่นเป็นเกสต์ (Guest)',
    loginGoogle: 'เข้าสู่ระบบด้วย Google',
    selectAccount: 'เลือกวิธีการเข้าเล่นเกม',
    leadDevBadge: '👑 ผู้พัฒนาเกมอันดับ 1 (VIP No.1 Lead Dev)',
    vipBadge: 'VIP ระดับ',
    profile: 'โปรไฟล์ผู้เล่น',
    changeNickname: 'เปลี่ยนชื่อเล่น (Nickname)',
    saveNickname: 'บันทึกชื่อ',
    store: 'ร้านค้าสโตร์ (Store)',
    angelRoyale: 'แองเจิ้ลรอยัล (Angel Royale)',
    wardrobe: 'ตู้เสื้อผ้า / แต่งตัว',
    quiz: 'ควิซกลยุทธ์ (Quiz)',
    dailyReward: 'ของขวัญรายวัน (Daily Check-in)',
    claim: 'รับรางวัล',
    claimed: 'รับแล้ว',
    exchange: 'แลกเปลี่ยนเพชร (Exchange)',
    exchangeDesc: 'แลก 500 เหรียญทอง รับทันที 90 เพชร',
    exchangeBtn: 'แลก 500 ทอง ➔ 90 เพชร',
    spin1: 'สุ่ม 1 ครั้ง',
    spin10: 'สุ่ม 10 ครั้ง (ลด 10%)',
    congrats: 'ยินดีด้วย! คุณได้รับไอเทม',
    equipped: 'สวมใส่อยู่',
    equip: 'สวมใส่',
    buy: 'ซื้อทันที',
    free: 'ฟรี (FREE)',
    danceHeal: 'เต้นฟื้นฟูเลือด (Dance Heal) [V]',
    emotes: 'ท่าเต้น / อีโมจิ',
    health: 'พลังชีวิต (HP)',
    armor: 'เกราะป้องกัน (ARMOR)',
    ammo: 'กระสุน (AMMO)',
    kills: 'สังหาร',
    deaths: 'ตาย',
    score: 'คะแนน',
    victory: 'ชัยชนะสุดยิ่งใหญ่! (VICTORY)',
    defeat: 'พ่ายแพ้ (DEFEAT)',
    playAgain: 'เล่นใหม่อีกครั้ง',
    quitLobby: 'กลับสู่ล็อบบี้',
    resume: 'กลับเข้าสู่เกม',
    settings: 'ตั้งค่าระบบ',
    sensitivity: 'ความไวเมาส์',
    volume: 'ระดับเสียง',
    botGender: 'เพศของบอทศัตรู',
    character: 'เลือกตัวละครหลัก',
    evaDesc: 'เอวา (Eva) - แองเจิ้ลสาวผู้ปราดเปรียว ว่องไวและแม่นยำสูง',
    kevinDesc: 'เควิน (Kevin) - หน่วยรบเกราะหนัก ทนทาน ชำนาญปืนไรเฟิล',
    kellyDesc: 'เคลลี่ (Kelly) - นักวิ่งสาวลมกรด เคลื่อนที่เร็วหลบหลีกยอดเยี่ยม',
    hayatoDesc: 'ฮายาโตะ (Hayato) - ซามูไรผู้ทะนงตน ชำนาญการต่อสู้ระยะประชิด',
    gameFile: 'สำรองไฟล์เกม (Save Backup)',
    exportJson: 'ดาวน์โหลดไฟล์เกม (.json)',
  },
  ms: {
    gameTitle: 'CYBER ANGEL: TACTICAL FPS',
    gameSubtitle: 'Permainan Menembak 3D Gaya Bullet Angel & Free Fire untuk Google Play',
    playNow: 'MULA MAIN (PLAY)',
    classicMap: 'Bandar Siber (Classic City)',
    desertMap: 'Kubu Gurun (Desert Outpost)',
    iceMap: 'Gunung Ais (Frozen Tundra)',
    tdmMode: 'Perlawanan Pasukan (TDM 5v5)',
    mutantMode: 'Wabak Mutan (Mutant)',
    trainingMode: 'Latihan Menembak (Training)',
    gold: 'Emas (Gold)',
    gems: 'Permata (Gems)',
    guestWarning: 'Main sebagai Tetamu: Data mungkin hilang jika anda memadam cache pelayar.',
    loginGuest: 'Main Sebagai Tetamu (Guest)',
    loginGoogle: 'Log Masuk dengan Google',
    selectAccount: 'Pilih Kaedah Log Masuk',
    leadDevBadge: '👑 Pembangun Utama No.1 (VIP No.1 Lead Dev)',
    vipBadge: 'Tahap VIP',
    profile: 'Profil Pemain',
    changeNickname: 'Tukar Nama Panggilan',
    saveNickname: 'Simpan Nama',
    store: 'Kedai Barangan (Store)',
    angelRoyale: 'Angel Royale (Cabutan Bertuah)',
    wardrobe: 'Almari Pakaian / Kostum',
    quiz: 'Kuiz Taktikal (Quiz)',
    dailyReward: 'Ganjaran Harian (Daily Check-in)',
    claim: 'Tuntut Ganjaran',
    claimed: 'Dituntut',
    exchange: 'Tukar Permata (Exchange)',
    exchangeDesc: 'Tukar 500 Emas untuk 90 Permata',
    exchangeBtn: 'Tukar 500 Emas ➔ 90 Permata',
    spin1: 'Pusing 1 Kali',
    spin10: 'Pusing 10 Kali (Diskaun 10%)',
    congrats: 'Tahniah! Anda Memperoleh Item',
    equipped: 'Sedang Dipakai',
    equip: 'Pakai',
    buy: 'Beli Sekarang',
    free: 'PERCUMA (FREE)',
    danceHeal: 'Tarian Penyembuhan (Dance Heal) [V]',
    emotes: 'Tarian / Emosi',
    health: 'Kesihatan (HP)',
    armor: 'Perisai (ARMOR)',
    ammo: 'Peluru (AMMO)',
    kills: 'Bunuh',
    deaths: 'Mati',
    score: 'Skor',
    victory: 'KEMENANGAN MUTLAK! (VICTORY)',
    defeat: 'KEKALAHAN (DEFEAT)',
    playAgain: 'Main Semula',
    quitLobby: 'Kembali ke Lobi',
    resume: 'Sambung Permainan',
    settings: 'Tetapan Sistem',
    sensitivity: 'Kepekaan Tetikus',
    volume: 'Kelantangan Bunyi',
    botGender: 'Jantina Bot Musuh',
    character: 'Pilih Watak Utama',
    evaDesc: 'Eva - Valkyrie tangkas dengan ketepatan menembak tinggi',
    kevinDesc: 'Kevin - Pahlawan perisai berat dengan pertahanan teguh',
    kellyDesc: 'Kelly - Pelari pantas dengan kelajuan larian luar biasa',
    hayatoDesc: 'Hayato - Samurai berani mahir dalam pertempuran jarak dekat',
    gameFile: 'Sandaran Fail Permainan (Save Backup)',
    exportJson: 'Muat Turun Fail Permainan (.json)',
  },
  en: {
    gameTitle: 'CYBER ANGEL: TACTICAL FPS',
    gameSubtitle: 'Ultimate 3D Tactical Shooter inspired by Bullet Angel & Free Fire for Google Play',
    playNow: 'START GAME (PLAY)',
    classicMap: 'Cyber City (Classic Map)',
    desertMap: 'Desert Outpost (Sahara Dunes)',
    iceMap: 'Frozen Tundra (Ice Mountain)',
    tdmMode: 'Team Deathmatch (TDM 5v5)',
    mutantMode: 'Mutant Outbreak',
    trainingMode: 'Shooting Range',
    gold: 'Gold',
    gems: 'Gems',
    guestWarning: 'Playing as Guest: Data may be cleared if browser storage is wiped.',
    loginGuest: 'Play as Guest',
    loginGoogle: 'Sign in with Google',
    selectAccount: 'Select Login Method',
    leadDevBadge: '👑 No.1 Lead Developer (VIP Creator)',
    vipBadge: 'VIP Rank',
    profile: 'Player Profile',
    changeNickname: 'Change Nickname',
    saveNickname: 'Save Name',
    store: 'Store & Armory',
    angelRoyale: 'Angel Royale (Lucky Draw)',
    wardrobe: 'Wardrobe & Outfits',
    quiz: 'Tactical Quiz',
    dailyReward: 'Daily Check-in Rewards',
    claim: 'Claim Reward',
    claimed: 'Claimed',
    exchange: 'Gem Exchange',
    exchangeDesc: 'Exchange 500 Gold for 90 Gems',
    exchangeBtn: 'Convert 500 Gold ➔ 90 Gems',
    spin1: 'Spin 1x',
    spin10: 'Spin 10x (10% OFF)',
    congrats: 'Congratulations! You unlocked',
    equipped: 'Equipped',
    equip: 'Equip',
    buy: 'Buy Now',
    free: 'FREE',
    danceHeal: 'Angel Dance Heal [V]',
    emotes: 'Dance Emotes',
    health: 'Health (HP)',
    armor: 'Body Armor',
    ammo: 'Ammunition',
    kills: 'Kills',
    deaths: 'Deaths',
    score: 'Score',
    victory: 'VICTORY!',
    defeat: 'DEFEAT',
    playAgain: 'Play Again',
    quitLobby: 'Return to Lobby',
    resume: 'Resume Game',
    settings: 'Settings',
    sensitivity: 'Mouse Sensitivity',
    volume: 'Master Volume',
    botGender: 'Enemy Bot Genders',
    character: 'Select Operative',
    evaDesc: 'Eva - Agile angel operative with pinpoint accuracy',
    kevinDesc: 'Kevin - Heavy armored juggernaut built for intense firefights',
    kellyDesc: 'Kelly - High-speed athletic runner with superior sprint speed',
    hayatoDesc: 'Hayato - Resolute samurai warrior specializing in close combat',
    gameFile: 'Game File Backup',
    exportJson: 'Download Game Data (.json)',
  },
};
