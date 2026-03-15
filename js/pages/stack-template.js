function initTemplatesPageActions() {
    document.querySelectorAll('.apply-devops-template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            if (!preset) return;
            applyPreset(preset);
            switchPage('stackinstall');
            showNotification(`DevSecOps template selected: ${preset}`, 'success');
        });
    });

    const searchInput = document.getElementById('templateSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        document.querySelectorAll('#templatesPage .template-admin-card').forEach(card => {
            const text = card.textContent?.toLowerCase() || '';
            card.style.display = text.includes(q) ? '' : 'none';
        });
    });
}
