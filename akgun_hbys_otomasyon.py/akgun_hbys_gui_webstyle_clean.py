import os
import re
from datetime import datetime
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext

import pandas as pd
import pyperclip

DOSYA_ADI = "radyoloji_sonuclari.xlsx"


def clipboard_oku():
    return pyperclip.paste().strip()


def entryye_pano_yapistir(entry_widget):
    try:
        veri = pyperclip.paste().strip()
        entry_widget.delete(0, tk.END)
        entry_widget.insert(0, veri)
    except Exception as e:
        messagebox.showerror("Hata", f"Panodan veri alınamadı: {e}")


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
        "trombus izlenmistir", "trombüs izlenmiştir",
        "trombus ile uyumlu", "trombüs ile uyumlu",
        "tromboz saptandi", "tromboz saptandı",
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


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Akgün HBYS Veri Toplama")
        self.geometry("1260x860")
        self.minsize(1160, 800)
        self.configure(bg="#0b1020")
        self._configure_style()
        self._build_ui()

    def _configure_style(self):
        style = ttk.Style(self)
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass

        style.configure("App.TFrame", background="#0b1020")
        style.configure("Surface.TFrame", background="#121a2b")
        style.configure("Card.TLabelframe", background="#121a2b", borderwidth=1, relief="solid")
        style.configure("Card.TLabelframe.Label", background="#121a2b", foreground="#f8fafc", font=("Arial", 11, "bold"))
        style.configure("Header.TLabel", background="#0b1020", foreground="#f8fafc", font=("Arial", 20, "bold"))
        style.configure("SubHeader.TLabel", background="#0b1020", foreground="#94a3b8", font=("Arial", 10))
        style.configure("Field.TLabel", background="#121a2b", foreground="#dbe4f0", font=("Arial", 10, "bold"))
        style.configure("Value.TLabel", background="#121a2b", foreground="#94a3b8", font=("Arial", 9))
        style.configure("Primary.TButton", font=("Arial", 10, "bold"), padding=10)
        style.configure("Secondary.TButton", font=("Arial", 10), padding=8)
        style.configure("App.TEntry", fieldbackground="#f8fafc", foreground="#0f172a", padding=8)

    def _build_ui(self):
        self.columnconfigure(0, weight=1)
        self.rowconfigure(3, weight=1)

        header = ttk.Frame(self, style="App.TFrame")
        header.grid(row=0, column=0, sticky="ew", padx=18, pady=(18, 10))
        header.columnconfigure(0, weight=1)
        ttk.Label(header, text="Akgün HBYS Veri Toplama Paneli", style="Header.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Label(header, text="Modern arayüz • hızlı pano akışı • Excel kayıt", style="SubHeader.TLabel").grid(row=1, column=0, sticky="w", pady=(4, 0))

        top = ttk.Frame(self, style="App.TFrame")
        top.grid(row=1, column=0, sticky="ew", padx=18, pady=6)
        top.columnconfigure(0, weight=5)
        top.columnconfigure(1, weight=4)

        frm1 = ttk.LabelFrame(top, text="Manuel Girilecek Alanlar", style="Card.TLabelframe")
        frm1.grid(row=0, column=0, sticky="nsew", padx=(0, 10))
        frm1.columnconfigure(1, weight=1)

        self._manual_row(frm1, 0, "Hasta ID", "HBYS'den kimlik alanını kopyalayın", "hasta_id")
        self._manual_row(frm1, 2, "Ad Soyad", "Hasta adı soyadı", "ad_soyad")
        self._manual_row(frm1, 4, "Yaş", "Sadece sayı olacak şekilde", "yas")

        ttk.Label(frm1, text="Cinsiyet", style="Field.TLabel").grid(row=6, column=0, sticky="w", padx=12, pady=(10, 2))
        self.cinsiyet = ttk.Entry(frm1, style="App.TEntry")
        self.cinsiyet.grid(row=6, column=1, sticky="ew", padx=12, pady=(10, 2))
        cwrap = ttk.Frame(frm1, style="Surface.TFrame")
        cwrap.grid(row=6, column=2, sticky="ew", padx=12, pady=(10, 2))
        ttk.Button(cwrap, text="K", style="Secondary.TButton", command=lambda: self._set_entry(self.cinsiyet, "K")).grid(row=0, column=0, padx=(0, 6))
        ttk.Button(cwrap, text="E", style="Secondary.TButton", command=lambda: self._set_entry(self.cinsiyet, "E")).grid(row=0, column=1)
        ttk.Label(frm1, text="Kadın / Erkek kısa seçim", style="Value.TLabel").grid(row=7, column=1, sticky="w", padx=12, pady=(0, 6))

        self._manual_row(frm1, 8, "İl", "Bulunduğu il", "il")
        self._manual_row(frm1, 10, "İlçe", "Bulunduğu ilçe", "ilce")

        frmSummary = ttk.LabelFrame(top, text="Canlı Durum", style="Card.TLabelframe")
        frmSummary.grid(row=0, column=1, sticky="nsew")
        frmSummary.columnconfigure(0, weight=1)
        self.summary_box = tk.Text(frmSummary, height=15, wrap=tk.WORD, bg="#121a2b", fg="#e2e8f0", insertbackground="#e2e8f0", relief="flat", font=("Arial", 10))
        self.summary_box.grid(row=0, column=0, sticky="nsew", padx=12, pady=12)
        self.summary_box.insert("1.0", "Hazır.\n\n1) Manuel alanları doldurun\n2) Radyoloji metnini panodan alın\n3) Lab metnini panodan alın\n4) Labları otomatik çözün\n5) Excel'e kaydedin")
        self.summary_box.configure(state="disabled")

        frm2 = ttk.LabelFrame(self, text="İşlemler", style="Card.TLabelframe")
        frm2.grid(row=2, column=0, sticky="ew", padx=18, pady=6)
        for i in range(6):
            frm2.columnconfigure(i, weight=1)

        ttk.Button(frm2, text="Panodan Radyoloji Al", style="Primary.TButton", command=self.load_radiology).grid(row=0, column=0, padx=8, pady=12, sticky="ew")
        ttk.Button(frm2, text="Panodan Lab Al", style="Primary.TButton", command=self.load_lab).grid(row=0, column=1, padx=8, pady=12, sticky="ew")
        ttk.Button(frm2, text="Labları Otomatik Çöz", style="Primary.TButton", command=self.parse_lab).grid(row=0, column=2, padx=8, pady=12, sticky="ew")
        ttk.Button(frm2, text="Kaydı Excel'e Yaz", style="Primary.TButton", command=self.save_record).grid(row=0, column=3, padx=8, pady=12, sticky="ew")
        ttk.Button(frm2, text="Formu Temizle", style="Secondary.TButton", command=self.clear_form).grid(row=0, column=4, padx=8, pady=12, sticky="ew")
        ttk.Button(frm2, text="Programdan Çık", style="Secondary.TButton", command=self.destroy).grid(row=0, column=5, padx=8, pady=12, sticky="ew")

        middle = ttk.Frame(self, style="App.TFrame")
        middle.grid(row=3, column=0, sticky="nsew", padx=18, pady=6)
        middle.columnconfigure(0, weight=1)
        middle.columnconfigure(1, weight=1)
        middle.rowconfigure(1, weight=1)

        frm3 = ttk.LabelFrame(middle, text="Otomatik Sonuçlar", style="Card.TLabelframe")
        frm3.grid(row=0, column=0, sticky="ew", padx=(0, 10), pady=0)
        for i in range(4):
            frm3.columnconfigure(i, weight=1)

        alanlar = [
            ("DVT Sonucu", "dvt_sonucu"),
            ("Taraf", "taraf"),
            ("Lokalizasyon", "lokalizasyon"),
            ("Hb", "hb"),
            ("WBC", "wbc"),
            ("PLT", "plt"),
            ("Kreatinin", "kreatinin"),
            ("CRP", "crp"),
        ]

        for idx, (etiket, attr) in enumerate(alanlar):
            r = idx // 2
            c = (idx % 2) * 2
            ttk.Label(frm3, text=etiket, style="Field.TLabel").grid(row=r, column=c, padx=12, pady=10, sticky="w")
            entry = ttk.Entry(frm3, style="App.TEntry")
            entry.grid(row=r, column=c + 1, padx=12, pady=10, sticky="ew")
            setattr(self, attr, entry)

        frm4 = ttk.LabelFrame(middle, text="Metin Önizleme", style="Card.TLabelframe")
        frm4.grid(row=1, column=0, columnspan=2, sticky="nsew", pady=10)
        frm4.columnconfigure(0, weight=1)
        frm4.columnconfigure(1, weight=1)
        frm4.rowconfigure(1, weight=1)

        ttk.Label(frm4, text="Radyoloji Metni", style="Field.TLabel").grid(row=0, column=0, sticky="w", padx=12, pady=8)
        ttk.Label(frm4, text="Lab Metni", style="Field.TLabel").grid(row=0, column=1, sticky="w", padx=12, pady=8)

        self.radyoloji_text = scrolledtext.ScrolledText(frm4, wrap=tk.WORD, height=18, font=("Consolas", 10), bg="#0f172a", fg="#e2e8f0", insertbackground="#e2e8f0", relief="flat")
        self.radyoloji_text.grid(row=1, column=0, sticky="nsew", padx=12, pady=10)

        self.lab_text = scrolledtext.ScrolledText(frm4, wrap=tk.WORD, height=18, font=("Consolas", 10), bg="#0f172a", fg="#e2e8f0", insertbackground="#e2e8f0", relief="flat")
        self.lab_text.grid(row=1, column=1, sticky="nsew", padx=12, pady=10)

        self.status = tk.StringVar(value="Hazır")
        status_frame = ttk.Frame(self, style="App.TFrame")
        status_frame.grid(row=4, column=0, sticky="ew", padx=18, pady=(0, 16))
        status_frame.columnconfigure(0, weight=1)
        ttk.Label(status_frame, textvariable=self.status, style="SubHeader.TLabel").grid(row=0, column=0, sticky="w")

    def _manual_row(self, parent, row, label, hint, attr):
        ttk.Label(parent, text=label, style="Field.TLabel").grid(row=row, column=0, sticky="w", padx=12, pady=(10, 2))
        entry = ttk.Entry(parent, style="App.TEntry")
        entry.grid(row=row, column=1, sticky="ew", padx=12, pady=(10, 2))
        ttk.Button(parent, text="Panodan Yapıştır", style="Secondary.TButton", command=lambda e=entry: entryye_pano_yapistir(e)).grid(row=row, column=2, sticky="ew", padx=12, pady=(10, 2))
        ttk.Label(parent, text=hint, style="Value.TLabel").grid(row=row + 1, column=1, sticky="w", padx=12, pady=(0, 6))
        setattr(self, attr, entry)

    def _set_entry(self, entry, value):
        entry.delete(0, tk.END)
        entry.insert(0, value)

    def _update_summary(self, text):
        self.summary_box.configure(state="normal")
        self.summary_box.delete("1.0", tk.END)
        self.summary_box.insert("1.0", text)
        self.summary_box.configure(state="disabled")

    def load_radiology(self):
        rapor = clipboard_oku()
        if not rapor:
            messagebox.showwarning("Uyarı", "Panoda radyoloji metni yok.")
            return
        self.radyoloji_text.delete("1.0", tk.END)
        self.radyoloji_text.insert(tk.END, rapor)
        self._set_entry(self.dvt_sonucu, dvt_analiz_et(rapor))
        self._set_entry(self.taraf, taraf_bul(rapor))
        self._set_entry(self.lokalizasyon, lokalizasyon_bul(rapor))
        self.status.set("Radyoloji metni panodan alındı.")
        self._update_summary(f"Radyoloji yüklendi.\n\nDVT: {self.dvt_sonucu.get()}\nTaraf: {self.taraf.get()}\nLokalizasyon: {self.lokalizasyon.get()}")

    def load_lab(self):
        lab = clipboard_oku()
        if not lab:
            messagebox.showwarning("Uyarı", "Panoda laboratuvar metni yok.")
            return
        self.lab_text.delete("1.0", tk.END)
        self.lab_text.insert(tk.END, lab)
        with open("lab_debug.txt", "w", encoding="utf-8") as f:
            f.write(lab)
        self.status.set("Lab metni panodan alındı ve lab_debug.txt kaydedildi.")

    def parse_lab(self):
        lab_metin = self.lab_text.get("1.0", tk.END).strip()
        if not lab_metin:
            messagebox.showwarning("Uyarı", "Önce lab metnini panodan alın.")
            return
        lablar = lablari_toplu_cek(lab_metin)
        self._set_entry(self.hb, lablar.get("hb", ""))
        self._set_entry(self.wbc, lablar.get("wbc", ""))
        self._set_entry(self.plt, lablar.get("plt", ""))
        self._set_entry(self.kreatinin, lablar.get("kreatinin", ""))
        self._set_entry(self.crp, lablar.get("crp", ""))
        self.status.set("Lablar otomatik çözüldü. Boş kalan alanları elle düzeltebilirsiniz.")
        self._update_summary(
            f"Lab çözümü tamamlandı.\n\nHb: {self.hb.get()}\nWBC: {self.wbc.get()}\nPLT: {self.plt.get()}\nKreatinin: {self.kreatinin.get()}\nCRP: {self.crp.get()}"
        )

    def save_record(self):
        hasta_id = self.hasta_id.get().strip()
        ad_soyad = self.ad_soyad.get().strip()

        if not hasta_id or not ad_soyad:
            messagebox.showerror("Hata", "Hasta ID ve Ad Soyad boş olamaz.")
            return

        yeni_kayit = {
            "tarih_saat": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "hasta_id": hasta_id,
            "ad_soyad": ad_soyad,
            "yas": self.yas.get().strip(),
            "cinsiyet": self.cinsiyet.get().strip(),
            "il": self.il.get().strip(),
            "ilce": self.ilce.get().strip(),
            "hb": self.hb.get().strip(),
            "wbc": self.wbc.get().strip(),
            "plt": self.plt.get().strip(),
            "kreatinin": self.kreatinin.get().strip(),
            "crp": self.crp.get().strip(),
            "radyoloji_raporu": self.radyoloji_text.get("1.0", tk.END).strip(),
            "lab_metin": self.lab_text.get("1.0", tk.END).strip(),
            "dvt_sonucu": self.dvt_sonucu.get().strip(),
            "taraf": self.taraf.get().strip(),
            "lokalizasyon": self.lokalizasyon.get().strip(),
        }

        kaydi_excel_yaz(yeni_kayit)
        self.status.set(f"Kayıt Excel'e yazıldı: {DOSYA_ADI}")
        messagebox.showinfo("Başarılı", f"Kayıt eklendi.\nDosya: {DOSYA_ADI}")

    def clear_form(self):
        for entry in [
            self.hasta_id, self.ad_soyad, self.yas, self.cinsiyet, self.il, self.ilce,
            self.dvt_sonucu, self.taraf, self.lokalizasyon,
            self.hb, self.wbc, self.plt, self.kreatinin, self.crp,
        ]:
            entry.delete(0, tk.END)
        self.radyoloji_text.delete("1.0", tk.END)
        self.lab_text.delete("1.0", tk.END)
        self.status.set("Form temizlendi.")
        self._update_summary("Hazır.\n\nYeni hasta kaydı için alanları doldurabilirsiniz.")


if __name__ == "__main__":
    app = App()
    app.mainloop()
