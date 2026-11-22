// ============================================
// BURAYI DOLDUR
// ============================================

// 1) Google Cloud Console'dan aldığın ÜCRETSİZ YouTube Data API v3 anahtarı
//    Nasıl alınır: README.md dosyasındaki adımları takip et.
const API_KEY = "AIzaSyBS9o7fJfjJ2B7nV3buphLRkxgclnndyXo";

// 2) Kanal handle'ın (başındaki @ işaretiyle birlikte)
const CHANNEL_HANDLE = "@bb197iscome";

// 3) Uygulamanın başlığı (istersen değiştir)
const APP_TITLE = "BB_197 TV";

// 4) Uygulamada GÖSTERİLMESİN istediğin videoların ID'lerini buraya ekle.
//    Video ID'sini bulmak için: videonun YouTube linkine bak, "v=" den sonraki kısım.
//    Örnek link: https://www.youtube.com/watch?v=ABC12345xyz  -> ID: ABC12345xyz
//    Birden fazla video gizlemek için virgülle ayırıp ekleyebilirsin.
const HIDDEN_VIDEO_IDS = [
  // "ABC12345xyz",
  // "DEF67890abc",
];
