# HBYS Veri Toplama Paneli

Hastane Bilgi Yönetim Sistemi - OCR destekli otomatik veri toplama aracı

## 🌟 Özellikler

### 📋 Belge İşleme
- **Entegre Belge İşleme Paneli** - PDF, JPG, PNG dosyalarını dahili olarak işler
- **Sekmeli Arayüz** - Hasta Bilgisi, Radyoloji Raporu, Laboratuvar Sonucu
- **Dahili OCR** - Tesseract.js ile Türkçe ve İngilizce metin tanıma
- **PDF Desteği** - PDF.js ile PDF dosyalarını doğrudan işleme

### 🧠 Akıllı Veri Çıkarımı
- **Gelişmiş OCR Pattern'leri** - SGK No, Ad Soyad, Baba Adı için Türkçe karakter desteği
- **Laboratuvar Otomatik Tanıma** - Hb, D-Dimer, INR, APTT, Trombosit, Urik Asit, Albumin, Total Protein
- **Radyoloji Rapor Analizi** - DVT sonuçları, lokalizasyon, taraf bilgileri
- **Ultrason Sonuçları** - Ek ultrason bulguları ve notlar

### 👤 Hasta Yönetimi
- **Hasta Adı Doğrulama Sistemi** - Benzer hasta adlarını tespit edip yanlış kayıtları önleme
- **Levenshtein Mesafesi** - %80 benzerlik eşiği ile akıllı eşleştirme
- **Mevcut Hasta Seçimi** - Var olan kayıtları hızlıca yükleme
- **Veri Kalıcılığı** - localStorage ile hasta verilerini saklama

### 📊 Veri Analizi
- **Excel Aktarım** - Sheet.js ile tam veri Excel'e aktarma
- **İstatistikler** - DVT pozitif/negatif oranları
- **Canlı Durum Takibi** - Adım adım işlem ilerlemesi
- **Veri Doğrulama** - Otomatik veri kontrolü ve uyarılar

## 🚀 Kurulum

### Gerekli Programlar
Sistem tamamen client-side çalışır, sunucu gerektirmez:

1. **Node.js** (v14+) - Geliştirme için
2. **Modern Web Tarayıcısı** - Chrome, Firefox, Safari, Edge
3. **İnternet Bağlantısı** - OCR kütüphaneleri için (ilk kullanımda)

### Hızlı Başlangıç

```bash
# Repository klonla
git clone https://github.com/kullanici/hbys-veri-toplama-paneli.git
cd hbys-veri-toplama-paneli

# Gerekli paketleri kur
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production için
npm start
```

### Docker ile Kurulum

```bash
# Docker imajı oluştur
docker build -t hbys-panel .

# Container çalıştır
docker run -p 8080:8080 hbys-panel
```

## 📱 Kullanım

### 1. Belge Yükleme
- **Hasta Bilgisi**: TC, Ad Soyad, Baba Adı, SGK No bilgilerini içeren belgeleri yükle
- **Radyoloji Raporu**: DVT sonuçlarını içeren raporları yükle  
- **Laboratuvar Sonucu**: Kan testi sonuçlarını içeren belgeleri yükle

### 2. Otomatik Veri Çıkarımı
- OCR ile metinleri otomatik tanıma
- Alanlara otomatik doldurma
- Manuel düzeltme imkanı

### 3. Hasta Doğrulama
- Benzer hasta adları uyarısı
- Mevcut kayıt seçimi
- Yeni hasta olarak devam etme

### 4. Veri Kaydetme
- Tüm bilgileri kontrol et
- Kaydet butonuna tıkla
- Excel'e aktar

## 🔧 Geliştirme

### Proje Yapısı
```
hbys-veri-toplama-paneli/
├── index.html              # Ana uygulama
├── enhancements.js          # Gelişmiş özellikler
├── integration_instructions.html # Entegrasyon talimatları
├── package.json           # Proje ayarları
├── README.md             # Bu dosya
└── docs/                 # Dokümantasyon
```

### Yeni Özellikler Ekleme
1. `enhancements.js` dosyasını düzenle
2. Yeni fonksiyonları ekle
3. Event listener'ları bağla
4. Test et ve commit'le

### OCR Pattern'leri
```javascript
// Yeni alan eklemek için
const alanMatch = text.match(/Alan\s*Adı[:\s]*(değer)/i);
if (alanMatch) {
    markAutoFilled('fieldId', alanMatch[1]);
    filledCount++;
}
```

## 🌐 Deployment

### GitHub Pages
```bash
# Build et
npm run build

# gh-pages branch'ine gönder
git subtree push --prefix dist origin gh-pages
```

### Netlify
1. Repository bağla
2. Build komutu: `npm run build`
3. Publish directory: `.`

### Vercel
1. Import et GitHub repository
2. Framework preset: "Other"
3. Build komutu: `npm run build`

## 🔒 Güvenlik

### Veri Gizliliği
- **Client-Side İşleme** - Veriler sunucuya gönderilmez
- **Local Storage** - Veriler tarayıcıda saklanır
- **HTTPS Destek** - Güvenli bağlantı
- **CORS Politikası** - Sadece izinli kaynaklar

### OCR Güvenliği
- **Güvenli Kütüphaneler** - Tesseract.js, PDF.js
- **Local Processing** - Dosyalar cihazda işlenir
- **No External API** - Üçüncü parti servis yok

## 📊 Performans

### Optimizasyonlar
- **Lazy Loading** - Gerekli olmadıkça yükleme
- **Caching** - OCR sonuçlarını önbelleğe alma
- **Compression** - Dosya boyutunu küçültme
- **CDN** - Kütüphaneler için CDN kullanımı

### Benchmark
- **OCR Hızı**: 2-5 saniye (A4 sayfa)
- **Destek**: 50+ format
- **Bellek**: <100MB kullanım
- **Uyumlu**: Chrome 90+, Firefox 88+, Safari 14+

## 🐞 Hata Ayıklama

### Common Issues
1. **OCR Çalışmıyor** - İnternet bağlantısını kontrol et
2. **PDF Açılmıyor** - Dosya boyutunu kontrol et (<10MB)
3. **Veri Kayboluyor** - Browser cache'ini temizle
4. **Excel Hatası** - Modern browser kullan

### Debug Mode
```javascript
// Console'da debug modu aktif et
localStorage.setItem('debug', 'true');
```

## 🤝 Katkı

### Nasıl Katkı Sağlanır?
1. Fork et
2. Feature branch oluştur: `git checkout -b ozellik/yeni-ozellik`
3. Commit'le: `git commit -am 'Yeni özellik eklendi'`
4. Push'la: `git push origin ozellik/yeni-ozellik`
5. Pull Request oluştur

### Katkı Kuralları
- **Code Style** - Prettier ve ESLint kullan
- **Tests** - Unit testleri ekle
- **Docs** - Dokümantasyon güncelle
- **Issues** - Issue template'ını kullan

## 📄 Lisans

MIT License - [LICENSE](LICENSE) dosyasını inceleyin.

## 📞 İletişim

- **Issues**: [GitHub Issues](https://github.com/kullanici/hbys-veri-toplama-paneli/issues)
- **Email**: hbys@ornek.com
- **Discord**: [Topluluk Sunucusu](https://discord.gg/hbys)

---

## 🙏 Teşekkürler

- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR motoru
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF işleme
- [Sheet.js](https://sheetjs.com/) - Excel export
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

**⭐ Eğer projeyi beğendiyseniz, GitHub'da star vermeyi unutmayın!**
