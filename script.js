// Navigation history for back button
var navHistory = [];

// Global state management
const state = {
    currentTab: 'artifacts',
    currentPage: 'organization',
    lastAdminPage: 'organization',
    lastDevopsPage: 'list',
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
const currencyRates = { USD: 1, KRW: 1333, CNY: 7.1 };
const currencySymbols = { USD: '$', KRW: '₩', CNY: '¥' };

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
            const page = item.dataset.page;
            if (page) {
                const developerPages = ['cicdtemplates', 'cicdlist', 'cicdhistory', 'developer', 'monitoring', 'alertlist', 'alerthistory'];
                if (state.currentRole === 'developer') {
                    if (developerPages.includes(page)) {
                        switchPage(page);
                    } else {
                        switchPage(state.lastDeveloperPage || 'cicdlist');
                    }
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
    if (!data || !elements.clusterDetailContent || !elements.clusterDetailPlaceholder) return;
    elements.clusterDetailPlaceholder.style.display = 'none';
    elements.clusterDetailContent.style.display = 'block';
    const titleEl = document.getElementById('clusterDetailTitle');
    if (titleEl) titleEl.textContent = data.name || clusterId;
    if (elements.clusterPageName) elements.clusterPageName.value = data.name || '';
    if (elements.clusterPageType) elements.clusterPageType.value = data.typeLabel || '';
    if (elements.clusterPageNamespace) elements.clusterPageNamespace.value = data.namespace || (typeof i18n !== 'undefined' ? i18n.t('cluster.notConfigured') : 'Not configured');
    if (elements.clusterPageEndpoint) elements.clusterPageEndpoint.value = data.endpoint || '';
    if (elements.clusterPageAuth) elements.clusterPageAuth.value = data.auth || '';
    if (elements.clusterPageOrgAccess) {
        elements.clusterPageOrgAccess.className = 'cluster-org-tags';
        elements.clusterPageOrgAccess.innerHTML = data.orgs && data.orgs.length
            ? data.orgs.map(o => '<span class="org-tag">' + o + '</span>').join('')
            : '<span class="org-empty">' + (typeof i18n !== 'undefined' ? 'No organization assigned' : 'No organization assigned') + '</span>';
    }
    if (elements.clusterPageConnection) {
        elements.clusterPageConnection.className = 'cluster-connection-status ' + (data.connected ? 'connected' : 'disconnected');
        const statusText = data.connected
            ? (typeof i18n !== 'undefined' ? i18n.t('cluster.connected') : 'Connected')
            : (typeof i18n !== 'undefined' ? i18n.t('cluster.notConfigured') : 'Not Configured');
        elements.clusterPageConnection.innerHTML =
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
    initializePipelineListFeatures();
    
    // Set initial page state — use URL hash if present
    const hashPage = location.hash.replace('#', '');
    const defaultPage = state.currentRole === 'admin' ? 'organization' : (state.currentRole === 'developer' ? 'cicdlist' : 'list');
    const initialPage = (hashPage && document.getElementById(hashPage + 'Page')) ? hashPage : defaultPage;
    switchPage(initialPage, true); // true = skip history push on initial load
});

// Hash-based routing: handle browser back/forward and direct URL navigation
window.addEventListener('hashchange', function() {
    var page = location.hash.replace('#', '');
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

// Page switching functionality
// _noHistory: pass true to skip pushing current page to navHistory (used by goBack, hashchange, initial load)
function switchPage(pageName, _noHistory) {
    var firstStack;
    if (!_noHistory && state.currentPage && state.currentPage !== pageName) {
        navHistory.push(state.currentPage);
    }
    state.currentPage = pageName;
    if (state.currentRole === 'admin' && ['organization', 'users', 'clusters', 'home'].includes(pageName)) {
        state.lastAdminPage = pageName;
    } else if (state.currentRole === 'devops' && pageName !== 'developer') {
        state.lastDevopsPage = pageName;
    } else if (state.currentRole === 'developer' && ['cicdtemplates', 'cicdlist', 'cicdhistory', 'developer', 'monitoring', 'alertlist', 'alerthistory'].includes(pageName)) {
        state.lastDeveloperPage = pageName;
    }

    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    document.body.classList.remove(
        'pipeline-list-page', 'templates-page', 'developer-page', 'clusters-page',
        'organization-page', 'history-page', 'monitoring-page', 'compatibility-page', 'users-page',
        'cicdhistory-page', 'cicdtemplates-page', 'cicdlist-page', 'home-page',
        'alertlist-page', 'alerthistory-page'
    );
    if (pageName === 'list') document.body.classList.add('pipeline-list-page');
    if (pageName === 'alertlist') document.body.classList.add('alertlist-page');
    if (pageName === 'alerthistory') document.body.classList.add('alerthistory-page');
    if (pageName === 'templates') document.body.classList.add('templates-page');
    if (pageName === 'developer') document.body.classList.add('developer-page');
    if (pageName === 'clusters') document.body.classList.add('clusters-page');
    if (pageName === 'organization') document.body.classList.add('organization-page');
    if (pageName === 'history') document.body.classList.add('history-page');
    if (pageName === 'monitoring') document.body.classList.add('monitoring-page');
    if (pageName === 'compatibility') document.body.classList.add('compatibility-page');
    if (pageName === 'users') document.body.classList.add('users-page');
    if (pageName === 'cicdhistory') document.body.classList.add('cicdhistory-page');
    if (pageName === 'cicdtemplates') document.body.classList.add('cicdtemplates-page');
    if (pageName === 'cicdlist') document.body.classList.add('cicdlist-page');
    if (pageName === 'home') document.body.classList.add('home-page');

    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const activeNavItem = document.querySelector(`[data-page="${pageName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    if (pageName === 'clusters') {
        renderClusterRegistryPage();
    }
    if (pageName === 'list') {
        firstStack = document.querySelector('.stack-list-item.active');
        if (firstStack && typeof renderStackDetail === 'function') renderStackDetail(firstStack.dataset.stackId);
    }
    if (pageName === 'monitoring') {
        renderMonitoringBars();
    }
    // Update URL hash (without triggering hashchange listener)
    if (location.hash.replace('#', '') !== pageName) {
        history.replaceState(null, '', '#' + pageName);
    }
    // Update back button visibility
    updateBackBtn();
    placeBackBtnNearTitle();
    // Re-apply i18n when switching pages (ensures install page etc. get translated)
    if (typeof i18n !== 'undefined' && i18n.apply) i18n.apply();
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
    
    const templates = {
        node: `stages:
  - install
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

install_dependencies:
  stage: install
  image: node:$NODE_VERSION
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

test_job:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm run test
    - npm run coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build_job:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy_job:
  stage: deploy
  image: node:$NODE_VERSION
  script:
    - npm run deploy
  only:
    - main`,
        
        docker: `stages:
  - build
  - test
  - push
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

build_image:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest

test_image:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker run --rm $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA npm test

push_image:
  stage: push
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main

deploy_container:
  stage: deploy
  image: docker:latest
  script:
    - docker-compose up -d
  only:
    - main`,
        
        kubernetes: `stages:
  - build
  - test
  - deploy

variables:
  KUBECONFIG: /tmp/kubeconfig

build_and_push:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

test_deployment:
  stage: test
  image: bitnami/kubectl
  script:
    - kubectl apply --dry-run=client -f k8s/

deploy_to_staging:
  stage: deploy
  image: bitnami/kubectl
  script:
    - kubectl apply -f k8s/namespace.yaml
    - kubectl apply -f k8s/configmap.yaml
    - kubectl apply -f k8s/deployment.yaml
    - kubectl apply -f k8s/service.yaml
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy_to_production:
  stage: deploy
  image: bitnami/kubectl
  script:
    - kubectl apply -f k8s/namespace.yaml
    - kubectl apply -f k8s/configmap.yaml
    - kubectl apply -f k8s/deployment.yaml
    - kubectl apply -f k8s/service.yaml
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main`,
        
        python: `stages:
  - test
  - build
  - deploy

variables:
  PYTHON_VERSION: "3.11"
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  paths:
    - .cache/pip
    - venv/

test_job:
  stage: test
  image: python:$PYTHON_VERSION
  before_script:
    - python -m venv venv
    - source venv/bin/activate
    - pip install -r requirements.txt
  script:
    - python -m pytest tests/ --cov=src/
    - python -m flake8 src/
    - python -m black --check src/
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

build_package:
  stage: build
  image: python:$PYTHON_VERSION
  script:
    - python -m pip install build
    - python -m build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy_package:
  stage: deploy
  image: python:$PYTHON_VERSION
  script:
    - python -m pip install twine
    - python -m twine upload dist/*
  only:
    - tags`
    };
    
    if (templates[templateType]) {
        editor.value = templates[templateType];
        showNotification(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template applied!`, 'success');
        
        // Switch back to config tab
        switchEditorTab('ci-config');
    }
}

// DevSecOps Configuration Templates
function generateGitLabDevSecOpsConfig() {
    return `# Production DevSecOps Pipeline - GitLab CI/CD
stages:
  - develop
  - build
  - security
  - test
  - deploy
  - operation
  - monitoring
  - finops

variables:
  DOCKER_REGISTRY: "harbor.company.com"
  TRIVY_VERSION: "0.48.0"
  ARGOCD_VERSION: "v2.9.3"

# Develop Stage
code_quality:
  stage: develop
  image: sonarsource/sonar-scanner-cli:latest
  script:
    - sonar-scanner
  only:
    - merge_requests
    - main

# Build Stage
build_image:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $DOCKER_REGISTRY/app:$CI_COMMIT_SHA .
    - docker push $DOCKER_REGISTRY/app:$CI_COMMIT_SHA

# Security Stage
container_scan:
  stage: security
  image: aquasec/trivy:$TRIVY_VERSION
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $DOCKER_REGISTRY/app:$CI_COMMIT_SHA

secret_scan:
  stage: security
  image: trufflesecurity/trufflehog:latest
  script:
    - trufflehog git file://. --json

# Test Stage
unit_tests:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test
  coverage: '/Lines\\s*:\\s*(\\d+\\.?\\d*)%/'

integration_tests:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Deploy Stage
deploy_production:
  stage: deploy
  image: argoproj/argocd:$ARGOCD_VERSION
  script:
    - argocd app sync production-app
    - argocd app wait production-app
  only:
    - main

# Operation Stage
health_check:
  stage: operation
  image: curlimages/curl:latest
  script:
    - curl -f https://app.company.com/health || exit 1

# Monitoring Stage
setup_monitoring:
  stage: monitoring
  image: prom/prometheus:latest
  script:
    - echo "Monitoring setup completed"

# FinOps Stage
cost_analysis:
  stage: finops
  image: kubecost/cost-analyzer:latest
  script:
    - echo "Cost analysis completed"
`;
}

function generateGitHubDevSecOpsConfig() {
    return `# Development DevSecOps Pipeline - GitHub Actions
name: DevSecOps Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: docker.io
  IMAGE_NAME: company/app

jobs:
  # Develop Stage
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}

  # Build Stage
  build:
    runs-on: ubuntu-latest
    needs: code-quality
    steps:
      - uses: actions/checkout@v4
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}

  # Security Stage
  security-scan:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: '\${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-results.sarif'

  # Test Stage
  test:
    runs-on: ubuntu-latest
    needs: security-scan
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  # Deploy Stage
  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy with Flux
        run: |
          echo "Deploying with Flux CD"
          # Flux deployment commands here

  # Monitoring Stage
  monitoring:
    runs-on: ubuntu-latest
    needs: deploy
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Setup monitoring
        run: |
          echo "Setting up monitoring with Prometheus"
`;
}

function generateJenkinsDevSecOpsConfig() {
    return `// Staging DevSecOps Pipeline - Jenkins
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'aws-account-id.dkr.ecr.region.amazonaws.com'
        IMAGE_NAME = 'staging-app'
        SONARQUBE_SERVER = 'SonarQube'
        SPINNAKER_WEBHOOK = credentials('spinnaker-webhook')
    }
    
    stages {
        // Develop Stage
        stage('Code Quality') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube Scanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        
        // Build Stage
        stage('Build') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                }
            }
        }
        
        // Security Stage
        stage('Security Scan') {
            parallel {
                stage('Container Scan') {
                    steps {
                        sh """
                            docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
                                aquasec/trivy image ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        """
                    }
                }
                stage('SAST') {
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh 'sonar-scanner -Dsonar.projectKey=staging-app'
                        }
                    }
                }
            }
        }
        
        // Test Stage
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm ci && npm test'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'docker-compose -f docker-compose.test.yml up --abort-on-container-exit'
                    }
                }
            }
        }
        
        // Deploy Stage
        stage('Deploy to Staging') {
            steps {
                script {
                    // Push to ECR
                    sh """
                        aws ecr get-login-password --region region | docker login --username AWS --password-stdin ${DOCKER_REGISTRY}
                        docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                    """
                    
                    // Trigger Spinnaker deployment
                    sh """
                        curl -X POST ${SPINNAKER_WEBHOOK} \\
                            -H 'Content-Type: application/json' \\
                            -d '{"parameters":{"image":"${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"}}'
                    """
                }
            }
        }
        
        // Operation Stage
        stage('Health Check') {
            steps {
                script {
                    sh 'curl -f https://staging.company.com/health || exit 1'
                }
            }
        }
        
        // Monitoring Stage
        stage('Setup Monitoring') {
            steps {
                sh 'echo "Monitoring configured with Prometheus and Grafana"'
            }
        }
        
        // FinOps Stage
        stage('Cost Analysis') {
            steps {
                sh 'echo "Cost analysis completed with AWS Cost Explorer"'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            emailext (
                subject: "Pipeline Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "The pipeline has failed. Please check the logs.",
                to: "devops@company.com"
            )
        }
    }
}
`;
}

function generateMicroservicesConfig() {
    return `# Microservices Platform - GitLab CI/CD with Istio
stages:
  - develop
  - build
  - security
  - test
  - deploy
  - service-mesh
  - monitoring
  - finops

variables:
  DOCKER_REGISTRY: "harbor.company.com"
  ISTIO_VERSION: "1.20.0"
  JAEGER_VERSION: "1.52.0"
  PROMETHEUS_VERSION: "2.48.0"

# Service Discovery
services_discovery:
  stage: develop
  image: consul:latest
  script:
    - consul agent -dev &
    - consul services register service-config.json

# Multi-service Build
build_services:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  parallel:
    matrix:
      - SERVICE: [user-service, order-service, payment-service, notification-service]
  script:
    - cd services/$SERVICE
    - docker build -t $DOCKER_REGISTRY/$SERVICE:$CI_COMMIT_SHA .
    - docker push $DOCKER_REGISTRY/$SERVICE:$CI_COMMIT_SHA

# Security Scanning for All Services
security_scan_services:
  stage: security
  image: aquasec/trivy:latest
  parallel:
    matrix:
      - SERVICE: [user-service, order-service, payment-service, notification-service]
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $DOCKER_REGISTRY/$SERVICE:$CI_COMMIT_SHA

# Contract Testing
contract_tests:
  stage: test
  image: pactfoundation/pact-cli:latest
  script:
    - pact-broker publish pacts --consumer-app-version $CI_COMMIT_SHA
    - pact-broker can-i-deploy --pacticipant user-service --version $CI_COMMIT_SHA

# Deploy to Kubernetes
deploy_services:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl apply -f k8s/namespace.yaml
    - envsubst < k8s/services.yaml | kubectl apply -f -
    - kubectl rollout status deployment/user-service -n microservices
    - kubectl rollout status deployment/order-service -n microservices

# Istio Service Mesh Configuration
configure_service_mesh:
  stage: service-mesh
  image: istio/istioctl:$ISTIO_VERSION
  script:
    - istioctl install --set values.defaultRevision=default -y
    - kubectl label namespace microservices istio-injection=enabled
    - kubectl apply -f istio/gateway.yaml
    - kubectl apply -f istio/virtual-services.yaml
    - kubectl apply -f istio/destination-rules.yaml

# Distributed Tracing Setup
setup_tracing:
  stage: monitoring
  image: jaegertracing/jaeger-operator:$JAEGER_VERSION
  script:
    - kubectl apply -f jaeger/jaeger-operator.yaml
    - kubectl apply -f jaeger/jaeger-instance.yaml

# Prometheus Monitoring
setup_monitoring:
  stage: monitoring
  image: prom/prometheus:$PROMETHEUS_VERSION
  script:
    - kubectl apply -f monitoring/prometheus-config.yaml
    - kubectl apply -f monitoring/service-monitors.yaml
    - kubectl apply -f monitoring/grafana-dashboards.yaml

# Cost Analysis per Service
cost_analysis:
  stage: finops
  image: kubecost/cost-analyzer:latest
  script:
    - kubectl apply -f kubecost/cost-analyzer.yaml
    - echo "Cost breakdown by service available in Kubecost dashboard"
`;
}

function generateMobileAppConfig() {
    return `# Mobile App CI/CD - GitHub Actions
name: Mobile App DevSecOps Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REACT_NATIVE_VERSION: "0.72.0"
  FLUTTER_VERSION: "3.16.0"
  FASTLANE_VERSION: "2.217.0"

jobs:
  # Code Quality & Security
  code-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: ESLint
        run: npx eslint . --ext .js,.jsx,.ts,.tsx
      - name: Security audit
        run: npm audit --audit-level high

  # React Native Build
  build-react-native:
    runs-on: macos-latest
    needs: code-analysis
    steps:
      - uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.0'
      - name: Install Fastlane
        run: gem install fastlane -v $FASTLANE_VERSION
      - name: Setup React Native
        run: |
          npm install -g react-native-cli
          npm ci
          cd ios && pod install
      - name: Build iOS
        run: |
          cd ios
          fastlane build_ios
      - name: Build Android
        run: |
          cd android
          fastlane build_android

  # Flutter Build
  build-flutter:
    runs-on: ubuntu-latest
    needs: code-analysis
    steps:
      - uses: actions/checkout@v4
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: $FLUTTER_VERSION
      - name: Get dependencies
        run: flutter pub get
      - name: Run tests
        run: flutter test
      - name: Build APK
        run: flutter build apk --release
      - name: Build iOS (without signing)
        run: flutter build ios --release --no-codesign

  # Security Testing
  security-tests:
    runs-on: ubuntu-latest
    needs: [build-react-native, build-flutter]
    steps:
      - uses: actions/checkout@v4
      - name: Mobile Security Framework (MobSF)
        run: |
          docker run --rm -v \$(pwd):/app opensecurity/mobsf:latest
      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'mobile-app'
          path: '.'
          format: 'JSON'

  # App Store Deployment
  deploy-ios:
    runs-on: macos-latest
    needs: security-tests
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.0'
      - name: Install Fastlane
        run: gem install fastlane
      - name: Deploy to TestFlight
        env:
          APPLE_ID: \${{ secrets.APPLE_ID }}
          APP_STORE_CONNECT_API_KEY: \${{ secrets.APP_STORE_CONNECT_API_KEY }}
        run: |
          cd ios
          fastlane deploy_testflight

  # Google Play Deployment
  deploy-android:
    runs-on: ubuntu-latest
    needs: security-tests
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.0'
      - name: Install Fastlane
        run: gem install fastlane
      - name: Deploy to Google Play
        env:
          GOOGLE_PLAY_SERVICE_ACCOUNT: \${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
        run: |
          cd android
          fastlane deploy_play_store

  # Performance Monitoring
  performance-monitoring:
    runs-on: ubuntu-latest
    needs: [deploy-ios, deploy-android]
    steps:
      - name: Setup Firebase Performance
        run: |
          echo "Firebase Performance Monitoring configured"
          echo "Crashlytics enabled for crash reporting"
`;
}

function generateMLPipelineConfig() {
    return `# ML/AI Pipeline - Kubeflow Pipeline
import kfp
from kfp import dsl
from kfp.components import create_component_from_func
import mlflow
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Data Ingestion Component
@create_component_from_func
def data_ingestion(
    data_source: str,
    output_path: str
) -> str:
    """Ingest data from various sources"""
    import pandas as pd
    import os
    
    # Simulate data loading from different sources
    if data_source == "s3":
        # Load from S3
        data = pd.read_csv("s3://ml-data-bucket/training-data.csv")
    elif data_source == "database":
        # Load from database
        data = pd.read_sql("SELECT * FROM training_data", connection_string)
    else:
        # Load sample data
        data = pd.DataFrame({
            'feature1': np.random.randn(1000),
            'feature2': np.random.randn(1000),
            'target': np.random.randint(0, 2, 1000)
        })
    
    os.makedirs(output_path, exist_ok=True)
    data_file = f"{output_path}/raw_data.csv"
    data.to_csv(data_file, index=False)
    
    return data_file

# Data Preprocessing Component
@create_component_from_func
def data_preprocessing(
    input_data_path: str,
    output_path: str
) -> str:
    """Preprocess and clean the data"""
    import pandas as pd
    import numpy as np
    from sklearn.preprocessing import StandardScaler
    import joblib
    import os
    
    # Load data
    data = pd.read_csv(input_data_path)
    
    # Handle missing values
    data = data.dropna()
    
    # Feature scaling
    scaler = StandardScaler()
    feature_columns = [col for col in data.columns if col != 'target']
    data[feature_columns] = scaler.fit_transform(data[feature_columns])
    
    # Save processed data and scaler
    os.makedirs(output_path, exist_ok=True)
    processed_data_file = f"{output_path}/processed_data.csv"
    scaler_file = f"{output_path}/scaler.joblib"
    
    data.to_csv(processed_data_file, index=False)
    joblib.dump(scaler, scaler_file)
    
    return processed_data_file

# Model Training Component
@create_component_from_func
def model_training(
    processed_data_path: str,
    model_output_path: str,
    experiment_name: str = "ml-experiment"
) -> str:
    """Train machine learning model"""
    import pandas as pd
    import mlflow
    import mlflow.sklearn
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import accuracy_score, classification_report
    import joblib
    import os
    
    # Setup MLflow
    mlflow.set_experiment(experiment_name)
    
    with mlflow.start_run():
        # Load processed data
        data = pd.read_csv(processed_data_path)
        
        # Prepare features and target
        X = data.drop('target', axis=1)
        y = data['target']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Log metrics and model
        mlflow.log_param("n_estimators", 100)
        mlflow.log_param("max_depth", 10)
        mlflow.log_metric("accuracy", accuracy)
        mlflow.sklearn.log_model(model, "model")
        
        # Save model
        os.makedirs(model_output_path, exist_ok=True)
        model_file = f"{model_output_path}/model.joblib"
        joblib.dump(model, model_file)
        
        print(f"Model trained with accuracy: {accuracy}")
        return model_file

# Model Validation Component
@create_component_from_func
def model_validation(
    model_path: str,
    validation_data_path: str,
    accuracy_threshold: float = 0.8
) -> bool:
    """Validate model performance"""
    import pandas as pd
    import joblib
    from sklearn.metrics import accuracy_score
    
    # Load model and validation data
    model = joblib.load(model_path)
    data = pd.read_csv(validation_data_path)
    
    X_val = data.drop('target', axis=1)
    y_val = data['target']
    
    # Predict and evaluate
    y_pred = model.predict(X_val)
    accuracy = accuracy_score(y_val, y_pred)
    
    print(f"Validation accuracy: {accuracy}")
    
    # Check if model meets threshold
    if accuracy >= accuracy_threshold:
        print("Model validation passed!")
        return True
    else:
        print("Model validation failed!")
        return False

# Model Deployment Component
@create_component_from_func
def model_deployment(
    model_path: str,
    deployment_name: str = "ml-model-service"
) -> str:
    """Deploy model to Kubernetes"""
    import os
    import yaml
    
    # Create Kubernetes deployment manifest
    deployment_config = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
            'name': deployment_name,
            'labels': {'app': deployment_name}
        },
        'spec': {
            'replicas': 3,
            'selector': {'matchLabels': {'app': deployment_name}},
            'template': {
                'metadata': {'labels': {'app': deployment_name}},
                'spec': {
                    'containers': [{
                        'name': 'model-server',
                        'image': 'ml-model-server:latest',
                        'ports': [{'containerPort': 8080}],
                        'env': [{'name': 'MODEL_PATH', 'value': model_path}]
                    }]
                }
            }
        }
    }
    
    # Save deployment config
    with open('/tmp/deployment.yaml', 'w') as f:
        yaml.dump(deployment_config, f)
    
    # Apply deployment (simulated)
    print(f"Deploying model service: {deployment_name}")
    return f"Model deployed as {deployment_name}"

# Define the Pipeline
@dsl.pipeline(
    name='ML DevSecOps Pipeline',
    description='Complete ML pipeline with MLOps best practices'
)
def ml_devsecops_pipeline(
    data_source: str = "sample",
    experiment_name: str = "ml-experiment",
    accuracy_threshold: float = 0.8
):
    # Data Ingestion
    data_ingestion_task = data_ingestion(
        data_source=data_source,
        output_path="/tmp/data"
    )
    
    # Data Preprocessing
    preprocessing_task = data_preprocessing(
        input_data_path=data_ingestion_task.output,
        output_path="/tmp/processed"
    )
    
    # Model Training
    training_task = model_training(
        processed_data_path=preprocessing_task.output,
        model_output_path="/tmp/model",
        experiment_name=experiment_name
    )
    
    # Model Validation
    validation_task = model_validation(
        model_path=training_task.output,
        validation_data_path=preprocessing_task.output,
        accuracy_threshold=accuracy_threshold
    )
    
    # Model Deployment (conditional on validation)
    with dsl.Condition(validation_task.output == True):
        deployment_task = model_deployment(
            model_path=training_task.output,
            deployment_name="ml-model-service"
        )

# Compile and run the pipeline
if __name__ == "__main__":
    kfp.compiler.Compiler().compile(
        ml_devsecops_pipeline,
        'ml-devsecops-pipeline.yaml'
    )
    
    # Submit to Kubeflow
    client = kfp.Client()
    experiment = client.create_experiment('ML DevSecOps')
    run = client.run_pipeline(
        experiment.id,
        'ML DevSecOps Pipeline Run',
        'ml-devsecops-pipeline.yaml'
    )
`;
}

// DevSecOps List Search and Filter Functions
function initializePipelineListFeatures() {
    const searchInput = document.querySelector('.search-box input');
    const pipelineCards = document.querySelectorAll('.devsecops-stack');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
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
document.addEventListener('click', function(event) {
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

// ============================================
// FEATURE 1: Role Switcher
// ============================================
function initRoleSwitcher() {
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const role = btn.dataset.role;
            if (role === state.currentRole) return;
            state.currentRole = role;
            document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyRole(role);
        });
    });
}

function applyRole(role) {
    document.body.classList.remove('role-admin', 'role-devops', 'role-developer');
    const adminPages = ['organization', 'users', 'clusters', 'home'];
    const devopsOnlyPages = ['install', 'templates', 'list', 'history', 'clusters', 'organization', 'users', 'compatibility', 'monitoring', 'alertlist', 'alerthistory', 'cicdtemplates', 'cicdlist', 'cicdhistory'];
    const developerPages = ['cicdtemplates', 'cicdlist', 'cicdhistory', 'developer', 'monitoring', 'alertlist', 'alerthistory'];

    if (role === 'admin') {
        document.body.classList.add('role-admin');
        if (adminPages.includes(state.currentPage)) {
            state.lastAdminPage = state.currentPage;
        } else {
            state.lastAdminPage = 'organization';
        }
        switchPage(state.lastAdminPage);
    } else if (role === 'developer') {
        document.body.classList.add('role-developer');
        if (developerPages.includes(state.currentPage)) {
            state.lastDeveloperPage = state.currentPage;
        } else {
            state.lastDeveloperPage = 'cicdlist';
        }
        switchPage(state.lastDeveloperPage);
    } else {
        document.body.classList.add('role-devops');
        if (devopsOnlyPages.includes(state.currentPage)) {
            state.lastDevopsPage = state.currentPage;
        } else {
            state.lastDevopsPage = 'list';
        }
        switchPage(state.lastDevopsPage);
    }
}

// ============================================
// FEATURE 2: Template Presets
// ============================================
function initTemplatePresets() {
    document.querySelectorAll('.btn-preset-apply').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const preset = btn.dataset.preset;
            applyPreset(preset);
        });
    });
    document.querySelectorAll('.preset-card').forEach(card => {
        card.addEventListener('click', () => {
            const preset = card.dataset.preset;
            applyPreset(preset);
        });
    });
}

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

// ============================================
// FEATURE 3: Export Configuration
// ============================================
function initExportConfig() {
    const exportJsonBtn = document.getElementById('exportConfigBtn');
    const exportYamlBtn = document.getElementById('exportYamlBtn');

    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            exportAsJSON();
        });
    }
    if (exportYamlBtn) {
        exportYamlBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            exportAsYAML();
        });
    }
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

// ============================================
// FEATURE 4: K8s Object Preview Modal
// ============================================
let currentK8sTab = 'namespace';

function initK8sPreview() {
    // Button to open modal
    document.addEventListener('click', (e) => {
        if (e.target.closest('#previewK8sObjectsBtn')) {
            e.preventDefault();
            openK8sPreviewModal();
        }
        if (e.target.closest('#closeK8sPreviewModal')) {
            closeK8sPreviewModal();
        }
        if (e.target.closest('#copyK8sYamlBtn')) {
            const el = document.getElementById('k8sPreviewContent');
            if (el && el.textContent) {
                navigator.clipboard.writeText(el.textContent).then(() => {
                    showNotification('K8s YAML copied to clipboard', 'success');
                }).catch(() => showNotification('Failed to copy', 'error'));
            }
        }
        // Tab switching
        if (e.target.closest('.k8s-tab')) {
            const tab = e.target.closest('.k8s-tab');
            const tabName = tab.dataset.k8sTab;
            currentK8sTab = tabName;
            document.querySelectorAll('.k8s-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderK8sPreview(tabName);
        }
    });
    const modal = document.getElementById('k8sPreviewModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeK8sPreviewModal();
        });
    }
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

function generateNamespaceYaml(ns) {
    return `apiVersion: v1
kind: Namespace
metadata:
  name: ${ns}
  labels:
    app.kubernetes.io/managed-by: nullus
    app.kubernetes.io/part-of: devsecops-stack`;
}

function generateDeploymentYaml(tool, ns) {
    const slug = tool.key.replace(/[^a-z0-9]/g, '-');
    const cpuReq = Math.max(Math.floor(state.resources.cpu / Math.max(getSelectedTools().length, 1) * 1000), 250);
    const memReq = Math.max(Math.floor(state.resources.memory / Math.max(getSelectedTools().length, 1) * 1024), 256);
    return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${slug}
  namespace: ${ns}
  labels:
    app.kubernetes.io/name: ${slug}
    app.kubernetes.io/version: "${tool.version}"
    app.kubernetes.io/component: ${tool.category}
    app.kubernetes.io/managed-by: nullus
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: ${slug}
  template:
    metadata:
      labels:
        app.kubernetes.io/name: ${slug}
        app.kubernetes.io/version: "${tool.version}"
    spec:
      containers:
        - name: ${slug}
          image: ${slug}:${tool.version}
          ports:
            - containerPort: 8080
              protocol: TCP
          resources:
            requests:
              cpu: "${cpuReq}m"
              memory: "${memReq}Mi"
            limits:
              cpu: "${cpuReq * 2}m"
              memory: "${memReq * 2}Mi"
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10`;
}

function generateServiceYaml(tool, ns) {
    const slug = tool.key.replace(/[^a-z0-9]/g, '-');
    return `apiVersion: v1
kind: Service
metadata:
  name: ${slug}-svc
  namespace: ${ns}
  labels:
    app.kubernetes.io/name: ${slug}
    app.kubernetes.io/managed-by: nullus
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: ${slug}
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP
      name: http`;
}

function generateIngressYaml(tools, ns) {
    const rules = tools.map(t => {
        const slug = t.key.replace(/[^a-z0-9]/g, '-');
        return `        - host: ${slug}.${ns}.local
          http:
            paths:
              - path: /
                pathType: Prefix
                backend:
                  service:
                    name: ${slug}-svc
                    port:
                      number: 80`;
    }).join('\n');
    return `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nullus-ingress
  namespace: ${ns}
  labels:
    app.kubernetes.io/managed-by: nullus
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
${rules}`;
}

function initTemplatesPageActions() {
    document.querySelectorAll('.apply-devops-template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            if (!preset) return;
            applyPreset(preset);
            switchPage('install');
            showNotification(`DevSecOps template selected: ${preset}`, 'success');
        });
    });

    const searchInput = document.getElementById('templateSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.trim().toLowerCase();
            document.querySelectorAll('#templatesPage .template-admin-card').forEach(card => {
                const text = card.textContent?.toLowerCase() || '';
                card.style.display = text.includes(q) ? '' : 'none';
            });
        });
    }
}

function initDeveloperExperience() {
    const templateCards = document.querySelectorAll('.developer-template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            templateCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.developer.selectedTemplate = card.dataset.template;
            if (elements.devSelectedTemplate) {
                elements.devSelectedTemplate.value = card.querySelector('h3')?.textContent || '';
            }
            updateDeveloperReview();
        });
    });

    [
        elements.devAppName,
        elements.devRepoUrl,
        elements.devTargetCluster,
        elements.devNamespace,
        elements.devCpuRequest,
        elements.devMemoryRequest
    ].forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            syncDeveloperFormState();
            updateDeveloperReview();
        });
        input.addEventListener('change', () => {
            syncDeveloperFormState();
            updateDeveloperReview();
        });
    });

    if (elements.addDevEnvVarBtn) {
        elements.addDevEnvVarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addDeveloperEnvVar();
        });
    }

    if (elements.developerEnvRows) {
        elements.developerEnvRows.addEventListener('click', (e) => {
            if (!e.target.closest('.remove-dev-env')) return;
            const row = e.target.closest('.developer-env-row');
            const idx = Number(row?.dataset.index || -1);
            if (idx >= 0) {
                state.developer.envVars.splice(idx, 1);
                renderDeveloperEnvRows();
                updateDeveloperReview();
            }
        });

        elements.developerEnvRows.addEventListener('input', (e) => {
            const row = e.target.closest('.developer-env-row');
            const idx = Number(row?.dataset.index || -1);
            if (idx < 0 || !state.developer.envVars[idx]) return;
            if (e.target.classList.contains('dev-env-key')) state.developer.envVars[idx].key = e.target.value;
            if (e.target.classList.contains('dev-env-value')) state.developer.envVars[idx].value = e.target.value;
            if (e.target.classList.contains('dev-env-secret')) state.developer.envVars[idx].secret = e.target.checked;
            updateDeveloperReview();
        });

        elements.developerEnvRows.addEventListener('change', (e) => {
            if (!e.target.classList.contains('dev-env-secret')) return;
            const row = e.target.closest('.developer-env-row');
            const idx = Number(row?.dataset.index || -1);
            if (idx >= 0 && state.developer.envVars[idx]) {
                state.developer.envVars[idx].secret = e.target.checked;
                updateDeveloperReview();
            }
        });
    }

    if (elements.developerPreviewBtn) {
        elements.developerPreviewBtn.addEventListener('click', () => {
            syncDeveloperFormState();
            renderDeveloperManifestPreview();
        });
    }

    if (elements.developerDeployBtn) {
        elements.developerDeployBtn.addEventListener('click', () => {
            syncDeveloperFormState();
            if (!validateDeveloperDeploy()) return;
            showNotification(`Deploy started: ${state.developer.appName} -> ${state.developer.cluster}/${state.developer.namespace}`, 'success');
        });
    }

    if (!state.developer.envVars.length) {
        addDeveloperEnvVar('APP_ENV', 'staging', false);
    }

    syncDeveloperFormState();
    updateDeveloperReview();
}

function syncDeveloperFormState() {
    state.developer.appName = elements.devAppName?.value?.trim() || '';
    state.developer.repoUrl = elements.devRepoUrl?.value?.trim() || '';
    state.developer.cluster = elements.devTargetCluster?.value || '';
    state.developer.namespace = elements.devNamespace?.value?.trim() || '';
    state.developer.cpuRequest = Number(elements.devCpuRequest?.value || 500);
    state.developer.memoryRequest = Number(elements.devMemoryRequest?.value || 512);
    state.developer.enableDb = !!elements.devEnableDb?.checked;
    state.developer.enableRedis = !!elements.devEnableRedis?.checked;
    state.developer.enableQueue = !!elements.devEnableQueue?.checked;
}

function addDeveloperEnvVar(key = '', value = '', secret = false) {
    state.developer.envVars.push({ key, value, secret });
    renderDeveloperEnvRows();
    updateDeveloperReview();
}

function renderDeveloperEnvRows() {
    if (!elements.developerEnvRows) return;
    elements.developerEnvRows.innerHTML = '';
    state.developer.envVars.forEach((env, idx) => {
        const row = document.createElement('div');
        row.className = 'developer-env-row';
        row.dataset.index = String(idx);
        row.innerHTML = `
            <input class="dev-env-key" type="text" placeholder="KEY" value="${escapeHtml(env.key)}">
            <input class="dev-env-value" type="text" placeholder="value" value="${escapeHtml(env.value)}">
            <label><input class="dev-env-secret" type="checkbox" ${env.secret ? 'checked' : ''}> Secret</label>
            <button class="btn btn-secondary btn-sm remove-dev-env" type="button"><i class="fas fa-trash"></i></button>
        `;
        elements.developerEnvRows.appendChild(row);
    });
}

function updateDeveloperReview() {
    if (!elements.developerReviewBox) return;
    const infra = [
        state.developer.enableDb ? 'PostgreSQL' : null,
        state.developer.enableRedis ? 'Redis' : null,
        state.developer.enableQueue ? 'Queue' : null
    ].filter(Boolean);
    const safeEnv = state.developer.envVars
        .filter(e => e.key)
        .map(e => `${e.key}=${e.secret ? '***' : (e.value || '')}`)
        .join(', ');

    elements.developerReviewBox.innerHTML = `
        <strong>Review</strong><br>
        Template: ${escapeHtml(elements.devSelectedTemplate?.value || '')}<br>
        App: ${escapeHtml(state.developer.appName || '-') }<br>
        Target: ${escapeHtml(state.developer.cluster || '-')} / ${escapeHtml(state.developer.namespace || '-')}<br>
        Resources: CPU ${state.developer.cpuRequest}m, Memory ${state.developer.memoryRequest}Mi<br>
        Infra: ${infra.length ? infra.join(', ') : 'none'}<br>
        Env: ${safeEnv || 'none'}
    `;
}

function renderDeveloperManifestPreview() {
    const name = state.developer.appName || 'sample-app';
    const ns = state.developer.namespace || 'apps';
    const cpu = state.developer.cpuRequest;
    const memory = state.developer.memoryRequest;
    const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const env = state.developer.envVars
        .filter(v => v.key)
        .map(v => `            - name: ${v.key}\n              value: ${v.secret ? '"***"' : `"${(v.value || '').replace(/"/g, '\\"')}"`}`)
        .join('\n');

    const yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${slug}
  namespace: ${ns}
  labels:
    app.kubernetes.io/managed-by: nullus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${slug}
  template:
    metadata:
      labels:
        app: ${slug}
    spec:
      containers:
        - name: ${slug}
          image: ${slug}:latest
          resources:
            requests:
              cpu: "${cpu}m"
              memory: "${memory}Mi"
${env ? `          env:\n${env}\n` : ''}---
apiVersion: v1
kind: Service
metadata:
  name: ${slug}-svc
  namespace: ${ns}
spec:
  selector:
    app: ${slug}
  ports:
    - port: 80
      targetPort: 8080`;

    const modal = document.getElementById('k8sPreviewModal');
    const content = document.getElementById('k8sPreviewContent');
    if (!modal || !content) return;
    content.textContent = yaml;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    showNotification('Developer manifest preview generated', 'info');
}

function validateDeveloperDeploy() {
    if (!state.developer.selectedTemplate) {
        showNotification('Choose a template first', 'error');
        return false;
    }
    if (!state.developer.appName) {
        showNotification('App name is required', 'error');
        return false;
    }
    if (!state.developer.cluster || !state.developer.namespace) {
        showNotification('Target cluster and namespace are required', 'error');
        return false;
    }
    return true;
}

function escapeHtml(text) {
    return String(text || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

// ============================================
// 기능 0: Organization 저장 (데모)
// ============================================
function saveOrganization() {
    const name = document.getElementById('orgName')?.value;
    showNotification(`Organization "${name}" saved successfully.`, 'success');
}

// ============================================
// 기능 4+6: Deployment History helpers
// ============================================
let rollbackTarget = null;

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
        // Nullus Stack logs
        'ns-v2': [
            '<span style="color:#6ee7b7;">[2026-03-01 10:58:00] INFO</span>  Starting Nullus platform upgrade v0.2.0 → v0.2.1...',
            '<span style="color:#6ee7b7;">[2026-03-01 10:59:10] INFO</span>  Applying CVE-2026-1234 security patch',
            '<span style="color:#6ee7b7;">[2026-03-01 11:02:00] INFO</span>  Nullus core pod restarted successfully',
            '<span style="color:#6ee7b7;">[2026-03-01 11:06:00] INFO</span>  Health check passed: nullus-core Running',
            '<span style="color:#6ee7b7;">[2026-03-01 11:08:00] INFO</span>  Nullus v0.2.1 upgrade complete ✓',
        ],
        'ns-v1': [
            '<span style="color:#6ee7b7;">[2026-02-20 09:58:00] INFO</span>  Starting Nullus platform initial install v0.2.0...',
            '<span style="color:#6ee7b7;">[2026-02-20 10:02:00] INFO</span>  Helm install nullus-core complete',
            '<span style="color:#6ee7b7;">[2026-02-20 10:08:00] INFO</span>  Database migration complete',
            '<span style="color:#6ee7b7;">[2026-02-20 10:15:00] INFO</span>  Nullus v0.2.0 install complete ✓',
        ],
        // DevSecOps Stack logs
        v3: [
            '<span style="color:#6ee7b7;">[2026-03-02 14:28:00] INFO</span>  Starting stack deployment v3...',
            '<span style="color:#6ee7b7;">[2026-03-02 14:28:05] INFO</span>  Upgrading Grafana: 10.2 → 10.3',
            '<span style="color:#6ee7b7;">[2026-03-02 14:35:20] INFO</span>  Helm upgrade grafana-stack complete',
            '<span style="color:#6ee7b7;">[2026-03-02 14:35:30] INFO</span>  Health check passed: Grafana pod Running',
            '<span style="color:#6ee7b7;">[2026-03-02 15:10:00] INFO</span>  Stack deployment v3 complete ✓',
        ],
        v2: [
            '<span style="color:#6ee7b7;">[2026-02-28 09:10:00] INFO</span>  Starting stack deployment v2...',
            '<span style="color:#6ee7b7;">[2026-02-28 09:12:00] INFO</span>  Installing MinIO storage backend',
            '<span style="color:#6ee7b7;">[2026-02-28 09:30:00] INFO</span>  Helm install minio complete',
            '<span style="color:#6ee7b7;">[2026-02-28 09:31:00] INFO</span>  Migrating storage config: S3 → MinIO',
            '<span style="color:#6ee7b7;">[2026-02-28 10:08:00] INFO</span>  Stack deployment v2 complete ✓',
        ],
        v1: [
            '<span style="color:#6ee7b7;">[2026-02-20 15:58:00] INFO</span>  Starting stack deployment v1...',
            '<span style="color:#fca5a5;">[2026-02-20 16:05:00] ERROR</span> Argo CD pod CrashLoopBackOff: ImagePullBackOff',
            '<span style="color:#fca5a5;">[2026-02-20 16:08:00] ERROR</span> Health check failed: argocd-server not ready',
            '<span style="color:#fca5a5;">[2026-02-20 16:10:00] WARN</span>  Initiating auto-rollback...',
            '<span style="color:#fca5a5;">[2026-02-20 16:12:00] INFO</span>  Rollback complete. Cluster restored to previous state.',
        ],
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

// ============================================
// 기능 7: Monitoring bar chart rendering
// ============================================
function renderMonitoringBars() {
    const bars = document.querySelectorAll('#monitoringPage [data-bar]');
    bars.forEach(bar => {
        bar.style.height = bar.getAttribute('data-bar');
    });
}

// ============================================
// 기능 9: User role update (데모)
// ============================================
function updateUserRole(selectEl, userId) {
    showNotification(`Role updated for user ${userId}: ${selectEl.value}`, 'success');
}

// ============================================
// 기능 5: Developer template category filter
// ============================================
function filterDevTemplates(category, btn) {
    // Update active button
    document.querySelectorAll('.template-category-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    document.querySelectorAll('#developerTemplateGrid .developer-template-card').forEach(card => {
        if (category === 'all' || card.dataset.type === category) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// Initialize all new features
// ============================================
(function initNewFeatures() {
    const origInit = window.addEventListener ? null : null;
    document.addEventListener('DOMContentLoaded', () => {
        initRoleSwitcher();
        applyRole('admin'); // proto4: 초기 역할 Admin, organization 페이지로 전환
        initTemplatePresets();
        initTemplatesPageActions();
        initExportConfig();
        initK8sPreview();
        initDeveloperExperience();
        initSidebarToggle();
        initThemeToggle();
        initI18n();
        initClusterListDetail();
        initStackListDetail();

        // Inject template-category-btn styles
        const style = document.createElement('style');
        style.textContent = `
            .template-category-btn {
                padding: 7px 16px;
                border: 1.5px solid #e5e7eb;
                border-radius: 20px;
                background: #fff;
                color: #6b7280;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.18s;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .template-category-btn.active,
            .template-category-btn:hover {
                background: #6366f1;
                color: #fff;
                border-color: #6366f1;
            }
        `;
        document.head.appendChild(style);
    });
})();

// Sidebar collapse/expand toggle
function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    if (!toggleBtn) return;

    const STORAGE_KEY = 'nullus_sidebar_collapsed';
    // Restore saved state
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
        document.body.classList.add('sidebar-collapsed');
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
        localStorage.setItem(STORAGE_KEY, document.body.classList.contains('sidebar-collapsed'));
    });
}
window.initSidebarToggle = initSidebarToggle;

// Theme (light/dark) toggle
function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const STORAGE_KEY = 'nullus_theme';
    if (localStorage.getItem(STORAGE_KEY) === 'light') {
        document.body.classList.add('light-mode');
        btn.querySelector('i').className = 'fas fa-moon';
    }
    btn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        btn.querySelector('i').className = isLight ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
    });
}
window.initThemeToggle = initThemeToggle;

// i18n (en/ko) 언어 전환
function initI18n() {
    if (typeof i18n === 'undefined') return;
    i18n.apply();
    const label = document.getElementById('langLabel');
    if (label) label.textContent = (i18n.locale || 'ko').toUpperCase();
    const dropdown = document.getElementById('langDropdown');
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown?.classList.toggle('open');
        });
        document.addEventListener('click', () => dropdown?.classList.remove('open'));
        langMenu.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = opt.dataset.lang;
                if (lang) i18n.setLocale(lang);
                dropdown?.classList.remove('open');
            });
        });
    }
}
window.initI18n = initI18n;

// 클러스터 목록+상세 패널 (CLU_010_020, CLU_010_030)
function initClusterListDetail() {
    document.querySelectorAll('.cluster-list-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.cluster-list-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderClusterDetail(item.dataset.clusterId);
        });
    });
    document.addEventListener('click', (e) => {
        if (e.target.closest('#registerClusterBtn2')) {
            e.preventDefault();
            if (typeof openClusterModal === 'function') openClusterModal();
        }
    });
}

// CI/CD History filter
function filterCicdHistory() {
    const typeFilter = document.getElementById('cicdHistoryTypeFilter')?.value || 'all';
    const statusFilter = document.getElementById('cicdHistoryStatusFilter')?.value || 'all';

    document.querySelectorAll('.cicd-history-item').forEach(item => {
        const matchType = typeFilter === 'all' || item.dataset.type === typeFilter;
        const matchStatus = statusFilter === 'all' || item.dataset.status === statusFilter;
        item.style.display = (matchType && matchStatus) ? '' : 'none';
    });
}
window.filterCicdHistory = filterCicdHistory;

// CI/CD Template filter
function filterCicdTemplates(value) {
    const query = (value || '').toLowerCase();
    document.querySelectorAll('.cicd-template-card').forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        card.style.display = name.includes(query) ? '' : 'none';
    });
}
window.filterCicdTemplates = filterCicdTemplates;

// Stack List filter
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
    // Delegate to new tab-based stack detail (defined in pages/stack-list.js)
    var item = document.querySelector('[data-stack-id="' + stackId + '"]');
    if (item && typeof selectStackItem === 'function') {
        selectStackItem(item);
    } else {
        // Fallback: just show content panel
        var placeholder = document.getElementById('stackDetailPlaceholder');
        var content = document.getElementById('stackDetailContent');
        var titleEl = document.getElementById('stackDetailTitle');
        var data = stackDataMap[stackId];
        if (!data || !placeholder || !content) return;
        placeholder.style.display = 'none';
        content.style.display = 'flex';
        if (titleEl) titleEl.textContent = data.name;
    }
}

function initStackListDetail() {
    document.querySelectorAll('.stack-list-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.stack-list-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderStackDetail(item.dataset.stackId);
        });
    });
    var first = document.querySelector('.stack-list-item.active');
    if (first) renderStackDetail(first.dataset.stackId);
}
window.filterStackList = filterStackList;

// CI/CD List filter
function filterCicdList(value) {
    const query = (value !== undefined ? value : (document.getElementById('cicdListSearch')?.value || '')).toLowerCase();
    const statusFilter = document.getElementById('cicdListStatusFilter')?.value || 'all';

    document.querySelectorAll('.cicd-list-card').forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const status = (card.dataset.status || '').toLowerCase();
        const matchName = name.includes(query);
        const matchStatus = statusFilter === 'all' || status === statusFilter;
        card.style.display = (matchName && matchStatus) ? '' : 'none';
    });
}
window.filterCicdList = filterCicdList;
