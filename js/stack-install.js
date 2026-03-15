var activeInstallValuesYamlCard = null;

function ensureInstallCardResourceControls() {
    var cards = document.querySelectorAll('#installResourceCompare .deployment-card');
    cards.forEach(function (card) {
        var existingBtn;
        var docBtn;
        var resourceRow;
        var cpuInput;
        var memoryInput;

        if (!card.dataset.cpuValue) card.dataset.cpuValue = '500m';
        if (!card.dataset.memoryValue) card.dataset.memoryValue = '512Mi';

        var header = card.querySelector('.card-header');
        existingBtn = card.querySelector('.values-editor-btn');
        if (existingBtn && existingBtn.parentElement !== card) {
            existingBtn.parentElement.removeChild(existingBtn);
            existingBtn = null;
        }

        if (header && !existingBtn) {
            card.style.position = 'relative';

            docBtn = document.createElement('button');
            docBtn.type = 'button';
            docBtn.className = 'values-editor-btn';
            docBtn.innerHTML = '<i class="fas fa-file-alt"></i> values.yaml';
            docBtn.style.cssText = 'position:absolute;top:10px;right:12px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;z-index:1;';
            docBtn.onclick = function () { openInstallValuesYamlEditor(card); };
            card.appendChild(docBtn);
        }

        var cardContent = card.querySelector('.card-content');
        if (cardContent && !cardContent.querySelector('.card-resource-row')) {
            resourceRow = document.createElement('div');
            resourceRow.className = 'card-resource-row';
            resourceRow.style.cssText = 'margin-top:14px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f8fafc;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;';
            resourceRow.innerHTML = '' +
                '<label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:#475569;">CPU' +
                '<input type="text" class="card-cpu-input" value="' + card.dataset.cpuValue + '" placeholder="예: 500m" style="padding:8px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;color:#111827;background:#fff;">' +
                '</label>' +
                '<label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:#475569;">Memory' +
                '<input type="text" class="card-memory-input" value="' + card.dataset.memoryValue + '" placeholder="예: 512Mi" style="padding:8px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;color:#111827;background:#fff;">' +
                '</label>';
            cardContent.appendChild(resourceRow);

            cpuInput = resourceRow.querySelector('.card-cpu-input');
            memoryInput = resourceRow.querySelector('.card-memory-input');
            if (cpuInput) {
                cpuInput.addEventListener('input', function (e) {
                    card.dataset.cpuValue = e.target.value.trim() || '500m';
                });
            }
            if (memoryInput) {
                memoryInput.addEventListener('input', function (e) {
                    card.dataset.memoryValue = e.target.value.trim() || '512Mi';
                });
            }
        }
    });
}

function openInstallValuesYamlEditor(card) {
    if (!card) return;
    ensureInstallCardResourceControls();
    activeInstallValuesYamlCard = card;

    var cpuValue = card.dataset.cpuValue || '500m';
    var memoryValue = card.dataset.memoryValue || '512Mi';
    var title = card.querySelector('h4') ? card.querySelector('h4').textContent.trim() : 'Config Card';

    var titleEl = document.getElementById('installValuesYamlModalTitle');
    if (titleEl) titleEl.textContent = title + ' values.yaml 편집';

    var textarea = document.getElementById('installValuesYamlTextarea');
    if (textarea) {
        textarea.value =
            'resources:\n' +
            '  requests:\n' +
            '    cpu: "' + cpuValue + '"\n' +
            '    memory: "' + memoryValue + '"\n' +
            '  limits:\n' +
            '    cpu: "' + cpuValue + '"\n' +
            '    memory: "' + memoryValue + '"\n';
    }

    var modal = document.getElementById('installValuesYamlModal');
    if (modal) modal.style.display = 'flex';
}

function closeInstallValuesYamlEditor() {
    var modal = document.getElementById('installValuesYamlModal');
    if (modal) modal.style.display = 'none';
    activeInstallValuesYamlCard = null;
}

function applyInstallValuesYamlEditor() {
    if (!activeInstallValuesYamlCard) return;

    var textarea = document.getElementById('installValuesYamlTextarea');
    if (!textarea) return;

    var cpuMatches = textarea.value.match(/cpu\s*:\s*['\"]?([^\n'\"]+)/g) || [];
    var memoryMatches = textarea.value.match(/memory\s*:\s*['\"]?([^\n'\"]+)/g) || [];

    var cpuValue = activeInstallValuesYamlCard.dataset.cpuValue || '500m';
    var memoryValue = activeInstallValuesYamlCard.dataset.memoryValue || '512Mi';

    if (cpuMatches[0]) cpuValue = cpuMatches[0].replace(/cpu\s*:\s*['\"]?/, '').trim();
    if (memoryMatches[0]) memoryValue = memoryMatches[0].replace(/memory\s*:\s*['\"]?/, '').trim();

    activeInstallValuesYamlCard.dataset.cpuValue = cpuValue || '500m';
    activeInstallValuesYamlCard.dataset.memoryValue = memoryValue || '512Mi';

    var cpuInput = activeInstallValuesYamlCard.querySelector('.card-cpu-input');
    var memoryInput = activeInstallValuesYamlCard.querySelector('.card-memory-input');
    if (cpuInput) cpuInput.value = activeInstallValuesYamlCard.dataset.cpuValue;
    if (memoryInput) memoryInput.value = activeInstallValuesYamlCard.dataset.memoryValue;

    closeInstallValuesYamlEditor();
    alert('values.yaml 변경사항이 적용되었습니다.');
}

document.addEventListener('click', function (e) {
    var modal = document.getElementById('installValuesYamlModal');
    if (modal && e.target === modal) {
        closeInstallValuesYamlEditor();
    }
});

window.closeInstallValuesYamlEditor = closeInstallValuesYamlEditor;
window.applyInstallValuesYamlEditor = applyInstallValuesYamlEditor;
