# Web Sitesi Deployment Rehberi

Programýnýz artýk tamamen web sitesi olarak çalýþabilir! Þu platformlarda deploy edebilirsiniz:

## 1. REPLIT (En Kolay - Ücretsiz)

### Adýmlar:
1. [replit.com](https://replit.com) adresine gidin
2. "Create Repl" -> "Python" seçin
3. Tüm dosyalarý upload edin:
   - `app.py`
   - `templates/index.html`
   - `requirements.txt`
   - `replit.nix`
   - `.env.example` (`.env` olarak yeniden adlandýrýn)

4. Otomatik olarak web sitesi olarak çalýþacaktýr!
5. URL: `https://your-app-name.replit.app`

### Avantajlar:
- Tamamen ücretsiz
- Otomatik deploy
- SSL sertifikasý
- Custom domain desteði

## 2. HEROKU (Profesyonel)

### Adýmlar:
1. Heroku hesabý oluþturun
2. Heroku CLI kurun
3. Bu komutlarý çalýþtýrýn:

```bash
# Git init
git init
git add .
git commit -m "First commit"

# Heroku login
heroku login

# App oluþtur
heroku create your-app-name

# Deploy
git push heroku main
```

### Gerekli Dosyalar:
- `app.py`
- `requirements.txt`
- `Procfile`
- `runtime.txt`

### URL: `https://your-app-name.herokuapp.com`

## 3. PYTHONANYWHERE (Basit)

### Adýmlar:
1. [pythonanywhere.com](https://pythonanywhere.com) adresine gidin
2. "Web" sekmesine gidin
3. "Add a new web app"
4. Flask seçeneði seçin
5. Python 3.9 seçin
6. Dosyalarý upload edin
7. `requirements.txt` kurun

## 4. VERCEL (Modern)

### Adýmlar:
1. Vercel hesabý oluþturun
2. GitHub'dan import edin
3. Otomatik deploy

## 5. DIGITAL OCEAN / AWS (Advanced)

### Docker ile:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "app:app"]
```

## Test Adýmlarý

Her platformda deploy ettikten sonra:

1. **Health Check**: `{url}/health` adresinde test edin
2. **Radyoloji Analizi**: Test metinleri ile deneyin
3. **Lab Analizi**: Sayýsal deðerlerin çýkýþýný kontrol edin
4. **Excel Kayýt**: Veri kaydýný test edin
5. **Mobil Uyum**: Telefonla test edin

## Güvenlik

### Production için:
- `.env` dosyasýný oluþturun
- `SECRET_KEY` deðerini deðiþtirin
- HTTPS kullanýn
- Regular backups yapýn

### Environment Variables:
```bash
SECRET_KEY=cok-gizli-anahtar-buraya
EXCEL_FILE=radyoloji_sonuclari.xlsx
PORT=5000
```

## Domain Ayarlarý

### Custom Domain:
1. Domain satýn alýn (GoDaddy, Namecheap vb.)
2. DNS ayarlarý yapýn
3. Platformda domain ekleyin

### Örnek:
- `akgun-hbys.com`
- `radyoloji-analiz.com`

## Monitoring

### Loglar:
- Uygulama loglarýný kontrol edin
- Error tracking yapýn
- Performance monitoring

### Öneriler:
- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry)
- Analytics (Google Analytics)

## Maliyet

### Ücretsiz Seçenekler:
- Replit (limitsiz)
- Heroku (kredi ile)
- PythonAnywhere (1 site ücretsiz)

### Ücretli Seçenekler:
- Digital Ocean ($5/ay)
- AWS (kullanýma baðlý)
- Vercel Pro ($20/ay)

## Hýzlý Deploy (Replit)

En hýzlý baþlangýç için Replit öneriyorum:

1. 5 dakikada kurulum
2. Otomatik SSL
3. Ücretsiz hosting
4. Gerçek web sitesi URL'i

**Hemen baþlamak için:** `https://replit.com/@username/akgun-hbys-web`
