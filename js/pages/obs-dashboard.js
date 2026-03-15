function renderMonitoringBars() {
    const bars = document.querySelectorAll('#monitoringPage [data-bar]');
    bars.forEach(bar => {
        bar.style.height = bar.getAttribute('data-bar');
    });
}
