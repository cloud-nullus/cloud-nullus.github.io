(function() {
    var ws = document.body;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content" id="templatesPage">
                <div class="template-admin-container">
                    <div class="list-header template-page-header">
                        <div class="list-controls">
                            <input type="text" placeholder="Search DevSecOps templates..." id="templateSearchInput" class="template-search-inline">
                        </div>
                        <button class="btn btn-primary" onclick="switchPage('install')">
                            <i class="fas fa-plus"></i> + New Template
                        </button>
                    </div>

                    <div class="template-info-banner">
                        <i class="fas fa-info-circle"></i>
                        <span>DevSecOps 스택 템플릿을 선택하면 Stack Install로 이동해 즉시 배포 구성을 시작합니다.</span>
                    </div>

                    <div class="template-admin-grid">
                        <div class="pipeline-card template-admin-card">
                            <div class="stack-header">
                                <div class="stack-info">
                                    <div class="stack-title"><i class="fas fa-stream"></i> Standard CI/CD</div>
                                    <div class="stack-description">GitLab CI + ArgoCD + Prometheus + Grafana 조합의 기본 DevSecOps 템플릿</div>
                                </div>
                                <div class="stack-status active">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Default</span>
                                </div>
                            </div>
                            <div class="template-admin-fields">
                                <div class="input-group">
                                    <label>Included Tools</label>
                                    <input type="text" value="GitLab CI, ArgoCD, Prometheus, Grafana" readonly>
                                </div>
                                <div class="input-group">
                                    <label>Recommended For</label>
                                    <input type="text" value="일반 서비스 팀의 표준 배포 파이프라인" readonly>
                                </div>
                                <div class="input-group">
                                    <label>Security/Logging</label>
                                    <input type="text" value="기본 로깅만 활성화, 보안 도구 최소화" readonly>
                                </div>
                            </div>
                            <div class="stack-actions">
                                <button class="btn btn-primary btn-icon apply-devops-template-btn" data-preset="standard"><i class="fas fa-check"></i> Use This Template</button>
                            </div>
                        </div>

                        <div class="pipeline-card template-admin-card">
                            <div class="stack-header">
                                <div class="stack-info">
                                    <div class="stack-title"><i class="fas fa-shield-alt"></i> Full DevSecOps</div>
                                    <div class="stack-description">CI/CD + 모니터링 + 로깅 + 보안까지 포함한 통합 DevSecOps 템플릿</div>
                                </div>
                                <div class="stack-status active">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Security</span>
                                </div>
                            </div>
                            <div class="template-admin-fields">
                                <div class="input-group">
                                    <label>Included Tools</label>
                                    <input type="text" value="GitLab CI, ArgoCD, Prometheus, Grafana, OpenTelemetry, OpenSearch" readonly>
                                </div>
                                <div class="input-group">
                                    <label>Recommended For</label>
                                    <input type="text" value="운영/보안 요구사항이 높은 서비스" readonly>
                                </div>
                                <div class="input-group">
                                    <label>Security/Logging</label>
                                    <input type="text" value="OpenTelemetry + OpenSearch 포함" readonly>
                                </div>
                            </div>
                            <div class="stack-actions">
                                <button class="btn btn-primary btn-icon apply-devops-template-btn" data-preset="full"><i class="fas fa-check"></i> Use This Template</button>
                            </div>
                        </div>

                        <div class="pipeline-card template-admin-card">
                            <div class="stack-header">
                                <div class="stack-info">
                                    <div class="stack-title"><i class="fas fa-feather-alt"></i> Minimal Pipeline</div>
                                    <div class="stack-description">핵심 배포만 빠르게 구성하는 경량 DevSecOps 템플릿</div>
                                </div>
                                <div class="stack-status running">
                                    <i class="fas fa-vial"></i>
                                    <span>Lean</span>
                                </div>
                            </div>
                            <div class="template-admin-fields">
                                <div class="input-group">
                                    <label>Included Tools</label>
                                    <input type="text" value="GitHub Actions, ArgoCD" readonly>
                                </div>
                                <div class="input-group">
                                    <label>Recommended For</label>
                                    <input type="text" value="초기 프로젝트, 비용 최적화 환경" readonly>
                                </div>
                                <div class="input-group">
                                    <label>Security/Logging</label>
                                    <input type="text" value="모니터링/로깅 도구 비활성화" readonly>
                                </div>
                            </div>
                            <div class="stack-actions">
                                <button class="btn btn-primary btn-icon apply-devops-template-btn" data-preset="minimal"><i class="fas fa-check"></i> Use This Template</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
