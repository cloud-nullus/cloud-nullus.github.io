(function () {
    var ws = document.body;
    var el = document.createElement('div');
    el.innerHTML = `
<div class="page-content" id="listPage">
    <div class="stack-list-detail-layout">

        <!-- ── Left: Stack List ── -->
        <div class="stack-list-panel">
            <div class="list-header">
                <h3 class="panel-title" data-i18n="stack.list">스택 목록</h3>
                <button class="btn btn-primary btn-sm" onclick="switchPage('templates')">
                    <i class="fas fa-plus"></i> <span data-i18n="stack.newStack">신규 스택</span>
                </button>
            </div>
            <div class="stack-list-filters">
                <input type="text" id="stackListSearch" class="stack-search-input"
                    placeholder="스택 검색..." oninput="filterStackList(this.value)">
                <select id="stackListStatusFilter" class="stack-status-filter" onchange="filterStackList()">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="building">Building</option>
                    <option value="failed">Failed</option>
                </select>
            </div>
            <div class="stack-list-items" id="stackListItems">
                <div class="stack-list-item active" data-stack-id="production-stack"
                    data-name="production devsecops gitlab argocd" data-status="active"
                    onclick="selectStackItem(this)">
                    <div class="stack-item-icon" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);">
                        <i class="fab fa-gitlab"></i></div>
                    <div class="stack-item-info">
                        <div class="stack-item-name">production-stack</div>
                        <div class="stack-item-meta">GitLab CI/CD · ArgoCD · Harbor</div>
                    </div>
                    <span class="stack-item-status status-active">ACTIVE</span>
                </div>
                <div class="stack-list-item" data-stack-id="development-stack"
                    data-name="development stack github flux" data-status="building"
                    onclick="selectStackItem(this)">
                    <div class="stack-item-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);">
                        <i class="fab fa-github"></i></div>
                    <div class="stack-item-info">
                        <div class="stack-item-name">development-stack</div>
                        <div class="stack-item-meta">GitHub Actions · Flux · Snyk</div>
                    </div>
                    <span class="stack-item-status status-building"><i class="fas fa-spinner fa-spin"></i> BUILDING</span>
                </div>
                <div class="stack-list-item" data-stack-id="staging-environment"
                    data-name="staging environment jenkins spinnaker" data-status="failed"
                    onclick="selectStackItem(this)">
                    <div class="stack-item-icon" style="background:linear-gradient(135deg,#6b7280,#374151);">
                        <i class="fas fa-infinity"></i></div>
                    <div class="stack-item-info">
                        <div class="stack-item-name">staging-environment</div>
                        <div class="stack-item-meta">Jenkins · Spinnaker · SonarQube</div>
                    </div>
                    <span class="stack-item-status status-failed">FAILED</span>
                </div>
                <div class="stack-list-item" data-stack-id="microservices-platform"
                    data-name="microservices platform gitlab istio" data-status="active"
                    onclick="selectStackItem(this)">
                    <div class="stack-item-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706);">
                        <i class="fas fa-network-wired"></i></div>
                    <div class="stack-item-info">
                        <div class="stack-item-name">microservices-platform</div>
                        <div class="stack-item-meta">GitLab CI/CD · Istio · Jaeger</div>
                    </div>
                    <span class="stack-item-status status-active">ACTIVE</span>
                </div>
                <div class="stack-list-item" data-stack-id="ml-ai-pipeline"
                    data-name="ml ai pipeline mlflow kubeflow" data-status="active"
                    onclick="selectStackItem(this)">
                    <div class="stack-item-icon" style="background:linear-gradient(135deg,#10b981,#059669);">
                        <i class="fas fa-brain"></i></div>
                    <div class="stack-item-info">
                        <div class="stack-item-name">ml-ai-pipeline</div>
                        <div class="stack-item-meta">MLflow · Kubeflow · MinIO</div>
                    </div>
                    <span class="stack-item-status status-active">ACTIVE</span>
                </div>
            </div>
        </div>

        <!-- ── Right: Stack Detail ── -->
        <div class="stack-detail-panel">

            <!-- Placeholder -->
            <div id="stackDetailPlaceholder" class="stack-detail-placeholder">
                <i class="fas fa-cubes"></i>
                <p data-i18n="stack.detail">스택 상세</p>
                <span data-i18n="stack.selectPrompt">목록에서 스택을 선택하세요</span>
            </div>

            <!-- Detail Content -->
            <div id="stackDetailContent" class="stack-detail-content" style="display:none;flex-direction:column;height:100%;">

                <!-- Header -->
                <div class="stack-detail-header" style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e5e7eb;flex-shrink:0;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div id="stackDetailIconEl" style="width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);"></div>
                        <h3 class="stack-detail-title" id="stackDetailTitle" style="margin:0;font-size:16px;font-weight:700;"></h3>
                        <span id="stackDetailStatusBadge"></span>
                    </div>
                    <button class="btn btn-primary" id="stackInfoSaveBtn" style="display:none;"
                        onclick="alert('Stack 설정이 저장되었습니다.')">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>

                <!-- Inner Tab Bar -->
                <div class="stack-inner-tabs" style="display:flex;gap:0;border-bottom:1px solid #e5e7eb;flex-shrink:0;">
                    <button class="stack-inner-tab active" data-stab="info" onclick="switchStackTab(this,'info')">
                        <i class="fas fa-info-circle"></i> Info
                    </button>
                    <button class="stack-inner-tab" data-stab="monitoring" onclick="switchStackTab(this,'monitoring')">
                        <i class="fas fa-chart-bar"></i> Monitoring
                    </button>
                    <button class="stack-inner-tab" data-stab="history" onclick="switchStackTab(this,'history')">
                        <i class="fas fa-history"></i> History
                    </button>
                    <button class="stack-inner-tab" data-stab="version-upgrade" onclick="switchStackTab(this,'version-upgrade')">
                        <i class="fas fa-arrow-circle-up"></i> Version Upgrade
                    </button>
                </div>

                <!-- ── Tab: Info ── -->
                <div class="stack-tab-pane" id="stackTab-info" style="display:flex;flex-direction:column;flex:1;overflow:hidden;">
                    <!-- Info sub-tabs -->
                    <div class="config-tabs" style="flex-shrink:0;border-radius:0;border-bottom:1px solid #e5e7eb;padding:0 16px;">
                        <div class="tab active" data-stab="artifacts" onclick="switchStackInfoTab(this,'artifacts')">
                            <i class="fas fa-box"></i><span>Artifacts</span>
                        </div>
                        <div class="tab" data-stab="pipeline-tools" onclick="switchStackInfoTab(this,'pipeline-tools')">
                            <i class="fas fa-project-diagram"></i><span>Pipeline Tools</span>
                        </div>
                        <div class="tab" data-stab="monitoring-tools" onclick="switchStackInfoTab(this,'monitoring-tools')">
                            <i class="fas fa-chart-line"></i><span>Monitoring Tools</span>
                        </div>
                        <div class="tab" data-stab="logging-tools" onclick="switchStackInfoTab(this,'logging-tools')">
                            <i class="fas fa-file-alt"></i><span>Logging Tools</span>
                        </div>
                        <div class="tab" data-stab="resources" onclick="switchStackInfoTab(this,'resources')">
                            <i class="fas fa-server"></i><span>Resources</span>
                        </div>
                    </div>

                    <!-- Artifacts -->
                    <div class="panel stack-info-subpanel" id="sinfo-artifacts" style="overflow-y:auto;flex:1;display:block;">
                        <div class="panel-header">
                            <h3>Artifact Configuration</h3>
                            <p>현재 스택에 구성된 아티팩트 저장소</p>
                        </div>
                        <div class="config-grid">
                            <div class="config-card">
                                <div class="card-header"><i class="fas fa-archive"></i><h4>Package Registry</h4></div>
                                <div class="card-content">
                                    <div class="tool-selection-group">
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-pkg" value="gitlab" checked>
                                                <div class="tool-info">
                                                    <span class="tool-title">GitLab Package Registry</span>
                                                    <span class="tool-desc">Default integrated solution</span>
                                                </div>
                                            </label>
                                            <div class="tool-config-row">
                                                <div class="version-selector">
                                                    <select class="version-dropdown">
                                                        <option>v16.7 (Latest)</option><option>v16.6</option><option>v15.11 (LTS)</option>
                                                    </select>
                                                </div>
                                                <div class="instance-config">
                                                    <label class="instance-label">Instances:</label>
                                                    <div class="instance-controls">
                                                        <button type="button" class="instance-btn decrease">-</button>
                                                        <input type="number" class="instance-count" value="1" min="1" max="3">
                                                        <button type="button" class="instance-btn increase">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-pkg" value="nexus">
                                                <div class="tool-info">
                                                    <span class="tool-title">Nexus Repository</span>
                                                    <span class="tool-desc">Enterprise artifact management</span>
                                                </div>
                                            </label>
                                            <div class="tool-config-row">
                                                <div class="version-selector">
                                                    <select class="version-dropdown" disabled><option>v3.45.0 (Latest)</option></select>
                                                </div>
                                                <div class="instance-config">
                                                    <label class="instance-label">Instances:</label>
                                                    <div class="instance-controls">
                                                        <button type="button" class="instance-btn decrease" disabled>-</button>
                                                        <input type="number" class="instance-count" value="1" min="1" max="3" disabled>
                                                        <button type="button" class="instance-btn increase" disabled>+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="config-card">
                                <div class="card-header"><i class="fas fa-code-branch"></i><h4>Source Code Repository</h4></div>
                                <div class="card-content">
                                    <div class="tool-selection-group">
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-scm" value="gitlab" checked>
                                                <div class="tool-info">
                                                    <span class="tool-title">GitLab</span>
                                                    <span class="tool-desc">Complete DevOps platform</span>
                                                </div>
                                            </label>
                                            <div class="tool-config-row">
                                                <div class="version-selector">
                                                    <select class="version-dropdown"><option>v16.7</option><option>v16.6</option></select>
                                                </div>
                                                <div class="instance-config">
                                                    <label class="instance-label">Instances:</label>
                                                    <div class="instance-controls">
                                                        <button type="button" class="instance-btn decrease">-</button>
                                                        <input type="number" class="instance-count" value="1" min="1" max="3">
                                                        <button type="button" class="instance-btn increase">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-scm" value="github">
                                                <div class="tool-info">
                                                    <span class="tool-title">GitHub</span>
                                                    <span class="tool-desc">Cloud-based repository</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="config-card">
                                <div class="card-header"><i class="fab fa-docker"></i><h4>Container Registry</h4></div>
                                <div class="card-content">
                                    <div class="tool-selection-group">
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-cr" value="harbor" checked>
                                                <div class="tool-info">
                                                    <span class="tool-title">Harbor</span>
                                                    <span class="tool-desc">Enterprise container registry</span>
                                                </div>
                                            </label>
                                            <div class="tool-config-row">
                                                <div class="version-selector">
                                                    <select class="version-dropdown"><option>v2.8.2</option><option>v2.7.4</option></select>
                                                </div>
                                                <div class="instance-config">
                                                    <label class="instance-label">Instances:</label>
                                                    <div class="instance-controls">
                                                        <button type="button" class="instance-btn decrease">-</button>
                                                        <input type="number" class="instance-count" value="1" min="1" max="3">
                                                        <button type="button" class="instance-btn increase">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-cr" value="ecr">
                                                <div class="tool-info">
                                                    <span class="tool-title">AWS ECR</span>
                                                    <span class="tool-desc">Amazon Elastic Container Registry</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pipeline Tools -->
                    <div class="panel stack-info-subpanel" id="sinfo-pipeline-tools" style="display:none;overflow-y:auto;flex:1;">
                        <div class="panel-header"><h3>Pipeline Tools</h3><p>현재 스택의 CI/CD 파이프라인 도구 구성</p></div>
                        <div class="config-grid">
                            <div class="config-card">
                                <div class="card-header"><i class="fas fa-project-diagram"></i><h4>CI/CD Platform</h4></div>
                                <div class="card-content">
                                    <div class="tool-selection-group">
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-ci" value="gitlab-ci" checked>
                                                <div class="tool-info">
                                                    <span class="tool-title">GitLab CI/CD</span>
                                                    <span class="tool-desc">Integrated with GitLab SCM</span>
                                                </div>
                                            </label>
                                            <div class="tool-config-row">
                                                <div class="version-selector">
                                                    <select class="version-dropdown"><option>v16.7</option></select>
                                                </div>
                                                <div class="instance-config">
                                                    <label class="instance-label">Instances:</label>
                                                    <div class="instance-controls">
                                                        <button type="button" class="instance-btn decrease">-</button>
                                                        <input type="number" class="instance-count" value="2" min="1" max="5">
                                                        <button type="button" class="instance-btn increase">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-ci" value="jenkins">
                                                <div class="tool-info">
                                                    <span class="tool-title">Jenkins</span>
                                                    <span class="tool-desc">Open-source automation server</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="config-card">
                                <div class="card-header"><i class="fas fa-rocket"></i><h4>Continuous Deployment</h4></div>
                                <div class="card-content">
                                    <div class="tool-selection-group">
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-cd" value="argocd" checked>
                                                <div class="tool-info">
                                                    <span class="tool-title">Argo CD</span>
                                                    <span class="tool-desc">GitOps CD for Kubernetes</span>
                                                </div>
                                            </label>
                                            <div class="tool-config-row">
                                                <div class="version-selector">
                                                    <select class="version-dropdown"><option>v2.9.3</option><option>v2.8.4</option></select>
                                                </div>
                                                <div class="instance-config">
                                                    <label class="instance-label">Instances:</label>
                                                    <div class="instance-controls">
                                                        <button type="button" class="instance-btn decrease">-</button>
                                                        <input type="number" class="instance-count" value="1" min="1" max="3">
                                                        <button type="button" class="instance-btn increase">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-cd" value="flux">
                                                <div class="tool-info">
                                                    <span class="tool-title">Flux</span>
                                                    <span class="tool-desc">GitOps toolkit for Kubernetes</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Monitoring Tools -->
                    <div class="panel stack-info-subpanel" id="sinfo-monitoring-tools" style="display:none;overflow-y:auto;flex:1;">
                        <div class="panel-header"><h3>Monitoring Tools</h3><p>현재 스택의 모니터링 도구 구성</p></div>
                        <div class="config-grid">
                            <div class="config-card">
                                <div class="card-header"><i class="fas fa-chart-line"></i><h4>Metrics Collection</h4></div>
                                <div class="card-content">
                                    <div class="tool-selection-group">
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-metrics" value="prometheus" checked>
                                                <div class="tool-info">
                                                    <span class="tool-title">Prometheus</span>
                                                    <span class="tool-desc">Time-series metrics collection</span>
                                                </div>
                                            </label>
                                            <div class="tool-config-row">
                                                <div class="version-selector">
                                                    <select class="version-dropdown"><option>v2.48.1</option></select>
                                                </div>
                                                <div class="instance-config">
                                                    <label class="instance-label">Instances:</label>
                                                    <div class="instance-controls">
                                                        <button type="button" class="instance-btn decrease">-</button>
                                                        <input type="number" class="instance-count" value="1" min="1" max="3">
                                                        <button type="button" class="instance-btn increase">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-metrics" value="thanos">
                                                <div class="tool-info">
                                                    <span class="tool-title">Thanos</span>
                                                    <span class="tool-desc">Long-term metrics storage</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="config-card">
                                <div class="card-header"><i class="fas fa-tachometer-alt"></i><h4>Visualization</h4></div>
                                <div class="card-content">
                                    <div class="tool-selection-group">
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-viz" value="grafana" checked>
                                                <div class="tool-info">
                                                    <span class="tool-title">Grafana</span>
                                                    <span class="tool-desc">Dashboard &amp; visualization</span>
                                                </div>
                                            </label>
                                            <div class="tool-config-row">
                                                <div class="version-selector">
                                                    <select class="version-dropdown"><option>v10.3</option><option>v10.2</option></select>
                                                </div>
                                                <div class="instance-config">
                                                    <label class="instance-label">Instances:</label>
                                                    <div class="instance-controls">
                                                        <button type="button" class="instance-btn decrease">-</button>
                                                        <input type="number" class="instance-count" value="1" min="1" max="3">
                                                        <button type="button" class="instance-btn increase">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-viz" value="datadog">
                                                <div class="tool-info">
                                                    <span class="tool-title">Datadog</span>
                                                    <span class="tool-desc">Cloud monitoring platform</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Logging Tools -->
                    <div class="panel stack-info-subpanel" id="sinfo-logging-tools" style="display:none;overflow-y:auto;flex:1;">
                        <div class="panel-header"><h3>Logging Tools</h3><p>현재 스택의 로깅 도구 구성</p></div>
                        <div class="config-grid">
                            <div class="config-card">
                                <div class="card-header"><i class="fas fa-file-alt"></i><h4>Log Collection</h4></div>
                                <div class="card-content">
                                    <div class="tool-selection-group">
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-log" value="loki" checked>
                                                <div class="tool-info">
                                                    <span class="tool-title">Loki</span>
                                                    <span class="tool-desc">Log aggregation system</span>
                                                </div>
                                            </label>
                                            <div class="tool-config-row">
                                                <div class="version-selector">
                                                    <select class="version-dropdown"><option>v2.9.3</option></select>
                                                </div>
                                                <div class="instance-config">
                                                    <label class="instance-label">Instances:</label>
                                                    <div class="instance-controls">
                                                        <button type="button" class="instance-btn decrease">-</button>
                                                        <input type="number" class="instance-count" value="1" min="1" max="3">
                                                        <button type="button" class="instance-btn increase">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tool-option">
                                            <label class="tool-checkbox">
                                                <input type="checkbox" name="si-log" value="opensearch">
                                                <div class="tool-info">
                                                    <span class="tool-title">OpenSearch</span>
                                                    <span class="tool-desc">Search and analytics engine</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Resources -->
                    <div class="panel stack-info-subpanel" id="sinfo-resources" style="display:none;overflow-y:auto;flex:1;">
                        <div class="panel-header"><h3>Resources</h3><p>현재 스택의 리소스 할당 현황</p></div>
                        <div style="padding:20px;">
                            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
                                <div class="compare-card available" style="padding:20px;text-align:center;">
                                    <h4 style="margin:0 0 8px;">CPU</h4>
                                    <div style="font-size:28px;font-weight:700;color:#6366f1;">8 <span style="font-size:14px;color:#9ca3af;">cores</span></div>
                                    <div style="font-size:12px;color:#6b7280;margin-top:4px;">할당된 CPU</div>
                                </div>
                                <div class="compare-card available" style="padding:20px;text-align:center;">
                                    <h4 style="margin:0 0 8px;">Memory</h4>
                                    <div style="font-size:28px;font-weight:700;color:#10b981;">32 <span style="font-size:14px;color:#9ca3af;">Gi</span></div>
                                    <div style="font-size:12px;color:#6b7280;margin-top:4px;">할당된 메모리</div>
                                </div>
                                <div class="compare-card available" style="padding:20px;text-align:center;">
                                    <h4 style="margin:0 0 8px;">Storage</h4>
                                    <div style="font-size:28px;font-weight:700;color:#f59e0b;">500 <span style="font-size:14px;color:#9ca3af;">Gi</span></div>
                                    <div style="font-size:12px;color:#6b7280;margin-top:4px;">할당된 스토리지</div>
                                </div>
                            </div>
                            <div style="background:#f9fafb;border-radius:8px;padding:16px;border:1px solid #e5e7eb;">
                                <h4 style="margin:0 0 12px;font-size:14px;color:#374151;"><i class="fas fa-server"></i> Cluster 정보</h4>
                                <div style="display:flex;gap:24px;font-size:13px;color:#4b5563;flex-wrap:wrap;">
                                    <div><strong>Cluster:</strong> prod-k8s</div>
                                    <div><strong>Namespace:</strong> devops</div>
                                    <div><strong>Region:</strong> ap-northeast-2</div>
                                    <div><strong>Node Count:</strong> 6</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!-- /stackTab-info -->

                <!-- ── Tab: Monitoring ── -->
                <div class="stack-tab-pane" id="stackTab-monitoring" style="display:none;flex-direction:column;flex:1;overflow-y:auto;">
                    <div style="padding:16px 24px 0;">
                        <div class="list-controls" style="margin-bottom:16px;">
                            <select style="padding:8px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;background:#0f1419;">
                                <option>Last 1 hour</option>
                                <option selected>Last 24 hours</option>
                                <option>Last 7 days</option>
                            </select>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;">
                            <div class="pipeline-card" style="padding:20px;text-align:center;">
                                <div style="font-size:28px;font-weight:700;color:#6366f1;">68<span style="font-size:16px;color:#9ca3af;">%</span></div>
                                <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-microchip" style="color:#6366f1;"></i> CPU Usage</div>
                                <div style="height:6px;background:#e5e7eb;border-radius:99px;margin-top:10px;"><div style="height:6px;width:68%;background:#6366f1;border-radius:99px;"></div></div>
                            </div>
                            <div class="pipeline-card" style="padding:20px;text-align:center;">
                                <div style="font-size:28px;font-weight:700;color:#10b981;">42<span style="font-size:16px;color:#9ca3af;">%</span></div>
                                <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-memory" style="color:#10b981;"></i> Memory Usage</div>
                                <div style="height:6px;background:#e5e7eb;border-radius:99px;margin-top:10px;"><div style="height:6px;width:42%;background:#10b981;border-radius:99px;"></div></div>
                            </div>
                            <div class="pipeline-card" style="padding:20px;text-align:center;">
                                <div style="font-size:28px;font-weight:700;color:#f59e0b;">31<span style="font-size:16px;color:#9ca3af;">%</span></div>
                                <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-hdd" style="color:#f59e0b;"></i> Storage Usage</div>
                                <div style="height:6px;background:#e5e7eb;border-radius:99px;margin-top:10px;"><div style="height:6px;width:31%;background:#f59e0b;border-radius:99px;"></div></div>
                            </div>
                            <div class="pipeline-card" style="padding:20px;text-align:center;">
                                <div style="font-size:28px;font-weight:700;color:#059669;">97.3<span style="font-size:14px;color:#9ca3af;">%</span></div>
                                <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-check-circle" style="color:#059669;"></i> Pipeline Success</div>
                                <div style="height:6px;background:#e5e7eb;border-radius:99px;margin-top:10px;"><div style="height:6px;width:97.3%;background:#059669;border-radius:99px;"></div></div>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:24px;">
                            <div class="pipeline-card" style="padding:24px;">
                                <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;">Pipeline Runs (Last 24h)</h3>
                                <div style="display:flex;align-items:flex-end;gap:6px;height:100px;">
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:80%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">00</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:45%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">02</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:30%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">04</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:60%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">06</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:95%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">08</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:100%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">10</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:70%;background:#ef4444;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">12</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:88%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">14</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:75%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">16</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:92%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">18</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:55%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">20</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:40%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">22</span></div>
                                </div>
                            </div>
                            <div class="pipeline-card" style="padding:24px;">
                                <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;">Stack Tools Status</h3>
                                <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
                                    <div style="display:flex;justify-content:space-between;padding:8px 10px;background:#1e293b;border-radius:6px;"><span style="color:#e2e8f0;"><i class="fab fa-gitlab" style="color:#fc6d26;margin-right:6px;"></i>GitLab</span><span style="color:#6ee7b7;font-weight:600;"><i class="fas fa-check-circle"></i> Running</span></div>
                                    <div style="display:flex;justify-content:space-between;padding:8px 10px;background:#1e293b;border-radius:6px;"><span style="color:#e2e8f0;"><i class="fas fa-dharmachakra" style="color:#326ce5;margin-right:6px;"></i>Argo CD</span><span style="color:#6ee7b7;font-weight:600;"><i class="fas fa-check-circle"></i> Running</span></div>
                                    <div style="display:flex;justify-content:space-between;padding:8px 10px;background:#1e293b;border-radius:6px;"><span style="color:#e2e8f0;"><i class="fas fa-fire" style="color:#e6522c;margin-right:6px;"></i>Prometheus</span><span style="color:#6ee7b7;font-weight:600;"><i class="fas fa-check-circle"></i> Running</span></div>
                                    <div style="display:flex;justify-content:space-between;padding:8px 10px;background:#1e293b;border-radius:6px;"><span style="color:#e2e8f0;"><i class="fas fa-chart-pie" style="color:#f46800;margin-right:6px;"></i>Grafana</span><span style="color:#6ee7b7;font-weight:600;"><i class="fas fa-check-circle"></i> Running</span></div>
                                    <div style="display:flex;justify-content:space-between;padding:8px 10px;background:#1e293b;border-radius:6px;"><span style="color:#e2e8f0;"><i class="fas fa-anchor" style="color:#0f98c5;margin-right:6px;"></i>Harbor</span><span style="color:#6ee7b7;font-weight:600;"><i class="fas fa-check-circle"></i> Running</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!-- /stackTab-monitoring -->

                <!-- ── Tab: History ── -->
                <div class="stack-tab-pane" id="stackTab-history" style="display:none;flex-direction:column;flex:1;overflow-y:auto;">
                    <div style="padding:16px 24px 0;">
                        <div class="list-controls" style="margin-bottom:16px;">
                            <select style="padding:8px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;background:#0f1419;">
                                <option value="all">All Status</option>
                                <option value="success">Success</option>
                                <option value="failed">Failed</option>
                                <option value="rollback">Rolled Back</option>
                            </select>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
                            <div style="width:4px;height:22px;background:linear-gradient(135deg,#10b981,#059669);border-radius:2px;"></div>
                            <h3 style="margin:0;font-size:15px;font-weight:700;color:#e2e8f0;">DevSecOps Stack History</h3>
                        </div>
                        <!-- v3 current -->
                        <div class="pipeline-card" style="margin-bottom:12px;padding:0;overflow:hidden;">
                            <div style="padding:14px 20px;background:#1e293b;border-bottom:1px solid #bbf7d0;display:flex;align-items:center;justify-content:space-between;">
                                <div style="display:flex;align-items:center;gap:12px;">
                                    <span style="padding:3px 10px;background:#059669;color:#fff;border-radius:20px;font-size:12px;font-weight:700;">v3 · Current</span>
                                    <span style="font-weight:600;color:#94a3b8;font-size:14px;">GitLab CI + Argo CD + Prometheus + Grafana</span>
                                    <span style="padding:2px 8px;background:rgba(245,158,11,0.15);color:#fcd34d;border-radius:10px;font-size:11px;font-weight:600;">Tool Upgrade</span>
                                </div>
                                <div style="font-size:12px;color:#94a3b8;"><i class="fas fa-user"></i> admin@nullus.io &nbsp;<i class="fas fa-clock"></i> 2026-03-02 14:30</div>
                            </div>
                            <div style="padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                                <div style="display:flex;gap:20px;font-size:13px;">
                                    <span><strong style="color:#e2e8f0;">Reason:</strong> <span style="color:#94a3b8;">Grafana v10.2 → v10.3 upgrade</span></span>
                                    <span><strong style="color:#e2e8f0;">Duration:</strong> <span style="color:#94a3b8;">42 min</span></span>
                                    <span style="padding:2px 8px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:12px;font-weight:600;"><i class="fas fa-check-circle"></i> Success</span>
                                </div>
                                <div style="display:flex;gap:8px;">
                                    <button class="btn btn-secondary btn-sm" onclick="showDiff('v2','v3')"><i class="fas fa-code-branch"></i> Diff v2→v3</button>
                                    <button class="btn btn-secondary btn-sm" onclick="showDeployLogs('v3')"><i class="fas fa-terminal"></i> Logs</button>
                                </div>
                            </div>
                            <div id="diff-v2-v3" style="display:none;padding:0 20px 14px;">
                                <pre style="background:#1f2937;color:#e5e7eb;padding:14px;border-radius:8px;font-size:12px;overflow-x:auto;line-height:1.6;margin:0;"><span style="color:#6ee7b7;">+  monitoringQuery:\n+    tool: grafana\n+    version: "10.3"</span>
<span style="color:#fca5a5;">-  monitoringQuery:\n-    tool: grafana\n-    version: "10.2"</span></pre>
                            </div>
                        </div>
                        <!-- v2 -->
                        <div class="pipeline-card" style="margin-bottom:12px;padding:0;overflow:hidden;">
                            <div style="padding:14px 20px;background:#1e293b;border-bottom:1px solid #2d3748;display:flex;align-items:center;justify-content:space-between;">
                                <div style="display:flex;align-items:center;gap:12px;">
                                    <span style="padding:3px 10px;background:#6366f1;color:#fff;border-radius:20px;font-size:12px;font-weight:700;">v2</span>
                                    <span style="font-weight:600;color:#94a3b8;font-size:14px;">GitLab CI + Argo CD + Prometheus + Grafana</span>
                                    <span style="padding:2px 8px;background:#e0f2fe;color:#0369a1;border-radius:10px;font-size:11px;font-weight:600;">Config Change</span>
                                </div>
                                <div style="font-size:12px;color:#94a3b8;"><i class="fas fa-user"></i> kim@nullus.io &nbsp;<i class="fas fa-clock"></i> 2026-02-28 09:15</div>
                            </div>
                            <div style="padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                                <div style="display:flex;gap:20px;font-size:13px;">
                                    <span><strong style="color:#e2e8f0;">Reason:</strong> <span style="color:#94a3b8;">Storage: AWS S3 → MinIO</span></span>
                                    <span><strong style="color:#e2e8f0;">Duration:</strong> <span style="color:#94a3b8;">58 min</span></span>
                                    <span style="padding:2px 8px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:12px;font-weight:600;"><i class="fas fa-check-circle"></i> Success</span>
                                </div>
                                <div style="display:flex;gap:8px;">
                                    <button class="btn btn-secondary btn-sm" onclick="showDiff('v1','v2')"><i class="fas fa-code-branch"></i> Diff v1→v2</button>
                                    <button class="btn btn-secondary btn-sm" onclick="showDeployLogs('v2')"><i class="fas fa-terminal"></i> Logs</button>
                                    <button class="btn btn-primary btn-sm" onclick="confirmRollback('Stack v2')"><i class="fas fa-undo"></i> Rollback to v2</button>
                                </div>
                            </div>
                        </div>
                        <!-- v1 failed -->
                        <div class="pipeline-card" style="margin-bottom:12px;padding:0;overflow:hidden;">
                            <div style="padding:14px 20px;background:#1e293b;border-bottom:1px solid #fecaca;display:flex;align-items:center;justify-content:space-between;">
                                <div style="display:flex;align-items:center;gap:12px;">
                                    <span style="padding:3px 10px;background:#ef4444;color:#fff;border-radius:20px;font-size:12px;font-weight:700;">v1 · Failed</span>
                                    <span style="font-weight:600;color:#e2e8f0;font-size:14px;">GitLab CI + Argo CD + Prometheus</span>
                                    <span style="padding:2px 8px;background:rgba(239,68,68,0.15);color:#fca5a5;border-radius:10px;font-size:11px;font-weight:600;">Initial Deploy</span>
                                </div>
                                <div style="font-size:12px;color:#94a3b8;"><i class="fas fa-user"></i> admin@nullus.io &nbsp;<i class="fas fa-clock"></i> 2026-02-20 16:00</div>
                            </div>
                            <div style="padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                                <div style="display:flex;gap:20px;font-size:13px;">
                                    <span><strong style="color:#e2e8f0;">Reason:</strong> <span style="color:#94a3b8;">Initial stack deployment</span></span>
                                    <span><strong style="color:#e2e8f0;">Duration:</strong> <span style="color:#94a3b8;">12 min (aborted)</span></span>
                                    <span style="padding:2px 8px;background:rgba(239,68,68,0.15);color:#fca5a5;border-radius:12px;font-size:12px;font-weight:600;"><i class="fas fa-times-circle"></i> Failed · Auto Rolled Back</span>
                                </div>
                                <button class="btn btn-secondary btn-sm" onclick="showDeployLogs('v1')"><i class="fas fa-terminal"></i> Error Logs</button>
                            </div>
                        </div>
                    </div>
                </div><!-- /stackTab-history -->

                <!-- ── Tab: Version Upgrade ── -->
                <div class="stack-tab-pane" id="stackTab-version-upgrade" style="display:none;flex-direction:column;flex:1;overflow-y:auto;">
                    <div style="padding:24px;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
                            <div style="width:4px;height:22px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:2px;"></div>
                            <h3 style="margin:0;font-size:15px;font-weight:700;color:#e2e8f0;">Available Version Upgrades</h3>
                            <span style="padding:2px 8px;background:rgba(99,102,241,0.15);color:#a5b4fc;border-radius:12px;font-size:12px;font-weight:600;">3 updates available</span>
                        </div>
                        <div style="display:flex;flex-direction:column;gap:12px;">
                            <div class="pipeline-card" style="padding:20px;">
                                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                                    <div style="display:flex;align-items:center;gap:12px;">
                                        <div style="width:36px;height:36px;background:linear-gradient(135deg,#fc6d26,#e24329);border-radius:8px;display:flex;align-items:center;justify-content:center;"><i class="fab fa-gitlab" style="color:white;font-size:18px;"></i></div>
                                        <div>
                                            <div style="font-weight:700;color:#e2e8f0;font-size:14px;">GitLab</div>
                                            <div style="font-size:12px;color:#94a3b8;">Current: v16.7 → Latest: <strong style="color:#6ee7b7;">v16.9</strong></div>
                                        </div>
                                    </div>
                                    <div style="display:flex;align-items:center;gap:10px;">
                                        <span style="padding:3px 10px;background:rgba(245,158,11,0.15);color:#fcd34d;border-radius:12px;font-size:11px;font-weight:600;">Minor Update</span>
                                        <button class="btn btn-secondary btn-sm"><i class="fas fa-clipboard-list"></i> Changelog</button>
                                        <button class="btn btn-primary btn-sm"><i class="fas fa-arrow-circle-up"></i> Upgrade</button>
                                    </div>
                                </div>
                            </div>
                            <div class="pipeline-card" style="padding:20px;">
                                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                                    <div style="display:flex;align-items:center;gap:12px;">
                                        <div style="width:36px;height:36px;background:linear-gradient(135deg,#e6522c,#cc3918);border-radius:8px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-fire" style="color:white;font-size:18px;"></i></div>
                                        <div>
                                            <div style="font-weight:700;color:#e2e8f0;font-size:14px;">Prometheus</div>
                                            <div style="font-size:12px;color:#94a3b8;">Current: v2.48.1 → Latest: <strong style="color:#6ee7b7;">v2.50.1</strong></div>
                                        </div>
                                    </div>
                                    <div style="display:flex;align-items:center;gap:10px;">
                                        <span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:11px;font-weight:600;">Patch Update</span>
                                        <button class="btn btn-secondary btn-sm"><i class="fas fa-clipboard-list"></i> Changelog</button>
                                        <button class="btn btn-primary btn-sm"><i class="fas fa-arrow-circle-up"></i> Upgrade</button>
                                    </div>
                                </div>
                            </div>
                            <div class="pipeline-card" style="padding:20px;">
                                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                                    <div style="display:flex;align-items:center;gap:12px;">
                                        <div style="width:36px;height:36px;background:linear-gradient(135deg,#f46800,#d45a00);border-radius:8px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-chart-pie" style="color:white;font-size:18px;"></i></div>
                                        <div>
                                            <div style="font-weight:700;color:#e2e8f0;font-size:14px;">Grafana</div>
                                            <div style="font-size:12px;color:#94a3b8;">Current: v10.3 → Latest: <strong style="color:#6ee7b7;">v10.4</strong></div>
                                        </div>
                                    </div>
                                    <div style="display:flex;align-items:center;gap:10px;">
                                        <span style="padding:3px 10px;background:rgba(245,158,11,0.15);color:#fcd34d;border-radius:12px;font-size:11px;font-weight:600;">Minor Update</span>
                                        <button class="btn btn-secondary btn-sm"><i class="fas fa-clipboard-list"></i> Changelog</button>
                                        <button class="btn btn-primary btn-sm"><i class="fas fa-arrow-circle-up"></i> Upgrade</button>
                                    </div>
                                </div>
                            </div>
                            <div class="pipeline-card" style="padding:20px;opacity:0.6;">
                                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                                    <div style="display:flex;align-items:center;gap:12px;">
                                        <div style="width:36px;height:36px;background:linear-gradient(135deg,#326ce5,#1e4db8);border-radius:8px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-dharmachakra" style="color:white;font-size:18px;"></i></div>
                                        <div>
                                            <div style="font-weight:700;color:#e2e8f0;font-size:14px;">Argo CD</div>
                                            <div style="font-size:12px;color:#94a3b8;">Current: v2.9.3 → <strong style="color:#6ee7b7;">Up to date</strong></div>
                                        </div>
                                    </div>
                                    <span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:11px;font-weight:600;"><i class="fas fa-check"></i> Up to date</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!-- /stackTab-version-upgrade -->

            </div><!-- /stackDetailContent -->
        </div><!-- /stack-detail-panel -->
    </div>
</div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();

// ── Stack inner tab switching ──
function switchStackTab(btn, tabName) {
    var tabs = document.querySelectorAll('.stack-inner-tab');
    tabs.forEach(function (t) { t.classList.remove('active'); });
    btn.classList.add('active');

    document.querySelectorAll('.stack-tab-pane').forEach(function (p) {
        p.style.display = 'none';
    });
    var pane = document.getElementById('stackTab-' + tabName);
    if (pane) {
        pane.style.display = 'flex';
        pane.style.flexDirection = 'column';
    }
    // Save button only on Info tab
    var saveBtn = document.getElementById('stackInfoSaveBtn');
    if (saveBtn) saveBtn.style.display = (tabName === 'info') ? '' : 'none';
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
    document.querySelectorAll('.stack-list-item').forEach(function (el) { el.classList.remove('active'); });
    item.classList.add('active');

    var stackName = item.querySelector('.stack-item-name').textContent;
    var iconEl = item.querySelector('.stack-item-icon');
    var iconBg = iconEl ? iconEl.style.background : '';
    var iconHtml = iconEl ? iconEl.innerHTML : '';
    var statusEl = item.querySelector('.stack-item-status');

    document.getElementById('stackDetailPlaceholder').style.display = 'none';
    var content = document.getElementById('stackDetailContent');
    content.style.display = 'flex';

    document.getElementById('stackDetailTitle').textContent = stackName;

    var detailIcon = document.getElementById('stackDetailIconEl');
    if (detailIcon) { detailIcon.innerHTML = iconHtml; detailIcon.style.background = iconBg; }

    var badge = document.getElementById('stackDetailStatusBadge');
    if (badge && statusEl) {
        badge.className = statusEl.className;
        badge.innerHTML = statusEl.innerHTML;
        badge.style.cssText = 'font-size:12px;padding:3px 10px;border-radius:12px;';
    }

    // Reset to Info tab
    var firstTab = document.querySelector('.stack-inner-tab[data-stab="info"]');
    if (firstTab) switchStackTab(firstTab, 'info');

    var saveBtn = document.getElementById('stackInfoSaveBtn');
    if (saveBtn) saveBtn.style.display = '';
}
