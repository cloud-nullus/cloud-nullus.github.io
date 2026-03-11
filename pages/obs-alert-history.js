(function() {
    var ws = document.body;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content" id="alerthistoryPage">
                <div class="list-header">
                    <h3 class="page-title" data-i18n="alert.history">알림 이력</h3>
                </div>
                <div style="padding:24px;">
                    <p style="color:#94a3b8;margin-bottom:20px;font-size:14px;">발생한 알림 목록을 조회합니다.</p>
                    <div class="pipeline-card" style="padding:24px;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th><span data-i18n="alert.firedAt">발생 시각</span></th>
                                    <th><span data-i18n="alert.ruleName">규칙명</span></th>
                                    <th><span data-i18n="alert.severity">심각도</span></th>
                                    <th><span data-i18n="alert.message">메시지</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="muted">2026-03-08 14:32:15</td>
                                    <td class="bold">High CPU Usage</td>
                                    <td><span class="badge badge-danger">Critical</span></td>
                                    <td class="muted">CPU usage exceeded 85% on prod-k8s</td>
                                </tr>
                                <tr>
                                    <td class="muted">2026-03-08 10:15:22</td>
                                    <td class="bold">Pipeline Failed</td>
                                    <td><span class="badge badge-warning">Warning</span></td>
                                    <td class="muted">Build #142 failed on development-stack</td>
                                </tr>
                                <tr>
                                    <td class="muted">2026-03-07 18:45:00</td>
                                    <td class="bold">Memory Threshold</td>
                                    <td><span class="badge badge-warning">Warning</span></td>
                                    <td class="muted">Memory usage 82% on staging-k8s</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
