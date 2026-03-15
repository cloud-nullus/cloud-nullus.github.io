function saveOrganization() {
    const name = document.getElementById('orgName')?.value;
    showNotification(`Organization "${name}" saved successfully.`, 'success');
}
