(function() {
    var ws = document.getElementById('mainWorkspace'); if (!ws) return;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content" id="compatibilityPage">
                <div class="list-header">
                    <div class="list-controls">
                        <span style="font-size:13px;color:#94a3b8;">Last updated: 2026-03-01</span>
                    </div>
                </div>

                <div style="padding:0 24px 24px;">
                    <div style="background:rgba(99,102,241,0.12);border:1px solid #3b82f6;border-radius:8px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:#93c5fd;display:flex;align-items:center;gap:8px;">
                        <i class="fas fa-info-circle"></i>
                        테스트 완료된 버전 조합만 표시됩니다. 미검증 조합 사용 시 경고가 표시됩니다.
                    </div>

                    <!-- Matrix Table -->
                    <div class="pipeline-card" style="padding:24px;overflow-x:auto;">
                        <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;">Verified Combinations</h3>
                        <table style="width:100%;border-collapse:collapse;font-size:13px;">
                            <thead>
                                <tr style="background:#1e293b;color:#e2e8f0;">
                                    <th style="text-align:left;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">GitLab</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">Argo CD</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">Prometheus</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">Grafana</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">OpenTelemetry</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">K8s</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom:1px solid #2d3748;background:#0f1419;">
                                    <td style="padding:12px 14px;font-weight:600;color:#e2e8f0;">v17.0</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v2.10</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v2.49</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v10.3</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v1.1</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">1.29+</td>
                                    <td style="padding:12px 14px;text-align:center;"><span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:12px;font-weight:600;"><i class="fas fa-check"></i> Verified</span></td>
                                </tr>
                                <tr style="border-bottom:1px solid #2d3748;background:#0f1419;">
                                    <td style="padding:12px 14px;font-weight:600;color:#e2e8f0;">v16.7</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v2.9.3</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v2.47</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v10.2</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v1.0</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">1.28+</td>
                                    <td style="padding:12px 14px;text-align:center;"><span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:12px;font-weight:600;"><i class="fas fa-check"></i> Verified</span><span style="margin-left:6px;padding:2px 6px;background:#ede9fe;color:#5b21b6;border-radius:10px;font-size:10px;font-weight:600;">Recommended</span></td>
                                </tr>
                                <tr style="border-bottom:1px solid #2d3748;background:#0f1419;">
                                    <td style="padding:12px 14px;font-weight:600;color:#e2e8f0;">v16.5</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v2.8</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v2.45</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v10.0</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v0.9</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">1.26+</td>
                                    <td style="padding:12px 14px;text-align:center;"><span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:12px;font-weight:600;"><i class="fas fa-check"></i> Verified</span></td>
                                </tr>
                                <tr style="border-bottom:1px solid #2d3748;background:#0f1419;">
                                    <td style="padding:12px 14px;font-weight:600;color:#94a3b8;">v16.3</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v2.9.3</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v2.48</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v10.2</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v1.0</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">1.27+</td>
                                    <td style="padding:12px 14px;text-align:center;"><span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#fcd34d;border-radius:12px;font-size:12px;font-weight:600;"><i class="fas fa-exclamation-triangle"></i> Partial</span></td>
                                </tr>
                                <tr style="border-bottom:1px solid #2d3748;background:#0f1419;">
                                    <td style="padding:12px 14px;font-weight:600;color:#9ca3af;">v15.x</td>
                                    <td style="padding:12px 14px;text-align:center;color:#9ca3af;">v2.9.3</td>
                                    <td style="padding:12px 14px;text-align:center;color:#9ca3af;">any</td>
                                    <td style="padding:12px 14px;text-align:center;color:#9ca3af;">any</td>
                                    <td style="padding:12px 14px;text-align:center;color:#9ca3af;">any</td>
                                    <td style="padding:12px 14px;text-align:center;color:#9ca3af;">any</td>
                                    <td style="padding:12px 14px;text-align:center;"><span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#fca5a5;border-radius:12px;font-size:12px;font-weight:600;"><i class="fas fa-times"></i> Not Supported</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- GitHub + GitHub Actions combinations -->
                    <div class="pipeline-card" style="margin-top:20px;padding:24px;overflow-x:auto;">
                        <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;">GitHub Actions + Argo CD Combinations</h3>
                        <table style="width:100%;border-collapse:collapse;font-size:13px;">
                            <thead>
                                <tr style="background:#1e293b;color:#e2e8f0;">
                                    <th style="text-align:left;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">GitHub Actions</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">Argo CD</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">Prometheus</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">Grafana</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">K8s</th>
                                    <th style="text-align:center;padding:10px 14px;color:#cbd5e1;font-weight:600;border-bottom:2px solid #2d3748;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom:1px solid #2d3748;">
                                    <td style="padding:12px 14px;font-weight:600;color:#e2e8f0;">latest</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v2.10</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v2.49</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">v10.3</td>
                                    <td style="padding:12px 14px;text-align:center;color:#94a3b8;">1.28+</td>
                                    <td style="padding:12px 14px;text-align:center;"><span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:12px;font-weight:600;"><i class="fas fa-check"></i> Verified</span><span style="margin-left:6px;padding:2px 6px;background:#ede9fe;color:#5b21b6;border-radius:10px;font-size:10px;font-weight:600;">Recommended</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
