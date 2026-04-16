# GitHub Kurulum Adýmlarý

## 1. GitHub Repository Oluþturma

1. GitHub'a gidin ve yeni repository oluþturun
2. Repository adý: `akgun-hbys-web`
3. Public/Private seçimi (Public önerilir)
4. README.md ekleme (zaten oluþturduk)
5. .gitignore ekleme (Python seçeneði)

## 2. Yerel Git Kurulumu

```bash
# Git'i baþlat
git init

# Remote ekle
git remote add origin https://github.com/KULLANICI-AKI/akgun-hbys-web.git

# Tüm dosyalarý ekle
git add .

# Ýlk commit
git commit -m "Ýlk versiyon - Web tabanlý HBYS veri toplama sistemi"

# Push yap
git push -u origin main
```

## 3. Gerekli Dosyalar

Proje için hazýrlanan dosyalar:

- `hbys_web.py` - Ana Flask uygulamasý
- `templates/index.html` - Web arayüzü
- `requirements.txt` - Python baðýmlýlýklarý
- `README.md` - Proje açýklamasý
- `.gitignore` - Git ignore dosyasý

## 4. Deployment Seçenekleri

### Heroku
```bash
# Heroku CLI kurulumu
# Procfile oluþtur
echo "web: python hbys_web.py" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

### PythonAnywhere
- Web uygulamasý olarak yükle
- requirements.txt kur
- WSGI konfigürasyonu

### Replit
- Proje olarak yükle
- requirements.txt otomatik kurulur
- Web modunda çalýþtýr

## 5. Domain ve SSL

Ücretsiz seçenekler:
- GitHub Pages (sadece statik)
- Netlify
- Vercel
- Heroku (appname.herokuapp.com)

## 6. Test

Uygulama çalýþtýrýldýktan sonra:
1. http://localhost:5000 adresinde test edin
2. Radyoloji ve lab metinleri ile analiz yapýn
3. Excel kayýt fonksiyonunu test edin
4. Tüm özelliklerin çalýþtýðýndan emin olun
