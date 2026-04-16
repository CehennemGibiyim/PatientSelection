#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd

app = Flask(__name__)

DOSYA_ADI = "radyoloji_sonuclari.xlsx"

def dvt_analiz_et(metin):
    text = metin.lower()
    # Türkçe karakterleri normalize et
    text = text.replace("ð", "g").replace("þ", "s").replace("ý", "i").replace("ç", "c").replace("ö", "o").replace("ü", "u")

    negatifler = [
        "dvt saptanmadi", "dvt saptanmadý",
        "derin ven trombozu saptanmadi", "derin ven trombozu saptanmadý",
        "tromboz izlenmedi",
        "patolojik trombus izlenmedi", "patolojik trombüs izlenmedi",
        "venoz tromboz izlenmedi", "venöz tromboz izlenmedi",
        "derin venoz tromboz izlenmedi", "derin venöz tromboz izlenmedi",
        "derin venlerde trombus izlenmedi", "derin venlerde trombüs izlenmedi",
        "trombus saptanmadi", "trombüs saptanmadi", "trombüs saptanmadý",
        "patolojik bulgu saptanmadi", "patolojik bulgu saptanmamýþtýr",
        "bulgu saptanmadi", "bulgu saptanmamýþtýr",
        "saptanmadi", "saptanmamýþtýr",
        "saptanmamistir", "bulgu saptanmamistir",
    ]

    yuzeyel_ifadeler = [
        "yuzeyel ven trombozu", "yüzeyel ven trombozu",
        "yuzeyel tromboflebit", "yüzeyel tromboflebit",
        "safen vende tromboz", "vena safena", "saphenous",
    ]

    derin_ifadeler = [
        "dvt", "derin ven trombozu", "deep vein thrombosis",
        "derin venoz tromboz", "derin venöz tromboz",
        "femoral ven", "popliteal ven", "iliak ven",
        "tibial ven", "peroneal ven", "derin ven",
        "akut tromboz", "subakut tromboz", "kronik tromboz",
        "trombus", "trombüs",
        "okluziv trombus", "oklüziv trombüs",
        "nonokluziv trombus", "nonoklüziv trombüs",
        "non okluziv trombus", "non oklüziv trombüs",
        "lümende trombüs", "lumende trombus",
        "ven lümeninde trombüs", "ven lumeninde trombus",
        "trombus mevcuttur", "trombüs mevcuttur",
        "trombus izlendi", "trombüs izlendi",
        "trombus izlenmistir", "trombüs izlenmektedir",
        "trombus ile uyumlu", "trombüs ile uyumlu",
        "tromboz saptandi", "tromboz saptandi",
        "rekanalize olmayan trombus", "rekanalize olmayan trombüs",
    ]

    for ifade in negatifler:
        if ifade in text:
            return "DVT YOK"

    for ifade in yuzeyel_ifadeler:
        if ifade in text:
            return "YUZEYEL TROMBOZ"

    for ifade in derin_ifadeler:
        if ifade in text:
            return "DVT VAR"

    return "BELIRSIZ"

def taraf_bul(metin):
    # Türkçe karakterleri normalize et
    text = metin.lower()
    text = text.replace("ð", "g").replace("þ", "s").replace("ý", "i").replace("ç", "c").replace("ö", "o").replace("ü", "u")
    
    if "bilateral" in text or (("sag" in text) and ("sol" in text)):
        return "BILATERAL"
    if "sag" in text:
        return "SAG"
    if "sol" in text:
        return "SOL"
    return ""

def lokalizasyon_bul(metin):
    text = metin.lower()
    text = text.replace("ð", "g").replace("þ", "s").replace("ý", "i").replace("ç", "c").replace("ö", "o").replace("ü", "u")
    bulunan = []
    lokalizasyonlar = [
        ("iliak", ["iliak", "iliac"]),
        ("femoral", ["femoral"]),
        ("popliteal", ["popliteal"]),
        ("tibial", ["tibial"]),
        ("peroneal", ["peroneal"]),
        ("safen", ["safen", "saphenous", "safena"]),
    ]
    for etiket, anahtarlar in lokalizasyonlar:
        for anahtar in anahtarlar:
            if anahtar in text:
                bulunan.append(etiket)
                break
    return ", ".join(bulunan)

def satirdan_sayi_al(satir):
    temiz = satir.replace(",", ".").replace(":", " ").replace("=", " ")
    parcali = temiz.split()
    bulunan = []
    for parca in parcali:
        try:
            float(parca)
            bulunan.append(parca)
        except ValueError:
            pass
    return bulunan[-1] if bulunan else ""

def lab_bul_satir_bazli(lab_metin, anahtar_listesi):
    satirlar = lab_metin.splitlines()
    for satir in satirlar:
        kucuk = satir.lower()
        for anahtar in anahtar_listesi:
            if anahtar in kucuk:
                deger = satirdan_sayi_al(satir)
                if deger:
                    return deger
    return ""

def lab_bul_regex(lab_metin, anahtar_listesi):
    for anahtar in anahtar_listesi:
        patternler = [
            rf"\b{re.escape(anahtar)}\b[^\d]{{0,40}}(\d+[.,]?\d*)",
            rf"\b{re.escape(anahtar)}\b.*?(\d+[.,]?\d*)",
        ]
        for pattern in patternler:
            eslesme = re.search(pattern, lab_metin, re.IGNORECASE | re.MULTILINE | re.DOTALL)
            if eslesme:
                return eslesme.group(1).replace(",", ".")
    return ""

def lab_bul(lab_metin, anahtar_listesi):
    deger = lab_bul_satir_bazli(lab_metin, anahtar_listesi)
    if deger:
        return deger
    return lab_bul_regex(lab_metin, anahtar_listesi)

def lablari_toplu_cek(lab_metin):
    return {
        "hb": lab_bul(lab_metin, ["hb", "hgb", "hemoglobin"]),
        "wbc": lab_bul(lab_metin, ["wbc", "lökosit", "lokosit", "leukocyte", "leukocytes"]),
        "plt": lab_bul(lab_metin, ["plt", "trombosit", "platelet", "platelets"]),
        "kreatinin": lab_bul(lab_metin, ["kreatinin", "creatinine"]),
        "crp": lab_bul(lab_metin, ["crp", "c-reaktif", "c reaktif", "c-reactive", "c reactive"]),
    }

def kaydi_excel_yaz(yeni_kayit):
    if os.path.exists(DOSYA_ADI):
        df_eski = pd.read_excel(DOSYA_ADI)
        df_yeni = pd.concat([df_eski, pd.DataFrame([yeni_kayit])], ignore_index=True)
    else:
        df_yeni = pd.DataFrame([yeni_kayit])
    df_yeni.to_excel(DOSYA_ADI, index=False)

# Web Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze_radiology', methods=['POST'])
def analyze_radiology():
    data = request.get_json()
    radiology_text = data.get('text', '')
    
    if not radiology_text:
        return jsonify({'error': 'Radyoloji metni boþ olamaz'}), 400
    
    results = {
        'dvt_sonucu': dvt_analiz_et(radiology_text),
        'taraf': taraf_bul(radiology_text),
        'lokalizasyon': lokalizasyon_bul(radiology_text)
    }
    
    return jsonify(results)

@app.route('/api/analyze_lab', methods=['POST'])
def analyze_lab():
    data = request.get_json()
    lab_text = data.get('text', '')
    
    if not lab_text:
        return jsonify({'error': 'Lab metni boþ olamaz'}), 400
    
    results = lablari_toplu_cek(lab_text)
    return jsonify(results)

@app.route('/api/save_record', methods=['POST'])
def save_record():
    data = request.get_json()
    
    required_fields = ['hasta_id', 'ad_soyad']
    for field in required_fields:
        if not data.get(field, '').strip():
            return jsonify({'error': f'{field} boþ olamaz'}), 400
    
    yeni_kayit = {
        "tarih_saat": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "hasta_id": data.get('hasta_id', '').strip(),
        "ad_soyad": data.get('ad_soyad', '').strip(),
        "yas": data.get('yas', '').strip(),
        "cinsiyet": data.get('cinsiyet', '').strip(),
        "il": data.get('il', '').strip(),
        "ilce": data.get('ilce', '').strip(),
        "hb": data.get('hb', '').strip(),
        "wbc": data.get('wbc', '').strip(),
        "plt": data.get('plt', '').strip(),
        "kreatinin": data.get('kreatinin', '').strip(),
        "crp": data.get('crp', '').strip(),
        "radyoloji_raporu": data.get('radyoloji_raporu', '').strip(),
        "lab_metin": data.get('lab_metin', '').strip(),
        "dvt_sonucu": data.get('dvt_sonucu', '').strip(),
        "taraf": data.get('taraf', '').strip(),
        "lokalizasyon": data.get('lokalizasyon', '').strip(),
    }
    
    try:
        kaydi_excel_yaz(yeni_kayit)
        return jsonify({'success': True, 'message': 'Kayýt baþarýyla kaydedildi'})
    except Exception as e:
        return jsonify({'error': f'Kayýt hatasý: {str(e)}'}), 500

@app.route('/download')
def download_excel():
    if os.path.exists(DOSYA_ADI):
        return send_file(DOSYA_ADI, as_attachment=True)
    return jsonify({'error': 'Excel dosyasý bulunamadý'}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
