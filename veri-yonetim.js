/* ===================================================
   Veri Yönetim Sistemi - Export/Import
=================================================== */
class DataManagement {
    constructor() {
        this.exportFormats = ['excel', 'json', 'csv'];
        this.importFormats = ['json', 'csv'];
    }

    // Veri export
    exportData(format = 'excel', patients = null) {
        const data = patients || storageManager.loadPatients();
        
        if (!data || data.length === 0) {
            showToast('Aktarılacak hasta kaydı bulunamadı.', 'warning');
            return;
        }

        switch (format.toLowerCase()) {
            case 'excel':
                this.exportToExcel(data);
                break;
            case 'json':
                this.exportToJSON(data);
                break;
            case 'csv':
                this.exportToCSV(data);
                break;
            default:
                showToast('Desteklenmeyen format: ' + format, 'error');
        }
    }

    // Excel export
    exportToExcel(patients) {
        try {
            const excelData = patients.map(p => ({
                'TC Kimlik': p.tcKimlik || '',
                'Ad': p.ad || '',
                'Soyad': p.soyad || '',
                'Ad Soyad': p.adSoyad || '',
                'Yaş': p.yas || '',
                'Cinsiyet': p.cinsiyet || '',
                'Baba Adı': p.babaAdi || '',
                'Anne Adı': p.anneAdi || '',
                'Doğum Tarihi': p.dogumTarihi || '',
                'SGK No': p.sgkNo || '',
                'Kayıt Tarihi': p.kayitTarihi || '',
                'DVT Sonucu': p.dvtSonucu || '',
                'Lokalizasyon': p.lokalizasyon || '',
                'Taraf': p.taraf || '',
                'Hb (g/dL)': p.hb || '',
                'Urik Asit (mg/dL)': p.urikAsit || '',
                'Albumin (g/dL)': p.albumin || '',
                'Total Protein (g/dL)': p.totalProtein || '',
                'Trombosit (10^3/uL)': p.trombosit || '',
                'D-Dimer (ug/mL FEU)': p.dDimer || '',
                'INR': p.inr || '',
                'APTT (sn)': p.aptt || '',
                'Ultrason Sonucu': p.ultrasonSonucu || '',
                'Ultrason Lokalizasyon': p.ultrasonLokalizasyon || '',
                'Ultrason Taraf': p.ultrasonTaraf || '',
                'Ultrason Notları': p.ultrasonNotlar || ''
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            
            // Sütun genişlikleri ayarla
            ws['!cols'] = [
                { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 24 }, { wch: 6 },
                { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
                { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 12 },
                { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 10 }
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Hasta Verileri');

            // Dosya adına tarih ekle
            const now = new Date();
            const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
            XLSX.writeFile(wb, `HBYS_Verileri_${dateStr}.xlsx`);

            showToast(`${patients.length} hasta kaydı Excel'e aktarıldı.`, 'success', 4000);
        } catch (err) {
            console.error('Excel aktarım hatası:', err);
            showToast('Excel aktarımı başarısız: ' + err.message, 'error');
        }
    }

    // JSON export
    exportToJSON(patients) {
        try {
            const exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '1.0.0',
                    totalPatients: patients.length,
                    system: 'HBYS Veri Toplama Paneli'
                },
                patients: patients
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `HBYS_Verileri_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast(`${patients.length} hasta kaydı JSON olarak aktarıldı.`, 'success');
        } catch (err) {
            console.error('JSON aktarım hatası:', err);
            showToast('JSON aktarımı başarısız: ' + err.message, 'error');
        }
    }

    // CSV export
    exportToCSV(patients) {
        try {
            const headers = [
                'TC Kimlik', 'Ad', 'Soyad', 'Ad Soyad', 'Yaş', 'Cinsiyet', 'Baba Adı', 'Anne Adı',
                'Doğum Tarihi', 'SGK No', 'Kayıt Tarihi', 'DVT Sonucu', 'Lokalizasyon',
                'Taraf', 'Hb (g/dL)', 'Urik Asit (mg/dL)', 'Albumin (g/dL)',
                'Total Protein (g/dL)', 'Trombosit (10^3/uL)', 'D-Dimer (ug/mL FEU)',
                'INR', 'APTT (sn)', 'Ultrason Sonucu', 'Ultrason Lokalizasyon',
                'Ultrason Taraf', 'Ultrason Notları'
            ];

            const csvContent = [
                headers.join(','),
                ...patients.map(p => [
                    `"${p.tcKimlik || ''}"`,
                    `"${p.ad || ''}"`,
                    `"${p.soyad || ''}"`,
                    `"${p.adSoyad || ''}"`,
                    `"${p.yas || ''}"`,
                    `"${p.cinsiyet || ''}"`,
                    `"${p.babaAdi || ''}"`,
                    `"${p.anneAdi || ''}"`,
                    `"${p.dogumTarihi || ''}"`,
                    `"${p.sgkNo || ''}"`,
                    `"${p.kayitTarihi || ''}"`,
                    `"${p.dvtSonucu || ''}"`,
                    `"${p.lokalizasyon || ''}"`,
                    `"${p.taraf || ''}"`,
                    `"${p.hb || ''}"`,
                    `"${p.urikAsit || ''}"`,
                    `"${p.albumin || ''}"`,
                    `"${p.totalProtein || ''}"`,
                    `"${p.trombosit || ''}"`,
                    `"${p.dDimer || ''}"`,
                    `"${p.inr || ''}"`,
                    `"${p.aptt || ''}"`,
                    `"${p.ultrasonSonucu || ''}"`,
                    `"${p.ultrasonLokalizasyon || ''}"`,
                    `"${p.ultrasonTaraf || ''}"`,
                    `"${p.ultrasonNotlar || ''}"`
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `HBYS_Verileri_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast(`${patients.length} hasta kaydı CSV olarak aktarıldı.`, 'success');
        } catch (err) {
            console.error('CSV aktarım hatası:', err);
            showToast('CSV aktarımı başarısız: ' + err.message, 'error');
        }
    }

    // Veri import
    importData(file, format = null) {
        const fileFormat = format || this.detectFileFormat(file.name);
        
        if (!this.importFormats.includes(fileFormat)) {
            showToast('Desteklenmeyen dosya formatı: ' + fileFormat, 'error');
            return;
        }

        switch (fileFormat) {
            case 'json':
                this.importFromJSON(file);
                break;
            case 'csv':
                this.importFromCSV(file);
                break;
            default:
                showToast('Desteklenmeyen format: ' + fileFormat, 'error');
        }
    }

    // JSON import
    importFromJSON(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                let importedPatients = [];
                
                if (data.patients && Array.isArray(data.patients)) {
                    importedPatients = data.patients;
                } else if (Array.isArray(data)) {
                    importedPatients = data;
                } else {
                    throw new Error('Geçersiz JSON formatı');
                }

                this.processImportedData(importedPatients);
            } catch (error) {
                console.error('JSON import hatası:', error);
                showToast('JSON dosyası import edilemedi: ' + error.message, 'error');
            }
        };
        
        reader.onerror = () => {
            showToast('Dosya okunamadı', 'error');
        };
        
        reader.readAsText(file);
    }

    // CSV import
    importFromCSV(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
                
                const importedPatients = [];
                
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const values = line.split(',').map(v => v.replace(/"/g, '').trim());
                    const patient = {};
                    
                    headers.forEach((header, index) => {
                        patient[header] = values[index] || '';
                    });
                    
                    importedPatients.push(patient);
                }
                
                this.processImportedData(importedPatients);
            } catch (error) {
                console.error('CSV import hatası:', error);
                showToast('CSV dosyası import edilemedi: ' + error.message, 'error');
            }
        };
        
        reader.onerror = () => {
            showToast('Dosya okunamadı', 'error');
        };
        
        reader.readAsText(file);
    }

    // Import edilmiş verileri işle
    processImportedData(importedPatients) {
        if (importedPatients.length === 0) {
            showToast('Import edilecek hasta kaydı bulunamadı.', 'warning');
            return;
        }

        // Mevcut hastaları kontrol et
        const existingPatients = storageManager.loadPatients();
        const duplicatePatients = [];
        const newPatients = [];

        importedPatients.forEach(imported => {
            const duplicate = existingPatients.find(existing => 
                existing.tcKimlik === imported.tcKimlik || 
                existing.adSoyad === imported.adSoyad
            );
            
            if (duplicate) {
                duplicatePatients.push({ existing: duplicate, imported: imported });
            } else {
                newPatients.push(imported);
            }
        });

        if (duplicatePatients.length > 0) {
            this.showDuplicateResolutionModal(duplicatePatients, newPatients);
        } else {
            this.completeImport(newPatients);
        }
    }

    // Duplicate çözüm modalı
    showDuplicateResolutionModal(duplicates, newPatients) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        modal.id = 'duplicateResolutionModal';
        
        const duplicateList = duplicates.map((dup, index) => `
            <div style="padding:10px; border:1px solid var(--border); border-radius:8px; margin-bottom:8px;">
                <div style="font-weight:600; color:var(--warning); margin-bottom:4px;">
                    ${dup.imported.adSoyad || dup.imported['Ad Soyad']}
                </div>
                <div style="font-size:12px; color:var(--text-muted);">
                    Mevcut kayıt: ${dup.existing.kayitTarihi || 'Bilinmiyor'}<br>
                    Yeni kayıt: ${dup.imported['Kayıt Tarihi'] || 'Bilinmiyor'}
                </div>
                <div style="margin-top:8px; display:flex; gap:8px;">
                    <button class="btn btn-ghost" style="font-size:11px;" onclick="dataManagement.skipDuplicate(${index})">
                        Atla
                    </button>
                    <button class="btn btn-secondary" style="font-size:11px;" onclick="dataManagement.replaceDuplicate(${index})">
                        Değiştir
                    </button>
                    <button class="btn btn-primary" style="font-size:11px;" onclick="dataManagement.mergeDuplicate(${index})">
                        Birleştir
                    </button>
                </div>
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width:600px; max-height:80vh; overflow-y:auto;">
                <div style="text-align:center; margin-bottom:20px;">
                    <i class="fa-solid fa-exclamation-triangle" style="font-size:32px; color:var(--warning); margin-bottom:12px; display:block;"></i>
                    <h3 class="font-display" style="font-size:18px; font-weight:600;">Duplicate Hasta Kayıtları</h3>
                    <p style="font-size:13px; color:var(--text-muted); margin-top:6px;">
                        ${duplicates.length} adet duplicate hasta kaydı bulundu.
                    </p>
                </div>
                
                <div style="margin-bottom:20px;">
                    ${duplicateList}
                </div>
                
                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button class="btn btn-ghost" onclick="dataManagement.cancelImport()">
                        <i class="fa-solid fa-times"></i> İptal
                    </button>
                    <button class="btn btn-primary" onclick="dataManagement.importOnlyNew()">
                        <i class="fa-solid fa-download"></i> Sadece Yenileri Import Et (${newPatients.length})
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Global değişkenler
        window.dataManagementDuplicates = duplicates;
        window.dataManagementNewPatients = newPatients;
    }

    // Duplicate atla
    skipDuplicate(index) {
        window.dataManagementDuplicates.splice(index, 1);
        this.updateDuplicateModal();
    }

    // Duplicate değiştir
    replaceDuplicate(index) {
        const duplicate = window.dataManagementDuplicates[index];
        const existingPatients = storageManager.loadPatients();
        
        // Eski kaydı sil
        const updatedPatients = existingPatients.filter(p => 
            !(p.tcKimlik === duplicate.existing.tcKimlik || p.adSoyad === duplicate.existing.adSoyad)
        );
        
        // Yeni kaydı ekle
        updatedPatients.push(duplicate.imported);
        
        storageManager.savePatients(updatedPatients);
        window.dataManagementDuplicates.splice(index, 1);
        
        this.updateDuplicateModal();
        showToast(`${duplicate.imported.adSoyad} kaydı güncellendi.`, 'success');
    }

    // Duplicate birleştir
    mergeDuplicate(index) {
        const duplicate = window.dataManagementDuplicates[index];
        const existingPatients = storageManager.loadPatients();
        
        // Kayıtları birleştir
        const merged = { ...duplicate.existing, ...duplicate.imported };
        
        // Eski kaydı güncelle
        const updatedPatients = existingPatients.map(p => 
            (p.tcKimlik === duplicate.existing.tcKimlik || p.adSoyad === duplicate.existing.adSoyad) ? merged : p
        );
        
        storageManager.savePatients(updatedPatients);
        window.dataManagementDuplicates.splice(index, 1);
        
        this.updateDuplicateModal();
        showToast(`${duplicate.imported.adSoyad} kaydı birleştirildi.`, 'success');
    }

    // Modal güncelle
    updateDuplicateModal() {
        const modal = document.getElementById('duplicateResolutionModal');
        if (window.dataManagementDuplicates.length === 0) {
            this.completeImport(window.dataManagementNewPatients);
        }
    }

    // Sadece yenileri import et
    importOnlyNew() {
        this.completeImport(window.dataManagementNewPatients);
        this.closeDuplicateModal();
    }

    // Import iptal
    cancelImport() {
        this.closeDuplicateModal();
        showToast('Import işlemi iptal edildi.', 'info');
    }

    // Modal kapat
    closeDuplicateModal() {
        const modal = document.getElementById('duplicateResolutionModal');
        if (modal) {
            modal.remove();
        }
    }

    // Import tamamla
    completeImport(patients) {
        const existingPatients = storageManager.loadPatients();
        const updatedPatients = [...existingPatients, ...patients];
        
        storageManager.savePatients(updatedPatients);
        
        // Patients array'ini güncelle
        if (typeof patients !== 'undefined') {
            patients.length = 0;
            patients.push(...updatedPatients);
            renderPatientList();
            updateStats();
        }
        
        this.closeDuplicateModal();
        showToast(`${patients.length} hasta kaydı başarıyla import edildi.`, 'success', 4000);
    }

    // Dosya formatı tespit et
    detectFileFormat(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        
        if (['json'].includes(extension)) return 'json';
        if (['csv'].includes(extension)) return 'csv';
        
        return null;
    }

    // Export/Import modalı göster
    showDataManagementModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        modal.id = 'dataManagementModal';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width:500px;">
                <div style="text-align:center; margin-bottom:20px;">
                    <i class="fa-solid fa-database" style="font-size:32px; color:var(--info); margin-bottom:12px; display:block;"></i>
                    <h3 class="font-display" style="font-size:18px; font-weight:600;">Veri Yönetimi</h3>
                    <p style="font-size:13px; color:var(--text-muted); margin-top:6px;">
                        Hasta verilerini export et veya import et
                    </p>
                </div>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
                    <div>
                        <h4 style="font-size:14px; font-weight:600; margin-bottom:12px; color:var(--text);">
                            <i class="fa-solid fa-upload" style="margin-right:6px; color:var(--accent);"></i>
                            Export Et
                        </h4>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <button class="btn btn-primary" onclick="dataManagement.exportData('excel')">
                                <i class="fa-solid fa-file-excel"></i> Excel
                            </button>
                            <button class="btn btn-secondary" onclick="dataManagement.exportData('json')">
                                <i class="fa-solid fa-file-code"></i> JSON
                            </button>
                            <button class="btn btn-secondary" onclick="dataManagement.exportData('csv')">
                                <i class="fa-solid fa-file-csv"></i> CSV
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="font-size:14px; font-weight:600; margin-bottom:12px; color:var(--text);">
                            <i class="fa-solid fa-download" style="margin-right:6px; color:var(--warning);"></i>
                            Import Et
                        </h4>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <input type="file" id="importFileInput" accept=".json,.csv" style="display:none;">
                            <button class="btn btn-warning" onclick="document.getElementById('importFileInput').click()">
                                <i class="fa-solid fa-folder-open"></i> Dosya Seç
                            </button>
                            <button class="btn btn-ghost" onclick="storageManager.createBackup()">
                                <i class="fa-solid fa-save"></i> Yedek Al
                            </button>
                        </div>
                    </div>
                </div>
                
                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button class="btn btn-ghost" onclick="dataManagement.closeDataManagementModal()">
                        <i class="fa-solid fa-times"></i> Kapat
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Import file input event listener
        document.getElementById('importFileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importData(file);
            }
        });
    }

    // Modal kapat
    closeDataManagementModal() {
        const modal = document.getElementById('dataManagementModal');
        if (modal) {
            modal.remove();
        }
    }
}

// Global instance
const dataManagement = new DataManagement();

// Export fonksiyonları
window.dataManagement = dataManagement;
