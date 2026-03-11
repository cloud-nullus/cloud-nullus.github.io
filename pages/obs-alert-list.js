(function() {
    var ws = document.body;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content" id="alertlistPage">
                <div class="list-header">
                    <h3 class="page-title" data-i18n="alert.rules">알림 규칙</h3>
                    <button class="btn btn-primary"><i class="fas fa-plus"></i> <span data-i18n="alert.addRule">규칙 추가</span></button>
                </div>
                <div style="padding:24px;">
                    <p style="color:#94a3b8;margin-bottom:20px;font-size:14px;">알림 발생 조건과 전송 채널(Slack, Email 등)을 설정합니다.</p>
                    <div class="pipeline-card" style="padding:24px;">
                        <h4 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;"><span data-i18n="alert.configuration">알림 설정</span></h4>
                        <div style="display:flex;flex-direction:column;gap:12px;">
                            <label class="alert-channel-item">
                                <div><div class="channel-title">Slack</div><div class="channel-desc">#devops-alerts</div></div>
                                <input type="checkbox" checked style="accent-color:#6366f1;">
                            </label>
                            <label class="alert-channel-item">
                                <div><div class="channel-title">Email</div><div class="channel-desc">admin@nullus.io</div></div>
                                <input type="checkbox" style="accent-color:#6366f1;">
                            </label>
                            <div class="alert-threshold-box">
                                <div class="alert-threshold-title"><span data-i18n="alert.threshold">임계값</span></div>
                                <div style="display:flex;flex-direction:column;gap:8px;">
                                    <div class="alert-threshold-row"><span style="color:#94a3b8;">CPU &gt;</span><input type="number" value="80" style="width:60px;padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:13px;text-align:center;background:#1e293b;color:#e2e8f0;"><span style="color:#94a3b8;">%</span></div>
                                    <div class="alert-threshold-row"><span style="color:#94a3b8;">Memory &gt;</span><input type="number" value="85" style="width:60px;padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:13px;text-align:center;background:#1e293b;color:#e2e8f0;"><span style="color:#94a3b8;">%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
