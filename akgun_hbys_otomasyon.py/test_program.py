#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
sys.path.append(os.path.dirname(__file__))

from akgun_hbys_gui_webstyle_clean import dvt_analiz_et, taraf_bul, lokalizasyon_bul, lablari_toplu_cek

def test_dvt_analiz():
    print("=== DVT Analiz Testi ===")
    
    # Test 1: DVT VAR
    metin1 = "Sað femoral ven ve popliteal venlerde akut tromboz izlenmektedir."
    sonuc1 = dvt_analiz_et(metin1)
    print(f"Test 1 - DVT VAR: {sonuc1} (Beklenen: DVT VAR)")
    
    # Test 2: DVT YOK
    metin2 = "Derin venlerde patolojik bulgu saptanmamýþtýr."
    sonuc2 = dvt_analiz_et(metin2)
    print(f"Test 2 - DVT YOK: {sonuc2} (Beklenen: DVT YOK)")
    
    # Test 3: YÜZEYEL
    metin3 = "Safen vende tromboz izlenmektedir."
    sonuc3 = dvt_analiz_et(metin3)
    print(f"Test 3 - YÜZEYEL: {sonuc3} (Beklenen: YUZEYEL TROMBOZ)")

def test_taraf_bul():
    print("\n=== Taraf Bulma Testi ===")
    
    metin1 = "Sað femoral ven ve popliteal venlerde akut tromboz izlenmektedir."
    sonuc1 = taraf_bul(metin1)
    print(f"Test 1 - Sað: {sonuc1} (Beklenen: SAG)")
    
    metin2 = "Sol bacak derin venlerinde patolojik bulgu saptanmamýþtýr."
    sonuc2 = taraf_bul(metin2)
    print(f"Test 2 - Sol: {sonuc2} (Beklenen: SOL)")
    
    metin3 = "Bilateral venlerde akým patterni normal."
    sonuc3 = taraf_bul(metin3)
    print(f"Test 3 - Bilateral: {sonuc3} (Beklenen: BILATERAL)")

def test_lokalizasyon_bul():
    print("\n=== Lokalizasyon Testi ===")
    
    metin = "Sað femoral ven ve popliteal venlerde akut tromboz izlenmektedir. Ýliak venlerde normal."
    sonuc = lokalizasyon_bul(metin)
    print(f"Test - Lokalizasyon: {sonuc} (Beklenen: femoral, popliteal, iliak)")

def test_lab_cozumleme():
    print("\n=== Laboratuvar Çözümleme Testi ===")
    
    lab_metni = """Hemoglobin (Hb): 12.5 g/dL
Beyaz Küre (WBC): 8500 /µL
Trombosit (PLT): 250000 /µL
Kreatinin: 0.9 mg/dL
CRP: 15 mg/L"""
    
    sonuclar = lablari_toplu_cek(lab_metni)
    print(f"Hb: {sonuclar['hb']} (Beklenen: 12.5)")
    print(f"WBC: {sonuclar['wbc']} (Beklenen: 8500)")
    print(f"PLT: {sonuclar['plt']} (Beklenen: 250000)")
    print(f"Kreatinin: {sonuclar['kreatinin']} (Beklenen: 0.9)")
    print(f"CRP: {sonuclar['crp']} (Beklenen: 15)")

if __name__ == "__main__":
    test_dvt_analiz()
    test_taraf_bul()
    test_lokalizasyon_bul()
    test_lab_cozumleme()
    print("\n=== Test Tamamlandi ===")
