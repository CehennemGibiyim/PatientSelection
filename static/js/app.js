// Akgün HBYS Web - JavaScript

// Icon data (Lucide icons simplified)
const icons = {
    user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    'file-text': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>',
    save: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17,21 17,13 7,13 7,21"></polyline><polyline points="7,3 7,8 15,8"></polyline></svg>',
    'trash-2': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"></polyline><path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
    download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
};

// Initialize icons
document.addEventListener('DOMContentLoaded', function() {
    // Replace icon placeholders
    document.querySelectorAll('[data-lucide]').forEach(element => {
        const iconName = element.getAttribute('data-lucide');
        if (icons[iconName]) {
            element.innerHTML = icons[iconName];
        }
    });
});

// Utility functions
function updateStatus(message, type = 'info') {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = 'status-text';
        
        // Add color based on type
        if (type === 'error') {
            statusElement.style.color = '#ef4444';
        } else if (type === 'success') {
            statusElement.style.color = '#22c55e';
        } else {
            statusElement.style.color = 'var(--text-secondary)';
        }
    }
}

function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type} fade-in`;
    messageDiv.textContent = message;
    
    // Insert after header
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentElement('afterend', messageDiv);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

function validateField(fieldId, label) {
    const field = document.getElementById(fieldId);
    const value = field ? field.value.trim() : '';
    
    if (!value) {
        updateStatus(`${label} boþ olamaz`, 'error');
        return false;
    }
    return true;
}

function setLoading(element, loading = true) {
    if (loading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// Form functions
function setGender(gender) {
    const genderField = document.getElementById('cinsiyet');
    if (genderField) {
        genderField.value = gender;
        updateStatus(`Cinsiyet seçildi: ${gender === 'K' ? 'Kadýn' : 'Erkek'}`, 'success');
    }
}

function clearForm() {
    document.querySelectorAll('.form-input').forEach(field => {
        field.value = '';
    });
    document.getElementById('cinsiyet').value = '';
    updateStatus('Form temizlendi', 'info');
}

// API functions
async function makeRequest(url, method, data) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Ýsteðiniz iÛlenirken bir hata oluþtu');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Analysis functions
async function analyzeRadiology() {
    const textArea = document.getElementById('radyoloji_text');
    const text = textArea ? textArea.value.trim() : '';
    
    if (!text) {
        updateStatus('Radyoloji metni boþ', 'error');
        return;
    }
    
    const button = event.target;
    setLoading(button, true);
    updateStatus('Radyoloji analizi yapýlýyor...');
    
    try {
        const result = await makeRequest('/api/analyze_radiology', 'POST', { text });
        
        // Update fields
        document.getElementById('dvt_sonucu').value = result.dvt_sonucu || '';
        document.getElementById('taraf').value = result.taraf || '';
        document.getElementById('lokalizasyon').value = result.lokalizasyon || '';
        
        updateStatus('Radyoloji analizi tamamlandý', 'success');
        showMessage('Radyoloji analizi baþarýyla tamamlandý', 'success');
        
    } catch (error) {
        updateStatus('Hata: ' + error.message, 'error');
        showMessage(error.message, 'error');
    } finally {
        setLoading(button, false);
    }
}

async function analyzeLab() {
    const textArea = document.getElementById('lab_text');
    const text = textArea ? textArea.value.trim() : '';
    
    if (!text) {
        updateStatus('Lab metni boþ', 'error');
        return;
    }
    
    const button = event.target;
    setLoading(button, true);
    updateStatus('Lab analizi yapýlýyor...');
    
    try {
        const result = await makeRequest('/api/analyze_lab', 'POST', { text });
        
        // Update fields
        document.getElementById('hb').value = result.hb || '';
        document.getElementById('wbc').value = result.wbc || '';
        document.getElementById('plt').value = result.plt || '';
        document.getElementById('kreatinin').value = result.kreatinin || '';
        document.getElementById('crp').value = result.crp || '';
        
        updateStatus('Lab analizi tamamlandý', 'success');
        showMessage('Lab analizi baþarýyla tamamlandý', 'success');
        
    } catch (error) {
        updateStatus('Hata: ' + error.message, 'error');
        showMessage(error.message, 'error');
    } finally {
        setLoading(button, false);
    }
}

async function saveRecord() {
    // Validate required fields
    if (!validateField('hasta_id', 'Hasta ID')) return;
    if (!validateField('ad_soyad', 'Ad Soyad')) return;
    
    const button = event.target;
    setLoading(button, true);
    updateStatus('Kayýt kaydediliyor...');
    
    try {
        const record = {
            hasta_id: document.getElementById('hasta_id').value.trim(),
            ad_soyad: document.getElementById('ad_soyad').value.trim(),
            yas: document.getElementById('yas').value,
            cinsiyet: document.getElementById('cinsiyet').value,
            il: document.getElementById('il').value,
            ilce: document.getElementById('ilce').value,
            hb: document.getElementById('hb').value,
            wbc: document.getElementById('wbc').value,
            plt: document.getElementById('plt').value,
            kreatinin: document.getElementById('kreatinin').value,
            crp: document.getElementById('crp').value,
            radyoloji_raporu: document.getElementById('radyoloji_text').value,
            lab_metin: document.getElementById('lab_text').value,
            dvt_sonucu: document.getElementById('dvt_sonucu').value,
            taraf: document.getElementById('taraf').value,
            lokalizasyon: document.getElementById('lokalizasyon').value,
        };
        
        const result = await makeRequest('/api/save_record', 'POST', record);
        
        updateStatus('Kayýt baþarýyla kaydedildi', 'success');
        showMessage('Kayýt baþarýyla kaydedildi', 'success');
        
        // Clear form after successful save
        setTimeout(() => {
            clearForm();
        }, 1500);
        
    } catch (error) {
        updateStatus('Hata: ' + error.message, 'error');
        showMessage(error.message, 'error');
    } finally {
        setLoading(button, false);
    }
}

function downloadExcel() {
    updateStatus('Excel dosyasý indiriliyor...', 'info');
    window.location.href = '/download';
    
    setTimeout(() => {
        updateStatus('Hazýr - Veri giriþi yapabilirsiniz', 'info');
    }, 2000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveRecord();
    }
    
    // Ctrl+L to clear form
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearForm();
    }
    
    // Escape to clear status
    if (e.key === 'Escape') {
        updateStatus('Hazýr - Veri giriþi yapabilirsiniz', 'info');
    }
});

// Auto-save draft
let autoSaveTimer;
function setupAutoSave() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                // Save to localStorage
                const formData = {};
                inputs.forEach(field => {
                    formData[field.id] = field.value;
                });
                localStorage.setItem('hbys_draft', JSON.stringify(formData));
            }, 1000);
        });
    });
}

// Load draft on page load
function loadDraft() {
    const draft = localStorage.getItem('hbys_draft');
    if (draft) {
        try {
            const formData = JSON.parse(draft);
            Object.keys(formData).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && formData[fieldId]) {
                    field.value = formData[fieldId];
                }
            });
            updateStatus('Taslak yüklendi', 'info');
        } catch (e) {
            console.error('Failed to load draft:', e);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDraft();
    setupAutoSave();
    updateStatus('Hazýr - Veri giriþi yapabilirsiniz', 'info');
});

// Export functions for global access
window.setGender = setGender;
window.clearForm = clearForm;
window.analyzeRadiology = analyzeRadiology;
window.analyzeLab = analyzeLab;
window.saveRecord = saveRecord;
window.downloadExcel = downloadExcel;
