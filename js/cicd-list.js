// ── CI/CD inner tab switching ──
function switchCicdTab(btn, tabName) {
    window.pageReuse.switchTabPane({
        tabSelector: '.stack-inner-tab[data-ctab]',
        paneSelector: '.cicd-tab-pane',
        paneIdPrefix: 'cicdTab-',
        tabName: tabName,
        activeTabButton: btn,
        paneDisplay: 'flex',
        paneFlexDirection: 'column'
    });
}

// ── Filter CI/CD sidebar list ──
function filterCicdListSidebar(query) {
    window.pageReuse.filterListByQueryAndStatus({
        query: query,
        queryInputId: 'cicdListSearch',
        statusInputId: 'cicdListStatusFilter2',
        itemSelector: '#cicdListItems .stack-list-item',
        nameAttr: 'data-name',
        statusAttr: 'data-status',
        defaultStatus: 'all'
    });
}

// ── Select CI/CD item ──
function selectCicdItem(item) {
    window.pageReuse.selectListItemWithDetail({
        item: item,
        itemSelector: '#cicdListItems .stack-list-item',
        titleSourceSelector: '.stack-item-name',
        metaSourceSelector: '.stack-item-meta',
        iconSourceSelector: '.stack-item-icon',
        statusSourceSelector: '.stack-item-status',
        placeholderId: 'cicdDetailPlaceholder',
        contentId: 'cicdDetailContent',
        titleTargetId: 'cicdDetailTitle',
        metaTargetId: 'cicdDetailMeta',
        iconTargetId: 'cicdDetailIconEl',
        statusTargetId: 'cicdDetailStatusBadge',
        contentDisplay: 'flex',
        contentFlexDirection: 'column',
        badgeClassName: 'detail-status-badge'
    });

    var defaultTab = document.querySelector('.stack-inner-tab[data-ctab="info"]');
    if (defaultTab) switchCicdTab(defaultTab, 'info');
}
