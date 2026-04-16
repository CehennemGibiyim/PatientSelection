/* ===================================================
   Local Storage Manager - Veri Kalıcılığı
=================================================== */
class StorageManager {
    constructor() {
        this.storageKey = 'hbys_patient_data';
        this.settingsKey = 'hbys_settings';
        this.maxStorageSize = 50 * 1024 * 1024; // 50MB limit
    }

    // Hasta verilerini kaydet
    savePatients(patients) {
        try {
            const data = {
                patients: patients,
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Veri kaydetme hatası:', error);
            if (error.name === 'QuotaExceededError') {
                this.showStorageWarning();
            }
            return false;
        }
    }

    // Hasta verilerini getir
    loadPatients() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                return parsed.patients || [];
            }
            return [];
        } catch (error) {
            console.error('Veri yükleme hatası:', error);
            return [];
        }
    }

    // Ayarları kaydet
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Ayar kaydetme hatası:', error);
            return false;
        }
    }

    // Ayarları getir
    loadSettings() {
        try {
            const settings = localStorage.getItem(this.settingsKey);
            return settings ? JSON.parse(settings) : this.getDefaultSettings();
        } catch (error) {
            console.error('Ayar yükleme hatası:', error);
            return this.getDefaultSettings();
        }
    }

    // Varsayılan ayarlar
    getDefaultSettings() {
        return {
            autoSave: true,
            patientVerification: true,
            ocrLanguage: 'tur+eng',
            exportFormat: 'excel',
            theme: 'dark',
            autoBackup: true,
            lastBackup: null
        };
    }

    // Veri yedeği
    createBackup() {
        try {
            const data = {
                patients: this.loadPatients(),
                settings: this.loadSettings(),
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `hbys_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Son yedeklemeyi kaydet
            const settings = this.loadSettings();
            settings.lastBackup = new Date().toISOString();
            this.saveSettings(settings);
            
            return true;
        } catch (error) {
            console.error('Yedekleme hatası:', error);
            return false;
        }
    }

    // Yedekten geri yükle
    restoreFromBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Versiyon kontrolü
                    if (data.version && this.isVersionCompatible(data.version)) {
                        // Hastaları geri yükle
                        if (data.patients && Array.isArray(data.patients)) {
                            this.savePatients(data.patients);
                        }
                        
                        // Ayarları geri yükle
                        if (data.settings) {
                            this.saveSettings(data.settings);
                        }
                        
                        resolve(data);
                    } else {
                        reject(new Error('Yedek dosyası uyumsuz versiyon'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Dosya okunamadı'));
            reader.readAsText(file);
        });
    }

    // Versiyon uyumluluğu kontrolü
    isVersionCompatible(version) {
        const currentVersion = '1.0.0';
        return this.compareVersions(version, currentVersion) <= 0;
    }

    // Versiyon karşılaştırma
    compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;
            
            if (part1 > part2) return 1;
            if (part1 < part2) return -1;
        }
        
        return 0;
    }

    // Depolama uyarısı göster
    showStorageWarning() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div style="text-align:center; margin-bottom:20px;">
                    <i class="fa-solid fa-exclamation-triangle" style="font-size:32px; color:var(--warning); margin-bottom:12px; display:block;"></i>
                    <h3 class="font-display" style="font-size:18px; font-weight:600;">Depolama Alanı Doldu</h3>
                    <p style="font-size:13px; color:var(--text-muted); margin-top:6px;">Tarayıcı depolama alanı neredeyse dolu.</p>
                </div>
                
                <div style="background:var(--warning-glow); border:1px solid rgba(255,145,0,0.3); border-radius:8px; padding:12px; margin-bottom:16px;">
                    <p style="font-size:12px; color:var(--warning); font-weight:600; margin-bottom:6px;">Öneriler:</p>
                    <ul style="font-size:11px; color:var(--text); margin:0; padding-left:16px;">
                        <li>Eski hasta kayıtlarını silin</li>
                        <li>Veri yedeği oluşturun</li>
                        <li>Tarayıcı cache'ini temizleyin</li>
                    </ul>
                </div>
                
                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button class="btn btn-ghost" onclick="closeStorageWarning()">
                        <i class="fa-solid fa-times"></i> Kapat
                    </button>
                    <button class="btn btn-warning" onclick="storageManager.cleanupOldData()">
                        <i class="fa-solid fa-broom"></i> Eski Verileri Temizle
                    </button>
                    <button class="btn btn-primary" onclick="storageManager.createBackup()">
                        <i class="fa-solid fa-download"></i> Yedek Al
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Eski verileri temizle
    cleanupOldData() {
        const patients = this.loadPatients();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentPatients = patients.filter(p => {
            const patientDate = new Date(p.kayitTarihi || p.timestamp);
            return patientDate > thirtyDaysAgo;
        });
        
        this.savePatients(recentPatients);
        closeStorageWarning();
        showToast(`${patients.length - recentPatients.length} eski hasta kaydı silindi.`, 'info');
    }

    // Depolama durumunu kontrol et
    getStorageInfo() {
        try {
            const data = localStorage.getItem(this.storageKey);
            const settings = localStorage.getItem(this.settingsKey);
            
            const totalSize = (data ? data.length : 0) + (settings ? settings.length : 0);
            const percentage = (totalSize / this.maxStorageSize) * 100;
            
            return {
                used: totalSize,
                max: this.maxStorageSize,
                percentage: percentage,
                status: percentage > 90 ? 'critical' : percentage > 70 ? 'warning' : 'good'
            };
        } catch (error) {
            return { used: 0, max: this.maxStorageSize, percentage: 0, status: 'error' };
        }
    }

    // Otomatik yedekle
    autoBackup() {
        const settings = this.loadSettings();
        if (settings.autoBackup) {
            const lastBackup = settings.lastBackup;
            const now = new Date();
            
            // Haftada bir yedekle
            if (!lastBackup || (now - new Date(lastBackup)) > 7 * 24 * 60 * 60 * 1000) {
                this.createBackup();
            }
        }
    }
}

// Global instance
const storageManager = new StorageManager();

// Modal kapatma fonksiyonu
function closeStorageWarning() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Export fonksiyonları
window.storageManager = storageManager;
window.closeStorageWarning = closeStorageWarning;
