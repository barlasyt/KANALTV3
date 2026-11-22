// ================== DURUM ==================
let allVideos = [];
let uploadsPlaylistId = null;

const els = {
  profileScreen: document.getElementById('profile-screen'),
  mainScreen: document.getElementById('main-screen'),
  profileList: document.getElementById('profile-list'),
  addProfileBtn: document.getElementById('add-profile-btn'),
  currentProfile: document.getElementById('current-profile'),
  search: document.getElementById('search-input'),
  hero: document.getElementById('hero'),
  heroTitle: document.getElementById('hero-title'),
  heroDesc: document.getElementById('hero-desc'),
  heroPlay: document.getElementById('hero-play'),
  rows: document.getElementById('rows-container'),
  modal: document.getElementById('player-modal'),
  frame: document.getElementById('video-frame'),
  playerTitle: document.getElementById('player-title'),
  closePlayer: document.getElementById('close-player'),
  loading: document.getElementById('loading'),
  errorBox: document.getElementById('error-box'),
};

document.getElementById('app-title').textContent = APP_TITLE;
document.getElementById('app-title-profile').textContent = APP_TITLE;

// ================== PROFİLLER (sadece yerel, kozmetik) ==================
function getProfiles(){
  return JSON.parse(localStorage.getItem('profiles') || '["Ben"]');
}
function saveProfiles(list){
  localStorage.setItem('profiles', JSON.stringify(list));
}
function renderProfiles(){
  const list = getProfiles();
  els.profileList.innerHTML = '';
  list.forEach(name=>{
    const btn = document.createElement('button');
    btn.className = 'profile-card';
    btn.innerHTML = `<div class="profile-avatar">${name[0].toUpperCase()}</div><span>${name}</span>`;
    btn.onclick = ()=> selectProfile(name);
    els.profileList.appendChild(btn);
  });
}
function selectProfile(name){
  localStorage.setItem('activeProfile', name);
  els.currentProfile.textContent = name[0].toUpperCase();
  els.profileScreen.classList.add('hidden');
  els.mainScreen.classList.remove('hidden');
  if(allVideos.length === 0) loadChannel();
}
els.addProfileBtn.onclick = ()=>{
  const name = prompt('Yeni profil adı:');
  if(name && name.trim()){
    const list = getProfiles();
    list.push(name.trim());
    saveProfiles(list);
    renderProfiles();
  }
};
renderProfiles();

// ================== YOUTUBE VERİSİ ==================
function showLoading(on){ els.loading.classList.toggle('hidden', !on); }
function showError(msg){
  els.errorBox.textContent = msg;
  els.errorBox.classList.remove('hidden');
}

async function loadChannel(){
  if(!API_KEY || API_KEY.includes('BURAYA')){
    showError('Lütfen config.js dosyasına kendi YouTube API anahtarını gir. README.md dosyasına bak.');
    return;
  }
  showLoading(true);
  try{
    // 1) Handle -> kanal ID ve uploads playlist ID
    const chRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(CHANNEL_HANDLE.replace('@',''))}&key=${API_KEY}`);
    const chData = await chRes.json();

    // API'den gelen gerçek hatayı göster (yanlış anahtar, kapalı API, vs.)
    if(chData.error){
      showError('YouTube API hatası: ' + chData.error.message);
      showLoading(false);
      console.error('YouTube API error:', chData.error);
      return;
    }
    if(!chData.items || chData.items.length === 0){
      showError('Kanal bulunamadı (API anahtarı ve CHANNEL_HANDLE doğru görünüyor ama sonuç boş döndü). Konsolu (F12) kontrol et.');
      showLoading(false);
      console.error('Boş yanıt:', chData);
      return;
    }
    uploadsPlaylistId = chData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2) Uploads playlist'ten videoları çek (ilk 50)
    const plRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${API_KEY}`);
    const plData = await plRes.json();
    const items = (plData.items || []).filter(it => it.snippet && it.snippet.resourceId);

    const videoIds = items.map(it => it.snippet.resourceId.videoId).join(',');

    // 3) İstatistikler (izlenme sayısı) için videos.list
    const statsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`);
    const statsData = await statsRes.json();
    const statsMap = {};
    (statsData.items || []).forEach(v=>{ statsMap[v.id] = v.statistics; });

    allVideos = items
      .map(it=>{
        const vid = it.snippet.resourceId.videoId;
        return {
          id: vid,
          title: it.snippet.title,
          desc: it.snippet.description,
          thumb: (it.snippet.thumbnails.high || it.snippet.thumbnails.default).url,
          publishedAt: it.snippet.publishedAt,
          views: statsMap[vid] ? parseInt(statsMap[vid].viewCount || 0) : 0,
        };
      })
      // config.js içindeki HIDDEN_VIDEO_IDS listesindeki videoları ele
      .filter(v => !(typeof HIDDEN_VIDEO_IDS !== 'undefined' && HIDDEN_VIDEO_IDS.includes(v.id)));

    showLoading(false);
    renderHero();
    renderRows(allVideos);
  }catch(e){
    showLoading(false);
    showError('Veri çekilirken hata oluştu: ' + e.message);
  }
}

function renderHero(){
  if(allVideos.length === 0) return;
  const featured = allVideos[0];
  els.hero.style.backgroundImage = `url(${featured.thumb})`;
  els.heroTitle.textContent = featured.title;
  els.heroDesc.textContent = (featured.desc || '').slice(0,160);
  els.heroPlay.onclick = ()=> playVideo(featured);
}

function makeRow(title, videos){
  const row = document.createElement('div');
  row.className = 'row';
  const h3 = document.createElement('h3');
  h3.textContent = title;
  const scroll = document.createElement('div');
  scroll.className = 'row-scroll';
  videos.forEach(v=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<img src="${v.thumb}" loading="lazy"><div class="card-title">${v.title}</div>`;
    card.onclick = ()=> playVideo(v);
    scroll.appendChild(card);
  });
  row.appendChild(h3);
  row.appendChild(scroll);
  return row;
}

function renderRows(videos){
  els.rows.innerHTML = '';
  const newest = [...videos].sort((a,b)=> new Date(b.publishedAt) - new Date(a.publishedAt));
  const mostViewed = [...videos].sort((a,b)=> b.views - a.views);

  els.rows.appendChild(makeRow('Son Yüklenenler', newest));
  els.rows.appendChild(makeRow('En Çok İzlenenler', mostViewed));
  els.rows.appendChild(makeRow('Tüm Videolar', videos));
}

// ================== ARAMA ==================
els.search.addEventListener('input', ()=>{
  const q = els.search.value.trim().toLowerCase();
  if(!q){ renderRows(allVideos); return; }
  const filtered = allVideos.filter(v => v.title.toLowerCase().includes(q));
  els.rows.innerHTML = '';
  els.rows.appendChild(makeRow(`"${els.search.value}" için sonuçlar`, filtered));
});

// ================== OYNATICI ==================
function playVideo(v){
  els.frame.src = `https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`;
  els.playerTitle.textContent = v.title;
  els.modal.classList.remove('hidden');
}
els.closePlayer.onclick = ()=>{
  els.frame.src = '';
  els.modal.classList.add('hidden');
};

// Profil ikonuna tıklayınca profil ekranına dön
els.currentProfile.onclick = ()=>{
  els.mainScreen.classList.add('hidden');
  els.profileScreen.classList.remove('hidden');
};
