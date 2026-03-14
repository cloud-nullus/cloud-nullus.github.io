(function() {
    var ws = document.getElementById('mainWorkspace'); if (!ws) return;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content" id="clustersPage">
                <div class="cluster-list-detail-layout">
                    <!-- 좌측: 클러스터 목록 (CLU_010_020) -->
                    <div class="cluster-list-panel">
                        <div class="list-header">
                            <h3 class="panel-title" data-i18n="cluster.list">클러스터 목록</h3>
                            <button class="btn btn-primary btn-sm" id="registerClusterBtn">
                                <i class="fas fa-plus"></i> <span data-i18n="cluster.register">클러스터 등록</span>
                            </button>
                        </div>
                        <div class="cluster-list-items">
                            <div class="cluster-list-item active" data-cluster-id="devops-cluster" data-cluster-type="pipeline">
                                <div class="cluster-item-icon"><i class="fas fa-cogs"></i></div>
                                <div class="cluster-item-info">
                                    <div class="cluster-item-name">devops-cluster</div>
                                    <div class="cluster-item-meta" data-i18n="cluster.pipelineClusterMeta">Pipeline · nullus-system</div>
                                </div>
                                <span class="cluster-item-status status-connected"><i class="fas fa-check-circle"></i></span>
                            </div>
                            <div class="cluster-list-item" data-cluster-id="app-cluster-prod" data-cluster-type="app">
                                <div class="cluster-item-icon"><i class="fas fa-server"></i></div>
                                <div class="cluster-item-info">
                                    <div class="cluster-item-name">app-cluster-prod</div>
                                    <div class="cluster-item-meta" data-i18n="cluster.appClusterMeta">Application · Not Configured</div>
                                </div>
                                <span class="cluster-item-status status-disconnected"><i class="fas fa-clock"></i></span>
                            </div>
                        </div>
                    </div>
                    <!-- 우측: 클러스터 상세 (CLU_010_030) -->
                    <div class="cluster-detail-panel">
                        <div id="clusterDetailPlaceholder" class="cluster-detail-placeholder">
                            <i class="fas fa-server"></i>
                            <p data-i18n="cluster.detail">클러스터 상세</p>
                            <span data-i18n="cluster.selectPrompt">목록에서 클러스터를 선택하세요</span>
                        </div>
                        <div id="clusterDetailContent" class="cluster-detail-content" style="display:none;">
                            <div class="cluster-detail-header">
                                <h3 class="cluster-detail-title" id="clusterDetailTitle"></h3>
                                <div class="cluster-detail-actions">
                                    <button class="btn btn-secondary btn-sm" id="clusterEditBtn"><i class="fas fa-edit"></i> <span data-i18n="common.edit">수정</span></button>
                                    <button class="btn btn-secondary btn-sm btn-danger" id="clusterDeleteBtn"><i class="fas fa-trash"></i> <span data-i18n="common.delete">삭제</span></button>
                                </div>
                            </div>
                            <div class="template-admin-fields cluster-detail-fields">
                                <div class="input-group">
                                    <label data-i18n="cluster.name">클러스터 이름</label>
                                    <input type="text" id="clusterPageName" readonly>
                                </div>
                                <div class="input-group">
                                    <label data-i18n="cluster.type">유형</label>
                                    <input type="text" id="clusterPageType" readonly>
                                </div>
                                <div class="input-group">
                                    <label data-i18n="cluster.namespace">네임스페이스</label>
                                    <input type="text" id="clusterPageNamespace" readonly>
                                </div>
                                <div class="input-group">
                                    <label data-i18n="cluster.endpoint">API 엔드포인트</label>
                                    <input type="text" id="clusterPageEndpoint" readonly>
                                </div>
                                <div class="input-group">
                                    <label data-i18n="cluster.authMethod">Auth Method</label>
                                    <input type="text" id="clusterPageAuth" value="Kubeconfig (ServiceAccount)" readonly>
                                </div>
                                <div class="input-group">
                                    <label data-i18n="cluster.orgAccess">Organization 접근</label>
                                    <div class="cluster-org-tags" id="clusterPageOrgAccess"></div>
                                </div>
                                <div class="input-group" style="grid-column:1/-1;">
                                    <label data-i18n="cluster.connectionStatus">연결 상태</label>
                                    <div class="cluster-connection-status" id="clusterPageConnection"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
