# Kanal TV — Kendi YouTube Kanalın İçin Netflix Tarzı Uygulama

Bu, **@barlasyt_bb197** kanalındaki videoları Netflix benzeri bir arayüzde gösteren,
tek kod tabanıyla PS4 Pro, Xbox, PC, Linux ve Android'de **tarayıcı üzerinden** çalışan
bir web uygulamasıdır. Videolar YouTube'un resmi API'si üzerinden, YouTube'un kendi
oynatıcısıyla (embed) oynatılır — hiçbir video indirilmez veya kopyalanmaz.

## 1) YouTube API Anahtarı Al (ücretsiz, 5 dakika)

1. https://console.cloud.google.com/ adresine git, Google hesabınla giriş yap.
2. Üstten "Yeni Proje" oluştur (herhangi bir isim verebilirsin).
3. Sol menüden **APIs & Services > Library** yoluna git.
4. "YouTube Data API v3" ara ve **Enable** (etkinleştir) butonuna bas.
5. Sol menüden **APIs & Services > Credentials** yoluna git.
6. **Create Credentials > API Key** seçeneğine tıkla. Sana bir anahtar (uzun bir kod) verecek.
7. Bu anahtarı kopyala.

## 2) config.js Dosyasını Doldur

`config.js` dosyasını bir metin editörüyle aç:

```js
const API_KEY = "BURAYA_API_ANAHTARINI_YAPISTIR"; // ← kopyaladığın anahtarı buraya yapıştır
const CHANNEL_HANDLE = "@barlasyt_bb197";          // ← zaten doğru, değiştirmene gerek yok
const APP_TITLE = "Barlas TV";                      // ← istersen uygulamanın adını değiştir
```

## 3) Uygulamayı Yayına Al (herkese/tüm cihazlara açık bir link için)

PS4, Xbox gibi cihazlarda yerel dosya açmak zor olduğu için en kolay yol,
uygulamayı **ücretsiz** bir adrese koymak:

### En kolay yöntem: GitHub Pages
1. https://github.com adresinde ücretsiz bir hesap aç.
2. Yeni bir repo oluştur (örn: `kanal-tv`).
3. Bu klasördeki tüm dosyaları (`index.html`, `style.css`, `app.js`, `config.js`,
   `manifest.json`, `icon.svg`) o repoya yükle.
4. Repo ayarlarından **Settings > Pages** bölümüne git, "Deploy from branch" seç, `main` dalını seç.
5. Birkaç dakika sonra sana şöyle bir adres verecek:
   `https://kullaniciadin.github.io/kanal-tv/`

Bu adresi artık **her cihazda** kullanabilirsin.

(Alternatif: Netlify, Vercel gibi siteler de aynı işi ücretsiz yapar — dosyaları sürükleyip
bırakman yeterli.)

## 4) Her Cihazda Nasıl Açılır

| Cihaz | Nasıl açılır |
|---|---|
| **PS4 Pro** | Ayarlar > Ağ > İnternet Tarayıcısı'nı aç, adres çubuğuna linki yaz. Açıldıktan sonra tarayıcı menüsünden "favorilere ekle" dersen tek tıkla erişebilirsin. |
| **Xbox** | Microsoft Store'dan **Edge** tarayıcısını indir (yoksa), linki aç. |
| **PC / Linux** | Chrome, Firefox veya herhangi bir tarayıcıda linki aç. |
| **Android** | Chrome'da linki aç, sağ üstteki ⋮ menüsünden **"Ana ekrana ekle"** de — gerçek bir uygulama ikonu gibi ayrı pencerede açılır. |

## Notlar

- Uygulama hiçbir videoyu indirmiyor ya da kopyalamıyor; sadece YouTube'un kendi
  oynatıcısını (embed) açıyor. Videolar kanalından silinir/gizlenirse burada da kaybolur.
- İzlenme sayısına göre "En Çok İzlenenler" satırı otomatik oluşur.
- Arama kutusu video başlıklarında anlık arama yapar.
- Profiller şu an sadece kozmetik (farklı kişiler için isim göstergesi); her cihazın
  kendi tarayıcı hafızasında ayrı ayrı tutulur.
