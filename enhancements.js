/* ===================================================
   Hasta Adı Doğrulama Sistemi
=================================================== */
let patientNameDatabase = []; // Mevcut hasta adları veritabanı

function verifyPatientName(newPatientName) {
    const normalizedNew = normalizeTurkish(newPatientName.toLowerCase().trim());
    
    // Benzer isimleri ara (Levenshtein mesafesi ile)
    const similarPatients = patientNameDatabase.filter(patient => {
        const normalizedExisting = normalizeTurkish(patient.name.toLowerCase().trim());
        const similarity = calculateSimilarity(normalizedNew, normalizedExisting);
        return similarity > 0.8; // %80 benzerlik eşiği
    });
    
    if (similarPatients.length > 0) {
        showPatientVerificationModal(newPatientName, similarPatients);
        return false; // Doğrulama gerekli
    }
    
    return true; // İsim benzersiz, devam edilebilir
}

function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

function showPatientVerificationModal(newName, similarPatients) {
    // Modal oluştur
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.id = 'patientVerificationModal';
    
    const similarList = similarPatients.map(p => `
        <div style="padding:10px; border:1px solid var(--border); border-radius:8px; margin-bottom:8px; cursor:pointer;" onclick="selectExistingPatient('${p.id}')">
            <div style="font-weight:600; color:var(--text);">${p.name}</div>
            <div style="font-size:12px; color:var(--text-muted);">TC: ${p.tc || 'Belirtilmemiş'} | Kayıt: ${p.date}</div>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width:520px;">
            <div style="text-align:center; margin-bottom:20px;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:32px; color:var(--warning); margin-bottom:12px; display:block;"></i>
                <h3 class="font-display" style="font-size:18px; font-weight:600;">Hasta Adı Doğrulaması</h3>
                <p style="font-size:13px; color:var(--text-muted); margin-top:6px;">"${newName}" adına benzer kayıtlar bulundu!</p>
            </div>
            
            <div style="background:var(--warning-glow); border:1px solid rgba(255,145,0,0.3); border-radius:8px; padding:12px; margin-bottom:16px;">
                <p style="font-size:12px; color:var(--warning); font-weight:600; margin-bottom:6px;"><i class="fa-solid fa-info-circle" style="margin-right:4px;"></i>Yanlış hasta kaydını önlemek için:</p>
                <ul style="font-size:11px; color:var(--text); margin:0; padding-left:16px;">
                    <li>Aşağıdaki benzer hasta kayıtlarını kontrol edin</li>
                    <li>Eğer aynı hasta ise, mevcut kaydı seçin</li>
                    <li>Farklı bir hasta ise, "Yeni Hasta Olarak Devam Et" butonuna tıklayın</li>
                </ul>
            </div>
            
            <div style="max-height:200px; overflow-y:auto; margin-bottom:16px;">
                ${similarList}
            </div>
            
            <div style="display:flex; gap:10px; justify-content:flex-end;">
                <button class="btn btn-ghost" onclick="closePatientVerificationModal()">
                    <i class="fa-solid fa-times"></i> İptal
                </button>
                <button class="btn btn-primary" onclick="confirmNewPatient('${newName}')">
                    <i class="fa-solid fa-user-plus"></i> Yeni Hasta Olarak Devam Et
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function selectExistingPatient(patientId) {
    const patient = patientNameDatabase.find(p => p.id === patientId);
    if (patient) {
        // Mevcut hasta bilgilerini forma yükle
        document.getElementById('tcKimlik').value = patient.tc || '';
        document.getElementById('adSoyad').value = patient.name;
        document.getElementById('yas').value = patient.age || '';
        document.getElementById('cinsiyet').value = patient.gender || '';
        document.getElementById('babaAdi').value = patient.fatherName || '';
        document.getElementById('dogumTarihi').value = patient.birthDate || '';
        document.getElementById('sgkNo').value = patient.sgk || '';
        
        closePatientVerificationModal();
        showToast('Mevcut hasta kaydı yüklendi. Lütfen bilgileri kontrol edip güncelleyin.', 'info');
    }
}

function confirmNewPatient(patientName) {
    // Yeni hastayı veritabanına ekle
    const newPatient = {
        id: Date.now().toString(),
        name: patientName,
        tc: document.getElementById('tcKimlik').value,
        date: new Date().toLocaleDateString('tr-TR')
    };
    
    patientNameDatabase.push(newPatient);
    closePatientVerificationModal();
    showToast('Yeni hasta olarak kaydedildi. İşleme devam edebilirsiniz.', 'success');
}

function closePatientVerificationModal() {
    const modal = document.getElementById('patientVerificationModal');
    if (modal) {
        modal.remove();
    }
}

// Laboratuvar işleme fonksiyonu index.html'de multi-page PDF desteği ile tanımlıdır

/* ===================================================
   Sekme Geçişi Fonksiyonu
=================================================== */
function switchTab(tabName) {
    // Tüm sekmeleri gizle
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Tüm sekme butonlarını pasif yap
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.style.color = 'var(--text-muted)';
        btn.style.borderBottom = '2px solid transparent';
    });
    
    // Seçili sekmeyi göster
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    // Seçili butonu aktif yap
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.style.color = 'var(--text)';
        activeBtn.style.borderBottom = '2px solid var(--accent)';
    }
}

/* ===================================================
   Geliştirilmiş Kaydet Fonksiyonu
=================================================== */
function enhancedSavePatient() {
    const adSoyad = document.getElementById('adSoyad').value.trim();
    const tcKimlik = document.getElementById('tcKimlik').value.trim();
    
    // En azından ad soyad veya TC olmalı
    if (!adSoyad && !tcKimlik) {
        showToast('En az Ad Soyad veya TC Kimlik girilmelidir.', 'error');
        return;
    }
    
    // Hasta adı doğrulaması
    if (adSoyad && !verifyPatientName(adSoyad)) {
        return; // Doğrulama modalı gösterilecek, user karar verecek
    }
    
    // Normal kaydetme işlemi
    savePatient();
}

/* ===================================================
   Event Listener Ekleme
=================================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Laboratuvar işleme index.html'de tanımlıdır
    
    // Ad soyad alanına yazma olayında doğrulama
    const adSoyadField = document.getElementById('adSoyad');
    if (adSoyadField) {
        adSoyadField.addEventListener('blur', function() {
            if (this.value.trim().length > 2) {
                verifyPatientName(this.value.trim());
            }
        });
    }
});

// Global fonksiyonları dışa aktar
window.verifyPatientName = verifyPatientName;
window.switchTab = switchTab;
window.enhancedSavePatient = enhancedSavePatient;
window.selectExistingPatient = selectExistingPatient;
window.confirmNewPatient = confirmNewPatient;
window.closePatientVerificationModal = closePatientVerificationModal;
