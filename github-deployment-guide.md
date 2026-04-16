# GitHub Deployment Guide

## 🚀 HBYS Paneli GitHub Pages'e Dağıtımı

Bu rehber, HBYS Veri Toplama Paneli'nin GitHub Pages üzerinde nasıl yayınlanacağını adım adım açıklar.

## 📋 Gerekli Dosyalar

Projenizin kök dizininde aşağı dosyaların olduğundan emin olun:

```
hbys-veri-toplama-paneli/
├── index.html              # Ana uygulama dosyası
├── enhancements.js          # Gelişmiş özellikler
├── storage-manager.js      # Veri kalıcılığı
├── mobile-responsive.js    # Mobil uyumluluk
├── veri-yonetim.js       # Export/Import işlemleri
├── package.json           # Proje ayarları
├── README.md             # Dokümantasyon
├── .github/workflows/     # GitHub Actions
└── .gitignore           # Git ignore dosyası
```

## 🔧 Adım 1: Repository Oluşturma

1. GitHub'da yeni repository oluşturun: `hbys-veri-toplama-paneli`
2. Repository'yi local'e klonlayın:
```bash
git clone https://github.com/kullanici-adiniz/hbys-veri-toplama-paneli.git
cd hbys-veri-toplama-paneli
```

## 📦 Adım 2: Dosyaları Yükleme

Tüm dosyaları repository'ye ekleyin:

```bash
# Tüm dosyaları ekle
git add .

# Commit oluştur
git commit -m "Initial commit - HBYS Veri Toplama Paneli"

# GitHub'a gönder
git push origin main
```

## ⚙️ Adım 3: GitHub Pages Ayarları

1. Repository'de **Settings**'e gidin
2. **Pages** bölümünü açın
3. **Source** olarak **Deploy from a branch** seçin
4. **Branch** olarak **main** seçin
5. **Save** butonuna tıklayın

## 🤖 Adım 4: GitHub Actions (Otomatik Deployment)

`.github/workflows/deploy.yml` dosyası zaten hazırlandı. Bu sayfa her push'ta otomatik olarak güncellenecektir.

### Workflow Özellikleri:
- ✅ Otomatik build ve deployment
- ✅ Pull Request için preview
- ✅ Hata takibi ve bildirimler
- ✅ Cache optimizasyonu

## 🌐 Adım 5: Site Erişimi

Deployment tamamlandığında siteniz şu adresten erişilebilir:

```
https://kullanici-adiniz.github.io/hbys-veri-toplama-paneli/
```

## 📱 Mobil Uyumluluk

Site mobil cihazlarda tam uyumlu çalışır:
- 📱 Responsive tasarım
- 👆 Touch gesture desteği
- 🔄 Orientation change optimizasyonu
- 📊 PWA özellikleri

## 🔒 Güvenlik Ayarları

### HTTPS Zorunluluğu
GitHub Pages otomatik olarak HTTPS sağlar.

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; 
               script-src 'self' 'unsafe-inline' cdnjs.net; 
               style-src 'self' 'unsafe-inline';">
```

## 📊 Performans Optimizasyonu

### CDN Kullanımı
Tüm harici kütüphaneler CDN üzerinden yüklenir:
- Tesseract.js
- PDF.js
- Sheet.js
- Font Awesome

### Cache Stratejisi
```javascript
// Service worker ile cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('hbys-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/enhancements.js',
                '/storage-manager.js',
                '/mobile-responsive.js',
                '/veri-yonetim.js'
            ]);
        })
    );
});
```

## 🐛 Hata Ayıklama

### GitHub Pages Hataları
1. **404 Hatası**: Base URL ayarını kontrol et
2. **CORS Hatası**: CDN linklerini kontrol et
3. **JS Hataları**: Browser console'u kontrol et

### Debug Modu
```javascript
localStorage.setItem('debug', 'true');
```

### Loglama
```javascript
console.log('HBYS Panel v1.0.0 - Debug Mode');
```

## 🔄 Güncelleme Süreci

### Yeni Versiyon Yayınlama
1. Değişiklikleri yap ve test et
2. Version numarasını güncelle (`package.json`)
3. Commit ve push:
```bash
git add .
git commit -m "v1.1.0 - Yeni özellikler eklendi"
git tag v1.1.0
git push origin main --tags
```

### Rollback
```bash
# Önceki versiyona dön
git checkout v1.0.0
git push origin v1.0.0:main --force
```

## 📈 Analytics İzleme

### Google Analytics Ekleme
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔧 Özel Domain Ayarları

### Custom Domain
1. Repository Settings → Pages
2. Custom domain girin
3. DNS ayarlarını yapın

### CNAME Dosyası
```bash
echo "hbys-panel.sizin-domain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

## 🚨 Troubleshooting

### Yayınlanmıyor
1. **Repository adını** kontrol et
2. **main branch**'in varlığından emin olun
3. **GitHub Pages**'in aktif olduğundan emin olun

### Kaybolan CSS/JS
1. **Dosya yollarını** kontrol et
2. **Case sensitivity**'ye dikkat et
3. **Cache temizleme** yapın

### OCR Çalışmıyor
1. **HTTPS** gerektiğini kontrol et
2. **CDN erişimini** test et
3. **Browser konsolunu** kontrol et

## 📞 Destek

### Yardım Alın
- **GitHub Issues**: [Sorun Bildir](https://github.com/kullanici-adiniz/hbys-veri-toplama-paneli/issues)
- **Discord**: [Topluluk](https://discord.gg/hbys)
- **Email**: hbys@destek.com

### Katkı Sağlayın
1. Fork yapın
2. Feature branch oluşturun
3. Değişiklik yapın
4. Pull Request gönderin

---

## ✅ Deployment Checklist

- [ ] Repository oluşturuldu
- [ ] Tüm dosyalar yüklendi
- [ ] GitHub Pages aktif edildi
- [ ] GitHub Actions çalışıyor
- [ ] Site erişilebilir durumda
- [ ] Mobil uyumluluk test edildi
- [ ] OCR özellikleri çalışıyor
- [ ] Export/Import işlemleri test edildi
- [ ] HTTPS çalışıyor
- [ ] Performance test edildi

**🎉 Tebrikler! HBYS Paneliniz artık GitHub Pages'de yayınlandı!**

Artık hastane verilerinizi toplamak için modern, hızlı ve güvenli bir web uygulamasına sahipsiniz.
