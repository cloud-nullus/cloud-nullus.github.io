function filterCicdHistory() {
    const typeFilter = document.getElementById('cicdHistoryTypeFilter')?.value || 'all';
    const statusFilter = document.getElementById('cicdHistoryStatusFilter')?.value || 'all';

    document.querySelectorAll('.cicd-history-item').forEach(item => {
        const matchType = typeFilter === 'all' || item.dataset.type === typeFilter;
        const matchStatus = statusFilter === 'all' || item.dataset.status === statusFilter;
        item.style.display = (matchType && matchStatus) ? '' : 'none';
    });
}

function filterCicdTemplates(value) {
    const query = (value || '').toLowerCase();
    document.querySelectorAll('.cicd-template-card').forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        card.style.display = name.includes(query) ? '' : 'none';
    });
}

window.filterCicdHistory = filterCicdHistory;
window.filterCicdTemplates = filterCicdTemplates;
