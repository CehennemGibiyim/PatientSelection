# Akgün HBYS Veri Toplama Programi - Kullaným Kýlavuzu

## Programý Çalýþtýrma

```bash
python akgun_hbys_gui_webstyle_clean.py
```

## Test Dosyalarý

Programý test etmek için hazýrlanan dosyalar:

- `test_program.py` - Ana fonksiyonlarýn testi
- `test_excel_kayit.py` - Excel kayýt testi  
- `test_radyoloji_metni.txt` - Örnek radyoloji raporu
- `test_lab_metni.txt` - Örnek laboratuvar sonuçlarý

## Adým Adým Kullaným

### 1. Manuel Bilgileri Girin
- **Hasta ID**: HBYS'den kopyalayýn
- **Ad Soyad**: Hasta adý soyadý
- **Yaþ**: Sadece sayý olarak
- **Cinsiyet**: K/E butonlarýný kullanýn
- **Ýl/Ýlçe**: Konum bilgileri

### 2. Radyoloji Raporunu Alýn
- HBYS'den radyoloji metnini kopyalayýn
- "Panodan Radyoloji Al" butonuna týklayýn
- Program otomatik analiz yapacak:
  - DVT sonucu (VAR/YOK/YÜZEYEL)
  - Taraf (SAÐ/SOL/BILATERAL)
  - Lokalizasyon (iliak, femoral, popliteal vb.)

### 3. Laboratuvar Sonuçlarýný Alýn
- Lab sonuçlarýný kopyalayýn
- "Panodan Lab Al" butonuna týklayýn
- "Lablarý Otomatik Çöz" butonuna týklayýn
- Program çýkaracak:
  - Hb (Hemoglobin)
  - WBC (Beyaz küre)
  - PLT (Trombosit)
  - Kreatinin
  - CRP

### 4. Kaydet
- "Kaydý Excel'e Yaz" butonuna týklayýn
- Veriler `radyoloji_sonuclari.xlsx` dosyasýna kaydedilir

## Test Senaryosu

1. Programý açýn
2. Manuel alanlara test verileri girin:
   - Hasta ID: TEST-001
   - Ad Soyad: Test Hasta
   - Yaþ: 45
   - Cinsiyet: E
3. `test_radyoloji_metni.txt` içeriðini kopyalayýp "Panodan Radyoloji Al" deyin
4. `test_lab_metni.txt` içeriðini kopyalayýp "Panodan Lab Al" deyin
5. "Lablarý Otomatik Çöz" deyin
6. "Kaydý Excel'e Yaz" deyin

## Önemli Notlar

- Program Türkçe karakter sorunlarý için normalize edilmiþtir
- Excel dosyasý otomatik olarak oluþturulur/güncellenir
- Her kayýtta tarih ve saat otomatik eklenir
- Panodan veri almak için metin önce kopyalanmalýdýr

## Baðýmlýlýklar

Program çalýþmak için gereken kütüphaneler:
- tkinter (Python ile birlikte gelir)
- pandas
- pyperclip
- openpyxl

Kurulum komutu:
```bash
pip install pandas pyperclip openpyxl
```
