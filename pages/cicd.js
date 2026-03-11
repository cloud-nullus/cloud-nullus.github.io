(function () {
    var ws = document.body;
    var el = document.createElement('div');
    el.innerHTML = `
<div class="page-content" id="cicdlistPage">
    <div class="stack-list-detail-layout">

        <!-- ── Left: CI/CD Pipeline List ── -->
        <div class="stack-list-panel">
            <div class="list-header">
                <h3 class="panel-title">CI/CD 목록</h3>
                <button class="btn btn-primary btn-sm" onclick="switchPage('cicd-template')">
                    <i class="fas fa-plus"></i> New Pipeline
                </button>
            </div>
            <div class="stack-list-filters">
                <input type="text" id="cicdListSearch" class="stack-search-input"
                    placeholder="파이프라인 검색..." oninput="filterCicdListSidebar(this.value)">
                <select id="cicdListStatusFilter2" class="stack-status-filter" onchange="filterCicdListSidebar()">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="building">Building</option>
                    <option value="failed">Failed</option>
                </select>
            </div>
            <div class="stack-list-items" id="cicdListItems">
                <div class="stack-list-item active" data-cicd-id="frontend-web" data-name="frontend-web react" data-status="active" onclick="selectCicdItem(this)">
                    <div class="stack-item-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb);"><i class="fab fa-react"></i></div>
                    <div class="stack-item-info">
                        <div class="stack-item-name">frontend-web</div>
                        <div class="stack-item-meta">Web Frontend · React · main</div>
                    </div>
                    <span class="stack-item-status status-active">ACTIVE</span>
                </div>
                <div class="stack-list-item" data-cicd-id="backend-api" data-name="backend-api spring java" data-status="failed" onclick="selectCicdItem(this)">
                    <div class="stack-item-icon" style="background:linear-gradient(135deg,#10b981,#059669);"><i class="fas fa-server"></i></div>
                    <div class="stack-item-info">
                        <div class="stack-item-name">backend-api</div>
                        <div class="stack-item-meta">Backend API · Spring Boot · develop</div>
                    </div>
                    <span class="stack-item-status status-failed">BUILD FAILED</span>
                </div>
                <div class="stack-list-item" data-cicd-id="ml-service" data-name="ml-service python" data-status="failed" onclick="selectCicdItem(this)">
                    <div class="stack-item-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);"><i class="fas fa-brain"></i></div>
                    <div class="stack-item-info">
                        <div class="stack-item-name">ml-service</div>
                        <div class="stack-item-meta">ML Service · Python · main</div>
                    </div>
                    <span class="stack-item-status status-failed">DEGRADED</span>
                </div>
                <div class="stack-list-item" data-cicd-id="batch-runner" data-name="batch-runner spring batch" data-status="building" onclick="selectCicdItem(this)">
                    <div class="stack-item-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706);"><i class="fas fa-tasks"></i></div>
                    <div class="stack-item-info">
                        <div class="stack-item-name">batch-runner</div>
                        <div class="stack-item-meta">Batch Job · Spring Batch · release/v1.3</div>
                    </div>
                    <span class="stack-item-status status-building"><i class="fas fa-spinner fa-spin"></i> BUILDING</span>
                </div>
            </div>
        </div>

        <!-- ── Right: CI/CD Detail ── -->
        <div class="stack-detail-panel">

            <!-- Placeholder -->
            <div id="cicdDetailPlaceholder" class="stack-detail-placeholder">
                <i class="fas fa-project-diagram"></i>
                <p>CI/CD 파이프라인 상세</p>
                <span>목록에서 파이프라인을 선택하세요</span>
            </div>

            <!-- Detail Content -->
            <div id="cicdDetailContent" class="stack-detail-content stack-detail-content--full" style="display:none;">

                <!-- Header -->
                <div class="stack-detail-header stack-detail-header--compact">
                    <div class="stack-detail-header-main">
                        <div id="cicdDetailIconEl" class="stack-detail-icon"></div>
                        <div class="stack-detail-title-wrap">
                            <h3 id="cicdDetailTitle" class="stack-detail-title"></h3>
                            <div id="cicdDetailMeta" class="stack-detail-meta"></div>
                        </div>
                        <span id="cicdDetailStatusBadge"></span>
                    </div>
                    <div class="stack-detail-header-actions">
                        <button class="btn btn-secondary btn-sm" id="cicdLogsBtn" onclick="alert('Pipeline Logs 보기')"><i class="fas fa-terminal"></i> Logs</button>
                        <button class="btn btn-primary btn-sm" id="cicdDeployBtn" onclick="alert('파이프라인 재실행')"><i class="fas fa-rocket"></i> Run</button>
                    </div>
                </div>

                <!-- Inner Tab Bar -->
                <div class="stack-inner-tabs">
                    <button class="stack-inner-tab active" data-ctab="info" onclick="switchCicdTab(this,'info')">
                        <i class="fas fa-info-circle"></i> Info
                    </button>
                    <button class="stack-inner-tab" data-ctab="monitoring" onclick="switchCicdTab(this,'monitoring')">
                        <i class="fas fa-chart-bar"></i> Monitoring
                    </button>
                    <button class="stack-inner-tab" data-ctab="history" onclick="switchCicdTab(this,'history')">
                        <i class="fas fa-history"></i> History
                    </button>
                </div>

                <!-- ── Tab: Info ── -->
                <div class="cicd-tab-pane" id="cicdTab-info" style="display:flex;flex-direction:column;flex:1;overflow-y:auto;">
                    <div style="padding:20px;">
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
                            <div style="background:#fffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
                                <div style="font-size:12px;color:#e5e7eb;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;"><i class="fas fa-code-branch"></i> CI Configuration</div>
                                <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
                                    <div style="display:flex;justify-content:space-between;"><span style="color:#e5e7eb;">Platform</span><span style="font-weight:600;color:#374151;">GitLab CI/CD</span></div>
                                    <div style="display:flex;justify-content:space-between;"><span style="color:#e5e7eb;">Branch</span><code style="background:#e5e7eb;padding:2px 6px;border-radius:4px;font-size:12px;">main</code></div>
                                    <div style="display:flex;justify-content:space-between;"><span style="color:#e5e7eb;">Config File</span><code style="background:#e5e7eb;padding:2px 6px;border-radius:4px;font-size:12px;">.gitlab-ci.yml</code></div>
                                    <div style="display:flex;justify-content:space-between;"><span style="color:#e5e7eb;">Runner</span><span style="font-weight:600;color:#374151;">k8s-runner-01</span></div>
                                    <div style="display:flex;justify-content:space-between;"><span style="color:#e5e7eb;">Trigger</span><span style="font-weight:600;color:#374151;">Push / MR</span></div>
                                </div>
                            </div>
                            <div style="background:#fffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
                                <div style="font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;"><i class="fas fa-rocket"></i> CD Configuration</div>
                                <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
                                    <div style="display:flex;justify-content:space-between;"><span style="color:#e5e7eb;">Platform</span><span style="font-weight:600;color:#374151;">Argo CD</span></div>
                                    <div style="display:flex;justify-content:space-between;"><span style="color:#e5e7eb;">Cluster</span><span style="font-weight:600;color:#374151;">prod-k8s</span></div>
                                    <div style="display:flex;justify-content:space-between;"><span style="color:#e5e7eb;">Namespace</span><code style="background:#e5e7eb;padding:2px 6px;border-radius:4px;font-size:12px;">production</code></div>
                                    <div style="display:flex;justify-content:space-between;"><span style="color:#e5e7eb;">Sync Policy</span><span style="font-weight:600;color:#374151;">Auto Sync</span></div>
                                    <div style="display:flex;justify-content:space-between;"><span style="color:#e5e7eb;">Image</span><code style="background:#e5e7eb;padding:2px 6px;border-radius:4px;font-size:11px;">registry/frontend-web:v1.2.3</code></div>
                                </div>
                            </div>
                        </div>

                        <div style="background:#fffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px;">
                            <div style="font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;"><i class="fas fa-layer-group"></i> Pipeline Stages</div>
                            <div style="display:flex;align-items:center;gap:0;">
                                <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
                                    <div style="width:36px;height:36px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;"><i class="fas fa-hammer"></i></div>
                                    <div style="font-size:11px;color:#374151;margin-top:4px;font-weight:600;">build</div>
                                    <div style="font-size:10px;color:#6ee7b7;">✓ 1m 12s</div>
                                </div>
                                <div style="flex:1;height:2px;background:#6366f1;margin-bottom:20px;"></div>
                                <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
                                    <div style="width:36px;height:36px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;"><i class="fas fa-vial"></i></div>
                                    <div style="font-size:11px;color:#374151;margin-top:4px;font-weight:600;">test</div>
                                    <div style="font-size:10px;color:#6ee7b7;">✓ 45s</div>
                                </div>
                                <div style="flex:1;height:2px;background:#6366f1;margin-bottom:20px;"></div>
                                <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
                                    <div style="width:36px;height:36px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;"><i class="fas fa-shield-alt"></i></div>
                                    <div style="font-size:11px;color:#374151;margin-top:4px;font-weight:600;">security</div>
                                    <div style="font-size:10px;color:#6ee7b7;">✓ 2m 10s</div>
                                </div>
                                <div style="flex:1;height:2px;background:#6366f1;margin-bottom:20px;"></div>
                                <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
                                    <div style="width:36px;height:36px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;"><i class="fab fa-docker"></i></div>
                                    <div style="font-size:11px;color:#374151;margin-top:4px;font-weight:600;">package</div>
                                    <div style="font-size:10px;color:#6ee7b7;">✓ 37s</div>
                                </div>
                                <div style="flex:1;height:2px;background:#6366f1;margin-bottom:20px;"></div>
                                <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
                                    <div style="width:36px;height:36px;border-radius:50%;background:#059669;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;"><i class="fas fa-rocket"></i></div>
                                    <div style="font-size:11px;color:#374151;margin-top:4px;font-weight:600;">deploy</div>
                                    <div style="font-size:10px;color:#6ee7b7;">✓ 45s</div>
                                </div>
                            </div>
                        </div>

                        <div style="background:#fffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                                <div style="font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;"><i class="fas fa-cog"></i> Pipeline Variables</div>
                                <button class="btn btn-secondary btn-sm"><i class="fas fa-plus"></i> Add Variable</button>
                            </div>
                            <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
                                <div style="display:grid;grid-template-columns:1fr 1fr 80px;gap:8px;padding:8px 10px;background:#fffff;border:1px solid #e5e7eb;border-radius:6px;">
                                    <input type="text" value="DOCKER_DRIVER" style="border:none;outline:none;font-size:13px;color:#e5e7eb;background:transparent;">
                                    <input type="text" value="overlay2" style="border:none;outline:none;font-size:13px;color:#6b7280;background:transparent;">
                                    <span style="padding:2px 6px;background:#e5e7eb;border-radius:4px;font-size:11px;color:#6b7280;text-align:center;">plaintext</span>
                                </div>
                                <div style="display:grid;grid-template-columns:1fr 1fr 80px;gap:8px;padding:8px 10px;background:#fffff;border:1px solid #e5e7eb;border-radius:6px;">
                                    <input type="text" value="NODE_VERSION" style="border:none;outline:none;font-size:13px;color:#e5e7eb;background:transparent;">
                                    <input type="text" value="18" style="border:none;outline:none;font-size:13px;color:#6b7280;background:transparent;">
                                    <span style="padding:2px 6px;background:#e5e7eb;border-radius:4px;font-size:11px;color:#6b7280;text-align:center;">plaintext</span>
                                </div>
                                <div style="display:grid;grid-template-columns:1fr 1fr 80px;gap:8px;padding:8px 10px;background:#fffff;border:1px solid #e5e7eb;border-radius:6px;">
                                    <input type="text" value="REGISTRY_TOKEN" style="border:none;outline:none;font-size:13px;color:#e5e7eb;background:transparent;">
                                    <input type="password" value="ghp_xxxxxxxxxx" style="border:none;outline:none;font-size:13px;color:#6b7280;background:transparent;">
                                    <span style="padding:2px 6px;background:#fde68a;border-radius:4px;font-size:11px;color:#92400e;text-align:center;">masked</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!-- /cicdTab-info -->

                <!-- ── Tab: Monitoring ── -->
                <div class="cicd-tab-pane" id="cicdTab-monitoring" style="display:none;flex-direction:column;flex:1;overflow-y:auto;">
                    <div style="padding:20px;">
                        <!-- Stats row -->
                        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;">
                            <div class="pipeline-card" style="padding:20px;text-align:center;">
                                <div style="font-size:28px;font-weight:700;color:#059669;">97.3<span style="font-size:14px;color:#9ca3af;">%</span></div>
                                <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-check-circle" style="color:#059669;"></i> Success Rate</div>
                                <div style="height:6px;background:#e5e7eb;border-radius:99px;margin-top:10px;"><div style="height:6px;width:97.3%;background:#059669;border-radius:99px;"></div></div>
                            </div>
                            <div class="pipeline-card" style="padding:20px;text-align:center;">
                                <div style="font-size:28px;font-weight:700;color:#6366f1;">145</div>
                                <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-play-circle" style="color:#6366f1;"></i> Total Builds</div>
                            </div>
                            <div class="pipeline-card" style="padding:20px;text-align:center;">
                                <div style="font-size:28px;font-weight:700;color:#f59e0b;">2m 34s</div>
                                <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-clock" style="color:#f59e0b;"></i> Avg Duration</div>
                            </div>
                            <div class="pipeline-card" style="padding:20px;text-align:center;">
                                <div style="font-size:28px;font-weight:700;color:#10b981;">3/3</div>
                                <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-server" style="color:#10b981;"></i> Pods Running</div>
                                <div style="height:6px;background:#e5e7eb;border-radius:99px;margin-top:10px;"><div style="height:6px;width:100%;background:#10b981;border-radius:99px;"></div></div>
                            </div>
                        </div>

                        <!-- Build trend + App metrics -->
                        <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:24px;">
                            <div class="pipeline-card" style="padding:24px;">
                                <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;">Build Trend (Last 14 days)</h3>
                                <div style="display:flex;align-items:flex-end;gap:6px;height:100px;">
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:70%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">2/25</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:85%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">2/26</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:60%;background:#ef4444;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">2/27</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:90%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">2/28</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:55%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">3/1</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:75%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">3/2</span></div>
                                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:100%;height:100%;background:#6366f1;border-radius:4px 4px 0 0;"></div><span style="font-size:10px;color:#9ca3af;">3/3</span></div>
                                </div>
                                <div style="display:flex;gap:16px;margin-top:10px;font-size:12px;">
                                    <span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;border-radius:2px;background:#6366f1;display:inline-block;"></span>Success</span>
                                    <span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;border-radius:2px;background:#ef4444;display:inline-block;"></span>Failed</span>
                                </div>
                            </div>
                            <div class="pipeline-card" style="padding:24px;">
                                <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;">Application Health</h3>
                                <div style="display:flex;flex-direction:column;gap:10px;font-size:13px;">
                                    <div>
                                        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="color:#94a3b8;">CPU</span><span style="color:#6366f1;font-weight:600;">0.3 cores</span></div>
                                        <div style="height:6px;background:#1e293b;border-radius:99px;"><div style="height:6px;width:15%;background:#6366f1;border-radius:99px;"></div></div>
                                    </div>
                                    <div>
                                        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="color:#94a3b8;">Memory</span><span style="color:#10b981;font-weight:600;">256 Mi</span></div>
                                        <div style="height:6px;background:#1e293b;border-radius:99px;"><div style="height:6px;width:25%;background:#10b981;border-radius:99px;"></div></div>
                                    </div>
                                    <div style="padding:10px;background:#1e293b;border-radius:6px;">
                                        <div style="font-size:11px;color:#64748b;margin-bottom:6px;">ArgoCD Sync Status</div>
                                        <div style="color:#6ee7b7;font-weight:600;"><i class="fas fa-check-circle"></i> Synced</div>
                                    </div>
                                    <div style="padding:10px;background:#1e293b;border-radius:6px;">
                                        <div style="font-size:11px;color:#64748b;margin-bottom:6px;">Last Deployment</div>
                                        <div style="color:#e2e8f0;">2026-03-03 14:28</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!-- /cicdTab-monitoring -->

                <!-- ── Tab: History ── -->
                <div class="cicd-tab-pane" id="cicdTab-history" style="display:none;flex-direction:column;flex:1;overflow-y:auto;">
                    <div style="padding:16px 24px;">
                        <div class="list-controls" style="margin-bottom:16px;display:flex;gap:8px;">
                            <select style="padding:8px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;background:#0f1419;">
                                <option value="all">All Types</option>
                                <option value="ci">CI (Build)</option>
                                <option value="cd">CD (Deploy)</option>
                            </select>
                            <select style="padding:8px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;background:#0f1419;">
                                <option value="all">All Status</option>
                                <option value="success">Success</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>

                        <!-- CI History -->
                        <div style="margin-bottom:24px;">
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                                <div style="width:4px;height:20px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:2px;"></div>
                                <h4 style="margin:0;font-size:14px;font-weight:700;color:#e2e8f0;">CI Build History</h4>
                            </div>
                            <div class="pipeline-card" style="margin-bottom:10px;padding:14px 18px;">
                                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                                    <span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:11px;font-weight:700;">SUCCESS</span>
                                    <span style="padding:3px 8px;background:rgba(245,158,11,0.15);color:#fcd34d;border-radius:6px;font-size:11px;font-weight:600;">CI</span>
                                    <span style="font-size:13px;color:#6366f1;font-weight:600;">#145</span>
                                    <code style="background:#1e293b;color:#e2e8f0;padding:2px 6px;border-radius:4px;font-size:12px;flex:1;">feat: add dark mode toggle</code>
                                    <span style="font-size:12px;color:#9ca3af;"><i class="fas fa-clock" style="margin-right:3px;"></i>2m 34s</span>
                                    <span style="font-size:12px;color:#9ca3af;">2026-03-03 14:22</span>
                                    <button onclick="alert('CI Logs: build(1m 12s) → test(45s) → security(2m 10s) → package(37s) → Success')" style="padding:5px 10px;border:1px solid #2d3748;background:#1e293b;border-radius:6px;font-size:12px;color:#cbd5e1;cursor:pointer;"><i class="fas fa-terminal"></i> Logs</button>
                                </div>
                            </div>
                            <div class="pipeline-card" style="margin-bottom:10px;padding:14px 18px;">
                                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                                    <span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:11px;font-weight:700;">SUCCESS</span>
                                    <span style="padding:3px 8px;background:rgba(245,158,11,0.15);color:#fcd34d;border-radius:6px;font-size:11px;font-weight:600;">CI</span>
                                    <span style="font-size:13px;color:#6366f1;font-weight:600;">#144</span>
                                    <code style="background:#1e293b;color:#e2e8f0;padding:2px 6px;border-radius:4px;font-size:12px;flex:1;">fix: resolve mobile layout issue</code>
                                    <span style="font-size:12px;color:#9ca3af;"><i class="fas fa-clock" style="margin-right:3px;"></i>2m 18s</span>
                                    <span style="font-size:12px;color:#9ca3af;">2026-03-02 11:05</span>
                                    <button onclick="alert('CI #144 Logs: build → test → security → package → Success')" style="padding:5px 10px;border:1px solid #2d3748;background:#1e293b;border-radius:6px;font-size:12px;color:#cbd5e1;cursor:pointer;"><i class="fas fa-terminal"></i> Logs</button>
                                </div>
                            </div>
                            <div class="pipeline-card" style="margin-bottom:10px;padding:14px 18px;border-left:3px solid #ef4444;">
                                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                                    <span style="padding:3px 10px;background:rgba(239,68,68,0.15);color:#fca5a5;border-radius:12px;font-size:11px;font-weight:700;">FAILED</span>
                                    <span style="padding:3px 8px;background:rgba(245,158,11,0.15);color:#fcd34d;border-radius:6px;font-size:11px;font-weight:600;">CI</span>
                                    <span style="font-size:13px;color:#6366f1;font-weight:600;">#143</span>
                                    <code style="background:#1e293b;color:#e2e8f0;padding:2px 6px;border-radius:4px;font-size:12px;flex:1;">refactor: update API client</code>
                                    <span style="font-size:12px;color:#9ca3af;"><i class="fas fa-clock" style="margin-right:3px;"></i>1m 05s</span>
                                    <span style="font-size:12px;color:#9ca3af;">2026-03-01 16:30</span>
                                    <button onclick="alert('CI #143 Error: test stage failed\\n[ERROR] TypeError: Cannot read property of undefined\\n  at src/api/client.js:42')" style="padding:5px 10px;border:1px solid #ef4444;background:rgba(239,68,68,0.1);border-radius:6px;font-size:12px;color:#ef4444;cursor:pointer;"><i class="fas fa-terminal"></i> Logs</button>
                                </div>
                            </div>
                        </div>

                        <!-- CD History -->
                        <div>
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                                <div style="width:4px;height:20px;background:linear-gradient(135deg,#10b981,#059669);border-radius:2px;"></div>
                                <h4 style="margin:0;font-size:14px;font-weight:700;color:#e2e8f0;">CD Deploy History</h4>
                            </div>
                            <div class="pipeline-card" style="margin-bottom:10px;padding:14px 18px;">
                                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                                    <span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:11px;font-weight:700;">SYNCED</span>
                                    <span style="padding:3px 8px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:6px;font-size:11px;font-weight:600;">CD</span>
                                    <span style="font-size:13px;color:#94a3b8;"><i class="fas fa-server" style="margin-right:3px;"></i>prod-k8s / production</span>
                                    <code style="background:#1e293b;color:#e2e8f0;padding:2px 6px;border-radius:4px;font-size:11px;flex:1;">registry/frontend-web:v1.2.3</code>
                                    <span style="font-size:12px;color:#9ca3af;"><i class="fas fa-clock" style="margin-right:3px;"></i>45s</span>
                                    <span style="font-size:12px;color:#9ca3af;">2026-03-03 14:28</span>
                                    <button onclick="alert('ArgoCD Sync: 3/3 pods healthy → Synced (45s)')" style="padding:5px 10px;border:1px solid #2d3748;background:#1e293b;border-radius:6px;font-size:12px;color:#cbd5e1;cursor:pointer;"><i class="fas fa-terminal"></i> Logs</button>
                                </div>
                            </div>
                            <div class="pipeline-card" style="margin-bottom:10px;padding:14px 18px;">
                                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                                    <span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:11px;font-weight:700;">SYNCED</span>
                                    <span style="padding:3px 8px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:6px;font-size:11px;font-weight:600;">CD</span>
                                    <span style="font-size:13px;color:#94a3b8;"><i class="fas fa-server" style="margin-right:3px;"></i>prod-k8s / production</span>
                                    <code style="background:#1e293b;color:#e2e8f0;padding:2px 6px;border-radius:4px;font-size:11px;flex:1;">registry/frontend-web:v1.2.2</code>
                                    <span style="font-size:12px;color:#9ca3af;"><i class="fas fa-clock" style="margin-right:3px;"></i>38s</span>
                                    <span style="font-size:12px;color:#9ca3af;">2026-03-02 11:20</span>
                                    <button onclick="alert('ArgoCD Sync: 3/3 pods healthy → Synced (38s)')" style="padding:5px 10px;border:1px solid #2d3748;background:#1e293b;border-radius:6px;font-size:12px;color:#cbd5e1;cursor:pointer;"><i class="fas fa-terminal"></i> Logs</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!-- /cicdTab-history -->

            </div><!-- /cicdDetailContent -->
        </div><!-- /stack-detail-panel -->
    </div>
</div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();

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
