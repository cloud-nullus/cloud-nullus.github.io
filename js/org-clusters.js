function initClusterListDetail() {
    document.querySelectorAll('.cluster-list-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.cluster-list-item').forEach(i => {
                i.classList.remove('active');
            });
            item.classList.add('active');
            renderClusterDetail(item.dataset.clusterId);
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#registerClusterBtn2')) return;
        e.preventDefault();
        if (typeof openClusterModal === 'function') openClusterModal();
    });
}
