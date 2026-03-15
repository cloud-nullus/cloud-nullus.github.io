function updateUserRole(selectEl, userId) {
    showNotification(`Role updated for user ${userId}: ${selectEl.value}`, 'success');
}
