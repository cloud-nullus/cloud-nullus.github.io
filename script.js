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

// Navigation history for back button
var navHistory = [];

// Global state management
const state = {
    currentTab: 'artifacts',
    currentPage: 'organization',
    lastAdminPage: 'organization',
    lastDevopsPage: 'stacklist',
    lastDeveloperPage: 'cicdlist',
    tabs: ['artifacts', 'pipeline', 'monitoring', 'logging', 'resources', 'clusters'],
    currentRole: 'admin',
    config: {
        packageRegistry: { tool: 'gitlab', version: '16.7' },
        sourceRepo: { tool: 'gitlab', version: '16.7' },
        imageRegistry: { tool: 'gitlab', version: '16.7' },
        storage: { tool: 's3', version: 'latest' },
        mainPipeline: { tool: 'gitlab', version: '16.7' },
        cdTool: { tool: 'argocd', version: '2.9.3' },
        monitoringCollection: { tool: 'prometheus', version: '2.47' },
        monitoringQuery: { tool: 'grafana', version: '10.2' },
        loggingCollection: { tool: 'opentelemetry', version: '1.0' },
        loggingQuery: { tool: 'opensearch', version: '2.11' },
        developerCount: 10,
        runnerCount: 4,
        commitCount: 50,
        buildFrequency: 'medium',
        pipelineClusterName: '',
        pipelineNamespace: '',
        appClusterName: '',
        appNamespace: ''
    },
    resources: {
        cpu: 8,
        memory: 32,
        storage: 500,
        cost: 240
    },
    currency: 'USD',
    developer: {
        selectedTemplate: 'react-spa',
        appName: '',
        repoUrl: '',
        cluster: '',
        namespace: '',
        cpuRequest: 500,
        memoryRequest: 512,
        enableDb: false,
        enableRedis: false,
        enableQueue: false,
        envVars: []
    }
};

// Exchange rates (approximate, for display)
const currencyRates = { USD: 1, KRW: 1500, CNY: 7.1 };
const currencySymbols = { USD: '$', KRW: '₩', CNY: '¥' };

if (!window.PIPELINE_TEMPLATE_DATA) {
    console.error('PIPELINE_TEMPLATE_DATA is missing. Check script load order for js/data/pipeline-template-data.js')
}

if (!window.K8S_TEMPLATE_DATA) {
    console.error('K8S_TEMPLATE_DATA is missing. Check script load order for js/data/k8s-template-data.js')
}

function formatCost(usdAmount) {
    const rate = currencyRates[state.currency] || 1;
    const value = Math.round(usdAmount * rate);
    const symbol = currencySymbols[state.currency] || '$';
    if (state.currency === 'KRW') return `${symbol}${value.toLocaleString()}`;
    return `${symbol}${value}`;
}

function updateCurrencyPopupSelection() {
    if (!elements.currencyPopup) return;
    elements.currencyPopup.querySelectorAll('.currency-option').forEach(opt => {
        opt.setAttribute('aria-selected', opt.dataset.currency === state.currency ? 'true' : 'false');
    });
}

function updateCurrencyButtonSymbol() {
    if (elements.currencyBtn) {
        elements.currencyBtn.textContent = currencySymbols[state.currency] || '$';
    }
}

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
    var querySource = options.query;
    var queryInput = document.getElementById(options.queryInputId);
    var statusInput = document.getElementById(options.statusInputId);
    var normalizedQuery = (querySource || (queryInput ? queryInput.value : '') || '').toLowerCase();
    var normalizedStatus = (statusInput ? statusInput.value : '') || options.defaultStatus || 'all';

    document.querySelectorAll(options.itemSelector).forEach(function (item) {
        var nameValue = (item.getAttribute(options.nameAttr || 'data-name') || '').toLowerCase();
        var statusValue = item.getAttribute(options.statusAttr || 'data-status');
        var nameMatch = !normalizedQuery || nameValue.includes(normalizedQuery);
        var statusMatch = normalizedStatus === (options.defaultStatus || 'all') || statusValue === normalizedStatus;
        item.style.display = (nameMatch && statusMatch) ? '' : 'none';
    });
};

window.pageReuse.selectListItemWithDetail = function (options) {
    var titleText;
    var metaText;
    var iconEl;
    var statusEl;
    var placeholder;
    var detailIcon;
    var badge;
    var content;
    var titleTarget;
    var metaTarget;

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
        if (placeholder) placeholder.style.display = 'none';
    }

    content = document.getElementById(options.contentId);
    if (content) {
        content.style.display = options.contentDisplay || 'flex';
        if (options.contentFlexDirection) {
            content.style.flexDirection = options.contentFlexDirection;
        }
    }

    titleTarget = document.getElementById(options.titleTargetId);
    if (titleTarget) titleTarget.textContent = titleText;

    if (options.metaTargetId && metaText != null) {
        metaTarget = document.getElementById(options.metaTargetId);
        if (metaTarget) metaTarget.textContent = metaText;
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
        badge.style.cssText = options.badgeStyle || 'font-size:12px;padding:3px 10px;border-radius:12px;';
    }
};

// Tool name mappings
const toolNames = {
    gitlab: 'GitLab',
    nexus: 'Nexus Repository',
    jfrog: 'JFrog Artifactory',
    harbor: 'Harbor',
    github: 'GitHub',
    gitea: 'Gitea',
    bitbucket: 'Bitbucket',
    dockerhub: 'Docker Hub',
    ecr: 'Amazon ECR',
    s3: 'AWS S3',
    minio: 'MinIO',
    gcs: 'Google Cloud Storage',
    azure: 'Azure Blob Storage',
    circleci: 'CircleCI',
    jenkins: 'Jenkins',
    argocd: 'ArgoCD',
    flux: 'Flux',
    spinnaker: 'Spinnaker',
    tekton: 'Tekton',
    prometheus: 'Prometheus',
    grafana: 'Grafana',
    thanos: 'Thanos',
    datadog: 'Datadog',
    opentelemetry: 'OpenTelemetry',
    opensearch: 'OpenSearch',
    loki: 'Loki',
    elasticsearch: 'Elasticsearch'
};

// DOM elements
const elements = {
    tabs: document.querySelectorAll('.tab'),
    panels: document.querySelectorAll('.panel'),
    // Enhanced header elements
    headerCpuCount: document.getElementById('headerCpuCount'),
    headerMemoryCount: document.getElementById('headerMemoryCount'),
    headerStorageCount: document.getElementById('headerStorageCount'),
    headerCostCount: document.getElementById('headerCostCount'),
    currencyBtn: document.getElementById('currencyBtn'),
    currencyPopup: document.getElementById('currencyPopup'),
    // Form elements
    developerCount: document.getElementById('developerCount'),
    runnerCount: document.getElementById('runnerCount'),
    commitCount: document.getElementById('commitCount'),
    buildFrequency: document.getElementById('buildFrequency'),
    calculatedCpu: document.getElementById('calculatedCpu'),
    calculatedMemory: document.getElementById('calculatedMemory'),
    calculatedStorage: document.getElementById('calculatedStorage'),
    calculatedCost: document.getElementById('calculatedCost'),
    recalculateBtn: document.getElementById('recalculateBtn'),
    // Modal elements
    clusterModal: document.getElementById('clusterModal'),
    configureClusterBtn: document.getElementById('configureClusterBtn'),
    closeClusterModal: document.getElementById('closeClusterModal'),
    cancelClusterConfig: document.getElementById('cancelClusterConfig'),
    saveClusterConfig: document.getElementById('saveClusterConfig'),
    quickDeployBtn: document.getElementById('quickDeployBtn'),
    deploymentProgressCard: document.getElementById('deploymentProgressCard'),
    // Sidebar status elements
    sidebarAppClusterStatus: document.getElementById('sidebarAppClusterStatus'),
    sidebarClusterCheck: document.getElementById('sidebarClusterCheck'),
    sidebarDeployBtn: document.getElementById('sidebarDeployBtn'),
    // Header status elements
    headerArtifactsStatus: document.getElementById('headerArtifactsStatus'),
    headerPipelineStatus: document.getElementById('headerPipelineStatus'),
    headerResourcesStatus: document.getElementById('headerResourcesStatus'),
    headerClustersStatus: document.getElementById('headerClustersStatus'),
    devSelectedTemplate: document.getElementById('devSelectedTemplate'),
    devAppName: document.getElementById('devAppName'),
    devRepoUrl: document.getElementById('devRepoUrl'),
    devTargetCluster: document.getElementById('devTargetCluster'),
    devNamespace: document.getElementById('devNamespace'),
    devCpuRequest: document.getElementById('devCpuRequest'),
    devMemoryRequest: document.getElementById('devMemoryRequest'),
    devEnableDb: document.getElementById('devEnableDb'),
    devEnableRedis: document.getElementById('devEnableRedis'),
    devEnableQueue: document.getElementById('devEnableQueue'),
    addDevEnvVarBtn: document.getElementById('addDevEnvVarBtn'),
    developerEnvRows: document.getElementById('developerEnvRows'),
    developerReviewBox: document.getElementById('developerReviewBox'),
    developerDeployBtn: document.getElementById('developerDeployBtn'),
    developerPreviewBtn: document.getElementById('developerPreviewBtn'),
    registerClusterBtn: document.getElementById('registerClusterBtn'),
    clusterDetailPlaceholder: document.getElementById('clusterDetailPlaceholder'),
    clusterDetailContent: document.getElementById('clusterDetailContent'),
    clusterPageName: document.getElementById('clusterPageName'),
    clusterPageType: document.getElementById('clusterPageType'),
    clusterPageNamespace: document.getElementById('clusterPageNamespace'),
    clusterPageEndpoint: document.getElementById('clusterPageEndpoint'),
    clusterPageAuth: document.getElementById('clusterPageAuth'),
    clusterPageOrgAccess: document.getElementById('clusterPageOrgAccess'),
    clusterPageConnection: document.getElementById('clusterPageConnection'),
    clusterEditBtn: document.getElementById('clusterEditBtn'),
    clusterDeleteBtn: document.getElementById('clusterDeleteBtn')
};

// Initialize the application
function init() {
    setupEventListeners();
    updateCurrencyButtonSymbol();
    updateUI();
    calculateResources();
    updateInstallResourceCompare();
    updateSummary();
    renderClusterRegistryPage();
}

function updateInstallResourceCompare() {
    const available = { cpu: 32, memory: 128, storage: 1200 };
    const required = {
        cpu: state.resources.cpu || 0,
        memory: state.resources.memory || 0,
        storage: state.resources.storage || 0
    };
    const remaining = {
        cpu: available.cpu - required.cpu,
        memory: available.memory - required.memory,
        storage: available.storage - required.storage
    };

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
    };

    setText('availableCpu', available.cpu);
    setText('availableMemory', available.memory);
    setText('availableStorage', available.storage);
    setText('requiredCpu', required.cpu);
    setText('requiredMemory', required.memory);
    setText('requiredStorage', required.storage);
    setText('remainingCpu', remaining.cpu);
    setText('remainingMemory', remaining.memory);
    setText('remainingStorage', remaining.storage);

    const card = document.getElementById('remainingCompareCard');
    if (card) {
        const over = remaining.cpu < 0 || remaining.memory < 0 || remaining.storage < 0;
        card.classList.toggle('is-over', over);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Checkbox and radio button changes
    document.addEventListener('change', (e) => {
        if (e.target.classList?.contains('dev-resource-toggle')) {
            syncDeveloperFormState();
            updateDeveloperReview();
            return;
        }
        if (e.target.type === 'radio') {
            state.config[e.target.name] = e.target.value;
            updatePipelineStages();
            updateSummary();
        }
        if (e.target.type === 'checkbox') {
            if (!e.target.closest('.tool-option')) return;
            handleToolSelection(e.target);
        }
    });

    // Resource calculation inputs
    if (elements.developerCount) {
        elements.developerCount.addEventListener('input', updateResourceCalculation);
    }
    if (elements.runnerCount) {
        elements.runnerCount.addEventListener('input', updateResourceCalculation);
    }
    if (elements.commitCount) {
        elements.commitCount.addEventListener('input', updateResourceCalculation);
    }
    if (elements.buildFrequency) {
        elements.buildFrequency.addEventListener('change', updateResourceCalculation);
    }

    // Currency icon button + popup
    if (elements.currencyBtn && elements.currencyPopup) {
        elements.currencyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = elements.currencyPopup.getAttribute('aria-hidden') === 'false';
            elements.currencyPopup.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
            elements.currencyBtn.setAttribute('aria-expanded', !isOpen);
            if (!isOpen) updateCurrencyPopupSelection();
        });
        elements.currencyPopup.querySelectorAll('.currency-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const currency = e.currentTarget.dataset.currency;
                state.currency = currency;
                elements.currencyBtn.textContent = currencySymbols[currency] || '$';
                elements.currencyPopup.setAttribute('aria-hidden', 'true');
                elements.currencyBtn.setAttribute('aria-expanded', 'false');
                updateResourceCalculation();
                updateSummary();
            });
        });
        document.addEventListener('click', () => {
            elements.currencyPopup.setAttribute('aria-hidden', 'true');
            elements.currencyBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // Recalculate button
    if (elements.recalculateBtn) {
        elements.recalculateBtn.addEventListener('click', updateResourceCalculation);
    }

    // Deploy button
    const deployBtn = document.getElementById('deployBtn');
    if (deployBtn) {
        deployBtn.addEventListener('click', startDeployment);
    }

    // File upload buttons
    document.querySelectorAll('.file-upload .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const fileInput = btn.parentElement.querySelector('input[type="file"]');
            fileInput.click();
        });
    });

    // File input changes
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name || 'No file selected';
            const button = e.target.parentElement.querySelector('.btn');
            button.innerHTML = `<i class="fas fa-check"></i> ${fileName}`;
        });
    });

    // Cluster configuration modal
    if (elements.configureClusterBtn) {
        elements.configureClusterBtn.addEventListener('click', openClusterModal);
    }
    if (elements.registerClusterBtn) {
        elements.registerClusterBtn.addEventListener('click', openClusterModal);
    }
    if (elements.closeClusterModal) {
        elements.closeClusterModal.addEventListener('click', closeClusterModal);
    }
    if (elements.cancelClusterConfig) {
        elements.cancelClusterConfig.addEventListener('click', closeClusterModal);
    }
    if (elements.saveClusterConfig) {
        elements.saveClusterConfig.addEventListener('click', saveClusterConfiguration);
    }
    if (elements.quickDeployBtn) {
        elements.quickDeployBtn.addEventListener('click', startQuickDeployment);
    }

    if (elements.sidebarDeployBtn) {
        elements.sidebarDeployBtn.addEventListener('click', startQuickDeployment);
    }

    // Close modal on backdrop click
    if (elements.clusterModal) {
        elements.clusterModal.addEventListener('click', (e) => {
            if (e.target === elements.clusterModal) {
                closeClusterModal();
            }
        });
    }

    // Deploy Script Preview modal (event delegation so buttons always work)
    document.addEventListener('click', (e) => {
        if (e.target.closest('#previewDeployScriptBtn, #previewDeployScriptBtnCompact, #previewDeployScriptBtnSidebar')) {
            e.preventDefault();
            openDeployScriptPreviewModal();
        }
        if (e.target.closest('#closeDeployScriptPreviewModal') || e.target.id === 'closeDeployScriptPreviewModal') {
            closeDeployScriptPreviewModal();
        }
        if (e.target.closest('#copyDeployScriptBtn') || e.target.id === 'copyDeployScriptBtn') {
            const contentEl = document.getElementById('deployScriptPreviewContent');
            if (contentEl && contentEl.textContent) {
                navigator.clipboard.writeText(contentEl.textContent).then(() => {
                    showNotification('Deploy script copied to clipboard', 'success');
                }).catch(() => {
                    showNotification('Failed to copy', 'error');
                });
            }
        }
    });
    const deployScriptPreviewModalEl = document.getElementById('deployScriptPreviewModal');
    if (deployScriptPreviewModalEl) {
        deployScriptPreviewModalEl.addEventListener('click', (e) => {
            if (e.target === deployScriptPreviewModalEl) closeDeployScriptPreviewModal();
        });
    }

    // Pipeline stage interactions
    document.querySelectorAll('.stage').forEach(stage => {
        stage.addEventListener('click', () => {
            const stageName = stage.dataset.stage;
            showStageDetails(stageName);
        });
    });

    // Navigation menu items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            // Switch pages
            const page = normalizePageName(item.dataset.page || '');
            if (page) {
                if (!canAccessPage(state.currentRole, page)) {
                    switchPage(getLastPage(state.currentRole));
                    return;
                }
                switchPage(page);
            }
        });
    });

    // CI Editor modal events
    const ciEditorModal = document.getElementById('ciEditorModal');
    const closeCiEditorModal = document.getElementById('closeCiEditorModal');
    const cancelCiEditor = document.getElementById('cancelCiEditor');
    const saveCiConfig = document.getElementById('saveCiConfig');
    const validateConfigBtn = document.getElementById('validateConfigBtn');

    if (closeCiEditorModal) {
        closeCiEditorModal.addEventListener('click', closeCiEditor);
    }
    if (cancelCiEditor) {
        cancelCiEditor.addEventListener('click', closeCiEditor);
    }
    if (saveCiConfig) {
        saveCiConfig.addEventListener('click', saveCiConfiguration);
    }
    if (validateConfigBtn) {
        validateConfigBtn.addEventListener('click', validateConfiguration);
    }

    // Editor tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchEditorTab(tabName);
        });
    });

    // Close modal on backdrop click
    if (ciEditorModal) {
        ciEditorModal.addEventListener('click', (e) => {
            if (e.target === ciEditorModal) {
                closeCiEditor();
            }
        });
    }
}

// Switch to specific tab
function switchTab(tabName) {
    if (tabName === 'clusters') {
        switchPage('clusters');
        return;
    }
    const validTabs = ['artifacts', 'pipeline', 'monitoring', 'logging', 'resources'];
    if (!validTabs.includes(tabName)) return;

    state.currentTab = tabName;
    updateUI();
    updateProgressSteps();

    // If switching to clusters tab, update cluster status
    updateClusterStatus();
}

// Update progress steps based on current tab
function updateProgressSteps() {
    const stepMapping = {
        'artifacts': 1,
        'pipeline': 2,
        'monitoring': 3,
        'logging': 4,
        'resources': 5,
        'clusters': 6
    };

    const currentStepNumber = stepMapping[state.currentTab];
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');

    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('completed', 'active');

        if (stepNumber < currentStepNumber) {
            step.classList.add('completed');
        } else if (stepNumber === currentStepNumber) {
            step.classList.add('active');
        }
    });

    progressLines.forEach((line, index) => {
        line.classList.remove('completed', 'active');

        if (index + 1 < currentStepNumber) {
            line.classList.add('completed');
        } else if (index + 1 === currentStepNumber) {
            line.classList.add('active');
        }
    });
}

// Update UI based on current tab
function updateUI() {
    // Update tab indicators
    elements.tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === state.currentTab);
    });

    // Update panels
    elements.panels.forEach(panel => {
        const panelId = panel.id;
        const expectedId = state.currentTab + 'Panel';
        panel.classList.toggle('active', panelId === expectedId);
    });
}

// Modal functions
function openClusterModal() {
    if (elements.clusterModal) {
        elements.clusterModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeClusterModal() {
    if (elements.clusterModal) {
        elements.clusterModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Deploy Script Preview
function getDeployScriptExample() {
    const mc = state.config.monitoringCollection;
    const mq = state.config.monitoringQuery;
    const lc = state.config.loggingCollection;
    const lq = state.config.loggingQuery;
    const ns = state.config.pipelineNamespace || 'nullus-system';
    const monColl = mc ? (mc.tool || '').toLowerCase() : 'prometheus';
    const monQuery = mq ? (mq.tool || '').toLowerCase() : 'grafana';
    const logColl = lc ? (lc.tool || '').toLowerCase() : 'opentelemetry';
    const logQuery = lq ? (lq.tool || '').toLowerCase() : 'opensearch';
    return `#!/usr/bin/env bash
# Nullus DevSecOps Stack - Deploy Script
# Generated from current configuration. Run against your pipeline cluster.

set -euo pipefail

NAMESPACE="${ns}"
ARGOCD_VERSION="${state.config.cdTool?.version || '2.9.3'}"

echo "[1/5] Checking prerequisites..."
command -v kubectl >/dev/null 2>&1 || { echo "kubectl required"; exit 1; }
kubectl cluster-info >/dev/null 2>&1 || { echo "Cannot reach cluster"; exit 1; }

echo "[2/5] Creating namespace: $NAMESPACE"
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo "[3/5] Installing Argo CD..."
kubectl apply -n "$NAMESPACE" -f https://raw.githubusercontent.com/argoproj/argo-cd/v${state.config.cdTool?.version || '2.9.3'}/manifests/install.yaml

echo "[4/5] Deploying Monitoring Stack (Collection: ${monColl}, Query: ${monQuery})..."
# Add Helm or kubectl apply for ${monColl} and ${monQuery} here
# Example: helm upgrade --install prometheus prometheus-community/kube-prometheus-stack -n "$NAMESPACE"

echo "[5/5] Deploying Logging Stack (Collection: ${logColl}, Query: ${logQuery})..."
# Add Helm or kubectl apply for ${logColl} and ${logQuery} here

echo "Done. DevSecOps stack deployed to namespace: $NAMESPACE"
echo "Argo CD: kubectl port-forward svc/argocd-server -n $NAMESPACE 8080:443"
`;
}

function openDeployScriptPreviewModal() {
    const modal = document.getElementById('deployScriptPreviewModal');
    const contentEl = document.getElementById('deployScriptPreviewContent');
    if (!modal) return;
    try {
        if (contentEl) contentEl.textContent = getDeployScriptExample();
    } catch (err) {
        if (contentEl) contentEl.textContent = '#!/usr/bin/env bash\n# Error generating script: ' + (err && err.message ? err.message : 'Unknown error');
    }
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeDeployScriptPreviewModal() {
    const modal = document.getElementById('deployScriptPreviewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function saveClusterConfiguration() {
    // Get values from modal inputs
    const pipelineClusterName = document.getElementById('modalPipelineClusterName')?.value || '';
    const pipelineNamespace = document.getElementById('modalPipelineNamespace')?.value || '';
    const appClusterName = document.getElementById('modalTargetClusterName')?.value || '';
    const appNamespace = document.getElementById('modalTargetNamespace')?.value || '';

    // Update state
    state.config.pipelineClusterName = pipelineClusterName;
    state.config.pipelineNamespace = pipelineNamespace;
    state.config.appClusterName = appClusterName;
    state.config.appNamespace = appNamespace;

    // Update cluster status in sidebar
    updateClusterStatus();
    renderClusterRegistryPage();

    // Close modal
    closeClusterModal();

    // Show success notification
    showNotification('Cluster configuration saved successfully!', 'success');
}

// 클러스터 목록+상세용 데이터 (CLU_010_020, CLU_010_030)
function getClusterData() {
    const pipelineName = state.config.pipelineClusterName || 'devops-cluster';
    const pipelineNs = state.config.pipelineNamespace || 'nullus-system';
    const appName = state.config.appClusterName || '';
    const appNs = state.config.appNamespace || '';
    return {
        'devops-cluster': {
            id: 'devops-cluster',
            name: pipelineName,
            type: 'pipeline',
            typeLabel: 'Pipeline Cluster',
            namespace: pipelineNs,
            endpoint: 'https://k8s-devops.internal:6443',
            auth: 'Kubeconfig (ServiceAccount)',
            orgs: ['nullus-devops'],
            connected: true,
            statusMeta: 'Last checked: 2 min ago'
        },
        'app-cluster-prod': {
            id: 'app-cluster-prod',
            name: appName || 'app-cluster-prod',
            type: 'app',
            typeLabel: 'Application Cluster',
            namespace: appNs || '',
            endpoint: '',
            auth: 'Kubeconfig (ServiceAccount)',
            orgs: [],
            connected: !!(appName && appNs),
            statusMeta: ''
        }
    };
}

function renderClusterDetail(clusterId) {
    const data = getClusterData()[clusterId];
    // 동적 주입 HTML 이므로 elements 캐시(null) 대신 매번 직접 조회
    const placeholder = document.getElementById('clusterDetailPlaceholder');
    const content = document.getElementById('clusterDetailContent');
    if (!data || !content || !placeholder) return;

    placeholder.style.display = 'none';
    content.style.display = 'block';

    const titleEl = document.getElementById('clusterDetailTitle');
    if (titleEl) titleEl.textContent = data.name || clusterId;

    const nameEl = document.getElementById('clusterPageName');
    if (nameEl) nameEl.value = data.name || '';

    const typeEl = document.getElementById('clusterPageType');
    if (typeEl) typeEl.value = data.typeLabel || '';

    const nsEl = document.getElementById('clusterPageNamespace');
    if (nsEl) nsEl.value = data.namespace || (typeof i18n !== 'undefined' ? i18n.t('cluster.notConfigured') : 'Not configured');

    const epEl = document.getElementById('clusterPageEndpoint');
    if (epEl) epEl.value = data.endpoint || '';

    const authEl = document.getElementById('clusterPageAuth');
    if (authEl) authEl.value = data.auth || '';

    const orgEl = document.getElementById('clusterPageOrgAccess');
    if (orgEl) {
        orgEl.className = 'cluster-org-tags';
        orgEl.innerHTML = data.orgs && data.orgs.length
            ? data.orgs.map(o => '<span class="org-tag">' + o + '</span>').join('')
            : '<span class="org-empty">No organization assigned</span>';
    }

    const connEl = document.getElementById('clusterPageConnection');
    if (connEl) {
        connEl.className = 'cluster-connection-status ' + (data.connected ? 'connected' : 'disconnected');
        const statusText = data.connected
            ? (typeof i18n !== 'undefined' ? i18n.t('cluster.connected') : 'Connected')
            : (typeof i18n !== 'undefined' ? i18n.t('cluster.notConfigured') : 'Not Configured');
        connEl.innerHTML =
            '<span class="status-dot"></span><span class="status-text">' + statusText + '</span>' +
            (data.statusMeta ? '<span class="status-meta">' + data.statusMeta + '</span>' : '') +
            (!data.connected ? '<button class="btn btn-primary btn-sm" style="margin-left:auto;" id="registerClusterBtn2"><i class="fas fa-plug"></i> Connect</button>' : '');
    }
}

function renderClusterRegistryPage() {
    const data = getClusterData();
    const listItems = document.querySelectorAll('.cluster-list-item');
    listItems.forEach(item => {
        const id = item.dataset.clusterId;
        const d = data[id];
        if (!d) return;
        const metaEl = item.querySelector('.cluster-item-meta');
        const nameEl = item.querySelector('.cluster-item-name');
        if (nameEl && d.name) nameEl.textContent = d.name;
        if (metaEl) {
            metaEl.textContent = d.typeLabel + ' · ' + (d.namespace || 'Not Configured');
        }
        const statusEl = item.querySelector('.cluster-item-status');
        if (statusEl) {
            statusEl.className = 'cluster-item-status status-' + (d.connected ? 'connected' : 'disconnected');
            statusEl.innerHTML = d.connected ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-clock"></i>';
        }
    });
    const active = document.querySelector('.cluster-list-item.active');
    if (active) renderClusterDetail(active.dataset.clusterId);
}

function updateClusterStatus() {
    const appClusterName = state.config.appClusterName || '';
    const appNamespace = state.config.appNamespace || '';
    const hasKubeconfig = true;

    // Update main cluster status
    if (elements.appClusterStatus) {
        if (appClusterName && appNamespace && hasKubeconfig) {
            elements.appClusterStatus.className = 'cluster-status connected';
            elements.appClusterStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Ready to connect</span>';
        } else if (appClusterName && appNamespace) {
            elements.appClusterStatus.className = 'cluster-status pending';
            elements.appClusterStatus.innerHTML = '<i class="fas fa-upload"></i><span>Upload kubeconfig file</span>';
        } else {
            elements.appClusterStatus.className = 'cluster-status pending';
            elements.appClusterStatus.innerHTML = '<i class="fas fa-clock"></i><span>Not configured</span>';
        }
    }

    // Update sidebar cluster status
    if (elements.sidebarAppClusterStatus) {
        if (appClusterName && appNamespace && hasKubeconfig) {
            elements.sidebarAppClusterStatus.className = 'cluster-status-indicator connected';
            elements.sidebarAppClusterStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>' + appClusterName + '</span>';
        } else if (appClusterName) {
            elements.sidebarAppClusterStatus.className = 'cluster-status-indicator pending';
            elements.sidebarAppClusterStatus.innerHTML = '<i class="fas fa-upload"></i><span>Config needed</span>';
        } else {
            elements.sidebarAppClusterStatus.className = 'cluster-status-indicator pending';
            elements.sidebarAppClusterStatus.innerHTML = '<i class="fas fa-clock"></i><span>Not configured</span>';
        }
    }

    // Update sidebar deploy checklist
    if (elements.sidebarClusterCheck) {
        if (appClusterName && appNamespace && hasKubeconfig) {
            elements.sidebarClusterCheck.className = 'checklist-item-compact completed';
            elements.sidebarClusterCheck.innerHTML = '<i class="fas fa-check"></i><span>Clusters</span>';
        } else {
            elements.sidebarClusterCheck.className = 'checklist-item-compact pending';
            elements.sidebarClusterCheck.innerHTML = '<i class="fas fa-times"></i><span>Clusters</span>';
        }
    }

    // Update deploy button states
    const isReady = !!(appClusterName && appNamespace);
    if (elements.quickDeployBtn) {
        elements.quickDeployBtn.disabled = !isReady;
    }
    if (elements.sidebarDeployBtn) {
        elements.sidebarDeployBtn.disabled = !isReady;
    }
}

function startQuickDeployment() {
    if (elements.deploymentProgressCard) {
        elements.deploymentProgressCard.style.display = 'block';

        // Hide deploy button
        if (elements.quickDeployBtn) {
            elements.quickDeployBtn.style.display = 'none';
        }

        // Start deployment simulation
        simulateDeployment();
    }
}

function simulateDeployment() {
    const progressFill = document.getElementById('sidebarProgressFill');
    const progressText = document.getElementById('sidebarProgressText');
    const deploymentLogs = document.getElementById('sidebarDeploymentLogs');

    const steps = [
        { text: 'Validating configuration...', progress: 10 },
        { text: 'Setting up repositories...', progress: 25 },
        { text: 'Deploying CI/CD pipeline...', progress: 50 },
        { text: 'Configuring clusters...', progress: 75 },
        { text: 'Deployment complete!', progress: 100 }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];

            if (progressFill) progressFill.style.width = step.progress + '%';
            if (progressText) progressText.textContent = step.text;

            // Add log entry
            if (deploymentLogs) {
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';
                logEntry.innerHTML = `
                    <span class="level info">INFO</span>
                    <span class="message">${step.text}</span>
                `;
                deploymentLogs.appendChild(logEntry);
                deploymentLogs.scrollTop = deploymentLogs.scrollHeight;
            }

            if (step.progress === 100) {
                clearInterval(interval);
                showNotification('Pipeline deployed successfully!', 'success');

                // Update progress card header
                const progressHeader = elements.deploymentProgressCard?.querySelector('.card-header h4');
                if (progressHeader) {
                    progressHeader.innerHTML = '<i class="fas fa-check-circle text-success"></i> Deployment Complete';
                }
            }

            currentStep++;
        }
    }, 1500);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    const bgColor = type === 'success' ? '#10b981' : '#3b82f6';

    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 16px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
            font-size: 0.875rem;
            font-weight: 500;
        ">
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas ${iconClass}"></i>
                <span>${message}</span>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
    }, 3000);
}

// Show stage configuration details
function showStageDetails(stageName) {
    // Create a modal or side panel to show stage-specific configuration
    console.log(`Configuring ${stageName} stage`);

    // Update stage status
    const stage = document.querySelector(`[data-stage="${stageName}"]`);
    if (stage) {
        const statusElement = stage.querySelector('.stage-status');
        if (statusElement && statusElement.textContent === 'Pending') {
            statusElement.textContent = 'Configured';
            statusElement.style.background = '#065f46';
            statusElement.style.color = '#10b981';
        }
    }
}

// Update pipeline stages based on configuration
function updatePipelineStages() {
    // Update stage configurations based on selected tools
    const stages = document.querySelectorAll('.stage');
    stages.forEach(stage => {
        const stageName = stage.dataset.stage;
        updateStageConfig(stageName);
    });
}

// Calculate resources based on inputs
function calculateResources() {
    const developers = parseInt(elements.developerCount?.value) || 0;
    const runners = parseInt(elements.runnerCount?.value) || 0;
    const commits = parseInt(elements.commitCount?.value) || 0;
    const frequency = elements.buildFrequency?.value || 'medium';

    // Resource calculation logic
    const baseCpu = 2; // Base CPU for the platform
    const baseMemory = 8; // Base memory for the platform
    const baseStorage = 100; // Base storage for the platform

    // Developer-based calculations
    const developerCpu = developers * 0.5; // 0.5 CPU per developer
    const developerMemory = developers * 2; // 2 Gi memory per developer

    // Runner-based calculations  
    const runnerCpu = runners * 1.5; // 1.5 CPU per runner
    const runnerMemory = runners * 3; // 3 Gi memory per runner

    // Build frequency multiplier
    const frequencyMultiplier = {
        'low': 0.8,
        'medium': 1.0,
        'high': 1.5
    }[frequency] || 1.0;

    // Commit-based storage calculation
    const commitStorage = Math.ceil(commits / 10) * 10; // 10 Gi per 10 commits/day

    // Total calculations with frequency adjustment
    state.resources.cpu = Math.ceil((baseCpu + developerCpu + runnerCpu) * frequencyMultiplier);
    state.resources.memory = Math.ceil((baseMemory + developerMemory + runnerMemory) * frequencyMultiplier);
    state.resources.storage = baseStorage + commitStorage + (runners * 50); // 50 Gi per runner

    // Cost calculation (rough estimate)
    const cpuCost = state.resources.cpu * 15; // $15 per CPU core
    const memoryCost = state.resources.memory * 2; // $2 per Gi memory
    const storageCost = state.resources.storage * 0.5; // $0.5 per Gi storage
    state.resources.cost = Math.ceil(cpuCost + memoryCost + storageCost);

    // Update config
    state.config.developerCount = developers;
    state.config.runnerCount = runners;
    state.config.commitCount = commits;
    state.config.buildFrequency = frequency;
}

// Update resource calculation display
function updateResourceCalculation() {
    calculateResources();

    // Update enhanced header resource displays
    if (elements.headerCpuCount) elements.headerCpuCount.textContent = `${state.resources.cpu} cores`;
    if (elements.headerMemoryCount) elements.headerMemoryCount.textContent = `${state.resources.memory} Gi`;
    if (elements.headerStorageCount) elements.headerStorageCount.textContent = `${state.resources.storage} Gi`;
    if (elements.headerCostCount) elements.headerCostCount.textContent = formatCost(state.resources.cost);

    // Update detailed resource displays
    if (elements.calculatedCpu) elements.calculatedCpu.textContent = state.resources.cpu;
    if (elements.calculatedMemory) elements.calculatedMemory.textContent = state.resources.memory;
    if (elements.calculatedStorage) elements.calculatedStorage.textContent = state.resources.storage;
    if (elements.calculatedCost) elements.calculatedCost.textContent = formatCost(state.resources.cost);

    // Add animation effect to header resource cards
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'scale(1.05) translateY(-3px)';
            setTimeout(() => {
                card.style.transform = 'scale(1) translateY(0)';
            }, 300);
        }, index * 100);
    });

    // Add animation to metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        }, index * 50);
    });

    // Update summary
    updateSummary();
    updateInstallResourceCompare();
}

// Update header status indicators
function updateHeaderStatus() {
    // Update Artifacts status
    if (elements.headerArtifactsStatus) {
        const hasArtifacts = Object.values(state.config.artifacts || {}).some(artifact => artifact);
        const statusIndicator = elements.headerArtifactsStatus.querySelector('.status-indicator');
        if (hasArtifacts) {
            statusIndicator.className = 'status-indicator completed';
            statusIndicator.textContent = 'Configured';
        } else {
            statusIndicator.className = 'status-indicator pending';
            statusIndicator.textContent = 'Not configured';
        }
    }

    // Update Pipeline Tools status
    if (elements.headerPipelineStatus) {
        const hasPipelineTools = (state.config.pipelineTools?.cicd?.tool || state.config.pipelineTools?.cd?.tool);
        const statusIndicator = elements.headerPipelineStatus.querySelector('.status-indicator');
        if (hasPipelineTools) {
            statusIndicator.className = 'status-indicator completed';
            statusIndicator.textContent = 'Configured';
        } else {
            statusIndicator.className = 'status-indicator pending';
            statusIndicator.textContent = 'Not configured';
        }
    }

    // Update Resources status (always calculated)
    if (elements.headerResourcesStatus) {
        const statusIndicator = elements.headerResourcesStatus.querySelector('.status-indicator');
        statusIndicator.className = 'status-indicator completed';
        statusIndicator.textContent = 'Calculated';
    }

    // Update Clusters status
    if (elements.headerClustersStatus) {
        const hasClusters = state.config.clusters?.appClusterName && state.config.clusters?.appKubeconfig;
        const statusIndicator = elements.headerClustersStatus.querySelector('.status-indicator');
        if (hasClusters) {
            statusIndicator.className = 'status-indicator completed';
            statusIndicator.textContent = 'Configured';
        } else {
            statusIndicator.className = 'status-indicator pending';
            statusIndicator.textContent = 'Not configured';
        }
    }
}

// Update configuration summary
function updateSummary() {
    updateHeaderStatus();

    const summaryElements = {
        summaryPackageRegistry: document.getElementById('summaryPackageRegistry'),
        summarySourceRepo: document.getElementById('summarySourceRepo'),
        summaryImageRegistry: document.getElementById('summaryImageRegistry'),
        summaryStorage: document.getElementById('summaryStorage'),
        summaryMainPipeline: document.getElementById('summaryMainPipeline'),
        summaryCdTool: document.getElementById('summaryCdTool'),
        summaryMonitoringStack: document.getElementById('summaryMonitoringStack'),
        summaryLoggingStack: document.getElementById('summaryLoggingStack'),
        installSummaryPackageRegistry: document.getElementById('installSummaryPackageRegistry'),
        installSummarySourceRepo: document.getElementById('installSummarySourceRepo'),
        installSummaryImageRegistry: document.getElementById('installSummaryImageRegistry'),
        installSummaryMainPipeline: document.getElementById('installSummaryMainPipeline'),
        installSummaryCdTool: document.getElementById('installSummaryCdTool'),
        deployCpu: document.getElementById('deployCpu'),
        deployMemory: document.getElementById('deployMemory'),
        deployStorage: document.getElementById('deployStorage'),
        deployCost: document.getElementById('deployCost')
    };

    // Helper function to get tool display name with version
    const getToolDisplayName = (configKey, defaultName) => {
        const config = state.config[configKey];
        if (typeof config === 'object' && config.tool) {
            const toolName = toolNames[config.tool] || config.tool;
            return `${toolName} v${config.version}`;
        }
        return toolNames[config] || config || defaultName;
    };

    if (summaryElements.summaryPackageRegistry) {
        summaryElements.summaryPackageRegistry.textContent = getToolDisplayName('packageRegistry', 'Not configured');
    }
    if (summaryElements.summarySourceRepo) {
        summaryElements.summarySourceRepo.textContent = getToolDisplayName('sourceRepo', 'Not configured');
    }
    if (summaryElements.summaryImageRegistry) {
        summaryElements.summaryImageRegistry.textContent = getToolDisplayName('imageRegistry', 'Not configured');
    }
    if (summaryElements.summaryStorage) {
        summaryElements.summaryStorage.textContent = getToolDisplayName('storage', 'Not configured');
    }
    if (summaryElements.summaryMainPipeline) {
        summaryElements.summaryMainPipeline.textContent = getToolDisplayName('mainPipeline', 'Not configured');
    }
    if (summaryElements.summaryCdTool) {
        summaryElements.summaryCdTool.textContent = getToolDisplayName('cdTool', 'Not configured');
    }
    if (summaryElements.installSummaryPackageRegistry) {
        summaryElements.installSummaryPackageRegistry.textContent = getToolDisplayName('packageRegistry', 'Not configured');
    }
    if (summaryElements.installSummarySourceRepo) {
        summaryElements.installSummarySourceRepo.textContent = getToolDisplayName('sourceRepo', 'Not configured');
    }
    if (summaryElements.installSummaryImageRegistry) {
        summaryElements.installSummaryImageRegistry.textContent = getToolDisplayName('imageRegistry', 'Not configured');
    }
    if (summaryElements.installSummaryMainPipeline) {
        summaryElements.installSummaryMainPipeline.textContent = getToolDisplayName('mainPipeline', 'Not configured');
    }
    if (summaryElements.installSummaryCdTool) {
        summaryElements.installSummaryCdTool.textContent = getToolDisplayName('cdTool', 'Not configured');
    }
    if (summaryElements.summaryMonitoringStack) {
        const coll = getToolDisplayName('monitoringCollection', '');
        const query = getToolDisplayName('monitoringQuery', '');
        summaryElements.summaryMonitoringStack.textContent = [coll, query].filter(Boolean).join(', ') || 'Not configured';
    }
    if (summaryElements.summaryLoggingStack) {
        const coll = getToolDisplayName('loggingCollection', '');
        const query = getToolDisplayName('loggingQuery', '');
        summaryElements.summaryLoggingStack.textContent = [coll, query].filter(Boolean).join(', ') || 'Not configured';
    }

    // Update deploy panel resources
    if (summaryElements.deployCpu) summaryElements.deployCpu.textContent = state.resources.cpu;
    if (summaryElements.deployMemory) summaryElements.deployMemory.textContent = state.resources.memory;
    if (summaryElements.deployStorage) summaryElements.deployStorage.textContent = state.resources.storage;
    if (summaryElements.deployCost) summaryElements.deployCost.textContent = formatCost(state.resources.cost);
}

// Start deployment process
function startDeployment() {
    const deployBtn = document.getElementById('deployBtn');
    const deploymentProgress = document.getElementById('deploymentProgress');
    const progressFill = document.getElementById('deployProgressFill');
    const progressText = document.getElementById('deployProgressText');
    const deploymentLogs = document.getElementById('deploymentLogs');

    if (!deployBtn || !deploymentProgress) return;

    deployBtn.style.display = 'none';
    deploymentProgress.style.display = 'block';

    const deploymentSteps = [
        { text: 'Initializing deployment...', progress: 5, logs: ['Starting deployment process', 'Validating configuration'] },
        { text: 'Setting up artifact repositories...', progress: 15, logs: ['Configuring GitLab Package Registry', 'Setting up container registry'] },
        { text: 'Deploying CI/CD pipeline...', progress: 35, logs: ['Creating GitLab CI configuration', 'Setting up pipeline triggers'] },
        { text: 'Configuring security tools...', progress: 50, logs: ['Installing security scanners', 'Setting up policy enforcement'] },
        { text: 'Deploying to clusters...', progress: 70, logs: ['Connecting to pipeline cluster', 'Installing Argo CD'] },
        { text: 'Setting up monitoring...', progress: 85, logs: ['Deploying Prometheus', 'Configuring Grafana dashboards'] },
        { text: 'Finalizing configuration...', progress: 95, logs: ['Running validation tests', 'Setting up webhooks'] },
        { text: 'Deployment completed successfully!', progress: 100, logs: ['All components deployed', 'Pipeline is ready for use'] }
    ];

    let currentStep = 0;

    const deployInterval = setInterval(() => {
        if (currentStep < deploymentSteps.length) {
            const step = deploymentSteps[currentStep];

            if (progressText) progressText.textContent = step.text;
            if (progressFill) progressFill.style.width = step.progress + '%';

            // Add logs
            if (deploymentLogs && step.logs) {
                step.logs.forEach(logMessage => {
                    const logEntry = document.createElement('div');
                    logEntry.className = 'log-entry';
                    const timestamp = new Date().toLocaleTimeString();
                    logEntry.innerHTML = `
                        <span class="timestamp">[${timestamp}]</span>
                        <span class="level info">INFO</span>
                        <span class="message">${logMessage}</span>
                    `;
                    deploymentLogs.appendChild(logEntry);
                    deploymentLogs.scrollTop = deploymentLogs.scrollHeight;
                });
            }

            if (step.progress === 100) {
                if (progressText) {
                    progressText.innerHTML = '<i class="fas fa-check-circle"></i> Deployment completed successfully!';
                    progressText.style.color = '#10b981';
                }
                clearInterval(deployInterval);

                setTimeout(() => {
                    showDeploymentSuccess();
                }, 1000);
            }

            currentStep++;
        }
    }, 2000);
}

// Show deployment success notification
function showDeploymentSuccess() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        ">
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <div style="font-weight: 600; margin-bottom: 4px;">Pipeline Deployed Successfully!</div>
                    <div style="font-size: 0.875rem; opacity: 0.9;">Your DevSecOps pipeline is now ready for use.</div>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
    }, 5000);
}

// Start installation process
function startInstallation() {
    elements.installBtn.style.display = 'none';
    elements.installProgress.style.display = 'block';

    const steps = [
        { text: '설치 준비 중...', progress: 10 },
        { text: '아티팩트 레지스트리 구성 중...', progress: 20 },
        { text: 'CI/CD 파이프라인 설정 중...', progress: 40 },
        { text: '클러스터 연결 확인 중...', progress: 60 },
        { text: 'DevSecOps 도구 설치 중...', progress: 80 },
        { text: '설정 검증 중...', progress: 95 },
        { text: '설치 완료!', progress: 100 }
    ];

    let currentStepIndex = 0;

    const installInterval = setInterval(() => {
        if (currentStepIndex < steps.length) {
            const step = steps[currentStepIndex];
            elements.progressText.textContent = step.text;
            elements.progressFill.style.width = step.progress + '%';

            if (step.progress === 100) {
                elements.progressText.innerHTML = '<i class="fas fa-check-circle"></i> 설치가 성공적으로 완료되었습니다!';
                elements.progressText.style.color = '#28a745';
                elements.progressText.style.fontWeight = 'bold';
                clearInterval(installInterval);

                // Show success animation
                setTimeout(() => {
                    showSuccessMessage();
                }, 1000);
            }

            currentStepIndex++;
        }
    }, 1500);
}

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 30px 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            z-index: 1000;
            animation: successPulse 0.6s ease-out;
        ">
            <i class="fas fa-rocket" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <h3 style="margin: 0 0 10px 0;">파이프라인 설치 완료!</h3>
            <p style="margin: 0; opacity: 0.9;">DevSecOps 파이프라인이 성공적으로 구성되었습니다.</p>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        "></div>
    `;

    // Add success animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successPulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.05); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(successDiv);

    // Remove success message after 3 seconds
    setTimeout(() => {
        document.body.removeChild(successDiv);
        document.head.removeChild(style);
    }, 3000);
}

// Add some interactive effects
function addInteractiveEffects() {
    // Pipeline stage click effects
    document.querySelectorAll('.stage').forEach(stage => {
        stage.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            const rect = stage.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';

            stage.style.position = 'relative';
            stage.appendChild(ripple);

            setTimeout(() => {
                stage.removeChild(ripple);
            }, 600);
        });
    });

    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Add floating particles background effect
function addBackgroundEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Handle tool selection with checkboxes
function handleToolSelection(checkbox) {
    const toolName = checkbox.name;
    const toolValue = checkbox.value;
    const isChecked = checkbox.checked;

    // Find the version dropdown for this tool
    const toolOption = checkbox.closest('.tool-option');
    const versionDropdown = toolOption?.querySelector('.version-dropdown');

    if (versionDropdown) {
        versionDropdown.disabled = !isChecked;
        if (isChecked) {
            state.config[toolName] = { tool: toolValue, version: versionDropdown.value };
            const otherCheckboxes = document.querySelectorAll(`input[name="${toolName}"]:not([value="${toolValue}"])`);
            otherCheckboxes.forEach(cb => {
                cb.checked = false;
                const otherOption = cb.closest('.tool-option');
                const otherDropdown = otherOption?.querySelector('.version-dropdown');
                if (otherDropdown) otherDropdown.disabled = true;
            });
        } else {
            delete state.config[toolName];
        }
    }

    updatePipelineStages();
    updateSummary();
}

// Handle version dropdown changes
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('version-dropdown')) {
        const toolOption = e.target.closest('.tool-option');
        const checkbox = toolOption?.querySelector('input[type="checkbox"]');

        if (checkbox && checkbox.checked) {
            const toolName = checkbox.name;
            const toolValue = checkbox.value;
            state.config[toolName] = { tool: toolValue, version: e.target.value };
            updateSummary();
            showNotification(`${toolName} version updated to ${e.target.value}`, 'info');
        }
    }
});

// Update stage configuration based on tools
function updateStageConfig(stageName) {
    // This would contain logic to update stage configuration
    // based on selected tools and show appropriate status
    console.log(`Updating ${stageName} stage configuration`);
}

// Add interactive effects for professional feel
function addInteractiveEffects() {
    // Pipeline stage click effects
    document.querySelectorAll('.stage').forEach(stage => {
        stage.addEventListener('click', () => {
            // Add subtle click feedback
            stage.style.transform = 'scale(0.98)';
            setTimeout(() => {
                stage.style.transform = '';
            }, 100);
        });
    });

    // Add hover effects to cards
    document.querySelectorAll('.config-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = '#60a5fa';
        });

        card.addEventListener('mouseleave', () => {
            card.style.borderColor = '#2d3748';
        });
    });

    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        const id = btn.id || '';
        if (id === 'previewDeployScriptBtn' || id === 'previewDeployScriptBtnCompact' || id === 'previewDeployScriptBtnSidebar') return;
        btn.addEventListener('click', () => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1000);
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    addInteractiveEffects();

    // Add initial animation to pipeline stages
    setTimeout(() => {
        document.querySelectorAll('.stage').forEach((stage, index) => {
            setTimeout(() => {
                stage.style.opacity = '0';
                stage.style.transform = 'translateY(20px)';
                stage.style.transition = 'all 0.3s ease';

                setTimeout(() => {
                    stage.style.opacity = '1';
                    stage.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }, 300);

    // Initialize DevSecOps List features
    if (typeof initializePipelineListFeatures === 'function') initializePipelineListFeatures();

    // Set initial page state — use URL hash if present
    const hashPage = normalizePageName(location.hash.replace('#', ''));
    const defaultPage = getDefaultPage(state.currentRole);
    const inlinePages = window.INLINE_PAGE_HTML || {};
    const initialPage = (hashPage && (PAGE_HTML_MAP[hashPage] || inlinePages[hashPage] || document.getElementById(hashPage + 'Page'))) ? hashPage : defaultPage;
    switchPage(initialPage, true); // true = skip history push on initial load
});

// Hash-based routing: handle browser back/forward and direct URL navigation
window.addEventListener('hashchange', function () {
    var page = normalizePageName(location.hash.replace('#', ''));
    if (page && page !== state.currentPage) {
        switchPage(page, true); // true = don't re-push to navHistory
    }
});

// Back button visibility
function updateBackBtn() {
    var btn = document.getElementById('globalBackBtn');
    if (btn) {
        btn.style.display = navHistory.length > 0 ? 'inline-flex' : 'none';
        placeBackBtnNearTitle();
    }
}

function placeBackBtnNearTitle() {
    var btn = document.getElementById('globalBackBtn');
    var titleBars;
    var visibleTitleBar;
    var i;
    var bar;
    if (!btn) return;

    titleBars = document.querySelectorAll('.header-title-bar');
    visibleTitleBar = null;

    for (i = 0; i < titleBars.length; i++) {
        bar = titleBars[i];
        if (bar.offsetParent !== null) {
            visibleTitleBar = bar;
            break;
        }
    }

    if (visibleTitleBar && btn.parentElement !== visibleTitleBar) {
        visibleTitleBar.insertBefore(btn, visibleTitleBar.firstChild);
    }
}

// Go back one page
function goBack() {
    var prev;
    if (navHistory.length > 0) {
        prev = navHistory.pop();
        switchPage(prev, true); // true = don't push to history again
    }
}

// ── Page HTML lazy-load registry ──
var PAGE_ALIAS_MAP = {
    list: 'stacklist',
    install: 'stackinstall',
    compatibility: 'version',
    history: 'stacklist',
    stackhistory: 'stacklist',
    cicdhistory: 'cicdlist',
    'cicd-template': 'cicdtemplates'
}

var PAGE_HTML_MAP = {
    home: 'html/pages/home.html',
    stacklist: 'html/pages/stack-list.html',
    stackinstall: 'html/pages/stack-install.html',
    templates: 'html/pages/stack-template.html',
    version: 'html/pages/stack-version.html',
    cicdlist: 'html/pages/cicd-list.html',
    cicdtemplates: 'html/pages/cicd-template.html',
    developer: 'html/pages/cicd-developer.html',
    action: 'html/pages/action.html',
    monitoring: 'html/pages/obs-dashboard.html',
    alertlist: 'html/pages/obs-alert-list.html',
    alerthistory: 'html/pages/obs-alert-history.html',
    organization: 'html/pages/org-organization.html',
    users: 'html/pages/org-users.html',
    clusters: 'html/pages/org-clusters.html'
}

function normalizePageName(pageName) {
    return PAGE_ALIAS_MAP[pageName] || pageName
}

function loadPageHtml(pageName, callback) {
    pageName = normalizePageName(pageName);
    var pageId = pageName + 'Page';
    var inlinePages = window.INLINE_PAGE_HTML || {};
    if (document.getElementById(pageId)) {
        callback();
        return;
    }

    if (inlinePages[pageName]) {
        const inlineWs = document.getElementById('mainWorkspace');
        const inlineEl = document.createElement('div');
        inlineEl.innerHTML = inlinePages[pageName];
        while (inlineEl.firstChild) inlineWs.appendChild(inlineEl.firstChild);
        callback();
        return;
    }

    var htmlFile = PAGE_HTML_MAP[pageName];
    if (!htmlFile) {
        callback();
        return;
    }

    var requestCandidates = [htmlFile];
    var pagesFallback = htmlFile.replace(/^html\/pages\//, 'pages/');
    if (pagesFallback !== htmlFile) requestCandidates.push(pagesFallback);
    requestCandidates.push('./' + htmlFile);
    if (pagesFallback !== htmlFile) requestCandidates.push('./' + pagesFallback);

    function appendPageHtml(html) {
        var ws = document.getElementById('mainWorkspace');
        var el = document.createElement('div');
        el.innerHTML = html;
        while (el.firstChild) ws.appendChild(el.firstChild);
    }

    function showPageLoadError() {
        var ws = document.getElementById('mainWorkspace');
        if (!ws) return;
        ws.innerHTML =
            '<div class="page-content active" style="padding:24px;">' +
            '<div class="pipeline-card" style="padding:20px;border:1px solid #ef4444;">' +
            '<h3 style="margin:0 0 8px;">Failed to load page content</h3>' +
            '<p style="margin:0;color:#64748b;line-height:1.6;">' +
            'Cannot fetch <code>' + htmlFile + '</code>. If you opened this file directly, run a local web server and open via <code>http://localhost</code>.' +
            '</p>' +
            '</div>' +
            '</div>';
    }

    function fetchWithFallback(index) {
        if (index >= requestCandidates.length) {
            console.error('Failed to load page HTML:', pageName, requestCandidates);
            showPageLoadError();
            callback();
            return;
        }

        fetch(requestCandidates[index], { cache: 'no-store' })
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(function (html) {
                appendPageHtml(html);
                callback();
            })
            .catch(function () {
                fetchWithFallback(index + 1);
            });
    }

    fetchWithFallback(0);
}

// Page switching functionality
// _noHistory: pass true to skip pushing current page to navHistory (used by goBack, hashchange, initial load)
function switchPage(pageName, _noHistory) {
    var previousPage = state.currentPage;
    var firstStack;
    pageName = normalizePageName(pageName);

    if (!_noHistory && state.currentPage && state.currentPage !== pageName) {
        navHistory.push(state.currentPage);
    }
    state.currentPage = pageName;
    if (canAccessPage(state.currentRole, pageName)) {
        setLastPage(state.currentRole, pageName);
    }

    // Update URL hash and back button immediately (before async load)
    if (location.hash.replace('#', '') !== pageName) {
        history.replaceState(null, '', '#' + pageName);
    }
    updateBackBtn();
    placeBackBtnNearTitle();
    if (window.matchMedia('(max-width: 1200px)').matches) {
        document.body.classList.remove('mobile-sidebar-open');
    }

    loadPageHtml(pageName, function () {
        var targetPage = document.getElementById(pageName + 'Page');
        if (!targetPage) {
            console.error('Target page element not found for route:', pageName);
            state.currentPage = previousPage;
            if (previousPage && location.hash.replace('#', '') !== previousPage) {
                history.replaceState(null, '', '#' + previousPage);
            }
            return;
        }

        // Hide all pages
        document.querySelectorAll('.page-content').forEach(function (page) {
            page.classList.remove('active');
        });

        // Show selected page
        targetPage.classList.add('active');

        document.body.classList.remove(
            'stack-list-page', 'templates-page', 'developer-page', 'clusters-page',
            'organization-page', 'monitoring-page', 'version-page', 'users-page',
            'cicdtemplates-page', 'cicdlist-page', 'action-page', 'home-page',
            'alertlist-page', 'alerthistory-page'
        );
        if (pageName === 'stacklist') document.body.classList.add('stack-list-page');
        if (pageName === 'alertlist') document.body.classList.add('alertlist-page');
        if (pageName === 'alerthistory') document.body.classList.add('alerthistory-page');
        if (pageName === 'templates') document.body.classList.add('templates-page');
        if (pageName === 'developer') document.body.classList.add('developer-page');
        if (pageName === 'clusters') document.body.classList.add('clusters-page');
        if (pageName === 'organization') document.body.classList.add('organization-page');
        if (pageName === 'monitoring') document.body.classList.add('monitoring-page');
        if (pageName === 'version') document.body.classList.add('version-page');
        if (pageName === 'users') document.body.classList.add('users-page');
        if (pageName === 'cicdtemplates') document.body.classList.add('cicdtemplates-page');
        if (pageName === 'cicdlist') document.body.classList.add('cicdlist-page');
        if (pageName === 'action') document.body.classList.add('action-page');
        if (pageName === 'home') document.body.classList.add('home-page');

        // Update sidebar active state
        document.querySelectorAll('.nav-item').forEach(function (item) {
            item.classList.remove('active');
        });
        var activeNavItem = document.querySelector('[data-page="' + pageName + '"]');
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        if (pageName === 'clusters') {
            renderClusterRegistryPage();
        }
        if (pageName === 'stacklist') {
            firstStack = document.querySelector('.stack-list-item.active');
            if (firstStack && typeof renderStackDetail === 'function') renderStackDetail(firstStack.dataset.stackId);
        }
        if (pageName === 'monitoring') {
            renderMonitoringBars();
        }

        updateBackBtn();
        placeBackBtnNearTitle();

        // Re-apply i18n when switching pages
        if (typeof i18n !== 'undefined' && i18n.apply) i18n.apply();
    });
}

// CI Editor functions
function editPipelineConfig(pipelineName) {
    const modal = document.getElementById('ciEditorModal');
    const modalTitle = document.getElementById('editorModalTitle');
    const configFileName = document.getElementById('configFileName');

    if (modal && modalTitle && configFileName) {
        modalTitle.textContent = `Edit ${pipelineName} Configuration`;

        // Set appropriate config file name based on pipeline
        if (pipelineName.includes('github') || pipelineName === 'api-service-pipeline') {
            configFileName.textContent = '.github/workflows/ci.yml';
        } else {
            configFileName.textContent = '.gitlab-ci.yml';
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Edit DevSecOps Stack Config
function editStackConfig(stackName) {
    const modal = document.getElementById('ciEditorModal');
    const modalTitle = document.getElementById('editorModalTitle');
    const configFileName = document.getElementById('configFileName');
    const configEditor = document.getElementById('configEditor');

    if (modal && modalTitle && configFileName && configEditor) {
        modalTitle.textContent = `Edit ${stackName} Pipeline`;

        // Determine CI/CD platform and config file based on stack
        let fileName, configContent;

        if (stackName === 'Production DevSecOps Stack') {
            fileName = '.gitlab-ci.yml';
            configContent = generateGitLabDevSecOpsConfig();
        } else if (stackName === 'Development Stack') {
            fileName = '.github/workflows/devsecops.yml';
            configContent = generateGitHubDevSecOpsConfig();
        } else if (stackName === 'Staging Environment') {
            fileName = 'Jenkinsfile';
            configContent = generateJenkinsDevSecOpsConfig();
        } else if (stackName === 'Microservices Platform') {
            fileName = '.gitlab-ci.yml';
            configContent = generateMicroservicesConfig();
        } else if (stackName === 'Mobile App CI/CD') {
            fileName = '.github/workflows/mobile-ci.yml';
            configContent = generateMobileAppConfig();
        } else if (stackName === 'ML/AI Pipeline') {
            fileName = 'kubeflow-pipeline.py';
            configContent = generateMLPipelineConfig();
        } else {
            fileName = '.gitlab-ci.yml';
            configContent = generateGitLabDevSecOpsConfig();
        }

        configFileName.textContent = fileName;
        configEditor.value = configContent;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeCiEditor() {
    const modal = document.getElementById('ciEditorModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function switchEditorTab(tabName) {
    // Update tab indicators
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update panels
    document.querySelectorAll('.editor-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(tabName.replace('-', '') + 'Panel');
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
}

function validateConfiguration() {
    const configText = document.getElementById('ciConfigEditor')?.value;

    if (!configText) {
        showNotification('No configuration to validate', 'warning');
        return;
    }

    // Simple YAML validation simulation
    try {
        // Basic validation checks
        if (!configText.includes('stages:')) {
            throw new Error('Missing required "stages" section');
        }

        if (!configText.includes('script:')) {
            throw new Error('No jobs with scripts found');
        }

        showNotification('Configuration is valid!', 'success');
    } catch (error) {
        showNotification(`Validation error: ${error.message}`, 'error');
    }
}

function saveCiConfiguration() {
    const configText = document.getElementById('ciConfigEditor')?.value;

    if (!configText) {
        showNotification('No configuration to save', 'warning');
        return;
    }

    // Simulate saving
    showNotification('Configuration saved successfully!', 'success');

    setTimeout(() => {
        closeCiEditor();
    }, 1000);
}

function applyTemplate(templateType) {
    const editor = document.getElementById('ciConfigEditor');
    if (!editor) return;

    const templates = window.PIPELINE_TEMPLATE_DATA?.editorTemplates || {};

    if (templates[templateType]) {
        editor.value = templates[templateType];
        showNotification(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template applied!`, 'success');

        // Switch back to config tab
        switchEditorTab('ci-config');
    }
}

// DevSecOps Configuration Templates
function generateGitLabDevSecOpsConfig() {
    return window.PIPELINE_TEMPLATE_DATA?.stackConfigs?.gitlabDevSecOps || '';
}

function generateGitHubDevSecOpsConfig() {
    return window.PIPELINE_TEMPLATE_DATA?.stackConfigs?.githubDevSecOps || '';
}

function generateJenkinsDevSecOpsConfig() {
    return window.PIPELINE_TEMPLATE_DATA?.stackConfigs?.jenkinsDevSecOps || '';
}

function generateMicroservicesConfig() {
    return window.PIPELINE_TEMPLATE_DATA?.stackConfigs?.microservices || '';
}

function generateMobileAppConfig() {
    return window.PIPELINE_TEMPLATE_DATA?.stackConfigs?.mobileApp || '';
}

function generateMLPipelineConfig() {
    return window.PIPELINE_TEMPLATE_DATA?.stackConfigs?.mlPipeline || '';
}

// DevSecOps List Search and Filter Functions
function initializePipelineListFeatures() {
    const searchInput = document.querySelector('.search-box input');
    const pipelineCards = document.querySelectorAll('.devsecops-stack');

    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();

            pipelineCards.forEach(card => {
                const title = card.querySelector('.stack-title')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.stack-description')?.textContent.toLowerCase() || '';
                const tools = Array.from(card.querySelectorAll('.tool-tag span'))
                    .map(span => span.textContent.toLowerCase()).join(' ');

                const isMatch = title.includes(searchTerm) ||
                    description.includes(searchTerm) ||
                    tools.includes(searchTerm);

                card.style.display = isMatch ? 'block' : 'none';
            });

            // Update results count
            const visibleCards = Array.from(pipelineCards).filter(card =>
                card.style.display !== 'none'
            ).length;

            updateSearchResults(visibleCards, pipelineCards.length);
        });
    }
}

function updateSearchResults(visible, total) {
    let resultsInfo = document.querySelector('.search-results-info');
    if (!resultsInfo) {
        resultsInfo = document.createElement('div');
        resultsInfo.className = 'search-results-info';
        const listHeader = document.querySelector('.list-header');
        if (listHeader) {
            listHeader.appendChild(resultsInfo);
        }
    }

    if (visible === total) {
        resultsInfo.textContent = '';
    } else {
        resultsInfo.textContent = `Showing ${visible} of ${total} stacks`;
    }
}

function filterByStatus(status) {
    const pipelineCards = document.querySelectorAll('.devsecops-stack');

    pipelineCards.forEach(card => {
        const cardStatus = card.querySelector('.stack-status')?.textContent.toLowerCase().trim();

        if (status === 'all' || cardStatus.includes(status.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function sortStacks(criteria) {
    const pipelineGrid = document.querySelector('.pipeline-grid');
    const cards = Array.from(document.querySelectorAll('.devsecops-stack'));

    cards.sort((a, b) => {
        switch (criteria) {
            case 'name':
                const nameA = a.querySelector('.stack-title')?.textContent || '';
                const nameB = b.querySelector('.stack-title')?.textContent || '';
                return nameA.localeCompare(nameB);

            case 'status':
                const statusA = a.querySelector('.stack-status')?.textContent || '';
                const statusB = b.querySelector('.stack-status')?.textContent || '';
                return statusA.localeCompare(statusB);

            case 'cost':
                const costA = parseInt(a.querySelector('.metric-item:last-child span')?.textContent.replace(/[^0-9]/g, '') || '0');
                const costB = parseInt(b.querySelector('.metric-item:last-child span')?.textContent.replace(/[^0-9]/g, '') || '0');
                return costB - costA; // Descending order

            default:
                return 0;
        }
    });

    // Re-append sorted cards
    cards.forEach(card => pipelineGrid.appendChild(card));
}

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const allDropdowns = document.querySelectorAll('.dropdown-menu');

    // Close all other dropdowns
    allDropdowns.forEach(menu => {
        if (menu.id !== dropdownId) {
            menu.classList.remove('show');
        }
    });

    // Toggle current dropdown
    dropdown.classList.toggle('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-toggle')) {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

// Export functions for global access
window.editStackConfig = editStackConfig;
window.switchPage = switchPage;
window.initializePipelineListFeatures = initializePipelineListFeatures;
window.filterByStatus = filterByStatus;
window.sortStacks = sortStacks;
window.toggleDropdown = toggleDropdown;

// Export state for debugging
window.nullusState = state;
window.editPipelineConfig = editPipelineConfig;
window.applyTemplate = applyTemplate;


function applyPreset(presetName) {
    // Clear all applied states
    document.querySelectorAll('.preset-card').forEach(c => {
        c.classList.remove('applied');
        c.querySelector('.preset-applied-badge').style.display = 'none';
        c.querySelector('.btn-preset-apply').style.display = '';
    });

    const presets = {
        standard: {
            mainPipeline: 'gitlab',
            cdTool: 'argocd',
            monitoringCollection: 'prometheus',
            monitoringQuery: 'grafana',
            loggingCollection: null,
            loggingQuery: null
        },
        full: {
            mainPipeline: 'gitlab',
            cdTool: 'argocd',
            monitoringCollection: 'prometheus',
            monitoringQuery: 'grafana',
            loggingCollection: 'opentelemetry',
            logging: 'opensearch'
        },
        minimal: {
            mainPipeline: 'github',
            cdTool: 'argocd',
            monitoringCollection: null,
            monitoringQuery: null,
            loggingCollection: null,
            loggingQuery: null
        }
    };

    const preset = presets[presetName];
    if (!preset) return;

    // Apply checkbox selections for each tool category
    Object.keys(preset).forEach(configKey => {
        const targetValue = preset[configKey];
        const checkboxes = document.querySelectorAll(`input[name="${configKey}"]`);
        checkboxes.forEach(cb => {
            const wasChecked = cb.checked;
            cb.checked = (cb.value === targetValue);
            if (wasChecked !== cb.checked) {
                handleToolSelection(cb);
            }
        });
    });

    // Mark card as applied
    const card = document.querySelector(`.preset-card[data-preset="${presetName}"]`);
    if (card) {
        card.classList.add('applied');
        card.querySelector('.preset-applied-badge').style.display = '';
        card.querySelector('.btn-preset-apply').style.display = 'none';
    }

    updatePipelineStages();
    updateSummary();
    showNotification(`"${presetName.charAt(0).toUpperCase() + presetName.slice(1)}" template applied!`, 'success');
}


function buildExportData() {
    const ts = new Date().toISOString();
    const ns = state.config.pipelineNamespace || 'nullus-system';
    const getToolObj = (key) => {
        const c = state.config[key];
        if (c && typeof c === 'object') return { tool: c.tool || null, version: c.version || null, enabled: true };
        return { tool: c || null, version: null, enabled: !!c };
    };
    return {
        nullus_version: '0.1.0',
        exported_at: ts,
        role: state.currentRole,
        artifacts: {
            packageRegistry: getToolObj('packageRegistry'),
            sourceRepo: getToolObj('sourceRepo'),
            imageRegistry: getToolObj('imageRegistry'),
            storage: getToolObj('storage')
        },
        pipeline: {
            cicd: getToolObj('mainPipeline'),
            cd: getToolObj('cdTool')
        },
        monitoring: {
            collection: getToolObj('monitoringCollection'),
            query: getToolObj('monitoringQuery')
        },
        logging: {
            collection: getToolObj('loggingCollection'),
            query: getToolObj('loggingQuery')
        },
        resources: {
            cpu: state.resources.cpu,
            memory: state.resources.memory,
            storage: state.resources.storage,
            estimatedCost: {
                monthly_usd: state.resources.cost,
                currency: state.currency,
                formatted: formatCost(state.resources.cost)
            }
        },
        clusters: {
            pipeline: {
                name: state.config.pipelineClusterName || 'devops-cluster',
                namespace: ns
            },
            target: {
                name: state.config.appClusterName || '',
                namespace: state.config.appNamespace || ''
            }
        }
    };
}

function exportAsJSON() {
    const data = buildExportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    downloadBlob(blob, `nullus-config-${ts}.json`);
    showNotification('Configuration exported as JSON', 'success');
}

function exportAsYAML() {
    const data = buildExportData();
    const yaml = jsonToYaml(data, 0);
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    downloadBlob(blob, `nullus-config-${ts}.yaml`);
    showNotification('Configuration exported as YAML', 'success');
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function jsonToYaml(obj, indent) {
    const pad = '  '.repeat(indent);
    let out = '';
    if (obj === null || obj === undefined) return pad + 'null\n';
    if (typeof obj !== 'object') {
        if (typeof obj === 'string') return obj.includes(':') || obj.includes('#') ? `"${obj}"` : obj;
        return String(obj);
    }
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                out += pad + '-\n' + jsonToYaml(item, indent + 1);
            } else {
                out += pad + '- ' + jsonToYaml(item, 0) + '\n';
            }
        });
        return out;
    }
    Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (val === null || val === undefined) {
            out += pad + key + ': null\n';
        } else if (typeof val === 'object') {
            out += pad + key + ':\n' + jsonToYaml(val, indent + 1);
        } else {
            out += pad + key + ': ' + jsonToYaml(val, 0) + '\n';
        }
    });
    return out;
}


function openK8sPreviewModal() {
    const modal = document.getElementById('k8sPreviewModal');
    if (!modal) return;
    currentK8sTab = 'namespace';
    document.querySelectorAll('.k8s-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.k8s-tab[data-k8s-tab="namespace"]')?.classList.add('active');
    renderK8sPreview('namespace');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeK8sPreviewModal() {
    const modal = document.getElementById('k8sPreviewModal');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
}

function getSelectedTools() {
    const tools = [];
    const toolConfigs = [
        { key: 'packageRegistry', category: 'artifact' },
        { key: 'sourceRepo', category: 'artifact' },
        { key: 'imageRegistry', category: 'artifact' },
        { key: 'mainPipeline', category: 'pipeline' },
        { key: 'cdTool', category: 'pipeline' },
        { key: 'monitoringCollection', category: 'monitoring' },
        { key: 'monitoringQuery', category: 'monitoring' },
        { key: 'loggingCollection', category: 'logging' },
        { key: 'loggingQuery', category: 'logging' }
    ];
    toolConfigs.forEach(tc => {
        const cfg = state.config[tc.key];
        if (cfg && ((typeof cfg === 'object' && cfg.tool) || typeof cfg === 'string')) {
            const t = typeof cfg === 'object' ? cfg.tool : cfg;
            const v = typeof cfg === 'object' ? cfg.version : 'latest';
            if (t) tools.push({ name: toolNames[t] || t, key: t, version: v, category: tc.category, configKey: tc.key });
        }
    });
    return tools;
}

function renderK8sPreview(tab) {
    const el = document.getElementById('k8sPreviewContent');
    if (!el) return;
    const ns = state.config.pipelineNamespace || 'nullus-system';
    const tools = getSelectedTools();
    let yaml = '';

    if (tab === 'namespace') {
        yaml = generateNamespaceYaml(ns);
    } else if (tab === 'deployments') {
        yaml = tools.map(t => generateDeploymentYaml(t, ns)).join('\n---\n');
    } else if (tab === 'services') {
        yaml = tools.map(t => generateServiceYaml(t, ns)).join('\n---\n');
    } else if (tab === 'ingress') {
        yaml = generateIngressYaml(tools, ns);
    }
    el.textContent = yaml || '# No resources to preview';
}

function applyTemplateData(template, values) {
    return Object.entries(values).reduce((acc, entry) => {
        return acc.replaceAll(`{{${entry[0]}}}`, String(entry[1]));
    }, template);
}

function generateNamespaceYaml(ns) {
    const template = window.K8S_TEMPLATE_DATA?.namespace || '';
    return applyTemplateData(template, { namespace: ns });
}

function generateDeploymentYaml(tool, ns) {
    const slug = tool.key.replace(/[^a-z0-9]/g, '-');
    const cpuReq = Math.max(Math.floor(state.resources.cpu / Math.max(getSelectedTools().length, 1) * 1000), 250);
    const memReq = Math.max(Math.floor(state.resources.memory / Math.max(getSelectedTools().length, 1) * 1024), 256);
    const template = window.K8S_TEMPLATE_DATA?.deployment || '';
    return applyTemplateData(template, {
        slug: slug,
        namespace: ns,
        version: tool.version,
        category: tool.category,
        cpuReq: cpuReq,
        memReq: memReq,
        cpuLimit: cpuReq * 2,
        memLimit: memReq * 2
    });
}

function generateServiceYaml(tool, ns) {
    const slug = tool.key.replace(/[^a-z0-9]/g, '-');
    const template = window.K8S_TEMPLATE_DATA?.service || '';
    return applyTemplateData(template, {
        slug: slug,
        namespace: ns
    });
}

function generateIngressYaml(tools, ns) {
    const ingressRuleTemplate = window.K8S_TEMPLATE_DATA?.ingressRule || '';
    const rules = tools.map(t => {
        const slug = t.key.replace(/[^a-z0-9]/g, '-');
        return applyTemplateData(ingressRuleTemplate, {
            slug: slug,
            namespace: ns
        });
    }).join('\n');
    const ingressTemplate = window.K8S_TEMPLATE_DATA?.ingress || '';
    return applyTemplateData(ingressTemplate, {
        namespace: ns,
        rules: rules
    });
}
