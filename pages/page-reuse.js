window.pageReuse = window.pageReuse || {};

window.pageReuse.switchTabPane = function (options) {
    var tabs = document.querySelectorAll(options.tabSelector);
    var panes = document.querySelectorAll(options.paneSelector);
    var activePane = document.getElementById(options.paneIdPrefix + options.tabName);

    tabs.forEach(function (tab) {
        tab.classList.remove(options.activeClass || 'active');
    });

    if (options.activeTabButton) {
        options.activeTabButton.classList.add(options.activeClass || 'active');
    }

    panes.forEach(function (pane) {
        pane.style.display = 'none';
    });

    if (activePane) {
        activePane.style.display = options.paneDisplay || 'flex';
        if (options.paneFlexDirection) {
            activePane.style.flexDirection = options.paneFlexDirection;
        }
    }
};

window.pageReuse.filterListByQueryAndStatus = function (options) {
    var queryInput = document.getElementById(options.queryInputId);
    var statusInput = document.getElementById(options.statusInputId);
    var normalizedQuery = (options.query || (queryInput ? queryInput.value : '') || '').toLowerCase();
    var defaultStatus = options.defaultStatus || 'all';
    var normalizedStatus = (statusInput ? statusInput.value : '') || defaultStatus;

    document.querySelectorAll(options.itemSelector).forEach(function (item) {
        var nameValue = (item.getAttribute(options.nameAttr || 'data-name') || '').toLowerCase();
        var statusValue = item.getAttribute(options.statusAttr || 'data-status');
        var nameMatch = !normalizedQuery || nameValue.includes(normalizedQuery);
        var statusMatch = normalizedStatus === defaultStatus || statusValue === normalizedStatus;

        item.style.display = (nameMatch && statusMatch) ? '' : 'none';
    });
};

window.pageReuse.selectListItemWithDetail = function (options) {
    var placeholder;
    var content;
    var titleTarget;
    var metaTarget;
    var detailIcon;
    var badge;
    var titleText;
    var metaText;
    var iconEl;
    var statusEl;

    document.querySelectorAll(options.itemSelector).forEach(function (el) {
        el.classList.remove(options.activeClass || 'active');
    });

    options.item.classList.add(options.activeClass || 'active');

    titleText = options.item.querySelector(options.titleSourceSelector).textContent;
    if (options.metaSourceSelector) {
        metaText = options.item.querySelector(options.metaSourceSelector).textContent;
    }
    iconEl = options.item.querySelector(options.iconSourceSelector);
    statusEl = options.item.querySelector(options.statusSourceSelector);

    if (options.placeholderId) {
        placeholder = document.getElementById(options.placeholderId);
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    }

    content = document.getElementById(options.contentId);
    if (content) {
        content.style.display = options.contentDisplay || 'flex';
        if (options.contentFlexDirection) {
            content.style.flexDirection = options.contentFlexDirection;
        }
    }

    titleTarget = document.getElementById(options.titleTargetId);
    if (titleTarget) {
        titleTarget.textContent = titleText;
    }

    if (options.metaTargetId && metaText != null) {
        metaTarget = document.getElementById(options.metaTargetId);
        if (metaTarget) {
            metaTarget.textContent = metaText;
        }
    }

    detailIcon = document.getElementById(options.iconTargetId);
    if (detailIcon && iconEl) {
        detailIcon.innerHTML = iconEl.innerHTML;
        detailIcon.style.background = iconEl.style.background;
    }

    badge = document.getElementById(options.statusTargetId);
    if (badge && statusEl) {
        badge.className = statusEl.className;
        badge.innerHTML = statusEl.innerHTML;
        badge.classList.add(options.badgeClassName || 'detail-status-badge');
    }
};
