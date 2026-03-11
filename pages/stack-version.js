(function() {
    var ws = document.body;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content" id="compatibilityPage">
                <div class="list-header">
                    <div class="list-controls">
                        <span style="font-size:13px;color:#94a3b8;">Last updated: 2026-03-01</span>
                    </div>
                </div>

                <div style="padding:0 24px 24px;">
                    <div class="info-banner info-banner-blue">
                        <i class="fas fa-info-circle"></i>
                        테스트 완료된 버전 조합만 표시됩니다. 미검증 조합 사용 시 경고가 표시됩니다.
                    </div>

                    <!-- Matrix Table -->
                    <div class="pipeline-card" style="padding:24px;overflow-x:auto;">
                        <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;">Verified Combinations</h3>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>GitLab</th>
                                    <th class="center">Argo CD</th>
                                    <th class="center">Prometheus</th>
                                    <th class="center">Grafana</th>
                                    <th class="center">OpenTelemetry</th>
                                    <th class="center">K8s</th>
                                    <th class="center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="bold">v17.0</td>
                                    <td class="center muted">v2.10</td>
                                    <td class="center muted">v2.49</td>
                                    <td class="center muted">v10.3</td>
                                    <td class="center muted">v1.1</td>
                                    <td class="center muted">1.29+</td>
                                    <td class="center"><span class="badge badge-success"><i class="fas fa-check"></i> Verified</span></td>
                                </tr>
                                <tr>
                                    <td class="bold">v16.7</td>
                                    <td class="center muted">v2.9.3</td>
                                    <td class="center muted">v2.47</td>
                                    <td class="center muted">v10.2</td>
                                    <td class="center muted">v1.0</td>
                                    <td class="center muted">1.28+</td>
                                    <td class="center"><span class="badge badge-success"><i class="fas fa-check"></i> Verified</span><span class="badge badge-purple badge-sm" style="margin-left:6px;">Recommended</span></td>
                                </tr>
                                <tr>
                                    <td class="bold">v16.5</td>
                                    <td class="center muted">v2.8</td>
                                    <td class="center muted">v2.45</td>
                                    <td class="center muted">v10.0</td>
                                    <td class="center muted">v0.9</td>
                                    <td class="center muted">1.26+</td>
                                    <td class="center"><span class="badge badge-success"><i class="fas fa-check"></i> Verified</span></td>
                                </tr>
                                <tr>
                                    <td class="muted bold">v16.3</td>
                                    <td class="center muted">v2.9.3</td>
                                    <td class="center muted">v2.48</td>
                                    <td class="center muted">v10.2</td>
                                    <td class="center muted">v1.0</td>
                                    <td class="center muted">1.27+</td>
                                    <td class="center"><span class="badge badge-warning"><i class="fas fa-exclamation-triangle"></i> Partial</span></td>
                                </tr>
                                <tr>
                                    <td class="bold" style="color:#9ca3af;">v15.x</td>
                                    <td class="center" style="color:#9ca3af;">v2.9.3</td>
                                    <td class="center" style="color:#9ca3af;">any</td>
                                    <td class="center" style="color:#9ca3af;">any</td>
                                    <td class="center" style="color:#9ca3af;">any</td>
                                    <td class="center" style="color:#9ca3af;">any</td>
                                    <td class="center"><span class="badge badge-danger"><i class="fas fa-times"></i> Not Supported</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- GitHub + GitHub Actions combinations -->
                    <div class="pipeline-card" style="margin-top:20px;padding:24px;overflow-x:auto;">
                        <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;">GitHub Actions + Argo CD Combinations</h3>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>GitHub Actions</th>
                                    <th class="center">Argo CD</th>
                                    <th class="center">Prometheus</th>
                                    <th class="center">Grafana</th>
                                    <th class="center">K8s</th>
                                    <th class="center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="bold">latest</td>
                                    <td class="center muted">v2.10</td>
                                    <td class="center muted">v2.49</td>
                                    <td class="center muted">v10.3</td>
                                    <td class="center muted">1.28+</td>
                                    <td class="center"><span class="badge badge-success"><i class="fas fa-check"></i> Verified</span><span class="badge badge-purple badge-sm" style="margin-left:6px;">Recommended</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
