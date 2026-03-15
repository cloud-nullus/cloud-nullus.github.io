// ── Stack inner tab switching ──
function switchStackTab(btn, tabName) {
    window.pageReuse.switchTabPane({
        tabSelector: '.stack-inner-tab',
        paneSelector: '.stack-tab-pane',
        paneIdPrefix: 'stackTab-',
        tabName: tabName,
        activeTabButton: btn,
        paneDisplay: 'flex',
        paneFlexDirection: 'column'
    });

    var saveWrap = document.getElementById('stackInfoSaveWrap');
    if (saveWrap) saveWrap.style.display = (tabName === 'info') ? 'flex' : 'none';
}

// ── Stack Info sub-tab switching ──
function switchStackInfoTab(tabEl, tabName) {
    var parent = tabEl.closest('.config-tabs');
    parent.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    tabEl.classList.add('active');
    document.querySelectorAll('.stack-info-subpanel').forEach(function (p) { p.style.display = 'none'; });
    var panel = document.getElementById('sinfo-' + tabName);
    if (panel) panel.style.display = 'block';
}

// ── Select stack from left list ──
function selectStackItem(item) {
    window.pageReuse.selectListItemWithDetail({
        item: item,
        itemSelector: '.stack-list-item',
        titleSourceSelector: '.stack-item-name',
        iconSourceSelector: '.stack-item-icon',
        statusSourceSelector: '.stack-item-status',
        placeholderId: 'stackDetailPlaceholder',
        contentId: 'stackDetailContent',
        titleTargetId: 'stackDetailTitle',
        iconTargetId: 'stackDetailIconEl',
        statusTargetId: 'stackDetailStatusBadge',
        contentDisplay: 'flex',
        contentFlexDirection: 'column',
        badgeClassName: 'detail-status-badge'
    });

    var firstTab = document.querySelector('.stack-inner-tab[data-stab="info"]');
    if (firstTab) switchStackTab(firstTab, 'info');

}

var activeValuesYamlCard = null;

function ensureCardResourceControls() {
    var cards = document.querySelectorAll('.stack-info-subpanel .config-card');
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
            docBtn.onclick = function () { openValuesYamlEditor(card); };
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

function openValuesYamlEditor(card) {
    if (!card) return;
    ensureCardResourceControls();
    activeValuesYamlCard = card;

    var cpuValue = card.dataset.cpuValue || '500m';
    var memoryValue = card.dataset.memoryValue || '512Mi';
    var title = card.querySelector('h4') ? card.querySelector('h4').textContent.trim() : 'Config Card';

    var titleEl = document.getElementById('valuesYamlModalTitle');
    if (titleEl) titleEl.textContent = title + ' values.yaml 편집';

    var textarea = document.getElementById('valuesYamlTextarea');
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

    var modal = document.getElementById('valuesYamlModal');
    if (modal) modal.style.display = 'flex';
}

function closeValuesYamlEditor() {
    var modal = document.getElementById('valuesYamlModal');
    if (modal) modal.style.display = 'none';
    activeValuesYamlCard = null;
}

function applyValuesYamlEditor() {
    if (!activeValuesYamlCard) return;

    var textarea = document.getElementById('valuesYamlTextarea');
    if (!textarea) return;

    var cpuMatches = textarea.value.match(/cpu\s*:\s*['\"]?([^\n'\"]+)/g) || [];
    var memoryMatches = textarea.value.match(/memory\s*:\s*['\"]?([^\n'\"]+)/g) || [];

    var cpuValue = activeValuesYamlCard.dataset.cpuValue || '500m';
    var memoryValue = activeValuesYamlCard.dataset.memoryValue || '512Mi';

    if (cpuMatches[0]) cpuValue = cpuMatches[0].replace(/cpu\s*:\s*['\"]?/, '').trim();
    if (memoryMatches[0]) memoryValue = memoryMatches[0].replace(/memory\s*:\s*['\"]?/, '').trim();

    activeValuesYamlCard.dataset.cpuValue = cpuValue || '500m';
    activeValuesYamlCard.dataset.memoryValue = memoryValue || '512Mi';

    var cpuInput = activeValuesYamlCard.querySelector('.card-cpu-input');
    var memoryInput = activeValuesYamlCard.querySelector('.card-memory-input');
    if (cpuInput) cpuInput.value = activeValuesYamlCard.dataset.cpuValue;
    if (memoryInput) memoryInput.value = activeValuesYamlCard.dataset.memoryValue;

    closeValuesYamlEditor();
    alert('values.yaml 변경사항이 적용되었습니다.');
}

document.addEventListener('click', function (e) {
    var modal = document.getElementById('valuesYamlModal');
    if (modal && e.target === modal) {
        closeValuesYamlEditor();
    }
});

ensureCardResourceControls();

var rollbackTarget = null;

function showDiff(fromVer, toVer) {
    const key = `diff-${fromVer}-${toVer}`;
    const el = document.getElementById(key);
    if (!el) return;
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function showDeployLogs(version) {
    const modal = document.getElementById('deployLogsModal');
    const content = document.getElementById('deployLogsContent');
    if (!modal || !content) return;

    const logsMap = {
        'ns-v2': [
            '<span style="color:#6ee7b7;">[2026-03-01 10:58:00] INFO</span>  Starting Nullus platform upgrade v0.2.0 → v0.2.1...',
            '<span style="color:#6ee7b7;">[2026-03-01 10:59:10] INFO</span>  Applying CVE-2026-1234 security patch',
            '<span style="color:#6ee7b7;">[2026-03-01 11:02:00] INFO</span>  Nullus core pod restarted successfully',
            '<span style="color:#6ee7b7;">[2026-03-01 11:06:00] INFO</span>  Health check passed: nullus-core Running',
            '<span style="color:#6ee7b7;">[2026-03-01 11:08:00] INFO</span>  Nullus v0.2.1 upgrade complete ✓'
        ],
        'ns-v1': [
            '<span style="color:#6ee7b7;">[2026-02-20 09:58:00] INFO</span>  Starting Nullus platform initial install v0.2.0...',
            '<span style="color:#6ee7b7;">[2026-02-20 10:02:00] INFO</span>  Helm install nullus-core complete',
            '<span style="color:#6ee7b7;">[2026-02-20 10:08:00] INFO</span>  Database migration complete',
            '<span style="color:#6ee7b7;">[2026-02-20 10:15:00] INFO</span>  Nullus v0.2.0 install complete ✓'
        ],
        v3: [
            '<span style="color:#6ee7b7;">[2026-03-02 14:28:00] INFO</span>  Starting stack deployment v3...',
            '<span style="color:#6ee7b7;">[2026-03-02 14:28:05] INFO</span>  Upgrading Grafana: 10.2 → 10.3',
            '<span style="color:#6ee7b7;">[2026-03-02 14:35:20] INFO</span>  Helm upgrade grafana-stack complete',
            '<span style="color:#6ee7b7;">[2026-03-02 14:35:30] INFO</span>  Health check passed: Grafana pod Running',
            '<span style="color:#6ee7b7;">[2026-03-02 15:10:00] INFO</span>  Stack deployment v3 complete ✓'
        ],
        v2: [
            '<span style="color:#6ee7b7;">[2026-02-28 09:10:00] INFO</span>  Starting stack deployment v2...',
            '<span style="color:#6ee7b7;">[2026-02-28 09:12:00] INFO</span>  Installing MinIO storage backend',
            '<span style="color:#6ee7b7;">[2026-02-28 09:30:00] INFO</span>  Helm install minio complete',
            '<span style="color:#6ee7b7;">[2026-02-28 09:31:00] INFO</span>  Migrating storage config: S3 → MinIO',
            '<span style="color:#6ee7b7;">[2026-02-28 10:08:00] INFO</span>  Stack deployment v2 complete ✓'
        ],
        v1: [
            '<span style="color:#6ee7b7;">[2026-02-20 15:58:00] INFO</span>  Starting stack deployment v1...',
            '<span style="color:#fca5a5;">[2026-02-20 16:05:00] ERROR</span> Argo CD pod CrashLoopBackOff: ImagePullBackOff',
            '<span style="color:#fca5a5;">[2026-02-20 16:08:00] ERROR</span> Health check failed: argocd-server not ready',
            '<span style="color:#fca5a5;">[2026-02-20 16:10:00] WARN</span>  Initiating auto-rollback...',
            '<span style="color:#fca5a5;">[2026-02-20 16:12:00] INFO</span>  Rollback complete. Cluster restored to previous state.'
        ]
    };

    const lines = logsMap[version] || ['No logs available.'];
    content.innerHTML = lines.join('<br>');
    modal.style.display = 'flex';
}

function confirmRollback(version) {
    rollbackTarget = version;
    const modal = document.getElementById('rollbackModal');
    if (modal) modal.style.display = 'flex';
}

function executeRollback() {
    const modal = document.getElementById('rollbackModal');
    if (modal) modal.style.display = 'none';
    showNotification(`Rolling back to ${rollbackTarget}... Auto-snapshot of current config saved.`, 'success');
    rollbackTarget = null;
}

function filterStackList(value) {
    const query = (value !== undefined ? value : (document.getElementById('stackListSearch')?.value || '')).toLowerCase();
    const statusFilter = document.getElementById('stackListStatusFilter')?.value || 'all';
    document.querySelectorAll('.stack-list-item').forEach(item => {
        const name = (item.dataset.name || '').toLowerCase();
        const status = (item.dataset.status || '').toLowerCase();
        const matchName = name.includes(query);
        const matchStatus = statusFilter === 'all' || status === statusFilter;
        item.style.display = (matchName && matchStatus) ? '' : 'none';
    });
}

var stackDataMap = {
    'production-stack': { name: 'production-stack', tools: 'GitLab CI/CD · ArgoCD · Harbor', resources: '12 cores / 48 Gi', cdStatus: 'Synced', cost: '$380 / mo', cluster: 'prod-k8s' },
    'development-stack': { name: 'development-stack', tools: 'GitHub Actions · Flux · Snyk', resources: '6 cores / 24 Gi', cdStatus: 'Syncing', cost: '$180 / mo', cluster: 'dev-k8s' },
    'staging-environment': { name: 'staging-environment', tools: 'Jenkins · Spinnaker · SonarQube', resources: '8 cores / 32 Gi', cdStatus: 'OutOfSync', cost: '$240 / mo', cluster: 'staging-k8s' },
    'microservices-platform': { name: 'microservices-platform', tools: 'GitLab CI/CD · Istio · Jaeger', resources: '16 cores / 64 Gi', cdStatus: 'Synced', cost: '$520 / mo', cluster: 'prod-k8s' },
    'ml-ai-pipeline': { name: 'ml-ai-pipeline', tools: 'MLflow · Kubeflow · MinIO', resources: '24 cores / 96 Gi', cdStatus: 'Synced', cost: '$780 / mo', cluster: 'gpu-k8s' }
};

function renderStackDetail(stackId) {
    var item = document.querySelector('[data-stack-id="' + stackId + '"]');
    if (item && typeof selectStackItem === 'function') {
        selectStackItem(item);
    } else {
        const placeholder = document.getElementById('stackDetailPlaceholder');
        const content = document.getElementById('stackDetailContent');
        const titleEl = document.getElementById('stackDetailTitle');
        const data = stackDataMap[stackId];
        if (!data || !placeholder || !content) return;
        placeholder.style.display = 'none';
        content.style.display = 'flex';
        if (titleEl) titleEl.textContent = data.name;
    }
}

function initStackListDetail() {
    document.querySelectorAll('.stack-list-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.stack-list-item').forEach(i => {
                i.classList.remove('active');
            });
            item.classList.add('active');
            renderStackDetail(item.dataset.stackId);
        });
    });
    var first = document.querySelector('.stack-list-item.active');
    if (first) renderStackDetail(first.dataset.stackId);
}

window.filterStackList = filterStackList;
