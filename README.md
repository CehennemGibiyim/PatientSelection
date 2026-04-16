# Akgün HBYS Veri Toplama Sistemi

Web tabanlý radyoloji ve laboratuvar veri analiz sistemi. DVT (Derin Ven Trombozu) tespiti ve laboratuvar sonuçlarýnýn otomatik çözümlenmesi için tasarlanmýþtýr.

## Özellikler

- **Radyoloji Analizi**: DVT var/yok/yüzeyel tespiti
- **Taraf Tespiti**: Sað/sol/bilateral analiz
- **Lokalizasyon**: Femoral, popliteal, iliak vb.
- **Lab Çözümleme**: Hb, WBC, PLT, Kreatinin, CRP
- **Web Arayüzü**: Modern ve kullanýcý dostu arayüz
- **Excel Kayýt**: Otomatik veri tabaný oluþturma

## Kurulum

### Gereksinimler
- Python 3.7+
- pip

### Adýmlar

1. Repoyu klonlayýn:
```bash
git clone https://github.com/kullanici-adi/akgun-hbys-web.git
cd akgun-hbys-web
```

2. Sanal ortam oluþturun (önerilir):
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Baðýmlýlýklarý kurun:
```bash
pip install -r requirements.txt
```

4. Uygulamayý çalýþtýrýn:
```bash
python hbys_web.py
```

5. Tarayýcýda açýn:
```
http://localhost:5000
```

## Kullaným

### 1. Manuel Bilgileri Girin
- Hasta ID, ad soyad, yaþ, cinsiyet, konum bilgileri

### 2. Radyoloji Metnini Analiz Edin
- Radyoloji raporunu metin alanýna yapýþtýrýn
- "Radyoloji Analiz Et" butonuna týklayýn
- Otomatik sonuçlar görünecektir

### 3. Laboratuvar Sonuçlarýný Çözümleyin
- Lab sonuçlarýný metin alanýna yapýþtýrýn
- "Lab Analiz Et" butonuna týklayýn
- Sayýsal deðerler otomatik çýkarýlacak

### 4. Kaydet
- "Kaydet" butonuna týklayýn
- Veriler Excel dosyasýna kaydedilir

## API Endpoints

### POST /api/analyze_radiology
Radyoloji metnini analiz eder.

**Request:**
```json
{
    "text": "Sað femoral venlerde akut tromboz izlenmektedir..."
}
```

**Response:**
```json
{
    "dvt_sonucu": "DVT VAR",
    "taraf": "SAG",
    "lokalizasyon": "femoral"
}
```

### POST /api/analyze_lab
Laboratuvar metnini analiz eder.

**Request:**
```json
{
    "text": "Hemoglobin (Hb): 12.5 g/dL..."
}
```

**Response:**
```json
{
    "hb": "12.5",
    "wbc": "8500",
    "plt": "250000",
    "kreatinin": "0.9",
    "crp": "15"
}
```

### POST /api/save_record
Yeni kayýt kaydeder.

### GET /download
Excel dosyasýný indirir.

## Dosya Yapýsý

```
akgun-hbys-web/
|-- hbys_web.py              # Ana Flask uygulamasý
|-- templates/
|   |-- index.html          # Ana web arayüzü
|-- requirements.txt         # Python baðýmlýlýklarý
|-- README.md               # Bu dosya
|-- radyoloji_sonuclari.xlsx # Oluþan Excel dosyasý
```

## Teknolojiler

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Veri Ýþleme**: Pandas, OpenPyXL
- **UI/UX**: Lucide Icons, Modern Glass-morphism tasarým

## Katkýda Bulunma

1. Fork yapýn
2. Özellik branch'i oluþturun (`git checkout -b feature/yeni-ozellik`)
3. Deðiþiklikleri commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Push yapýn (`git push origin feature/yeni-ozellik`)
5. Pull Request oluþturun

## Lisans

Bu proje MIT Lisansý altýnda daðýtýlmaktadýr.

## Ýletiþim

Sorular ve öneriler için:
- GitHub Issues
- [E-posta adresiniz]

## Demo

Uygulamanýn can demosu için: [Demo linki]
