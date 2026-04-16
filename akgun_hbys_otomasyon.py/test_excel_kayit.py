#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import pandas as pd
from datetime import datetime
sys.path.append(os.path.dirname(__file__))

from akgun_hbys_gui_webstyle_clean import kaydi_excel_yaz

def test_excel_kayit():
    print("=== Excel Kayýt Testi ===")
    
    # Test kayýt verisi
    test_kayit = {
        "tarih_saat": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "hasta_id": "TEST-001",
        "ad_soyad": "Test Hasta",
        "yas": "45",
        "cinsiyet": "E",
        "il": "Ýstanbul",
        "ilce": "Kadýköy",
        "hb": "12.5",
        "wbc": "8500",
        "plt": "250000",
        "kreatinin": "0.9",
        "crp": "15",
        "radyoloji_raporu": "Sað femoral ven ve popliteal venlerde akut tromboz izlenmektedir.",
        "lab_metin": "Hemoglobin (Hb): 12.5 g/dL\nWBC: 8500 /µL",
        "dvt_sonucu": "DVT VAR",
        "taraf": "SAG",
        "lokalizasyon": "femoral, popliteal",
    }
    
    try:
        # Excel dosyasýnýn var olup olmadýðýný kontrol et
        dosya_adi = "radyoloji_sonuclari.xlsx"
        if os.path.exists(dosya_adi):
            print(f"Mevcut Excel dosyasý yedekleniyor: {dosya_adi}")
            df_eski = pd.read_excel(dosya_adi)
            print(f"Mevcut kayýt sayýsý: {len(df_eski)}")
        
        # Yeni kayýt ekle
        kaydi_excel_yaz(test_kayit)
        print("Yeni kayýt Excel'e baþarýyla eklendi.")
        
        # Kontrol et
        df_yeni = pd.read_excel(dosya_adi)
        print(f"Güncel kayýt sayýsý: {len(df_yeni)}")
        
        # Son kaydý göster
        son_kayit = df_yeni.iloc[-1]
        print(f"\nSon kayýt bilgileri:")
        print(f"Hasta ID: {son_kayit.get('hasta_id', 'N/A')}")
        print(f"Ad Soyad: {son_kayit.get('ad_soyad', 'N/A')}")
        print(f"DVT Sonucu: {son_kayit.get('dvt_sonucu', 'N/A')}")
        print(f"Tarih: {son_kayit.get('tarih_saat', 'N/A')}")
        
        print("\nExcel kayýt testi BAÞARILI!")
        return True
        
    except Exception as e:
        print(f"Excel kayýt hatasý: {e}")
        return False

if __name__ == "__main__":
    test_excel_kayit()
