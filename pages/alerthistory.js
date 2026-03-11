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
                        <table style="width:100%;border-collapse:collapse;font-size:14px;">
                            <thead>
                                <tr style="border-bottom:2px solid #334155;">
                                    <th style="text-align:left;padding:10px 12px;color:#94a3b8;font-weight:600;"><span data-i18n="alert.firedAt">발생 시각</span></th>
                                    <th style="text-align:left;padding:10px 12px;color:#94a3b8;font-weight:600;"><span data-i18n="alert.ruleName">규칙명</span></th>
                                    <th style="text-align:left;padding:10px 12px;color:#94a3b8;font-weight:600;"><span data-i18n="alert.severity">심각도</span></th>
                                    <th style="text-align:left;padding:10px 12px;color:#94a3b8;font-weight:600;"><span data-i18n="alert.message">메시지</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom:1px solid #2d3748;">
                                    <td style="padding:12px;color:#94a3b8;">2026-03-08 14:32:15</td>
                                    <td style="padding:12px;font-weight:600;color:#e2e8f0;">High CPU Usage</td>
                                    <td style="padding:12px;"><span style="padding:3px 8px;background:rgba(239,68,68,0.2);color:#fca5a5;border-radius:8px;font-size:12px;">Critical</span></td>
                                    <td style="padding:12px;color:#94a3b8;">CPU usage exceeded 85% on prod-k8s</td>
                                </tr>
                                <tr style="border-bottom:1px solid #2d3748;">
                                    <td style="padding:12px;color:#94a3b8;">2026-03-08 10:15:22</td>
                                    <td style="padding:12px;font-weight:600;color:#e2e8f0;">Pipeline Failed</td>
                                    <td style="padding:12px;"><span style="padding:3px 8px;background:rgba(245,158,11,0.2);color:#fcd34d;border-radius:8px;font-size:12px;">Warning</span></td>
                                    <td style="padding:12px;color:#94a3b8;">Build #142 failed on development-stack</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px;color:#94a3b8;">2026-03-07 18:45:00</td>
                                    <td style="padding:12px;font-weight:600;color:#e2e8f0;">Memory Threshold</td>
                                    <td style="padding:12px;"><span style="padding:3px 8px;background:rgba(245,158,11,0.2);color:#fcd34d;border-radius:8px;font-size:12px;">Warning</span></td>
                                    <td style="padding:12px;color:#94a3b8;">Memory usage 82% on staging-k8s</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
